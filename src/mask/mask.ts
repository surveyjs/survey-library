export class InputMaskBase {
  placeholderChar = "_";

  definitions: { [key: string]: RegExp } = {
    "9": /[0-9]/,
    "a": /[a-zA-Z]/,
    "*": /[a-zA-Z0-9]/
  }

  constructor(private mask: string) { }

  getMaskedString(str: string): string {
    let result = "";
    let strIndex = 0;
    for(let maskIndex = 0; maskIndex < this.mask.length; maskIndex++) {
      const currentDefinition = this.definitions[this.mask[maskIndex]];
      if(currentDefinition) {
        if(strIndex < str.length && str[strIndex].match(currentDefinition)) {
          result += str[strIndex];
        } else {
          result += this.placeholderChar;
        }
        strIndex++;
      } else {
        result += this.mask[maskIndex];
      }
    }
    return result;
  }

  getUnmaskedValue(str: string, matchWholeMask: boolean): string {
    let result = "";
    for(let index = 0; index < this.mask.length; index++) {
      const currentDefinition = this.definitions[this.mask[index]];
      if(currentDefinition) {
        if(str[index].match(currentDefinition)) {
          result += str[index];
        } else if(matchWholeMask) {
          result = "";
          break;
        } else {
          break;
        }
      }
    }
    return result;
  }

  updateMaskedString(str: string): string {
    return this.getMaskedString(this.getUnmaskedValue(str, false));
  }
}