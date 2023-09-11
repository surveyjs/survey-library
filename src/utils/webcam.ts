import { settings } from "survey-core";

export class Webcam {
  public static mediaDevicesCallback: ((callback: (devices: Array<MediaDeviceInfo>) => void) => void) | undefined;
  public static clear(): void {
    Webcam.webcamList = undefined;
  }
  private static webcamList: Array<MediaDeviceInfo>;
  public hasWebcam(callback: (res: boolean) => void): void {
    if(Webcam.webcamList !== undefined) {
      this.hasWebcamCallback(callback);
      return;
    }
    if(Webcam.mediaDevicesCallback) {
      const devicesCallback = (devices: Array<MediaDeviceInfo>): void => {
        this.setVideoInputs(devices);
        this.hasWebcamCallback(callback);
      };
      Webcam.mediaDevicesCallback(devicesCallback);
      return;
    }
    if(typeof navigator !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then(devices =>{
          this.setVideoInputs(devices);
          this.hasWebcamCallback(callback);
        })
        .catch(error => {
          Webcam.webcamList = null;
          this.hasWebcamCallback(callback);
        });
    } else {
      Webcam.webcamList = null;
      this.hasWebcamCallback(callback);
    }
  }
  public getMediaConstraints(devices?: Array<MediaDeviceInfo>): MediaStreamConstraints {
    if(!devices) devices = Webcam.webcamList;
    if(!Array.isArray(devices)) return undefined;
    let selDevice: MediaDeviceInfo;
    for(let i = 0; i < devices.length; i ++) {
      const device = devices[i];
      const dType = this.getDeviceType(device);
      if(dType === "user") {
        selDevice = device;
        break;
      }
      if(!selDevice) selDevice = device;
      else {
        const selType = this.getDeviceType(selDevice);
        if(!selType && !!dType) {
          selDevice = device;
        }
      }
    }
    const videoConstraints: any = {};
    if (selDevice && selDevice.deviceId) {
      videoConstraints.deviceId = { exact: selDevice.deviceId };
    } else {
      videoConstraints.facingMode = "user";
    }
    //videoConstraints.width = { exact: this._webcamElement.width};
    //videoConstraints.height = {exact: this._webcamElement.height};
    return {
      video: videoConstraints,
      audio: false
    };
  }
  private getDeviceType(device: MediaDeviceInfo): string {
    const lbl = device.label.toLocaleLowerCase();
    if(lbl.indexOf("user") > -1) return "user";
    if(lbl.indexOf("enviroment") > -1) return "enviroment";
    return "";
  }
  public startVideo(videoElementId: string, callback: (stream: MediaStream) => void): void {
    const videoEl: any = settings.environment.root?.getElementById(videoElementId);
    if(!videoEl) {
      callback(undefined);
      return;
    }
    navigator.mediaDevices.getUserMedia(this.getMediaConstraints()).then(stream => {
      videoEl.srcObject = stream;
      videoEl.play();
      callback(stream);
    })
      .catch(error => {
        callback(undefined);
      });
  }

  private hasWebcamCallback(callback: (res: boolean) => void): void {
    callback(Array.isArray(Webcam.webcamList));
  }
  private setVideoInputs(devices: Array<MediaDeviceInfo>): void {
    const list: Array<MediaDeviceInfo> = [];
    devices.forEach(device => {
      if (device.kind === "videoinput") {
        list.push(device);
      }
    });
    Webcam.webcamList = list.length > 0 ? list : null;
  }
}