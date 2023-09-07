export class Webcam {
  public static mediaDevicesCallback: (callback: (devices: Array<MediaDeviceInfo>) => void) => void;
  public static clear(): void {
    Webcam.webcamList = undefined;
  }
  private static webcamList: Array<any>;
  public hasWebcam(callback: (res: boolean) => void): void {
    if(Webcam.webcamList !== undefined) {
      this.hasWebcamCallback(callback);
      return;
    }
    if(typeof navigator !== "undefined" && navigator.mediaDevices) {
      Webcam.webcamList = null;
      this.hasWebcamCallback(callback);
    } else {
      if(Webcam.mediaDevicesCallback) {
        const devicesCallback = (devices: Array<MediaDeviceInfo>): void => {
          this.setVideoInputs(devices);
          this.hasWebcamCallback(callback);
        };
        Webcam.mediaDevicesCallback(devicesCallback);
      } else {
        navigator.mediaDevices.enumerateDevices()
          .then(devices =>{
            this.setVideoInputs(devices);
            this.hasWebcamCallback(callback);
          })
          .catch(error => {
            Webcam.webcamList = null;
            this.hasWebcamCallback(callback);
          });
      }
    }
  }
  private hasWebcamCallback(callback: (res: boolean) => void): void {
    callback(Array.isArray(Webcam.webcamList));
  }
  private setVideoInputs(devices: Array<any>): void {
    const list: Array<any> = [];
    devices.forEach(device => {
      if (device.kind === "videoinput") {
        list.push(device);
      }
    });
    Webcam.webcamList = list.length > 0 ? list : null;
  }
}