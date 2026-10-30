"""Test site only: adds the palette trial (sky blue + accent, liquid glass, switcher) to every page.
Re-runnable: replaces the block between the trial markers. Run from the repo root after each sync."""
from pathlib import Path
import re
ROOT = Path(__file__).resolve().parents[2]
SKIP = {"projects/mirrorme-tech-pack.html", "projects/siri-reimagined.html", "logo-options.html", "ideas.html", "ideas-2.html", "palettes/index.html"}
HEAD = """<!-- trial -->
  <script>(function(){var r=document.documentElement,q=new URLSearchParams(location.search),s={};try{s=JSON.parse(localStorage.getItem('ck-trial'))||{}}catch(e){}
  r.dataset.palette='sky';r.dataset.blue=q.get('blue')||s.blue||'wash';r.dataset.accent=q.get('accent')||s.accent||'pink';r.setAttribute('data-theme','light');
  if(q.get('blue')||q.get('accent')){try{localStorage.setItem('ck-trial',JSON.stringify({blue:r.dataset.blue,accent:r.dataset.accent}))}catch(e){}}})();</script>
  <link rel="stylesheet" href="/assets/css/palette-glass.css?v=3">
  <script src="/assets/js/palette-trial.js?v=1" defer></script>
  <script src="/assets/js/liquid-glass.js?v=2" defer></script>
  <!-- /trial -->
"""
n = 0
for f in sorted(list(ROOT.glob("*.html")) + list(ROOT.glob("projects/*.html"))):
    rel = f.relative_to(ROOT).as_posix()
    if rel in SKIP:
        continue
    s = f.read_text()
    s = re.sub(r"<!-- trial -->.*?<!-- /trial -->\n", "", s, flags=re.S)
    if "</head>" not in s:
        continue
    s = s.replace("</head>", HEAD + "</head>", 1)
    f.write_text(s); n += 1
print("trial on", n, "pages")
