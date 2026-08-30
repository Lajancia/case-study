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

// 1. Read build-manifest for root main files
const manifestPath = join(buildDir, 'build-manifest.json')
if (!existsSync(manifestPath)) {
  console.log('No build-manifest.json found.')
  process.exit(1)
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
const mainFiles = manifest.rootMainFiles || []

let mainTotal = 0
console.log('=== Main Bundle Chunks (loaded on every page) ===')
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
console.log(`  Gzipped estimate (~30%): ${(mainTotal * 0.3 / 1024).toFixed(1)} KB\n`)

// 2. App pages
const pagesDir = join(buildDir, 'server', 'app')
if (existsSync(pagesDir)) {
  function walkDir(dir) {
    const results = []
    const entries = readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        results.push(...walkDir(fullPath))
      } else if (entry.name === 'page.js' || entry.name === 'route.js') {
        const rel = fullPath.replace(pagesDir, '').replace(/\/+/g, '/')
        const size = statSync(fullPath).size
        let htmlPath = fullPath.replace('.js', '.html')
        let htmlSize = existsSync(htmlPath) ? statSync(htmlPath).size : 0
        results.push({ route: rel, size, htmlSize })
      }
    }
    return results
  }

  console.log('=== Server-Side Route Bundles ===')
  const pages = walkDir(pagesDir)
  for (const p of pages.sort((a, b) => b.size - a.size)) {
    const route = p.route.replace('/page.js', '').replace('/route.js', '') || '/'
    console.log(`  ${route.padEnd(55)} js: ${(p.size / 1024).toFixed(1)} KB | html: ${(p.htmlSize / 1024).toFixed(1)} KB`)
  }
}

// 3. Total .next size
console.log(`\n=== Build Output ===`)
const du = execSync('du -sh .next/', { cwd: projectDir }).toString().trim()
console.log(`  Build cache + output: ${du}`)

// 4. Static chunk summary
const staticDir = join(buildDir, 'static', 'chunks')
if (existsSync(staticDir)) {
  let staticTotal = 0
  console.log(`\n=== Static Chunks Overview ===`)
  const files = readdirSync(staticDir).filter(f => f.endsWith('.js'))
  for (const f of files) {
    const size = statSync(join(staticDir, f)).size
    staticTotal += size
  }
  console.log(`  Total JS in static/chunks/: ${(staticTotal / 1024).toFixed(1)} KB across ${files.length} files`)
  
  const cssFiles = readdirSync(staticDir).filter(f => f.endsWith('.css'))
  let cssTotal = 0
  for (const f of cssFiles) {
    cssTotal += statSync(join(staticDir, f)).size
  }
  console.log(`  Total CSS in static/chunks/: ${(cssTotal / 1024).toFixed(1)} KB across ${cssFiles.length} files`)
}