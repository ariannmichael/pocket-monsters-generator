interface PromptDebugProps {
  promptUsed: string | null;
}

export function PromptDebug({ promptUsed }: PromptDebugProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted">
        Prompt (debug)
      </h2>
      <pre className="whitespace-pre-wrap text-xs leading-relaxed text-text-muted">
        {promptUsed || "Generate an image to see the prompt used."}
      </pre>
    </div>
  );
}
