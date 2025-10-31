import { SSTConfig } from "sst";
import { NextjsSite, Config } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "mini-ad-platform",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const NEXT_PUBLIC_SUPABASE_URL = new Config.Secret(stack, "NEXT_PUBLIC_SUPABASE_URL");
      const NEXT_PUBLIC_SUPABASE_ANON_KEY = new Config.Secret(stack, "NEXT_PUBLIC_SUPABASE_ANON_KEY");

      const site = new NextjsSite(stack, "site", {
        bind: [NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY],
        environment: {
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;


