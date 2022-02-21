import { Aleph, ensureTextFile, expect, join, test } from "./dev_deps.ts";
import { mdxLoader, mdxResolver } from "./plugin.ts";

test("mdxResolver", () => {
  expect(mdxResolver("/pages/index.mdx")).toEqual({
    asPage: {
      path: "/",
      isIndex: true,
    },
  });
  expect(mdxResolver("/pages/docs/index.mdx")).toEqual({
    asPage: {
      path: "/docs",
      isIndex: true,
    },
  });

  expect(mdxResolver("/pages/docs/get-started.mdx")).toEqual({
    asPage: { path: "/docs/get-started", isIndex: false },
  });

  expect(
    mdxResolver("/pages/get_started.mdx", {
      rewritePagePath: (path) => path.replaceAll("_", "-"),
    }),
  ).toEqual({
    asPage: { path: "/get-started", isIndex: false },
  });
});

test("mdxLoader", async () => {
  Deno.env.set("DENO_TESTING", "true");

  const dir = await Deno.makeTempDir({ prefix: "aleph_plugin_testing" });
  const aleph = new Aleph(dir);
  await ensureTextFile(
    join(dir, "/pages/docs/index.mdx"),
    [
      "# aleph-plugin-mdx",
      "Aleph plugin for mdx v2",
    ].join("\n"),
  );

  await expect(
    mdxLoader(
      { specifier: "/pages/docs/index.mdx" },
      aleph,
    ),
  ).resolves.toEqual({
    code: `/*@jsxRuntime automatic @jsxImportSource react*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? _jsx(MDXLayout, Object.assign({}, props, {
    children: _jsx(_createMdxContent, {})
  })) : _createMdxContent();
  function _createMdxContent() {
    const _components = Object.assign({
      h1: "h1",
      p: "p"
    }, props.components);
    return _jsxs(_Fragment, {
      children: [_jsx(_components.h1, {
        children: "aleph-plugin-mdx"
      }), "\\n", _jsx(_components.p, {
        children: "Aleph plugin for mdx v2"
      })]
    });
  }
}
export default MDXContent;
`,
  });

  await expect(
    mdxLoader(
      { specifier: "/pages/docs/index.mdx" },
      aleph,
      { pageProps: { meta: { title: "hello" }, nav: [{ path: "/" }] } },
    ),
  ).resolves.toEqual({
    code: `/*@jsxRuntime automatic @jsxImportSource react*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? _jsx(MDXLayout, Object.assign({}, props, {
    children: _jsx(_createMdxContent, {})
  })) : _createMdxContent();
  function _createMdxContent() {
    const _components = Object.assign({
      h1: "h1",
      p: "p"
    }, props.components);
    return _jsxs(_Fragment, {
      children: [_jsx(_components.h1, {
        children: "aleph-plugin-mdx"
      }), "\\n", _jsx(_components.p, {
        children: "Aleph plugin for mdx v2"
      })]
    });
  }
}
export default MDXContent;

MDXContent.meta = {"title":"hello"};
MDXContent.nav = [{"path":"/"}];`,
  });

  await ensureTextFile(
    join(dir, "/components/hello.mdx"),
    [
      "# aleph-plugin-mdx",
      "Aleph plugin for mdx v2",
    ].join("\n"),
  );

  await expect(
    mdxLoader(
      { specifier: "/components/hello.mdx" },
      aleph,
      { pageProps: { meta: { title: "hello" }, nav: [{ path: "/" }] } },
    ),
  ).resolves.toEqual({
    code: `/*@jsxRuntime automatic @jsxImportSource react*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? _jsx(MDXLayout, Object.assign({}, props, {
    children: _jsx(_createMdxContent, {})
  })) : _createMdxContent();
  function _createMdxContent() {
    const _components = Object.assign({
      h1: "h1",
      p: "p"
    }, props.components);
    return _jsxs(_Fragment, {
      children: [_jsx(_components.h1, {
        children: "aleph-plugin-mdx"
      }), "\\n", _jsx(_components.p, {
        children: "Aleph plugin for mdx v2"
      })]
    });
  }
}
export default MDXContent;
`,
  });
});
