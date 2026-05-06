export const runtime = "nodejs";

const ALLOWED_HOST_SUFFIX = ".s3.us-west-1.amazonaws.com";

function isAllowedImageUrl(url) {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname.endsWith(ALLOWED_HOST_SUFFIX)
    );
  } catch {
    return false;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sourceUrl = searchParams.get("url");

  if (!sourceUrl) {
    return Response.json({ message: "Missing url parameter" }, { status: 400 });
  }

  if (!isAllowedImageUrl(sourceUrl)) {
    return Response.json(
      { message: "Unsupported image source" },
      { status: 400 },
    );
  }

  const upstreamResponse = await fetch(sourceUrl, {
    cache: "no-store",
  });

  if (!upstreamResponse.ok) {
    return Response.json(
      { message: "Failed to fetch image", status: upstreamResponse.status },
      { status: upstreamResponse.status },
    );
  }

  const contentType =
    upstreamResponse.headers.get("content-type") || "application/octet-stream";
  const headers = new Headers();
  headers.set("Content-Type", contentType);
  headers.set(
    "Cache-Control",
    "public, max-age=3600, stale-while-revalidate=86400",
  );

  return new Response(upstreamResponse.body, {
    status: 200,
    headers,
  });
}
