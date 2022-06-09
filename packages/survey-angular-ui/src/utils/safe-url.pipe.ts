import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

//temp: disables angular sanitizer, which breaks a links
@Pipe({ name: "safeUrl" })
export class SafeUrlPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}
  transform(url: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }
}