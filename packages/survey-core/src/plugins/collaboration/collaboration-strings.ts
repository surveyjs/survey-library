// Collaboration carries its own English strings instead of adding keys to
// src/localization/english.ts.
//
// Two reasons: the feature ships as a separate bundle, so its text has no business
// sitting in the default one that every form downloads; and a key added there is a
// key every locale file is then expected to follow.
//
// Localization comes later. A host that needs other languages today replaces the
// strings wholesale through setCollabStrings.
export const collaborationStrings: { [index: string]: string } = {
  collabParticipants: "Participants",
  collabInvite: "Invite",
  collabInviteCopied: "Copied",
  collabInviteTooltip: "Copy invite link",
  collabStatusConnecting: "Connecting...",
  collabStatusClosed: "Disconnected",
  collabValueTooLarge: "This answer is too large to share with the other participants.",
  collabInfoRow: "{0}: {1}",
  collabMoreParticipants: "+{0}",
};

// Replaces or extends the strings. Unknown keys are kept, so a host can add its own.
export function setCollabStrings(patch: { [index: string]: string }): void {
  if (!patch) return;
  Object.keys(patch).forEach((key) => {
    collaborationStrings[key] = patch[key];
  });
}

// Reads a string and substitutes {0}, {1}, ... with the arguments.
export function getCollabString(key: string, ...args: Array<any>): string {
  const template = collaborationStrings[key];
  if (template === undefined) return key;
  return template.replace(/\{(\d+)\}/g, (match, index) => {
    const value = args[Number(index)];
    return value === undefined ? match : String(value);
  });
}
