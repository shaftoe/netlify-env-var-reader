# Netlify Environment Variable Function Reader

A reusable Netlify function that returns the content of a configurable environment variable.

## Configuration

Set the `ENV_VAR_NAME` environment variable to specify which environment variable should be returned:

- Set `ENV_VAR_NAME` to the name of the environment variable you want to expose (e.g., `ENV_VAR_NAME=SSH_PUBLIC_KEY`)
- The function will return the value of that environment variable as plain text
- If `ENV_VAR_NAME` is not set or the specified environment variable is missing, the function returns a 500 error

## Example

To expose an SSH public key:

- Set `ENV_VAR_NAME=SSH_PUBLIC_KEY` in your Netlify environment variables
- Ensure `SSH_PUBLIC_KEY` is also set with your public key value
- The deployed Netlify project will respond with the plain text SSH public key at `https://<project-name>.netlify.app/`
