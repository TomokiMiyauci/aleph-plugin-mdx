import { mdx, remarkFrontmatterProps, remarkTocProps } from "../mod.ts";
import remarkFrontmatter from "https://esm.sh/remark-frontmatter@4.0.1";
import type { Config } from "aleph/types";
export default <Config> {
  plugins: [mdx({
    rewritePagePath(path) {
      return path.replaceAll("_", "-");
    },
    remarkPlugins: [remarkFrontmatter, remarkFrontmatterProps, [
      remarkTocProps,
      { maxDepth: 4 },
    ]],
  })],
};
