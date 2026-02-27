const FAL_ENDPOINT = "https://fal.run/fal-ai/nano-banana-2";

interface FalImageResponse {
  images?: Array<{ url?: string }>;
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
    throw new FalError("Image generation failed", text, res.status >= 500 ? 502 : res.status);
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
