const isGitHubPages = process.env.GITHUB_PAGES === "true";

export default isGitHubPages
  ? {
      output: "export" as const,
      assetPrefix: "/shrimp-appointment",
      trailingSlash: true,
    }
  : {};
