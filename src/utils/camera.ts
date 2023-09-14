import { IElement, settings } from "survey-core";

export class Camera {
  public static mediaDevicesCallback: ((callback: (devices: Array<MediaDeviceInfo>) => void) => void) | undefined;
  public static clear(): void {
    Camera.cameraList = undefined;
    Camera.cameraIndex = -1;
  }
  public static setCameraList(list: Array<MediaDeviceInfo>): void {
    const getDeviceType = function(device: MediaDeviceInfo): string {
      const lbl = device.label.toLocaleLowerCase();
      if(lbl.indexOf("user") > -1) return "user";
      if(lbl.indexOf("enviroment") > -1) return "enviroment";
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
            if(lblA === "user") return -1;
            if(lblB === "user") return 1;
            if(lblA === "enviroment") return -1;
            if(lblB === "enviroment") return 1;
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
  public getMediaConstraints(videoEl?: any): MediaStreamConstraints {
    const devices = Camera.cameraList;
    if(!Array.isArray(devices) || devices.length < 1) return undefined;
    if(Camera.cameraIndex < 0) Camera.cameraIndex = 0;
    const selDevice = devices[Camera.cameraIndex];
    const videoConstraints: any = {};
    if (selDevice && selDevice.deviceId) {
      videoConstraints.deviceId = { exact: selDevice.deviceId };
    } else {
      videoConstraints.facingMode = "user";
    }
    if(videoEl) {
      videoConstraints.width = { exact: videoEl.width ? videoEl.width : videoEl.scrollWidth };
      videoConstraints.height = { exact: videoEl.height ? videoEl.height : videoEl.scrollHeight };
    }
    return {
      video: videoConstraints,
      audio: false
    };
  }
  public startVideo(videoElementId: string, callback: (stream: MediaStream) => void, imageWidth?: string, imageHeight?: string): void {
    const videoEl: any = settings.environment.root?.getElementById(videoElementId);
    if(!videoEl) {
      callback(undefined);
      return;
    }
    if(imageWidth) {
      videoEl.width = imageWidth;
    } else {
      videoEl.style.width = "100%";
    }
    if(imageHeight) {
      videoEl.height = imageHeight;
    } else {
      videoEl.style.height = "100%";
    }
    navigator.mediaDevices.getUserMedia(this.getMediaConstraints(videoEl)).then(stream => {
      videoEl.srcObject = stream;
      videoEl.play();
      callback(stream);
    })
      .catch(error => {
        callback(undefined);
      });
  }
  public snap(videoElementId: string, callback: BlobCallback): boolean {
    if("undefined" === typeof document) return false;
    const root = document;
    const videoEl: any = root.getElementById(videoElementId);
    if(!videoEl) return false;
    const canvasEl = root.createElement("canvas");
    canvasEl.height = videoEl.scrollHeight;
    canvasEl.width = videoEl.scrollWidth;
    let context = canvasEl.getContext("2d");
    /*
    if(this._facingMode == 'user'){
      context.translate(canvasEl.width, 0);
      context.scale(-1, 1);
    }
    */
    context.clearRect(0, 0, canvasEl.width, canvasEl.height);
    context.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
    canvasEl.toBlob(callback, "image/png");
    return true;
  }
  public canFlip(): boolean {
    const list = Camera.cameraList;
    return Array.isArray(list) && list.length > 1;
  }
  public flip(): void {
    if(!this.canFlip()) return;
    if(Camera.cameraIndex >= Camera.cameraList.length - 1) {
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