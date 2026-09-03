import { settings } from "../settings";
import { DomDocumentHelper, DomWindowHelper } from "../global_variables_utils";

const envStr = "environment";
const userStr = "user";
const autoStr = "auto";
const getDeviceType = function(device: MediaDeviceInfo): string {
  const lbl = device.label.toLocaleLowerCase();
  if (lbl.indexOf(userStr) > -1) return userStr;
  if (lbl.indexOf(envStr) > -1) return envStr;
  if (lbl.indexOf("front") > -1) return userStr;
  if (lbl.indexOf("back") > -1) return envStr;
  return "";
};
// Static members keep the device information that is shared by all cameras on the page: the list of
// available devices and the capabilities discovered for them. The selected device and the selected
// facing mode are instance members, so that several file questions can use their own camera.
export class Camera {
  public static mediaDevicesCallback: ((callback: (devices: Array<MediaDeviceInfo>) => void) => void) | undefined;
  public static clear(): void {
    Camera.cameraList = undefined;
    Camera.canSwitchFacingMode = false;
  }
  public static setCameraList(list: Array<MediaDeviceInfo>): void {
    Camera.clear();
    if (Array.isArray(list) && list.length > 0) {
      list.sort((a: MediaDeviceInfo, b: MediaDeviceInfo): number => {
        if (a === b) return 0;
        if (a.label !== b.label) {
          const lblA = getDeviceType(a);
          const lblB = getDeviceType(b);
          if (lblA !== lblB) {
            if (lblA === userStr) return -1;
            if (lblB === userStr) return 1;
            if (lblA === envStr) return -1;
            if (lblB === envStr) return 1;
          }
        }
        const iA = list.indexOf(a);
        const iB = list.indexOf(b);
        return iA < iB ? -1 : 1;
      });
    }
    Camera.cameraList = list;
  }
  private static cameraList: Array<MediaDeviceInfo>;
  private static canSwitchFacingMode: boolean = false;
  private cameraIndex: number = -1;
  private cameraFacingMode: string = userStr;
  // The mode passed to the last effective setFacingMode() call. It is compared with the new mode,
  // so that re-applying the same mode (for example, on every camera opening) doesn't discard
  // the camera the user has switched to via flip().
  private appliedFacingMode: string;
  public hasCamera(callback: (res: boolean) => void): void {
    if (Camera.cameraList !== undefined) {
      this.hasCameraCallback(callback);
      return;
    }
    if (Camera.mediaDevicesCallback) {
      const devicesCallback = (devices: Array<MediaDeviceInfo>): void => {
        this.setVideoInputs(devices);
        this.hasCameraCallback(callback);
      };
      Camera.mediaDevicesCallback(devicesCallback);
      return;
    }
    const window = DomWindowHelper.getWindow();
    if (!!window && !!window.navigator.mediaDevices) {
      window.navigator.mediaDevices.enumerateDevices()
        .then(devices =>{
          this.setVideoInputs(devices);
          this.hasCameraCallback(callback);
          this.updateCanFlipValue();
        })
        .catch(error => {
          Camera.cameraList = null;
          this.hasCameraCallback(callback);
        });
    } else {
      Camera.cameraList = null;
      this.hasCameraCallback(callback);
    }
  }
  // Sets the camera that should be used when the video starts. The "auto" mode selects no camera at all,
  // so that the browser opens the camera that the device settings define as the default one.
  // The user still can switch to another camera by calling flip(). An unknown mode is ignored, so the
  // previously selected camera is kept. The same mode applied again is ignored too: the camera selected
  // by the user sticks to this instance until a different mode is set.
  public setFacingMode(mode: string): void {
    if (mode !== userStr && mode !== envStr && mode !== autoStr) return;
    if (mode === this.appliedFacingMode) return;
    this.appliedFacingMode = mode;
    this.cameraFacingMode = mode;
    this.cameraIndex = -1;
  }
  private get isAutoFacingMode(): boolean {
    return this.cameraFacingMode === autoStr;
  }
  // The auto mode keeps no camera selected. As soon as the user flips the camera, the selection has to
  // become a concrete one, otherwise flip() could switch to the camera that is already running: the
  // browser starts from the camera that this method assumes, the front one or the first in the list.
  private resolveAutoFacingMode(): void {
    if (!this.isAutoFacingMode) return;
    this.cameraFacingMode = userStr;
    const devices = Camera.cameraList;
    this.cameraIndex = Array.isArray(devices) ? this.getStartCameraIndex(devices) : -1;
  }
  private getStartCameraIndex(devices: Array<MediaDeviceInfo>): number {
    if (this.cameraFacingMode === envStr) {
      for (let i = 0; i < devices.length; i++) {
        if (getDeviceType(devices[i]) === envStr) return i;
      }
    }
    return 0;
  }
  public getMediaConstraints(videoSize?: { width?: number, height?: number }): MediaStreamConstraints {
    const devices = Camera.cameraList;
    if (!Array.isArray(devices) || devices.length < 1) return undefined;
    const videoConstraints: any = {};
    // The auto mode requests neither a device nor a facing mode, so that the browser opens the camera
    // that the device settings define as the default one.
    if (!this.isAutoFacingMode) {
      // The device list can be replaced after this camera selected a device in it, for example when
      // the browser grants the permission and reports the devices again.
      if (this.cameraIndex < 0 || this.cameraIndex >= devices.length) {
        this.cameraIndex = this.getStartCameraIndex(devices);
      }
      const selDevice = devices[this.cameraIndex];
      if (selDevice && selDevice.deviceId) {
        videoConstraints.deviceId = { exact: selDevice.deviceId };
      } else {
        videoConstraints.facingMode = this.cameraFacingMode;
      }
    }
    if (videoSize) {
      if (videoSize?.height) {
        videoConstraints.height = { ideal: videoSize.height };
      }
      if (videoSize?.width) {
        videoConstraints.width = { ideal: videoSize.width };
      }
    }
    return {
      video: videoConstraints,
      audio: false
    };
  }
  public startVideo(videoElement: HTMLVideoElement, callback: (stream: MediaStream) => void, imageWidth?: number, imageHeight?: number): void {
    if (!videoElement) {
      callback(undefined);
      return;
    }
    videoElement.style.width = "100%";
    videoElement.style.height = "auto";
    videoElement.style.height = "100%";
    videoElement.style.objectFit = "contain";
    const mediaConstraints = this.getMediaConstraints({ width: imageWidth, height: imageHeight });
    const window = DomWindowHelper.getWindow();
    if (!window) {
      callback(undefined);
      return;
    }
    window.navigator.mediaDevices.getUserMedia(mediaConstraints).then(stream => {
      videoElement.srcObject = stream;
      if (!Camera.cameraList[this.cameraIndex]?.deviceId && !!stream.getTracks()[0].getCapabilities().facingMode) {
        Camera.canSwitchFacingMode = true;
        this.updateCanFlipValue();
      }
      videoElement.play();
      callback(stream);
    })
      .catch(error => {
        callback(undefined);
      });
  }
  public getImageSize(videoEl:HTMLVideoElement): { width: number, height: number } {
    return { width: videoEl.videoWidth, height: videoEl.videoHeight };

  }
  public snap(videoElement: HTMLVideoElement, callback: BlobCallback): boolean {
    if (!videoElement) return false;
    if (!DomDocumentHelper.isAvailable()) return false;
    const root = DomDocumentHelper.getDocument();
    if (!root) return false;
    const canvasEl = root.createElement("canvas");
    const imageSize = this.getImageSize(videoElement);
    canvasEl.height = imageSize.height;
    canvasEl.width = imageSize.width;
    let context = canvasEl.getContext("2d");
    /*
    if(this._facingMode == 'user'){
      context.translate(canvasEl.width, 0);
      context.scale(-1, 1);
    }
    */
    context.clearRect(0, 0, canvasEl.width, canvasEl.height);
    context.drawImage(videoElement, 0, 0, canvasEl.width, canvasEl.height);
    canvasEl.toBlob(callback, "image/png");
    return true;
  }

