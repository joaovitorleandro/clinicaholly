import { readdir, readFile } from 'node:fs/promises'
import { resolve, extname, relative } from 'node:path'

const root = process.cwd()
const targets = ['src', 'public', 'index.html']
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.mjs', '.scss', '.ts', '.tsx', '.vue'])
const forbidden = new RegExp('[\\u2190-\\u21FF\\u2B00-\\u2BFF]|\\uFE0E|\\uFE0F', 'gu')
const violations = []

async function inspect(file) {
  if (!textExtensions.has(extname(file))) return
  const source = await readFile(file, 'utf8')
  for (const match of source.matchAll(forbidden)) {
    const character = match[0]
    const index = match.index ?? 0
    const line = source.slice(0, index).split('\n').length
    violations.push(`${relative(root, file)}:${line} U+${character.codePointAt(0)?.toString(16).toUpperCase()}`)
  }
}

async function walk(target) {
  const file = resolve(root, target)
  const entries = await readdir(file, { withFileTypes: true }).catch(() => [])
  for (const entry of entries) {
    const child = resolve(file, entry.name)
    if (entry.isDirectory()) await walk(relative(root, child))
    else if (entry.isFile()) await inspect(child)
  }
}

for (const target of targets) {
  if (extname(target)) await inspect(resolve(root, target))
  else await walk(target)
}

if (violations.length > 0) {
  console.error('Caracteres Unicode de seta/emoji não são permitidos em ícones de interface:')
  violations.forEach((violation) => console.error(`  ${violation}`))
  process.exit(1)
}

console.log('UI unicode check passed.')
