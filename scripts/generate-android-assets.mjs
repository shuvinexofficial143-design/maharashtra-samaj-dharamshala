import { access, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const resourcesRoot = join(projectRoot, 'resources', 'android')
const androidResources = join(projectRoot, 'android', 'app', 'src', 'main', 'res')

await access(androidResources)

const densities = {
  mdpi: 1,
  hdpi: 1.5,
  xhdpi: 2,
  xxhdpi: 3,
  xxxhdpi: 4,
}

async function render(source, destination, width, height = width) {
  await mkdir(dirname(destination), { recursive: true })
  await sharp(source)
    .resize(width, height, { fit: 'cover', position: 'centre' })
    .png({ compressionLevel: 9, palette: true })
    .toFile(destination)
}

for (const [density, scale] of Object.entries(densities)) {
  const mipmap = join(androidResources, `mipmap-${density}`)
  await render(join(resourcesRoot, 'icon.svg'), join(mipmap, 'ic_launcher.png'), Math.round(48 * scale))
  await render(join(resourcesRoot, 'icon-round.svg'), join(mipmap, 'ic_launcher_round.png'), Math.round(48 * scale))
  await render(join(resourcesRoot, 'icon-foreground.svg'), join(mipmap, 'ic_launcher_foreground.png'), Math.round(108 * scale))

  const portraitWidth = Math.round(480 * scale)
  const portraitHeight = Math.round(800 * scale)
  await render(join(resourcesRoot, 'splash.svg'), join(androidResources, `drawable-port-${density}`, 'splash.png'), portraitWidth, portraitHeight)
  await render(join(resourcesRoot, 'splash-land.svg'), join(androidResources, `drawable-land-${density}`, 'splash.png'), portraitHeight, portraitWidth)
}

await render(join(resourcesRoot, 'splash.svg'), join(androidResources, 'drawable', 'splash.png'), 1080, 1920)
console.log('Generated branded Android launcher and splash assets.')
