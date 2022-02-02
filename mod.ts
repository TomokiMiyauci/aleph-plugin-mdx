import {
  Aleph,
  compile,
  LoadInput,
  LoadOutput,
  Plugin,
  ResolveResult,
  util,
} from "./deps.ts";

export type CompileOptions = Parameters<typeof compile>[1];
export type Options = CompileOptions;

const pattern = /\.(mdx)$/i;
const INDEX_PATH = "/index";
const PAGES_PATH = "/pages";
const NAME = "mdx-loader";

export function mdxResolver(specifier: string): ResolveResult {
  const pagePath = util.trimPrefix(
    specifier.replace(pattern, ""),
    PAGES_PATH,
  );
  const isIndex = pagePath.endsWith(INDEX_PATH);
  const path = isIndex
    ? (() => {
      const trimmed = util.trimSuffix(pagePath, INDEX_PATH);
      return trimmed ? trimmed : "/";
    })()
    : pagePath;

  return {
    asPage: { path, isIndex },
  };
}

export async function mdxLoader(
  { specifier }: LoadInput,
  aleph: Aleph,
  options?: CompileOptions,
): Promise<LoadOutput> {
  const { content } = await aleph.fetchModule(specifier);
  const { framework } = aleph.config;
  const source = new TextDecoder().decode(content);

  const { contents } = await compile(source, options);

  if (framework !== "react") {
    throw new Error(
      `${NAME}: don't support framework '${framework}'`,
    );
  }

  return {
    code: [
      contents.toString(),
    ].join("\n"),
  };
}

/** Plugin for mdx
 * ```ts
 * // aleph.config.ts
 * import mdx from "https://deno.land/x/aleph_plugin_mdx@$VERSION/mod.ts"
 * import type { Config } from "https://deno.land/x/aleph@v0.3.0-beta.19/types.d.ts"
 *
 * export default <Config> {
 *    plugins: [mdx()],
 * };
 * ```
 */
export default function (options?: Options): Plugin {
  return {
    name: NAME,
    setup(aleph) {
      aleph.onResolve(pattern, mdxResolver);
      aleph.onLoad(pattern, (input) => mdxLoader(input, aleph, options));
    },
  };
}
