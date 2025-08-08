"use client" line removed.

<html ...> replaced with:
<html lang={params.lang} suppressHydrationWarning>

<body ...> style prop removed, suppressHydrationWarning added after className or alone if no className.

Removed useEffect blocks that set lang or toggle className/theme on html/body and removed unused imports accordingly.

---

app/[lang]/layout.tsx:

import React from "react";

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang} suppressHydrationWarning>
      <body className="bg-white text-black" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}