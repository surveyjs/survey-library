import { settings } from "../settings";
import { DomDocumentHelper } from "../global_variables_utils";

const envStr = "environment";
const userStr = "user";
export class Camera {
  public static mediaDevicesCallback: ((callback: (devices: Array<MediaDeviceInfo>) => void) => void) | undefined;
  public static clear(): void {
    Camera.cameraList = undefined;
    Camera.cameraIndex = -1;
  }
  public static setCameraList(list: Array<MediaDeviceInfo>): void {
    const getDeviceType = function(device: MediaDeviceInfo): string {
      const lbl = device.label.toLocaleLowerCase();
      if(lbl.indexOf(userStr) > -1) return userStr;
      if(lbl.indexOf(envStr) > -1) return envStr;
      if(lbl.indexOf("front") > -1) return userStr;
      if(lbl.indexOf("back") > -1) return envStr;
      return "";
    };
    Camera.clear();
    if(Array.isArray(list) && list.length > 0) {
      Camera.cameraIndex = -1;
      list.sort((a: MediaDeviceInfo, b: MediaDeviceInfo): number => {
        if(a === b) return 0;
        if(a.label !== b.label) {
          const lblA = getDeviceType(a);
          const lblB = getDeviceType(b);
          if(lblA !== lblB) {
            if(lblA === userStr) return -1;
            if(lblB === userStr) return 1;
            if(lblA === envStr) return -1;
            if(lblB === envStr) return 1;
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
  private static cameraIndex: number = -1;
  private static cameraFacingMode: string = userStr;
  private static canSwitchFacingMode: boolean = false;
  public hasCamera(callback: (res: boolean) => void): void {
    if(Camera.cameraList !== undefined) {
      this.hasCameraCallback(callback);
      return;
    }
    if(Camera.mediaDevicesCallback) {
      const devicesCallback = (devices: Array<MediaDeviceInfo>): void => {
        this.setVideoInputs(devices);
        this.hasCameraCallback(callback);
      };
      Camera.mediaDevicesCallback(devicesCallback);
      return;
    }
    if(typeof navigator !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices.enumerateDevices()
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
  public getMediaConstraints(videoSize?: { width?: number, height?: number }): MediaStreamConstraints {
    const devices = Camera.cameraList;
    if(!Array.isArray(devices) || devices.length < 1) return undefined;
    if(Camera.cameraIndex < 0) Camera.cameraIndex = 0;
    const selDevice = devices[Camera.cameraIndex];
    const videoConstraints: any = {};
    if (selDevice && selDevice.deviceId) {
      videoConstraints.deviceId = { exact: selDevice.deviceId };
    } else {
      videoConstraints.facingMode = Camera.cameraFacingMode;
    }
    if(videoSize) {
      if(videoSize?.height) {
        videoConstraints.height = { ideal: videoSize.height };
      }
      if(videoSize?.width) {
        videoConstraints.width = { ideal: videoSize.width };
      }
    }
    return {
      video: videoConstraints,
      audio: false
    };
  }
  public startVideo(videoElement: HTMLVideoElement, callback: (stream: MediaStream) => void, imageWidth?: number, imageHeight?: number): void {
    if(!videoElement) {
      callback(undefined);
      return;
    }
    videoElement.style.width = "100%";
    videoElement.style.height = "auto";
    videoElement.style.height = "100%";
    videoElement.style.objectFit = "contain";
    const mediaConstraints = this.getMediaConstraints({ width: imageWidth, height: imageHeight });
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(stream => {
      videoElement.srcObject = stream;
      if(!Camera.cameraList[Camera.cameraIndex]?.deviceId && !!stream.getTracks()[0].getCapabilities().facingMode) {
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
    if(!videoElement) return false;
    if(!DomDocumentHelper.isAvailable()) return false;
    const root = DomDocumentHelper.getDocument();
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
    if(this.onCanFlipChangedCallback) this.onCanFlipChangedCallback(this.canFlipValue);
  }
  private onCanFlipChangedCallback?: (res: boolean) => void;

  public canFlip(onCanFlipChangedCallback?: (res: boolean) => void): boolean {
    if(this.canFlipValue === undefined) {
      this.updateCanFlipValue();
    }
    if(onCanFlipChangedCallback) {
      this.onCanFlipChangedCallback = onCanFlipChangedCallback;
    }
    return this.canFlipValue;
  }
  public flip(): void {
    if(!this.canFlip()) return;
    if(Camera.canSwitchFacingMode) {
      Camera.cameraFacingMode = Camera.cameraFacingMode === userStr ? "environment" : userStr;
    }
    else if(Camera.cameraIndex >= Camera.cameraList.length - 1) {
      Camera.cameraIndex = 0;
    } else {
      Camera.cameraIndex ++;
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