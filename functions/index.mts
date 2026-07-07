import { Context } from "@netlify/functions";

/**
 * How the value stored in the environment variable should be decoded before
 * being returned.
 *
 * Netlify environment variables do not reliably preserve real newlines (they
 * are often collapsed to spaces), so multi-line values such as GPG armoured
 * keys need to be stored in a newline-safe encoding.
 *
 * - `newlines` (default): the value contains literal `\n` (and optional `\r`)
 *   escape sequences which are converted back into real line breaks. This is a
 *   no-op for values that contain no escapes, so plain single-line values
 *   (e.g. an SSH public key) keep working unchanged.
 * - `base64`: the value is base64-encoded (whitespace is ignored), e.g. the
 *   output of `base64 < key.asc`. Most robust for arbitrary content.
 * - `raw`: return the value exactly as stored, with no transformation.
 */
type Encoding = "newlines" | "base64" | "raw";

function resolveEncoding(): Encoding {
  const raw = (process.env.ENV_VAR_ENCODING ?? "newlines").trim().toLowerCase();
  if (raw === "base64" || raw === "raw") return raw;
  return "newlines";
}

function decode(value: string, encoding: Encoding): string {
  switch (encoding) {
    case "base64":
      // The Netlify UI may wrap pasted base64 or inject stray whitespace, so
      // strip all whitespace before decoding.
      return Buffer.from(value.replace(/\s+/g, ""), "base64").toString("utf-8");
    case "newlines":
      // Convert literal escape sequences (`\r\n`, `\n`, `\r`) into real breaks.
      return value.replace(/\\r\\n|\\n|\\r/g, "\n");
    case "raw":
    default:
      return value;
  }
}

export default async (_req: Request, _context: Context) => {
  const envVarName = process.env.ENV_VAR_NAME ?? "";
  const raw = envVarName ? process.env[envVarName] ?? "" : "";

  if (!raw) {
    return new Response(`${envVarName} environment variable not set`, {
      status: 500,
    });
  }

  const value = decode(raw, resolveEncoding());

  return new Response(value, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
