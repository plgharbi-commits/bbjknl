:root{
  --primary:#45DFB1;
  --bg:#f6fbfb;
  --panel:#ffffff;
  --ink:#0c1e1c;
  --muted:rgba(12,30,28,.58);
  --line:rgba(12,30,28,.12);
  --radius:22px;
  --radius2:16px;
  --container:1100px;
}

*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  background: var(--bg);
  color: var(--ink);
}

body.dark{
  --bg:#0b1615;
  --panel:#122322;
  --ink:#f1fbfa;
  --muted:rgba(241,251,250,.62);
  --line:rgba(241,251,250,.12);
}

/* Topbar */
.topbar{
  position:sticky; top:0; z-index:50;
  background: color-mix(in srgb, var(--bg) 78%, transparent);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(10px);
}
.topbar-inner{
  height:72px;
  display:flex;
  align-items:center;
  gap:14px;
  padding: 0 18px;
  max-width: var(--container);
  margin:0 auto;
}
.icon-btn{
  width:44px;height:44px;
  border-radius: 14px;
  border:1px solid var(--line);
  background: transparent;
  cursor:pointer;
  font-weight:900;
}
.brand{display:flex;align-items:center;gap:12px}
.brand-mark{
  width:44px;height:44px;border-radius:16px;
  display:grid;place-items:center;
  background: color-mix(in srgb, var(--primary) 14%, transparent);
}
.brand-name{font-weight:900;font-size:20px;line-height:1.1}
.brand-sub{font-size:11px;letter-spacing:2.4px;color:var(--muted);margin-top:2px}

.tabs{
  margin-left:auto;
  display:flex;
  gap:8px;
  padding:6px;
  border:1px solid var(--line);
  border-radius: 14px;
  background: color-mix(in srgb, var(--panel) 55%, transparent);
}
.tab{
  height:40px;
  padding:0 18px;
  border:none;
  border-radius: 10px;
  background: transparent;
  color: var(--muted);
  font-weight:800;
  cursor:pointer;
}
.tab.is-active{
  background: color-mix(in srgb, var(--panel) 75%, transparent);
  color: var(--ink);
}

.main{
  padding: 22px 0 70px;
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--primary) 40%, transparent) 0%,
    color-mix(in srgb, var(--bg) 8%, transparent) 60%,
    transparent 100%);
  transition: background .18s ease, color .18s ease;
}
.view{display:none}
.view.is-active{display:block}

.container{max-width: var(--container); margin:0 auto; padding: 0 18px;}
.container.narrow{max-width: 860px}

