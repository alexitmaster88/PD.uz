// app/[lang]/layout.tsx
import React from "react";
import PageWrapper from "./page-wrapper"

export default function LangLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <PageWrapper>{children}</PageWrapper>
      </body>
    </html>
  );
}