// Last-commit lookup costs one request per branch head, so keep the cache long
// enough to stay under the 60 req/h unauthenticated limit.
const REVALIDATE_SECONDS = 1800;

export type RepoStats = {
  stars: number;
  commits: number;
  lastCommitAt: string;
};

function githubFetch(path: string) {
  const token = process.env.GITHUB_TOKEN;
  return fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate: REVALIDATE_SECONDS },
  });
}

// Commit count on the default branch: request one commit per page and read
// the page number of rel="last" from the Link header.
function commitCountFromLink(link: string | null): number {
  const match = link?.match(/[?&]page=(\d+)>;\s*rel="last"/);
  return match ? Number(match[1]) : 1;
}

type CommitListItem = { commit: { committer: { date: string } } };

async function headCommitDate(repo: string, sha: string): Promise<string | null> {
  const res = await githubFetch(`/repos/${repo}/commits?sha=${sha}&per_page=1`);
  if (!res.ok) return null;
  const commits: CommitListItem[] = await res.json();
  return commits[0]?.commit.committer.date ?? null;
}

// Newest commit across every branch, not just the default one.
async function latestCommitAcrossBranches(repo: string): Promise<string | null> {
  const res = await githubFetch(`/repos/${repo}/branches?per_page=100`);
  if (!res.ok) return null;
  const branches: { commit: { sha: string } }[] = await res.json();
  const shas = [...new Set(branches.map((b) => b.commit.sha))];
  const dates = await Promise.all(shas.map((sha) => headCommitDate(repo, sha)));
  const valid = dates.filter((d): d is string => d !== null);
  if (valid.length === 0) return null;
  return valid.reduce((a, b) => (new Date(a) > new Date(b) ? a : b));
}

export async function getRepoStats(repo: string): Promise<RepoStats | null> {
  try {
    const [repoRes, commitsRes, lastCommitAt] = await Promise.all([
      githubFetch(`/repos/${repo}`),
      githubFetch(`/repos/${repo}/commits?per_page=1`),
      latestCommitAcrossBranches(repo),
    ]);
    if (!repoRes.ok || !commitsRes.ok || !lastCommitAt) return null;

    const repoData: { stargazers_count: number } = await repoRes.json();

    return {
      stars: repoData.stargazers_count,
      commits: commitCountFromLink(commitsRes.headers.get("link")),
      lastCommitAt,
    };
  } catch {
    return null;
  }
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60],
  ["month", 30 * 24 * 60 * 60],
  ["day", 24 * 60 * 60],
  ["hour", 60 * 60],
  ["minute", 60],
];

export function formatRelativeJa(iso: string, now = Date.now()): string {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const rtf = new Intl.RelativeTimeFormat("ja", { numeric: "always" });
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) {
      return rtf.format(Math.trunc(seconds / size), unit).replace(/\s/g, "");
    }
  }
  return "たった今";
}

export function formatDateTimeJst(iso: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
