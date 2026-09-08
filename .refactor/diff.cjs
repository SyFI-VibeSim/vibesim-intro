/* Compare .refactor/current against .refactor/baseline, pixel by pixel.
   Pure PNG decode via zlib, no image dependency needed. */
const fs = require('fs'), zlib = require('zlib');

function decode(file) {
  const buf = fs.readFileSync(file);
  let p = 8, w = 0, h = 0, bd = 0, ct = 0, idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString('ascii', p + 4, p + 8);
    const data = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); bd = data[8]; ct = data[9]; }
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    p += len + 12;
  }
  if (bd !== 8) throw new Error('bit depth ' + bd);
  const ch = { 0: 1, 2: 3, 4: 2, 6: 4 }[ct];
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * ch, out = Buffer.alloc(h * stride);
  let ptr = 0;
  for (let y = 0; y < h; y++) {
    const ft = raw[ptr++];
    const line = raw.subarray(ptr, ptr + stride); ptr += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y ? out.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? cur[x - ch] : 0, b = prev[x], c = x >= ch ? prev[x - ch] : 0;
      let v = line[x];
      if (ft === 1) v += a; else if (ft === 2) v += b; else if (ft === 3) v += (a + b) >> 1;
      else if (ft === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
        v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c); }
      cur[x] = v & 255;
    }
  }
  return { w, h, ch, data: out };
}

const A = process.argv[2] || '.refactor/baseline', B = process.argv[3] || '.refactor/current';
const names = fs.readdirSync(A).filter(f => f.endsWith('.png')).sort();
let worst = 0, report = [];
for (const n of names) {
  const cp = B + '/' + n;
  if (!fs.existsSync(cp)) { report.push(`${n}  MISSING in current`); worst = 1e9; continue; }
  let a, b;
  try { a = decode(A + '/' + n); b = decode(cp); }
  catch (e) { report.push(`${n}  decode failed: ${e.message}`); continue; }
  if (a.w !== b.w || a.h !== b.h) { report.push(`${n}  SIZE ${a.w}x${a.h} -> ${b.w}x${b.h}`); worst = 1e9; continue; }
  // Counting "any channel differs by 1" is useless here: a 6/255 shift on a
  // background flips every pixel while being invisible. Measure magnitude.
  let sum = 0, max = 0, over8 = 0;
  const px = a.w * a.h;
  for (let i = 0; i < a.data.length; i += a.ch) {
    const d = Math.max(Math.abs(a.data[i] - b.data[i]),
                       Math.abs(a.data[i+1] - b.data[i+1]),
                       Math.abs(a.data[i+2] - b.data[i+2]));
    if (d) { sum += d; if (d > max) max = d; if (d > 8) over8++; }
  }
  const mean = sum / px, pctOver = 100 * over8 / px;
  if (max) report.push(
    `${n}  max ${max}/255  mean ${mean.toFixed(2)}/255  ` +
    `${pctOver.toFixed(2)}% of pixels shifted more than 8/255`);
  worst = Math.max(worst, max);
}
console.log(report.length ? report.join('\n') : 'IDENTICAL: every capture matches the baseline');
console.log(`\nworst channel delta: ${worst === 1e9 ? "STRUCTURAL" : worst + "/255"}  over ${names.length} captures`);
