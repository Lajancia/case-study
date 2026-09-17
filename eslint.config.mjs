import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Playwright output.
    "playwright-report/**",
    "test-results/**",
    // Vendored RDKit.js build, copied in by scripts/copy-rdkit.mjs. Minified
    // Emscripten output — not ours to lint.
    "public/rdkit/**",
    // Kilocode agent worktrees: a checkout of this same repo nested inside it.
    // Git already excludes them (.git/info/exclude); without this ESLint reports
    // every finding twice, once from a stale copy.
    ".kilo/**",
    ".kilocode/**",
  ]),
]);

export default eslintConfig;
