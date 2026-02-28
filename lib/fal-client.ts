const FAL_ENDPOINT = "https://fal.run/fal-ai/nano-banana-2";

const HUMAN_ERROR_MESSAGES: Record<string, string> = {
  no_media_generated:
    "The image couldn't be generated. This can happen if the prompt was blocked for safety, didn't match the image model, or the service had trouble with the request. Try a different prompt or try again in a moment.",
};

interface FalImageResponse {
  images?: Array<{ url?: string }>;
}

interface FalErrorDetail {
  type?: string;
  msg?: string;
}

function parseFalErrorBody(text: string): string | null {
  try {
    const body = JSON.parse(text) as { detail?: FalErrorDetail[] };
    const detail = body?.detail;
    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0];
      const type = first?.type;
      if (type && HUMAN_ERROR_MESSAGES[type]) {
        return HUMAN_ERROR_MESSAGES[type];
      }
      if (typeof first?.msg === "string") return first.msg;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

export async function generateImage(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch(FAL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      num_images: 1,
      output_format: "png",
      resolution: "1K",
      aspect_ratio: "1:1",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    const humanMessage = parseFalErrorBody(text);
    throw new FalError(
      humanMessage ?? "Image generation failed",
      text,
      res.status >= 500 ? 502 : res.status,
    );
  }

  const data = (await res.json()) as FalImageResponse;
  const imageUrl = data?.images?.[0]?.url;

  if (!imageUrl) {
    throw new FalError("No image returned from provider", undefined, 500);
  }

  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) {
    throw new FalError("Failed to fetch generated image", undefined, 502);
  }

  const buffer = await imgRes.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}

export class FalError extends Error {
  constructor(
    message: string,
    public readonly details?: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = "FalError";
  }
}
