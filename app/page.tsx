import Link from "next/link";
import DiagramGenerator from "@/components/DiagramGenerator";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Kroki Playground
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Paste diagram source, pick a type, and preview SVG from Kroki.
          </p>
        </div>
        <Link
          href="/api-docs"
          className="text-sm font-medium text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
        >
          API docs
        </Link>
      </header>
      <DiagramGenerator />
    </div>
  );
}
