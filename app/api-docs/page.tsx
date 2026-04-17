"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react").then((m) => m.default), {
  ssr: false,
  loading: () => (
    <p className="p-8 text-sm text-zinc-500 dark:text-zinc-400">
      Loading API docs…
    </p>
  ),
});

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Kroki Playground API
          </h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link
              href="/"
              className="font-medium text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
            >
              Home
            </Link>
            <a
              href="/openapi.yaml"
              className="font-medium text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
            >
              openapi.yaml
            </a>
            <a
              href="/api/openapi"
              className="font-medium text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
            >
              GET /api/openapi
            </a>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-2 pb-10">
        <SwaggerUI url="/openapi.yaml" />
      </div>
    </div>
  );
}
