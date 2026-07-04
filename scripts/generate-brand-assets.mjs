// Generates on-brand raster assets from code (no external services):
//   public/images/hero/hero-master.webp   (1600w)  — split-hero background
//   public/images/hero/hero-master-828.webp (828w) — mobile
//   public/images/hero/hero-master.jpg     (1600w) — fallback
//   public/og-image.jpg                     (1200x630) — social card
//
// The hero is a stylised data-centre: five vertical "container columns" spaced
// to line up with the hero's five split slices, so each slice reveals a column.
// Run: node scripts/generate-brand-assets.mjs
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');

const C = {
  navy950: '#090f0e',
  navy900: '#0e1513',
  navy850: '#161d1b',
  navy800: '#1a211f',
  navy700: '#2f3634',
  navy300: '#859490',
  aqua300: '#71f8e4',
  aqua400: '#4fdbc8',
  aqua500: '#14b8a6',
};

const gridLines = (w, h, step, color, opacity) => {
  let p = '';
  for (let x = step; x < w; x += step) p += `<line x1="${x}" y1="0" x2="${x}" y2="${h}"/>`;
  for (let y = step; y < h; y += step) p += `<line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`;
  return `<g stroke="${color}" stroke-width="1" opacity="${opacity}">${p}</g>`;
};

// One container/server column: frame + port-dot array + status bars.
function column(x, y, w, h, seed) {
  const pad = 16;
  const dotR = 3;
  const gapX = 18;
  const gapY = 18;
  const cols = Math.floor((w - pad * 2) / gapX);
  const rows = Math.floor((h - 96) / gapY);
  let dots = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // deterministic pseudo-random highlight, no Math.random (reproducible)
      const lit = ((r * 7 + c * 13 + seed * 5) % 11) === 0;
      const dim = ((r * 3 + c * 5 + seed) % 4) === 0;
      const fill = lit ? C.aqua400 : dim ? C.navy700 : C.navy300;
      const op = lit ? 0.95 : dim ? 0.5 : 0.28;
      dots += `<circle cx="${x + pad + c * gapX + dotR}" cy="${y + 64 + r * gapY + dotR}" r="${dotR}" fill="${fill}" opacity="${op}"/>`;
    }
  }
  const barY = y + h - 22;
  return `
    <g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10"
            fill="${C.navy850}" stroke="${C.aqua500}" stroke-opacity="0.28" stroke-width="1.5"/>
      <rect x="${x}" y="${y}" width="${w}" height="6" rx="3" fill="${C.aqua500}" opacity="0.55"/>
      <rect x="${x + pad}" y="${y + 24}" width="${w - pad * 2}" height="10" rx="3" fill="${C.navy800}"/>
      <rect x="${x + pad}" y="${y + 24}" width="${(w - pad * 2) * 0.45}" height="10" rx="3" fill="${C.aqua400}" opacity="0.8"/>
      ${dots}
      <rect x="${x + pad}" y="${barY}" width="${w - pad * 2}" height="8" rx="3" fill="${C.navy800}"/>
      <rect x="${x + pad}" y="${barY}" width="${(w - pad * 2) * (0.3 + (seed % 5) * 0.14)}" height="8" rx="3" fill="${C.aqua500}" opacity="0.7"/>
    </g>`;
}

