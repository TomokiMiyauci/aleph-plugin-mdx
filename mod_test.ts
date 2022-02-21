import { expect, test } from "./dev_deps.ts";
import { mdx, remarkFrontmatterProps, remarkTocProps } from "./mod.ts";

test("named export", () => {
  expect(mdx).toBeDefined();
  expect(remarkFrontmatterProps).toBeDefined();
  expect(remarkTocProps).toBeDefined();
});
