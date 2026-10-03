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
// Real photographs of the Arujá unit. The JPEG sources were converted from the
// original iPhone HEIC files (imagens-estabelecimento/) with metadata stripped:
//   convert IMG_xxxx.HEIC -auto-orient -strip -resize '2560x>' -quality 92 name.jpg
// They receive a light warm grade so they sit on the ivory/bronze palette.
const establishmentMap = {
  'space-reception': 'recepcao.jpg',
  'space-corridor': 'corredor.jpg',
  'space-planning': 'sala-planejamento.jpg',
  'space-room-view': 'consultorio-vista.jpg',
  'space-room-brand': 'consultorio-holly.jpg',
  'space-room-clinical': 'consultorio-clinico.jpg',
}
const establishmentWidth = 1920
const output = resolve('public/images')
await mkdir(output, { recursive: true })
let sourceBytes = 0
let optimizedBytes = 0
const jobs = [
  ...Object.entries(sourceMap).map(([name, filename]) => ({ name, source: resolve('assets/imagens', filename), maxWidth: null, grade: false })),
  ...Object.entries(establishmentMap).map(([name, filename]) => ({ name, source: resolve('assets/imagens/estabelecimento', filename), maxWidth: establishmentWidth, grade: true })),
]
for (const { name, source, maxWidth, grade } of jobs) {
  sourceBytes += (await stat(source)).size
  for (const size of [640, 960, null]) {
    const destination = resolve(output, `${name}${size ? `-${size}` : ''}.webp`)
    const pipeline = sharp(source).rotate()
    const width = size ?? maxWidth
    if (width) pipeline.resize({ width, withoutEnlargement: true })
    if (grade) pipeline.recomb([[1.04, 0.02, 0], [0, 1, 0], [0, 0, 0.93]]).modulate({ saturation: 0.92 })
    await pipeline.webp({ quality: 87, effort: 5 }).toFile(destination)
    if (!size) optimizedBytes += (await stat(destination)).size
  }
}
process.stdout.write(`Prepared ${jobs.length} approved images × 3 sizes. Original: ${(sourceBytes / 1048576).toFixed(1)} MB; full-size WebP: ${(optimizedBytes / 1048576).toFixed(1)} MB.\n`)
