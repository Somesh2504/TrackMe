import React, { Suspense } from "react";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen" />}>
        {children}
      </Suspense>
    </>
  );
}
