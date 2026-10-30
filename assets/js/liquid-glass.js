/* Liquid glass: refraction through a convex, rounded-rectangle lens.
   Each [data-lg] element gets its own SVG filter whose displacement map is sized to it
   (backdrop filters don't stretch maps to the element), after kube.io's approach:
   a squircle bezel bends the backdrop inward at the edges, and the flat middle stays clear.
   Red, green and blue are displaced by slightly different amounts for a little dispersion.
   SVG filters as backdrop-filter only work in Chromium; elsewhere the CSS frosted fallback stays. */
(function () {
  const chromium = !!(navigator.userAgentData && navigator.userAgentData.brands.some(b => /Chromium/.test(b.brand)));
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!chromium) return;
  document.documentElement.classList.add('lg-on');

  const NS = 'http://www.w3.org/2000/svg';
  const defs = document.createElementNS(NS, 'svg');
  defs.setAttribute('width', '0'); defs.setAttribute('height', '0');
  defs.setAttribute('aria-hidden', 'true');
  defs.style.position = 'absolute';
  document.body.appendChild(defs);

  // Convex squircle profile: height of the glass at t (0 = outer edge, 1 = end of bezel).
  const height = t => Math.pow(1 - Math.pow(1 - t, 4), 0.25);

  // Displacement (in units of the bezel width) for a ray entering at t, from Snell's law, n = 1.5.
  const N = 1.5, SAMPLES = 128;
  const profile = (() => {
    const out = new Float32Array(SAMPLES);
    for (let i = 0; i < SAMPLES; i++) {
      const t = Math.min(0.999, Math.max(0.001, i / (SAMPLES - 1)));
      const d = 0.001, slope = (height(t + d) - height(t - d)) / (2 * d);
      const inc = Math.atan(slope);                       // angle between the ray and the surface normal
      const ref = Math.asin(Math.sin(inc) / N);
      out[i] = Math.tan(inc - ref) * height(t);            // sideways travel through the glass
    }
    const max = Math.max(...out) || 1;
    return out.map(v => v / max);
  })();

  let uid = 0;
  const maps = new Map();

  function displacementMap(w, h, r, bezel) {
    const key = [w, h, r, bezel].join('x');
    if (maps.has(key)) return maps.get(key);
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(w, h);
    const hw = w / 2, hh = h / 2;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        // Signed distance to a rounded rectangle, and its gradient (the outward normal).
        const px = x + 0.5 - hw, py = y + 0.5 - hh;
        const qx = Math.abs(px) - (hw - r), qy = Math.abs(py) - (hh - r);
        let nx, ny, inside;
        if (qx > 0 && qy > 0) {
          const len = Math.hypot(qx, qy) || 1;
          nx = qx / len; ny = qy / len; inside = r - len;
        } else if (qx > qy) { nx = 1; ny = 0; inside = r - qx; }
        else { nx = 0; ny = 1; inside = r - qy; }
        nx *= Math.sign(px) || 1; ny *= Math.sign(py) || 1;
        let mag = 0;
        if (inside > 0 && inside < bezel) mag = profile[Math.round((inside / bezel) * (SAMPLES - 1))];
        // Sample from further inside the glass: displacement points against the normal.
        const i = (y * w + x) * 4;
        img.data[i] = 128 - nx * mag * 127;
        img.data[i + 1] = 128 - ny * mag * 127;
        img.data[i + 2] = 128;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    const url = c.toDataURL();
    maps.set(key, url);
    return url;
  }

  function build(el) {
    const box = el.getBoundingClientRect();
    const w = Math.round(box.width), h = Math.round(box.height);
    if (w < 8 || h < 8) return;
    const cs = getComputedStyle(el);
    const r = Math.min(parseFloat(cs.borderTopLeftRadius) || 0, w / 2, h / 2);
    const bezel = Math.max(6, Math.min(r * 0.9, Math.min(w, h) * 0.4, +el.dataset.lgBezel || 22));
    const strength = (+el.dataset.lgStrength || 1) * Math.min(bezel * 0.9, 26) * (still ? 0.6 : 1);
    const frost = +el.dataset.lgFrost || 0.6;

    const id = el.dataset.lgId || (el.dataset.lgId = 'lg-' + (++uid));
    let f = document.getElementById(id);
    if (!f) { f = document.createElementNS(NS, 'filter'); f.id = id; defs.appendChild(f); }
    f.setAttribute('x', '0'); f.setAttribute('y', '0');
    f.setAttribute('width', w); f.setAttribute('height', h);
    f.setAttribute('filterUnits', 'userSpaceOnUse');
    f.setAttribute('color-interpolation-filters', 'sRGB');
    const map = displacementMap(w, h, r, bezel);
    const ch = (c, s) => `<feDisplacementMap in="frost" in2="map" scale="${s.toFixed(1)}" xChannelSelector="R" yChannelSelector="G" result="d${c}"/>
      <feColorMatrix in="d${c}" type="matrix" values="${c === 'r' ? '1 0 0 0 0 0 0 0 0 0 0 0 0 0 0' : c === 'g' ? '0 0 0 0 0 0 1 0 0 0 0 0 0 0 0' : '0 0 0 0 0 0 0 0 0 0 0 0 1 0 0'} 0 0 0 1 0" result="c${c}"/>`;
    f.innerHTML = `
      <feImage href="${map}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" result="map"/>
      <feGaussianBlur in="SourceGraphic" stdDeviation="${frost}" result="frost"/>
      ${ch('r', strength)}${ch('g', strength * 1.04)}${ch('b', strength * 1.08)}
      <feBlend in="cr" in2="cg" mode="screen" result="rg"/>
      <feBlend in="rg" in2="cb" mode="screen"/>`;
    el.style.setProperty('--lg-filter', `url(#${id})`);
    el.classList.add('lg-live');
  }

  const els = () => document.querySelectorAll('[data-lg]');
  const ro = new ResizeObserver(entries => entries.forEach(e => build(e.target)));
  function scan() { els().forEach(el => { if (!el.dataset.lgWatched) { el.dataset.lgWatched = '1'; ro.observe(el); } build(el); }); }
  scan();
  // Tabs reveal new panels whose glass was hidden (zero-size) at load.
  document.addEventListener('click', () => requestAnimationFrame(scan));
  addEventListener('hashchange', () => requestAnimationFrame(scan));
})();