  private canFlipValue: boolean = undefined;

  private updateCanFlipValue() {
    const list = Camera.cameraList;
    this.canFlipValue = Array.isArray(list) && list.length > 1 || Camera.canSwitchFacingMode;
    if (this.onCanFlipChangedCallback)this.onCanFlipChangedCallback(this.canFlipValue);
  }
  private onCanFlipChangedCallback?: (res: boolean) => void;

  public canFlip(onCanFlipChangedCallback?: (res: boolean) => void): boolean {
    if (this.canFlipValue === undefined) {
      this.updateCanFlipValue();
    }
    if (onCanFlipChangedCallback) {
      this.onCanFlipChangedCallback = onCanFlipChangedCallback;
    }
    return this.canFlipValue;
  }
  public flip(): void {
    if (!this.canFlip()) return;
    this.resolveAutoFacingMode();
    if (Camera.canSwitchFacingMode) {
      this.cameraFacingMode = this.cameraFacingMode === userStr ? envStr : userStr;
    } else if (this.cameraIndex >= Camera.cameraList.length - 1) {
      this.cameraIndex = 0;
    } else {
      this.cameraIndex ++;
    }
  }
  private hasCameraCallback(callback: (res: boolean) => void): void {
    callback(Array.isArray(Camera.cameraList));
  }
  private setVideoInputs(devices: Array<MediaDeviceInfo>): void {
    const list: Array<MediaDeviceInfo> = [];
    devices.forEach(device => {
      if (device.kind === "videoinput") {
        list.push(device);
      }
    });
    Camera.setCameraList(list.length > 0 ? list : null);
  }
}