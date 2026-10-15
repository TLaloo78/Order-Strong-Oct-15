// Renders the brand sources in this folder into the files served from public/:
//   favicon.svg, favicon.ico (16/32/48), apple-touch-icon.png (180), og-image.png (1200x630)
// Usage: node brand/render.mjs   (set CHROME=/path/to/chrome if it isn't found automatically)
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const pub = path.join(here, '..', 'public')

const candidates = [
  process.env.CHROME,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)
const chrome = candidates.find((p) => fs.existsSync(p))
if (!chrome) throw new Error('Chrome or Edge not found. Set CHROME=/path/to/browser.')

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'order-strong-brand-'))

function shot(url, out, width, height, transparent) {
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      `--user-data-dir=${path.join(tmp, 'profile')}`,
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--window-size=${width},${height}`,
      '--virtual-time-budget=10000',
      ...(transparent ? ['--default-background-color=00000000'] : []),
      `--screenshot=${out}`,
      url,
    ],
    { stdio: 'ignore' },
  )
  const png = fs.readFileSync(out)
  const w = png.readUInt32BE(16)
  const h = png.readUInt32BE(20)
  if (w !== width || h !== height) throw new Error(`${path.basename(out)} is ${w}x${h}, expected ${width}x${height}`)
  return png
}

function iconPage(svgFile, size) {
  const html = path.join(tmp, `icon-${size}-${path.basename(svgFile)}.html`)
  fs.writeFileSync(
    html,
    `<!doctype html><html><body style="margin:0;background:transparent">` +
      `<img src="${pathToFileURL(svgFile).href}" width="${size}" height="${size}" style="display:block"></body></html>`,
  )
  return pathToFileURL(html).href
}

// 1. SVG favicon: the icon as-is.
const iconSvg = path.join(here, 'icon.svg')
fs.copyFileSync(iconSvg, path.join(pub, 'favicon.svg'))

// 2. favicon.ico with 16, 32 and 48 px PNGs inside (rounded corners stay transparent).
const sizes = [16, 32, 48]
const pngs = sizes.map((s) => shot(iconPage(iconSvg, s), path.join(tmp, `ico-${s}.png`), s, s, true))
const header = Buffer.alloc(6 + 16 * sizes.length)
header.writeUInt16LE(0, 0)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(sizes.length, 4)
let offset = header.length
sizes.forEach((s, i) => {
  const e = 6 + 16 * i
  header.writeUInt8(s, e)
  header.writeUInt8(s, e + 1)
  header.writeUInt8(0, e + 2)
  header.writeUInt8(0, e + 3)
  header.writeUInt16LE(1, e + 4)
  header.writeUInt16LE(32, e + 6)
  header.writeUInt32LE(pngs[i].length, e + 8)
  header.writeUInt32LE(offset, e + 12)
  offset += pngs[i].length
})
fs.writeFileSync(path.join(pub, 'favicon.ico'), Buffer.concat([header, ...pngs]))

// 3. Apple touch icon: full-bleed square (iOS rounds the corners itself), opaque.
const squareSvg = path.join(tmp, 'icon-square.svg')
fs.writeFileSync(squareSvg, fs.readFileSync(iconSvg, 'utf8').replace('rx="112"', 'rx="0"'))
shot(iconPage(squareSvg, 180), path.join(pub, 'apple-touch-icon.png'), 180, 180, false)

// 4. Open Graph image.
shot(pathToFileURL(path.join(here, 'og-image.html')).href, path.join(pub, 'og-image.png'), 1200, 630, false)

fs.rmSync(tmp, { recursive: true, force: true })
console.log('Rendered favicon.svg, favicon.ico, apple-touch-icon.png, og-image.png into public/')
