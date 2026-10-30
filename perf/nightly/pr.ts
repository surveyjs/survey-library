// The PR of a first-parent master commit (05, PR numbers). Subjects come in four shapes: a squash "... (#12145)",
// "Merge pull request #12152 from ..." with the title in the body, direct pushes with no PR ("Release: ...") and
// back-merges ("Merge branch 'master' of ..."). A bare "#N" is never a PR: "fix #12147 (...) (#12151)" is #12151.
export const repoUrl = "https://github.com/surveyjs/survey-library";

export interface CommitPr {
  sha: string;
  pr: number | null;
  title: string;
  url: string;
}

export function prOf(sha: string, subject: string, body?: string): CommitPr {
  const merge = /^Merge pull request #(\d+) from /.exec(subject);
  if (merge) {
    const title = (body || "").split(/\r?\n/).map((s: string) => s.trim()).filter((s: string) => !!s)[0] || subject;
    return { sha: sha, pr: Number(merge[1]), title: title, url: repoUrl + "/pull/" + merge[1] };
  }
  const all = subject.match(/\(#(\d+)\)/g);
  if (all) {
    const pr = Number(/\d+/.exec(all[all.length - 1])![0]);
    // The post shows "[#N](url) title": the trailing "(#N)" is not repeated in the title.
    return { sha: sha, pr: pr, title: subject.replace(/\s*\(#\d+\)\s*$/, ""), url: repoUrl + "/pull/" + pr };
  }
  return { sha: sha, pr: null, title: subject, url: repoUrl + "/commit/" + sha };
}