.hero{text-align:center;padding: 36px 0 26px}
.hero h1{margin:0;font-size:54px;font-weight:950;letter-spacing:-1px}
.accent{
  background: linear-gradient(90deg, var(--primary), #b7d6a6);
  -webkit-background-clip:text;background-clip:text;color:transparent;
}
.hero p{margin:14px auto 0;max-width:780px;color:var(--muted);font-size:18px;line-height:1.5}

/* Grid + Cards */
.grid{
  display:grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 22px;
  margin-top: 26px;
}
.card{
  position:relative;
  background: var(--panel);
  border:1px solid var(--line);
  border-radius: 22px;
  padding: 28px 24px 22px 96px;
  overflow: hidden;
}
.card::before{
  content: "📚";
  position:absolute;
  top:24px;
  left:24px;
  width:52px;
  height:52px;
  border-radius:14px;
  display:grid;place-items:center;
  font-size:20px;
  background: color-mix(in srgb, var(--primary) 12%, transparent);
}
.card h3{margin:14px 0 12px;font-size:28px;font-weight:950}
.meta-line{
  display:inline-flex;
  align-items:center;
  gap:10px;
  color:var(--muted);
  font-weight:800;
  background: color-mix(in srgb, var(--primary) 8%, transparent);
  padding:8px 12px;
  border-radius: 999px;
}

.btn{
  height:50px;
  padding:0 16px;
  border-radius: 14px;
  border:1px solid var(--line);
  background: color-mix(in srgb, var(--panel) 72%, transparent);
  font-weight:900;
  color: var(--ink);
  cursor:pointer;
}
.btn.primary{
  border:none;
  background: var(--primary);
  color:#fff;
}
.row{display:flex;gap:12px;margin-top:18px}
.row .btn{flex:1}
.row .btn.primary{
  height:64px;
  border-radius: 18px;
  background: color-mix(in srgb, var(--primary) 28%, #000 72%);
  color: #fff;
  font-size:18px;
  box-shadow: 0 6px 18px color-mix(in srgb, var(--primary) 10%, transparent);
}

/* Create tile */
.create-tile{
  border:2px dashed var(--line);
  background: color-mix(in srgb, var(--panel) 35%, transparent);
  display:grid;place-items:center;
  cursor:pointer;
  min-height: 220px;
  font-weight:950;
  color: var(--muted);
  border-radius: 26px;
  position:relative;
  padding: 28px 18px;
  text-align:center;
}
.create-tile::before{
  content: "→";
  position:absolute;
  right:36px;
  bottom:36px;
  width:72px;height:72px;border-radius:999px;
  display:grid;place-items:center;
  background: #fff;color:var(--ink);font-size:26px;
  box-shadow: 0 6px 18px rgba(0,0,0,.08);
}

/* Pages */
.page-head{display:flex;align-items:center;gap:14px;margin: 10px 0 18px}
.page-head h2{margin:0;font-size:32px;font-weight:950}
.back{
  width:44px;height:44px;border-radius: 14px;
  border:1px solid transparent;background:transparent;
  cursor:pointer;color:var(--muted);font-weight:950;
}

.panel{
  background: var(--panel);
  border:1px solid var(--line);
  border-radius: var(--radius);
  padding: 18px;
  margin-bottom: 14px;
}
.label{display:block;font-size:13px;font-weight:900;letter-spacing:.8px;color:var(--muted);margin-bottom:10px;text-transform:uppercase}
.input{
  width:100%;
  height:56px;
  border-radius: 14px;
  border:1px solid var(--line);
  background: color-mix(in srgb, var(--bg) 65%, transparent);
  padding: 0 14px;
  font-size: 16px;
  font-weight:800;
  color: var(--ink);
  outline:none;
}

.choice-input{
  height:44px !important;
  padding: 8px 12px !important;
  font-size: 14px !important;
}
.panel-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.panel-title{font-weight:950;font-size:20px}
.link{
  border:none;background:transparent;color:var(--primary);
  font-weight:950;cursor:pointer;
  padding: 8px 10px;border-radius: 12px;
}
.link:hover{background: color-mix(in srgb, var(--primary) 12%, transparent)}

.card-type-toggle{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:12px;
}
.card-type-btn{
  height:50px;
  border-radius: 14px;
  border:1px solid var(--line);
  background: color-mix(in srgb, var(--panel) 55%, transparent);
  color: var(--muted);
  font-weight:900;
  cursor:pointer;
  transition: all .18s ease;
}
.card-type-btn.is-active{
  background: var(--primary);
  color:#fff;
  border:none;
}

.cards-list{display:flex;flex-direction:column;gap:12px}
.card-row{
  border:1px solid var(--line);
  border-radius: var(--radius2);
  padding: 14px;
  background: color-mix(in srgb, var(--panel) 75%, transparent);
}
.card-row-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.small{font-size:12px;font-weight:950;letter-spacing:1px;color:var(--muted);text-transform:uppercase}
.textarea{
  width:100%;
  min-height: 92px;
  border-radius: 14px;
  border:1px solid var(--line);
  background: color-mix(in srgb, var(--bg) 65%, transparent);
  padding: 12px;
  font-size: 14px;
  font-weight:700;
  color: var(--ink);
  outline:none;
  resize:vertical;
}
.trash{
  width:38px;height:38px;border-radius:12px;
  border:1px solid transparent;background:transparent;
  cursor:pointer;
  font-weight:900;color: color-mix(in srgb, var(--ink) 60%, transparent);
}
.trash:hover{background: color-mix(in srgb, #ff3b3b 12%, transparent); color:#ff3b3b}

.cta{
  width:100%;
  height:62px;
  border:none;
  border-radius: var(--radius);
  background: var(--primary);
  color:#fff;
  font-weight:950;
  font-size:18px;
  cursor:pointer;
}

/* Study */
.study-head{display:flex;align-items:flex-end;justify-content:space-between;width:100%;gap:12px}

/* flip card */
.study-card{
  border-radius: 26px;
  border:1px solid var(--line);
  background: transparent;
  padding: 0;
  cursor:pointer;
  user-select:none;
  margin-top: 12px;
  perspective:1200px;
}
.study-card-inner{
  position:relative;
  border-radius:26px;
  background:var(--panel);
  padding:26px;
  transform-style:preserve-3d;
  transition:transform .35s ease;
}
.study-card.is-flipped .study-card-inner{
  transform:rotateY(180deg);
}
.study-face{
  position:relative;
  backface-visibility:hidden;
}
.study-face.back{
  transform:rotateY(180deg);
  position:absolute;
  inset:0;
  padding:26px;
}

.study-badge{
  display:inline-flex;
  font-size:12px;
  font-weight:950;
  letter-spacing:1px;
  color: var(--primary);
  background: color-mix(in srgb, var(--primary) 12%, transparent);
  padding: 8px 12px;
  border-radius:999px;
}
.study-text{margin-top:14px;font-size:22px;font-weight:900;line-height:1.35}
.study-hint{margin-top:16px;color:var(--muted);font-weight:800;font-size:13px}

.choice-option{
  border:1px solid var(--line);
  border-radius: 14px;
  padding:12px 14px;
  background: color-mix(in srgb, var(--panel) 75%, transparent);
  font-weight:800;
  color:var(--ink);
}

.photo-upload{
  display:flex;
  flex-direction:column;
  gap:12px;
}
.photo-label{
  display:block;
  border:2px dashed var(--line);
  border-radius:14px;
  padding:16px;
  text-align:center;
  cursor:pointer;
  transition:all .18s ease;
  background:color-mix(in srgb, var(--bg) 65%, transparent);
}
.photo-label:hover{
  border-color:var(--primary);
  background:color-mix(in srgb, var(--primary) 8%, transparent);
}
.photo-placeholder{
  display:block;
  font-weight:800;
  color:var(--muted);
  font-size:14px;
}
.photo-preview{
  border-radius:10px;
  overflow:hidden;
  background:color-mix(in srgb, var(--panel) 75%, transparent);
}

/* Manage */
.manage-head{display:flex;align-items:center;justify-content:space-between;width:100%}
.danger{
  height:42px;
  padding:0 14px;
  border-radius: 14px;
  border:1px solid color-mix(in srgb, #ff3b3b 35%, transparent);
  background: color-mix(in srgb, #ff3b3b 10%, transparent);
  color:#ff3b3b;
  font-weight:950;
  cursor:pointer;
}
.manage-list{display:flex;flex-direction:column;gap:12px;margin-top:12px}
.manage-item{
  border:1px solid var(--line);
  border-radius: var(--radius2);
  padding: 14px;
  background: color-mix(in srgb, var(--panel) 72%, transparent);
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:12px;
}
.manage-item-head{flex:1}
.manage-item .q{font-weight:950}
.manage-item .a{margin-top:8px;color:var(--muted);font-weight:750}
.manage-item .trash{
  flex-shrink:0;
  margin-top:2px;
}

/* Info */
.info-hero{text-align:center;padding: 30px 0 20px}
.info-hero h1{margin:16px 0 0;font-size:52px;font-weight:950;letter-spacing:-1px}
.info-hero p{margin:14px auto 0;max-width:820px;font-size:18px;line-height:1.55;color:var(--muted)}
.pill{
  display:inline-flex;align-items:center;gap:10px;
  padding: 10px 16px;border-radius:999px;
  background: color-mix(in srgb, var(--primary) 12%, transparent);
  color: var(--primary);font-weight:950;
}
.grad{
  background: linear-gradient(90deg, var(--primary), #b7d6a6);
  -webkit-background-clip:text;background-clip:text;color:transparent;
}
.hero-cta{
  margin-top: 18px;height:56px;padding:0 24px;
  border:none;border-radius: 18px;
  background: var(--primary);color:#fff;font-weight:950;cursor:pointer;
}
.info-grid{
  margin-top: 26px;
  display:grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 18px;
}
.feature{
  background: var(--panel);
  border:1px solid var(--line);
  border-radius: 26px;
  padding: 20px;
}
.feature h3{margin:0 0 8px;font-size:22px;font-weight:950}
.feature p{margin:0;color:var(--muted);line-height:1.45;font-weight:700}
.quote{
  margin-top: 22px;
  border-radius: 26px;
  border:1px solid color-mix(in srgb, var(--primary) 18%, transparent);
  background: color-mix(in srgb, var(--primary) 10%, transparent);
  padding: 22px;
  text-align:center;
  font-style: italic;
  font-weight: 850;
}

/* Drawer + Overlay */
.overlay{
  position:fixed; inset:0;
  background: rgba(0,0,0,.25);
  opacity:0; pointer-events:none;
  transition: opacity .18s ease;
  z-index:80;
}
.overlay.open{opacity:1;pointer-events:auto}

.drawer{
  position:fixed; top:0; left:0; height:100%;
  width: 320px;
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  border-right: 1px solid var(--line);
  transform: translateX(-105%);
  transition: transform .2s ease;
  z-index:90;
  backdrop-filter: blur(12px);
}
.drawer.open{transform: translateX(0)}
.drawer-inner{padding:18px;margin-top:72px}
.drawer-title{
  font-size: 12px;font-weight: 950;letter-spacing: 1.4px;
  color: var(--muted);margin: 10px 6px 10px;text-transform: uppercase;
}
.drawer-item,.drawer-item-static{
  width:100%;
  display:flex;align-items:center;gap:12px;
  border:none;background: transparent;
  padding: 12px 10px;border-radius: 14px;
  cursor:pointer;font-weight: 950;color: var(--ink);
}
.drawer-item:hover{background: color-mix(in srgb, var(--primary) 10%, transparent)}
.drawer-ico{width:28px;height:28px;display:grid;place-items:center}
.drawer-row{display:flex;align-items:center;justify-content:space-between;gap:10px}
.drawer-sep{height:1px;background:var(--line);margin: 12px 0}

/* Switch */
.switch{width:54px;height:30px;display:inline-block;position:relative}
.switch input{display:none}
.slider{
  position:absolute; inset:0;
  border-radius:999px;
  border:1px solid var(--line);
  background: color-mix(in srgb, var(--ink) 8%, transparent);
  cursor:pointer;
}
.slider::after{
  content:"";
  position:absolute; top:3px; left:4px;
  width:22px;height:22px;border-radius:999px;
  background: color-mix(in srgb, var(--panel) 92%, transparent);
  transition: transform .18s ease;
}
.switch input:checked + .slider{
  background: color-mix(in srgb, var(--primary) 22%, transparent);
}
.switch input:checked + .slider::after{transform: translateX(24px)}

/* Palette */
.palette{
  border:1px solid var(--line);
  border-radius: 18px;
  background: color-mix(in srgb, var(--panel) 55%, transparent);
  padding: 12px;
  display:grid;
  grid-template-columns: repeat(4, 52px);
  gap: 12px;
}
.swatch{
  width:52px;height:52px;border-radius: 16px;
  border:none; cursor:pointer;
  background: var(--sw);
  position:relative;
}
.swatch.is-active{
  outline: 3px solid color-mix(in srgb, var(--primary) 70%, transparent);
  outline-offset: 4px;
}

/* Modal */
.modal{
  position:fixed;
  inset:0;
  z-index:100;
  display:flex;
  align-items:center;
  justify-content:center;
}
.modal-overlay{
  position:absolute;
  inset:0;
  background:rgba(0,0,0,.4);
  backdrop-filter:blur(4px);
}
.modal-content{
  position:relative;
  z-index:101;
  background:var(--panel);
  border-radius:var(--radius);
  max-width:600px;
  width:90%;
  max-height:90vh;
  overflow-y:auto;
  box-shadow:0 8px 32px rgba(0,0,0,.15);
}
.modal-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:20px;
  border-bottom:1px solid var(--line);
}
.modal-head h3{
  margin:0;
  font-size:22px;
  font-weight:950;
}
.modal-close{
  width:38px;
  height:38px;
  border-radius:12px;
  border:none;
  background:transparent;
  cursor:pointer;
  font-weight:900;
  color:var(--muted);
  display:grid;
  place-items:center;
}
.modal-close:hover{
  background:color-mix(in srgb, var(--primary) 10%, transparent);
  color:var(--ink);
}
.modal-body{
  padding:20px;
}
.modal-footer{
  display:flex;
  gap:12px;
  padding:20px;
  border-top:1px solid var(--line);
  justify-content:flex-end;
}
.modal-footer .btn{
  flex:0;
}

@media (max-width: 980px){
  .grid{grid-template-columns: 1fr}
  .info-grid{grid-template-columns: 1fr}
  .hero h1{font-size: 42px}
  .info-hero h1{font-size: 42px}
}
