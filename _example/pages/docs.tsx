import React from "react";
import type { MDXContent } from "https://esm.sh/@types/mdx/types.d.ts";

export type DocsProps = {
  Page?: MDXContent;
};

export default function Docs({ Page }: DocsProps) {
  if (!Page) {
    return (
      <>
        <h1>Docs root</h1>
      </>
    );
  }
  return (
    <Page
      components={{
        h1: ({ children }) => <h2>{children}</h2>,
      }}
    />
  );
}
