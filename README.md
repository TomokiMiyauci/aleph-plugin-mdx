# aleph-plugin-mdx

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

## API

This package exports default as plugin. It uses the same style as the
[official plugin](https://alephjs.org/docs/plugins/official-plugins).

### default(options?)

Passes the `@mdx-js/mdx#compile` options as is. For details, see
[compile options](https://mdxjs.com/packages/mdx/#compilefile-options).

## Note

This plugin depends on [xdm@1.6.0](https://www.npmjs.com/package/xdm/v/1.6.0).

This is the latest version of the module that can be compiled into MDX 2 and
used with the Deno runtime.

There is already a `3.x.x` version, but unfortunately it is not available for
Deno. For more information, please refer to
[Failed to import - xdm #135](https://github.com/esm-dev/esm.sh/issues/135)

## License

Copyright © 2021-present [TomokiMiyauci](https://github.com/TomokiMiyauci).

Released under the [MIT](./LICENSE) license
