import { copyFileSync, mkdirSync, existsSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

/**
 * Copies the RDKit.js runtime out of node_modules and into `public/rdkit/`, so
 * the demo serves it from this origin instead of a CDN — the way AD3 serves it
 * from its own `/rdkit/` path.
 *
 * `@rdkit/rdkit` is a dependency for these two files only. Nothing imports the
 * package: an import would pull RDKit into a bundle and break the route-scoped
 * loading the case study is about. The version in package.json is the single
 * source of truth for which build ships.
 *
 * Runs from `predev` and `prebuild`, so `public/rdkit/` is generated output and
 * stays out of git.
 */

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectDir = join(__dirname, '..')
const sourceDir = join(projectDir, 'node_modules', '@rdkit', 'rdkit', 'dist')
const targetDir = join(projectDir, 'public', 'rdkit')

// The loader and the WASM binary it fetches. RDKit_full is not used.
const FILES = ['RDKit_minimal.js', 'RDKit_minimal.wasm']

if (!existsSync(sourceDir)) {
  console.error(
    `RDKit assets not found at ${sourceDir}.\n` +
      'Run `npm install` first — @rdkit/rdkit is a dependency.',
  )
  process.exit(1)
}

mkdirSync(targetDir, { recursive: true })

for (const file of FILES) {
  const source = join(sourceDir, file)
  if (!existsSync(source)) {
    console.error(`RDKit asset missing: ${source}`)
    process.exit(1)
  }
  const target = join(targetDir, file)
  copyFileSync(source, target)
  console.log(`  public/rdkit/${file.padEnd(20)} ${(statSync(target).size / 1024 / 1024).toFixed(2)} MB`)
}
