// The wire key codec.
//
// A question's answer travels under its valueName. Its comment ("Other" text) travels
// under the same name plus a FIXED suffix defined here - deliberately not
// survey.commentSuffix, which is a per-survey setting: two peers configured
// differently would write the comment into different fields and diverge without any
// error. The separator is a character no question name can contain.
export const COMMENT_KEY_SUFFIX = "\u0000comment";

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

// A name as survey-core's own events and survey.data spell it: a comment there carries
// the LOCAL survey.commentSuffix, which the wire key must not (see COMMENT_KEY_SUFFIX).
export function decodeSurveyName(name: string, commentSuffix: string): IDecodedKey {
  const isComment = !!commentSuffix && name.length > commentSuffix.length &&
    name.substring(name.length - commentSuffix.length) === commentSuffix;
  return { name: isComment ? name.substring(0, name.length - commentSuffix.length) : name, isComment: isComment };
}
