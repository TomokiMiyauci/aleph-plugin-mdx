import { visit } from "https://esm.sh/unist-util-visit@4.1.0?pin=v66";
import { load } from "https://esm.sh/js-yaml@4.1.0?pin=v66";
import { parse } from "https://esm.sh/toml@3.0.0?pin=v66";
import { isObject } from "https://deno.land/x/isx@v1.0.0-beta.17/mod.ts";
import { type Plugin } from "https://esm.sh/unified@10.1.1?pin=v66";
import type {
  Root,
} from "https://esm.sh/@types/mdast@3.0.10/index.d.ts?pin=v66";
import { type MdxjsEsm } from "https://esm.sh/mdast-util-mdx?pin=v66";
import { walk } from "https://esm.sh/estree-walker@3.0.1?pin=v66";
import { valueToEstree } from "https://esm.sh/estree-util-value-to-estree@1.3.0?pin=v66";
import type { Node } from "https://esm.sh/@types/unist@2.0.6/index.d.ts";
import type {
  Identifier,
  ObjectExpression,
  VariableDeclarator,
} from "https://esm.sh/@types/estree@0.0.51/index.d.ts?pin=v66";

export type RemarkFrontmatterPropsOptions = {
  /**
   * Define export name.
   * ```ts
   * // aleph.config.ts
   * import {
   *   mdx,
   *   remarkFrontmatterProps,
   * } from "https://deno.land/x/aleph_plugin_mdx@$VERSION/mod.ts";
   * import remarkFrontmatter from "https://esm.sh/remark-frontmatter";
   * import type { Config } from "https://deno.land/x/aleph@v0.3.0-beta.19/types.d.ts";
   * export default <Config> {
   *   plugins: [
   *     mdx({
   *       remarkPlugins: [remarkFrontmatter, [remarkFrontmatterProps, {
   *         name: "frontmatter",
   *       }]],
   *     }),
   *   ],
   * };
   * ```
   * @default meta
   */
  name?: string;
};

const defaultName = "meta";

/** A remark plugin to expose frontmatter to `ssrProps`.
 * ```ts
 * // aleph.config.ts
 * import {
 *   mdx,
 *   remarkFrontmatterProps,
 * } from "https://deno.land/x/aleph_plugin_mdx@$VERSION/mod.ts";
 * import remarkFrontmatter from "https://esm.sh/remark-frontmatter";
 * import type { Config } from "https://deno.land/x/aleph@v0.3.0-beta.19/types.d.ts";
 * export default <Config> {
 *   plugins: [
 *     mdx({
 *       remarkPlugins: [remarkFrontmatter, remarkFrontmatterProps],
 *     }),
 *   ],
 * };
 * ```
 */
export const remarkFrontmatterProps: Plugin<
  [RemarkFrontmatterPropsOptions],
  Root
> = (
  { name = defaultName } = { name: defaultName },
) => {
  return (root) => {
    // deno-lint-ignore no-explicit-any
    const data: Record<PropertyKey, any>[] = [];
    visit(root, "yaml", ({ value }) => {
      const _ = load(value);
      if (!isObject(_)) {
        throw new Error(
          `Expected frontmatter data to be an object, got:\n${value}`,
        );
      }
      data.push(_);
    });
    visit(root, "toml", (node: { value: string }) => {
      const value = parse(node.value);
      if (!isObject(value)) {
        throw new Error(
          `Expected frontmatter data to be an object, got:\n${node.value}`,
        );
      }
      data.push(value);
    });

    if (!data.length) return;
    const props = {
      [name]: data.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
    };

    const mdxJsEsm = createOrUpdateSsrProps(root, props);
    if (mdxJsEsm) {
      root.children.unshift(mdxJsEsm as never);
    }
  };
};

function ssrProps(props: unknown): MdxjsEsm {
  const mdxJsEsm: MdxjsEsm = {
    "type": "mdxjsEsm",
    value: "",
    "data": {
      estree: {
        "type": "Program",
        "body": [
          {
            "type": "ExportNamedDeclaration",
            "declaration": {
              "type": "VariableDeclaration",
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "id": {
                    "type": "Identifier",
                    "name": "ssr",
                  },
                  "init": {
                    "type": "ObjectExpression",
                    "properties": [
                      {
                        "type": "Property",
                        "method": false,
                        "shorthand": false,
                        "computed": false,
                        "key": {
                          "type": "Identifier",
                          "name": "props",
                        },
                        "value": {
                          "type": "ArrowFunctionExpression",
                          "expression": true,
                          "generator": false,
                          "async": false,
                          "params": [],
                          "body": valueToEstree(props),
                        },
                        "kind": "init",
                      },
                    ],
                  },
                },
              ],
              "kind": "const",
            },
            "specifiers": [],
            "source": null,
          },
        ],
        "sourceType": "module",
      },
    },
  };
  return mdxJsEsm;
}

function createOrUpdateSsrProps(
  root: Node,
  props: unknown,
): MdxjsEsm | undefined {
  let hasNode = false;
  walk(root, {
    enter(mdxJsEsm) {
      if (mdxJsEsm.type !== "mdxjsEsm") return;
      const estree = (mdxJsEsm as MdxjsEsm).data?.estree;
      if (!estree) return;
      walk(estree, {
        enter(node) {
          if (
            node.type === "VariableDeclarator" &&
            (node as VariableDeclarator).id.type === "Identifier" &&
            ((node as VariableDeclarator).id as Identifier).name === "ssr"
          ) {
            hasNode = true;
            walk(node, {
              enter(child, parent) {
                if (
                  child.type === "ObjectExpression" &&
                  parent.type === "ArrowFunctionExpression"
                ) {
                  const { properties, ...rest } = (child as ObjectExpression);
                  const tree = valueToEstree(props);
                  if (tree.type !== "ObjectExpression") {
                    throw Error(`Invalid data types.[${props}]`);
                  }

                  properties.push(...(tree as ObjectExpression).properties);
                  const baseNode = { ...rest, properties };
                  this.replace(baseNode);
                  this.skip();
                }
              },
            });
          }
        },
      });
    },
  });

  if (!hasNode) {
    return ssrProps(props);
  }
  return;
}
