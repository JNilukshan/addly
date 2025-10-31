// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "adly",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const site = new sst.aws.Nextjs("AdlyApp", {
      environment: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    });

    return {
      url: site.url,
    };
  },
});
