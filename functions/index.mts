import { Context } from "@netlify/functions";

export default async (_req: Request, _context: Context) => {
  const envVarName = process.env.ENV_VAR_NAME ?? "";
  const value = envVarName ? process.env[envVarName] ?? "" : "";

  if (!value) {
    return new Response(`${envVarName} environment variable not set`, {
      status: 500,
    });
  }

  return new Response(value, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
