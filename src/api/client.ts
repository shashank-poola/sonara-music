export const SAAVN_BASE_URL = "https://saavn.sumit.co";

export class SaavnApiError extends Error {
  readonly status?: number;
  readonly url: string;

  constructor(message: string, opts: { status?: number; url: string }) {
    super(message);
    this.name = "SaavnApiError";
    this.status = opts.status;
    this.url = opts.url;
  }
}

function toQueryString(
  params: Record<string, string | number | boolean | undefined | null>
) {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    usp.set(k, String(v));
  }
  const s = usp.toString();
  return s ? `?${s}` : "";
}

export async function saavnGetJson<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>
): Promise<T> {
  const url = `${SAAVN_BASE_URL}${path}${params ? toQueryString(params) : ""}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    let bodyText = "";
    try {
      bodyText = await res.text();
    } catch {
      // ignore
    }
    throw new SaavnApiError(
      `Request failed (${res.status})${bodyText ? `: ${bodyText}` : ""}`,
      { status: res.status, url }
    );
  }

  try {
    return (await res.json()) as T;
  } catch {
    throw new SaavnApiError("Invalid JSON response", {
      status: res.status,
      url,
    });
  }
}
