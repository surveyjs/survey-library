// The wire key codec.
//
// A question's answer travels under its valueName. Its comment ("Other" text) travels
// under the same name plus a FIXED suffix defined here - deliberately not
// survey.commentSuffix, which is a per-survey setting: two peers configured
// differently would write the comment into different fields and diverge without any
// error. The separator is a character no question name can contain.
export const COMMENT_KEY_SUFFIX = "\u0000comment";

// Ceiling on one serialized answer.
//
// A relay usually enforces its own frame limit, and exceeding THAT is not a
// recoverable error - the connection is closed and the form silently stops syncing.
// Refusing the value here keeps the connection alive and puts a message on the
// question instead. Measured in UTF-16 units rather than bytes: exact for the base64
// and ASCII payloads that actually approach the limit, and cheap enough to run on
// every keystroke.
export const MAX_VALUE_CHARS = 16 * 1024 * 1024;

export function encodeValueKey(name: string, isComment: boolean): string {
  return isComment ? name + COMMENT_KEY_SUFFIX : name;
}

export interface IDecodedKey {
  name: string;
  isComment: boolean;
}

export function decodeValueKey(key: string): IDecodedKey {
  if (typeof key === "string" && key.length > COMMENT_KEY_SUFFIX.length &&
    key.substring(key.length - COMMENT_KEY_SUFFIX.length) === COMMENT_KEY_SUFFIX) {
    return { name: key.substring(0, key.length - COMMENT_KEY_SUFFIX.length), isComment: true };
  }
  return { name: key, isComment: false };
}
