import React from "react";
import type { TableOfContents } from "../../mod.ts";

type TocProps = {
  tableOfContents?: TableOfContents;
};
export default function Toc({ tableOfContents }: TocProps) {
  return tableOfContents?.items?.length
    ? (
      <ul>
        {tableOfContents.items.map((item) => {
          return (
            <li key={item.title}>
              <a href={item.url}>{item.title}</a>
              {item.items?.length ? <Toc tableOfContents={item} /> : null}
            </li>
          );
        })}
      </ul>
    )
    : null;
}
