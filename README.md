# aleph-plugin-mdx

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno&labelColor=black&color=black)](https://deno.land/x/aleph_plugin_mdx)
[![nest.land](https://nest.land/badge.svg)](https://nest.land/package/aleph_plugin_mdx)

[MDX 2](https://mdxjs.com/) plugin for Aleph.js

## Usage

```ts
// aleph.config.ts
import { mdx } from "https://deno.land/x/aleph_plugin_mdx@$VERSION/mod.ts";
import type { Config } from "https://deno.land/x/aleph@v0.3.0-beta.19/types.d.ts";

export default <Config> {
  plugins: [mdx()],
};
```

then, modify `import_map.json`.

```json
{
  "imports": {
    ...,
    "react/jsx-runtime": "https://esm.sh/react@17.0.2/jsx-runtime"
  }
}
```

### Why need import map?

By default, `.mdx` files are JSX transformed into the `@jsx-runtime` format.

It includes the following imports.

```ts
import {
  Fragment as _Fragment,
  jsx as _jsx,
  jsxs as _jsxs,
} from "react/jsx-runtime";
```

As you know, Deno imports remote modules with URL schema. This means that you
need to change `react/jsx-runtime` to the correct URL.

Fortunately, Aleph.js has import map resolution enabled by default, so we will
use that.

:construction: This process may be automated in the future.

## Examples

- [_example](./_example/README.md)

## API

### mdx(options)

Plugin for mdx

```ts
// aleph.config.ts
import { mdx } from "https://deno.land/x/aleph_plugin_mdx@$VERSION/mod.ts";
import type { Config } from "https://deno.land/x/aleph@v0.3.0-beta.19/types.d.ts";
export default <Config> {
  plugins: [mdx()],
};
```

#### options.rewritePagePath

Rewrite the page path

```ts
declare function rewritePagePath: (path: string) => string | undefined;
```

##### example

```bash
pages
├── get_started.mdx
└── index.tsx
```

```ts
// aleph.config.ts
import mdx from "https://deno.land/x/aleph_plugin_mdx@$VERSION/mod.ts";
import type { Config } from "https://deno.land/x/aleph@v0.3.0-beta.19/types.d.ts";
export default <Config> {
  plugins: [mdx({
    rewritePagePath(path) {
      return path.replaceAll("_", "-");
    },
  })],
};
```

output:

```bash
▲ SSG
  /
  /get-started
```

#### others

Passes the `@mdx-js/mdx#compile` options as is. For details, see
[compile options](https://mdxjs.com/packages/mdx/#compilefile-options).

### remarkFrontmatterProps(options?)

A remark plugin to expose frontmatter to `ssrProps`. This will allow you to
retrieve frontmatter from `pageProps`.

This is useful for layout pages.

This package depends on the AST output by
[remark-frontmatter](https://github.com/remarkjs/remark-frontmatter).

```ts
// aleph.config.ts
import {
  mdx,
  remarkFrontmatterProps,
} from "https://deno.land/x/aleph_plugin_mdx@$VERSION/mod.ts";
import remarkFrontmatter from "https://esm.sh/remark-frontmatter";
import type { Config } from "https://deno.land/x/aleph@v0.3.0-beta.19/types.d.ts";
export default <Config> {
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkFrontmatterProps],
    }),
  ],
};
```

```md
// pages/docs/installation.mdx
---
title: Installation
---
```

output:

```js
// .aleph/pages/docs/installation.js
export const ssr = {
  props: () => ({ "meta": { "title": "Installation" } }),
};
function MDXContent(props = {}) {
  ...
}
export default MDXContent;
```

#### example

```bash
pages
├── docs
│   └── installation.mdx
└── docs.tsx
```

```tsx
// docs.tsx
import type { MDXContent } from "https://esm.sh/@types/mdx/types.d.ts";

type Meta = { title: string };
export type DocsProps = {
  Page?: MDXContent;
  pageProps: {
    meta?: Partial<Meta>;
  };
};
export default function Docs({ Page, pageProps }: DocsProps) {
  if (!Page) return <></>;

  // pageProps.meta?.title
  return <Page />;
}
```

#### options.name

Define export name. The default export name is `meta`

```ts
// aleph.config.ts
import {
  mdx,
  remarkFrontmatterProps,
} from "https://deno.land/x/aleph_plugin_mdx@$VERSION/mod.ts";
import remarkFrontmatter from "https://esm.sh/remark-frontmatter";
import type { Config } from "https://deno.land/x/aleph@v0.3.0-beta.19/types.d.ts";
export default <Config> {
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, [remarkFrontmatterProps, {
        name: "frontmatter",
      }]],
    }),
  ],
};
```

output:

```js
// .aleph/pages/docs/installation.js
export const ssr = {
  props: () => ({ "frontmatter": { "title": "Installation" } }),
};
function MDXContent(props = {}) {
  ...
}
export default MDXContent;
```

## Note

This plugin depends on
[@mdx-js/mdx@2.0.0](https://www.npmjs.com/package/@mdx-js/mdx/v/2.0.0).

## License

Copyright © 2021-present [TomokiMiyauci](https://github.com/TomokiMiyauci).

Released under the [MIT](./LICENSE) license
