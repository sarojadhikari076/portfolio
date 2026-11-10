export type BuildInfo = { commit: string; commitUrl: string | null; builtAt: Date };

/** Read at build time. Every page is static, so this is the moment the site was built. */
export function buildInfo(): BuildInfo {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  const owner = process.env.VERCEL_GIT_REPO_OWNER;
  const repo = process.env.VERCEL_GIT_REPO_SLUG;

  return {
    commit: sha ? sha.slice(0, 7) : 'local',
    commitUrl: sha && owner && repo ? `https://github.com/${owner}/${repo}/commit/${sha}` : null,
    builtAt: new Date(),
  };
}
