import sharp from 'sharp'

const art = (pad = 0) => `
<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FF8A3D"/><stop offset="1" stop-color="#E23E8F"/>
    </linearGradient>
  </defs>
  <rect width="96" height="96" ${pad ? '' : 'rx="24"'} fill="url(#lg)"/>
  <g transform="translate(${48 - 48 * (1 - pad)} ${48 - 48 * (1 - pad)}) scale(${1 - pad})">
    <path d="M24 44 L72 44 L66 74 Q65.4 78 61 78 L35 78 Q30.6 78 30 74 Z" fill="#fff"/>
    <path d="M36 44 Q36 28 48 28 Q60 28 60 44" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    <line x1="39" y1="52" x2="41" y2="70" stroke="#FF8A3D" stroke-width="3.4" stroke-linecap="round" opacity=".55"/>
    <line x1="48" y1="52" x2="48" y2="70" stroke="#FF8A3D" stroke-width="3.4" stroke-linecap="round" opacity=".55"/>
    <line x1="57" y1="52" x2="55" y2="70" stroke="#FF8A3D" stroke-width="3.4" stroke-linecap="round" opacity=".55"/>
    <g transform="translate(64 14) rotate(12)">
      <circle cx="3.4" cy="15.4" r="4.4" fill="#fff"/>
      <rect x="6.4" y="0" width="3.2" height="16" rx="1.6" fill="#fff"/>
      <path d="M6.4 0 Q13.4 2 15 7 Q11 5.4 6.4 5.2 Z" fill="#fff"/>
    </g>
  </g>
</svg>`

await sharp(Buffer.from(art(0))).resize(192, 192).png().toFile('public/icons/icon-192.png')
await sharp(Buffer.from(art(0))).resize(512, 512).png().toFile('public/icons/icon-512.png')
await sharp(Buffer.from(art(0.22))).resize(512, 512).png().toFile('public/icons/maskable-512.png')
console.log('icons done')
