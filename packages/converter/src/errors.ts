// `convert()` NEVER throws on an unsupported construct - those go to the
// report. It throws ONLY when the input cannot be a form definition at all:
// unparseable, or parseable but the wrong format for the converter that was
// called. These two errors are the entire throwing surface.

export class ConverterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
    // Restore prototype chain for ES5 targets.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Input is not valid JSON / not an object we can walk at all. */
export class UnparseableInputError extends ConverterError {}

/**
 * Input parsed, but it is not the format this converter handles (e.g. a JSON
 * Schema handed to the Form.io converter). Distinct from a construct we simply
 * do not support yet.
 */
export class WrongFormatError extends ConverterError {}
