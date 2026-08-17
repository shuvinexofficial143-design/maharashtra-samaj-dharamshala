import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const imagesDirectory = join(projectRoot, 'public', 'images')
const sourceDirectory = join(projectRoot, 'source-assets', 'concept-originals')
const names = ['concept-hero', 'concept-room', 'concept-courtyard']

await mkdir(imagesDirectory, { recursive: true })
for (const name of names) {
  await sharp(join(sourceDirectory, `${name}.png`))
    .resize({ width: 1536, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(join(imagesDirectory, `${name}.webp`))
}
