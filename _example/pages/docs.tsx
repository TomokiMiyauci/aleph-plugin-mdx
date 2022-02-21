import React from "react";
import Toc from "../components/toc.tsx";
import type { MDXContent } from "https://esm.sh/@types/mdx/types.d.ts";
import type { TableOfContents } from "../../mod.ts";

type Meta = {
  title: string;
};
export type DocsProps = {
  Page?: MDXContent;
  pageProps: {
    meta?: Partial<Meta>;
    tableOfContents?: TableOfContents;
  };
};

export default function Docs({ Page, pageProps }: DocsProps) {
  if (!Page) {
    return (
      <>
        <h1>Docs root</h1>
      </>
    );
  }
  return (
    <>
      <p>title: {pageProps.meta?.title}</p>
      <Page
        components={{
          h1: ({ children }) => <h2>{children}</h2>,
        }}
      />

      <aside
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          padding: "1rem",
        }}
      >
        <Toc tableOfContents={pageProps.tableOfContents} />
      </aside>
    </>
  );
}
