import sharp from 'sharp'
import { mkdir, stat } from 'node:fs/promises'
import { resolve } from 'node:path'

// Lossless source selection; only responsive resizing and WebP compression.
// Approved source PNGs remain untouched in assets/imagens.
const sourceMap = {
  'hero-smile': '76883e29-2a0d-4653-b04b-df5e3405d6fe.png',
  'smile-close': '414eeb15-cc8b-49e3-9526-87682a756faf.png',
  'smile-man': '73327672-95bb-43b4-9de9-cdee2a4507e0.png',
  'beauty-portrait': '7fed3bf7-b963-456c-b546-d139678eec04.png',
  'lips-profile': 'ChatGPT Image 10 de set. de 2026, 22_02_19 (1).png',
  'smile-detail': 'ChatGPT Image 10 de set. de 2026, 22_02_19 (2).png',
  'smile-natural': 'ChatGPT Image 10 de set. de 2026, 22_02_19 (3).png',
  'clinic-reception': '8d04d0a3-8532-477d-b0dd-c247478cee1c.png',
  'clinic-lounge': '960dbe47-bea6-4f18-8b58-f0ece4425ef4.png',
  'doctor-portrait': 'ChatGPT Image 10 de set. de 2026, 22_03_14 (1).png',
  'doctor-editorial': 'ChatGPT Image 10 de set. de 2026, 22_03_14 (3).png',
}
const output = resolve('public/images')
await mkdir(output, { recursive: true })
let sourceBytes = 0
let optimizedBytes = 0
for (const [name, filename] of Object.entries(sourceMap)) {
  const source = resolve('assets/imagens', filename)
  sourceBytes += (await stat(source)).size
  for (const size of [640, 960, null]) {
    const destination = resolve(output, `${name}${size ? `-${size}` : ''}.webp`)
    const pipeline = sharp(source).rotate()
    if (size) pipeline.resize({ width: size, withoutEnlargement: true })
    await pipeline.webp({ quality: 87, effort: 5 }).toFile(destination)
    if (!size) optimizedBytes += (await stat(destination)).size
  }
}
process.stdout.write(`Prepared ${Object.keys(sourceMap).length} approved images × 3 sizes. Original: ${(sourceBytes / 1048576).toFixed(1)} MB; full-size WebP: ${(optimizedBytes / 1048576).toFixed(1)} MB.\n`)
