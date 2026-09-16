import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { getAllSlugs, getCaseStudies, getCaseStudy, type Locale } from '@/lib/case-studies'

/**
 * A case study exists in three places that are maintained by hand:
 *
 *   1. `lib/case-studies.ts`         — the metadata the cards and hero render
 *   2. `content/work/{locale}/*.mdx` — the prose
 *   3. `content/work/index.ts`       — the slug → component registry
 *
 * `app/[locale]/work/[slug]/page.tsx` calls notFound() when (1) and (3)
 * disagree, so a case study can be added, linked from the home page, and still
 * 404 because one import line was missed. These tests are the reason that
 * cannot happen silently.
 *
 * The registry is read as source text rather than imported: it pulls in .mdx,
 * which only the Next build knows how to transform.
 */

const LOCALES: Locale[] = ['en', 'ko']
const CONTENT_ROOT = join(process.cwd(), 'content/work')

function mdxSlugsOnDisk(locale: Locale): string[] {
  return readdirSync(join(CONTENT_ROOT, locale))
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
    .sort()
}

/** The slugs `mdxModules[locale]` would expose at runtime. */
function registeredSlugs(locale: Locale): string[] {
  const source = readFileSync(join(CONTENT_ROOT, 'index.ts'), 'utf8')
  const block = source.match(new RegExp(`\\n  ${locale}: \\{([\\s\\S]*?)\\n  \\},`))
  if (!block) throw new Error(`no "${locale}" block in content/work/index.ts`)
  return [...block[1].matchAll(/^\s*'([^']+)':/gm)].map((m) => m[1]).sort()
}

function mdxMetadata(locale: Locale, slug: string): Record<string, string> {
  const source = readFileSync(join(CONTENT_ROOT, locale, `${slug}.mdx`), 'utf8')
  // Indentation is not uniform across these files — some use tabs, some two
  // spaces — so match the key at any depth rather than at a fixed column.
  const read = (key: string) => {
    const match = source.match(new RegExp(`^[ \\t]+${key}:\\s*(.+?),?$`, 'm'))
    return match ? match[1].replace(/^["']|["'],?$/g, '') : ''
  }
  return { slug: read('slug'), draft: read('draft') }
}

describe.each(LOCALES)('%s content', (locale) => {
  test('every MDX file has a metadata entry, and vice versa', () => {
    const declared = getCaseStudies(locale)
      .map((c) => c.slug)
      .sort()
    expect(mdxSlugsOnDisk(locale)).toEqual(declared)
  })

  test('every metadata entry is registered in content/work/index.ts', () => {
    const registered = registeredSlugs(locale)
    for (const study of getCaseStudies(locale)) {
      expect(registered).toContain(study.slug)
    }
  })

  test('the registry holds nothing that no longer exists', () => {
    for (const slug of registeredSlugs(locale)) {
      expect(getCaseStudy(locale, slug)).toBeDefined()
      expect(mdxSlugsOnDisk(locale)).toContain(slug)
    }
  })

  test('the slug inside each MDX matches its filename', () => {
    for (const slug of mdxSlugsOnDisk(locale)) {
      expect(mdxMetadata(locale, slug).slug).toBe(slug)
    }
  })

  // The route reads `draft` from lib/case-studies.ts to decide on noindex, but
  // the MDX carries its own copy. If they disagree, a draft can end up indexed.
  test('draft status agrees between MDX and metadata', () => {
    for (const study of getCaseStudies(locale)) {
      const onDisk = mdxMetadata(locale, study.slug).draft
      if (onDisk !== '') expect(onDisk).toBe(String(study.draft))
    }
  })
})

test('generateStaticParams would build a real page for every slug', () => {
  for (const slug of getAllSlugs()) {
    for (const locale of LOCALES) {
      expect(getCaseStudy(locale, slug)).toBeDefined()
      expect(registeredSlugs(locale)).toContain(slug)
    }
  }
})