function heroSVG(w, h) {
  const slice = w / 5;
  const colW = slice * 0.56;
  const cols = Array.from({ length: 5 }).map((_, i) => {
    const cx = slice * i + slice / 2;
    const ch = h * (0.62 + (i % 2 === 0 ? 0.06 : 0)); // slight height variation
    const cy = (h - ch) / 2 + 20;
    return column(cx - colW / 2, cy, colW, ch, i + 1);
  }).join('');

  // data-flow line linking column tops
  let flow = '';
  const nodes = Array.from({ length: 5 }).map((_, i) => ({ x: slice * i + slice / 2, y: h * 0.2 }));
  for (let i = 0; i < nodes.length - 1; i++) {
    flow += `<line x1="${nodes[i].x}" y1="${nodes[i].y}" x2="${nodes[i + 1].x}" y2="${nodes[i + 1].y}" stroke="${C.aqua400}" stroke-width="1.5" opacity="0.35"/>`;
  }
  flow += nodes.map((n) => `<circle cx="${n.x}" cy="${n.y}" r="5" fill="${C.aqua400}"/><circle cx="${n.x}" cy="${n.y}" r="11" fill="none" stroke="${C.aqua400}" stroke-opacity="0.4" stroke-width="1.5"/>`).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${C.navy900}"/>
        <stop offset="1" stop-color="${C.navy950}"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.72" cy="0.28" r="0.6">
        <stop offset="0" stop-color="${C.aqua500}" stop-opacity="0.22"/>
        <stop offset="1" stop-color="${C.aqua500}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="glow2" cx="0.2" cy="0.85" r="0.5">
        <stop offset="0" stop-color="${C.aqua400}" stop-opacity="0.10"/>
        <stop offset="1" stop-color="${C.aqua400}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    ${gridLines(w, h, 48, C.navy700, 0.5)}
    <rect width="${w}" height="${h}" fill="url(#glow)"/>
    <rect width="${w}" height="${h}" fill="url(#glow2)"/>
    ${flow}
    ${cols}
    <rect width="${w}" height="${h}" fill="url(#glow)" opacity="0.5"/>
  </svg>`;
}

function ogSVG(w, h) {
  const hexAt = (cx, cy, s) =>
    `<path d="M ${cx - s} ${cy} L ${cx - s / 2} ${cy - s * 0.87} L ${cx + s / 2} ${cy - s * 0.87} L ${cx + s} ${cy} L ${cx + s / 2} ${cy + s * 0.87} L ${cx - s / 2} ${cy + s * 0.87} Z"
       fill="none" stroke="${C.aqua400}" stroke-width="3"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${C.navy900}"/>
        <stop offset="1" stop-color="${C.navy950}"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.85" cy="0.2" r="0.7">
        <stop offset="0" stop-color="${C.aqua500}" stop-opacity="0.25"/>
        <stop offset="1" stop-color="${C.aqua500}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    ${gridLines(w, h, 40, C.navy700, 0.4)}
    <rect width="${w}" height="${h}" fill="url(#glow)"/>
    <g transform="translate(90, 96)">
      ${hexAt(20, 20, 20)}
      <rect x="12" y="12" width="6" height="6" rx="1" fill="${C.aqua400}"/>
      <rect x="22" y="12" width="6" height="6" rx="1" fill="${C.navy300}"/>
      <rect x="17" y="22" width="6" height="6" rx="1" fill="${C.navy300}"/>
      <text x="52" y="28" font-family="DejaVu Sans" font-weight="bold" font-size="26" fill="#dde4e1">ContainerCode Advisory</text>
    </g>
    <text x="90" y="300" font-family="DejaVu Sans" font-weight="bold" font-size="66" fill="#dde4e1">Transforming Businesses</text>
    <text x="90" y="380" font-family="DejaVu Sans" font-weight="bold" font-size="66" fill="${C.aqua400}">Through Cloud Excellence</text>
    <rect x="92" y="430" width="120" height="4" rx="2" fill="${C.aqua500}"/>
    <text x="90" y="486" font-family="DejaVu Sans Mono" font-size="26" fill="${C.navy300}">// multi-cloud · cybersecurity · devops · digital transformation</text>
  </svg>`;
}

async function run() {
  await mkdir(join(pub, 'images', 'hero'), { recursive: true });

  const hero = Buffer.from(heroSVG(1600, 1000));
  await sharp(hero).webp({ quality: 82 }).toFile(join(pub, 'images', 'hero', 'hero-master.webp'));
  await sharp(hero).resize(828).webp({ quality: 80 }).toFile(join(pub, 'images', 'hero', 'hero-master-828.webp'));
  await sharp(hero).jpeg({ quality: 82, mozjpeg: true }).toFile(join(pub, 'images', 'hero', 'hero-master.jpg'));
  await writeFile(join(pub, 'images', 'hero', 'hero-master.svg'), heroSVG(1600, 1000));

  const og = Buffer.from(ogSVG(1200, 630));
  await sharp(og).jpeg({ quality: 88, mozjpeg: true }).toFile(join(pub, 'og-image.jpg'));

  console.log('Generated hero-master.{webp,828.webp,jpg,svg} and og-image.jpg');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
