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

  console.log(`[PROXY] Request received for: ${sourceUrl?.substring(0, 100)}...`);

  if (!sourceUrl) {
    return Response.json({ message: "Missing url parameter" }, { status: 400 });
  }

  // Some stored image URLs may be encoded multiple times (eg. %252F).
  // Try decoding up to two times to obtain the real S3 object path.
  let finalUrl = sourceUrl;
  try {
    finalUrl = decodeURIComponent(finalUrl);
    // If still contains %25 (encoded %), decode once more.
    if (finalUrl.includes("%25")) {
      finalUrl = decodeURIComponent(finalUrl);
    }
  } catch {
    // fall back to original
    finalUrl = sourceUrl;
  }

  if (!isAllowedImageUrl(finalUrl)) {
    console.error(`[PROXY] Unsupported image source: ${finalUrl}`);
    return Response.json(
      { message: "Unsupported image source" },
      { status: 400 },
    );
  }

  try {
    console.log(`[PROXY] Fetching from S3: ${finalUrl.substring(0, 50)}...`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const start = Date.now();
    const upstreamResponse = await fetch(finalUrl, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const duration = Date.now() - start;
    console.log(`[PROXY] Fetch completed in ${duration}ms`);
    const contentLength = upstreamResponse.headers.get("content-length");
    console.log(`[PROXY] Content-Length: ${contentLength}`);

    if (!upstreamResponse.ok) {
      console.error(`[PROXY] S3 fetch failed: ${upstreamResponse.status} ${upstreamResponse.statusText}`);
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

    console.log(`[PROXY] S3 fetch successful, returning body. Content-Type: ${contentType}`);

    return new Response(upstreamResponse.body, {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error(`[PROXY] Critical error:`, err);
    return Response.json({ message: "Internal proxy error" }, { status: 500 });
  }
}
