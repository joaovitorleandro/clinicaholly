import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createServer, loadEnv } from 'vite'

// Production SFC scope IDs must match the compiled browser bundle.
process.env.NODE_ENV = 'production'

const root = process.cwd()
const environment = loadEnv('production', root, 'VITE_')
const configuredUrl = environment.VITE_SITE_URL?.trim()
let siteUrl

if (configuredUrl) {
  let parsed
  try {
    parsed = new URL(configuredUrl)
  } catch {
    throw new Error('VITE_SITE_URL deve ser uma origem absoluta, incluindo https://.')
  }
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== '/') {
    throw new Error('VITE_SITE_URL deve conter somente protocolo e domínio, sem caminho, credenciais, parâmetros ou fragmento.')
  }
  siteUrl = `${parsed.origin}/`
}

const outputPath = resolve(root, 'dist/index.html')
let html = await readFile(outputPath, 'utf8')
const mountPoint = '<div id="app"></div>'
if (!html.includes(mountPoint)) {
  throw new Error('O prerender requer um dist/index.html novo. Execute npm run build.')
}

const server = await createServer({
  mode: 'production',
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
  logLevel: 'error',
})

try {
  const { render, clinic } = await server.ssrLoadModule('/src/entry-server.ts')
  const content = await render()
  if (!content.includes('<h1') || !content.includes('Seu sorriso.') || !content.includes('Estrada de Santa Isabel')) {
    throw new Error('O prerender não produziu o conteúdo institucional esperado.')
  }
  html = html.replace(mountPoint, () => `<div id="app">${content}</div>`)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: clinic.name,
    telephone: '+55 11 95318-8144',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Estrada de Santa Isabel, 965 — Sala 27, Bairro Caputerá',
      addressLocality: 'Arujá',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    founder: { '@type': 'Person', name: 'Guilherme Lucena' },
    sameAs: [clinic.instagram],
    ...(siteUrl ? { url: siteUrl } : {}),
  }
  // Escape HTML-sensitive characters even if future content comes from outside code.
  const json = JSON.stringify(structuredData).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
  const metadata = [`<script type="application/ld+json">${json}</script>`]

  if (siteUrl) {
    const attributeUrl = siteUrl.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    metadata.unshift(`<link rel="canonical" href="${attributeUrl}" />`, `<meta property="og:url" content="${attributeUrl}" />`)
    html = html.replace(/(<meta (?:property="og:image"|name="twitter:image") content=")([^"\s]+)("\s*\/?>)/g, (_match, before, imagePath, after) => {
      return `${before}${new URL(imagePath, siteUrl).href}${after}`
    })
  }

  html = html.replace('</head>', `    ${metadata.join('\n    ')}\n  </head>`)
  await writeFile(outputPath, html, 'utf8')
  process.stdout.write(`Prerender: conteúdo HTML completo e JSON-LD gerados${siteUrl ? '; canonical e imagens sociais absolutos configurados' : '; domínio definitivo não configurado'}.\n`)
} finally {
  await server.close()
}
