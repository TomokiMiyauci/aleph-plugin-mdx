import mdx from "../mod.ts";
import type { Config } from "aleph/types";
export default <Config> {
  plugins: [mdx({
    rewritePagePath(path) {
      return path.replaceAll("_", "-");
    },
  })],
};
