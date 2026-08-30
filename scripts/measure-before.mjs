import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectDir = join(__dirname, '..')
const buildDir = join(projectDir, '.next')

if (!existsSync(buildDir)) {
  console.log('No .next build found. Run npm run build first.')
  process.exit(1)
}

const manifestPath = join(buildDir, 'build-manifest.json')
if (!existsSync(manifestPath)) {
  console.log('No build-manifest.json found.')
  process.exit(1)
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
const mainFiles = manifest.rootMainFiles || []

let mainTotal = 0
console.log('=== BEFORE OPTIMIZATION — Main Bundle Chunks ===')
for (const f of mainFiles) {
  const fp = join(projectDir, '.next', f)
  if (existsSync(fp)) {
    const size = statSync(fp).size
    mainTotal += size
    console.log(`  ${f.padEnd(50)} ${(size / 1024).toFixed(1)} KB`)
  }
}
console.log(`  ${'─'.repeat(70)}`)
console.log(`  Total main bundle:       ${(mainTotal / 1024).toFixed(1)} KB (${(mainTotal / 1024 / 1024).toFixed(3)} MB)`)
console.log(`  Gzipped estimate (~30%): ${(mainTotal * 0.3 / 1024).toFixed(1)} KB`)

// Check if three.js is in the bundle
console.log(`\n=== Heavy library detection ===`)
const allChunks = join(buildDir, 'static', 'chunks')
for (const f of readdirSync(allChunks).filter(f => f.endsWith('.js'))) {
  const content = readFileSync(join(allChunks, f), 'utf-8')
  if (content.length > 0) {
    const lines = content.split('\n')
    for (let i = 0; i < Math.min(lines.length, 10); i++) {
      if (lines[i].includes('three') || lines[i].includes('Three')) {
        console.log(`  three.js found in: ${f} (${(statSync(join(allChunks, f)).size / 1024).toFixed(1)} KB)`)
        break
      }
    }
  }
}

const du = execSync('du -sh .next/', { cwd: projectDir }).toString().trim()
console.log(`\n=== Build Output ===`)
console.log(`  Build cache + output: ${du}`)

// Check for standalone dir
console.log(`\n=== Standalone check ===`)
if (existsSync(join(projectDir, '.next', 'standalone'))) {
  const standaloneDu = execSync('du -sh .next/standalone/', { cwd: projectDir }).toString().trim()
  console.log(`  Standalone directory exists: ${standaloneDu}`)
} else {
  console.log(`  No standalone directory — output: 'standalone' was removed`)
}