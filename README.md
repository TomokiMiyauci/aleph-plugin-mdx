# aleph-plugin-mdx

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno&labelColor=black&color=black)](https://deno.land/x/aleph_plugin_mdx)
[![nest.land](https://nest.land/badge.svg)](https://nest.land/package/aleph_plugin_mdx)

[MDX 2](https://mdxjs.com/) plugin for Aleph.js

## Usage

```ts
// aleph.config.ts
import mdx from "https://deno.land/x/aleph_plugin_mdx@$VERSION/mod.ts";
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

This package exports default as plugin. It uses the same style as the
[official plugin](https://alephjs.org/docs/plugins/official-plugins).

### default(options?)

#### options.rewritePagePath

Rewrite the page path

```ts
declare function rewritePagePath: (path: string) => string | undefined;
```

example:

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

#### options.pageProps

Define props to page components.

```ts
declare const pageProps = Record<string | number, unknown>;
```

example:

```ts
// aleph.config.ts
import mdx from "https://deno.land/x/aleph_plugin_mdx@$VERSION/mod.ts";
import type { Config } from "https://deno.land/x/aleph@v0.3.0-beta.19/types.d.ts";
export default <Config> {
  plugins: [
    mdx({
      pageProps: { nav: [{ path: "/" }, { path: "/docs" }] },
    }),
  ],
};
```

```bash
pages
├── docs
│   └── installation.mdx
└── docs.tsx
```

```tsx
// docs.tsx
import type { MDXContent } from "https://esm.sh/@types/mdx/types.d.ts";
export type DocsProps = {
  Page?: MDXContent & { nav: { path: string }[] };
};
export default function Docs({ Page }: DocsProps) {
  if (!Page) return <></>;

  // Page.nav
  return <Page />;
}
```

others:

Passes the `@mdx-js/mdx#compile` options as is. For details, see
[compile options](https://mdxjs.com/packages/mdx/#compilefile-options).

## Note

This plugin depends on
[@mdx-js/mdx@2.0.0](https://www.npmjs.com/package/@mdx-js/mdx/v/2.0.0).

## License

Copyright © 2021-present [TomokiMiyauci](https://github.com/TomokiMiyauci).

Released under the [MIT](./LICENSE) license
