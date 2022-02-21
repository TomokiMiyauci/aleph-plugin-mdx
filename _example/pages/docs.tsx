import React from "react";
import type { MDXContent } from "https://esm.sh/@types/mdx/types.d.ts";

type Meta = {
  title: string;
};
export type DocsProps = {
  Page?: MDXContent;
  pageProps: {
    meta?: Partial<Meta>;
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
      <Page
        components={{
          h1: ({ children }) => <h2>{children}</h2>,
        }}
      />
      <p>title: {pageProps.meta?.title}</p>
    </>
  );
}
