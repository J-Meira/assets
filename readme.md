# Assets - by @j-meira

This project dynamically generates a `content.json` file containing the list of files from `src/files` (including subfolders) and a version number taken from the Git tag. The script is written in TypeScript and integrates with GitHub Actions for automation.

## Features

- **Dynamic Folder Scanning**: Recursively lists all files in `src/files`; paths are relative to that folder and hidden/OS metadata files are skipped.
- **Version Management**: Reads the version from the `TAG_NAME` environment variable (set from the GitHub tag in CI, or from a local `.env`).
- **TypeScript Support**: Ensures type safety and reliability.
- **GitHub Actions Integration**: Builds, generates `content.json` and syncs `src/files` and `src/public` to S3 on every `v*.*.*` tag.

## Usage

```bash
pnpm install
pnpm build
TAG_NAME=v1.0.0 pnpm make
```

The output is written to `src/public/content.json`.

> Contact: [J.Meira](https://github.com/J-Meira)
