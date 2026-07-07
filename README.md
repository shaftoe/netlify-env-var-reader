# Netlify Environment Variable Function Reader

A reusable Netlify function that returns the content of a configurable environment variable as plain text.

## Configuration

Set the `ENV_VAR_NAME` environment variable to specify which environment variable should be returned:

- Set `ENV_VAR_NAME` to the name of the environment variable you want to expose (e.g. `ENV_VAR_NAME=SSH_PUBLIC_KEY`)
- The function returns the value of that environment variable as plain text
- If `ENV_VAR_NAME` is not set or the named variable is missing, the function returns a `500` error

## Multi-line values

Netlify environment variables do **not** reliably preserve real newlines (they tend to get collapsed into spaces), so multi-line values like a GPG armoured key or a PEM private key break when pasted directly.

Set `ENV_VAR_ENCODING` to choose how the stored value should be decoded before it is returned:

| `ENV_VAR_ENCODING` | Description |
| --- | --- |
| `newlines` *(default)* | The value contains literal `\n` (and `\r`) escape sequences that are converted back into real line breaks. This is a no-op for values without escapes, so single-line values (e.g. an SSH public key) keep working unchanged. |
| `base64` | The value is base64-encoded (any whitespace is ignored). Most robust for arbitrary content — e.g. `base64 < key.asc`. |
| `raw` | Return the value exactly as stored, no transformation. |

### Examples

**SSH public key** (single line) — no encoding needed:

```
ENV_VAR_NAME=SSH_PUBLIC_KEY
SSH_PUBLIC_KEY=ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... user@host
```

**GPG armoured key** — store it with literal `\n` escapes (default `newlines` encoding):

```
ENV_VAR_NAME=GPG_PUBLIC_KEY
ENV_VAR_ENCODING=newlines
GPG_PUBLIC_KEY=-----BEGIN PGP PUBLIC KEY BLOCK-----\n\nmDMEak1GshYJKwY...\n=uhJe\n-----END PGP PUBLIC KEY BLOCK-----
```

…or base64-encode it (most robust):

```bash
ENV_VAR_NAME=GPG_PUBLIC_KEY
ENV_VAR_ENCODING=base64
GPG_PUBLIC_KEY=$(base64 < pubkey.asc | tr -d '\n')
```

In all cases the deployed Netlify project responds with the plain-text value at `https://<project-name>.netlify.app/`.
