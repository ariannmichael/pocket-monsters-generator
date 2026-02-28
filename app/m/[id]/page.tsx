import Link from "next/link";
import { notFound } from "next/navigation";
import { kv } from "@vercel/kv";
import { getBaseUrl } from "@/lib/site-url";

const CHECKER_BG =
  "repeating-conic-gradient(#d4d4d4 0% 25%, #e5e5e5 0% 50%) 50% / 20px 20px";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const exists = process.env.KV_REST_API_URL
    ? !!(await kv.get(`monster:${id}`))
    : false;
  if (!exists) return { title: "Pocket Monster" };
  const base = getBaseUrl();
  const pageUrl = `${base}/m/${id}`;
  return {
    title: "Pocket Monster",
    description: "Check out this Pocket Monster!",
    alternates: { canonical: pageUrl },
    openGraph: {
      title: "Pocket Monster",
      description: "Check out this Pocket Monster!",
      url: pageUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Pocket Monster",
      description: "Check out this Pocket Monster!",
    },
  };
}

export default async function MonsterPage({ params }: Props) {
  const { id } = await params;
  const exists = process.env.KV_REST_API_URL
    ? !!(await kv.get(`monster:${id}`))
    : false;

  if (!exists) {
    notFound();
  }

  const imageUrl = `/api/monster-image/${id}`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <main className="w-full max-w-md rounded-2xl bg-zinc-900 px-6 py-10 shadow-2xl ring-1 ring-zinc-800">
        <h1 className="mb-6 text-center text-xl font-medium text-white">
          Pocket Monster
        </h1>
        <div
          className="flex items-center justify-center rounded-lg border border-zinc-700 p-4"
          style={{ background: CHECKER_BG }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Pocket Monster"
            width={256}
            height={256}
            className="rounded-lg"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
        <p className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-cyan-400 underline hover:text-cyan-300"
          >
            Create your own →
          </Link>
        </p>
      </main>
    </div>
  );
}
