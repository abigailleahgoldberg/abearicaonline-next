'use client';

import { useEffect } from 'react';

export default function AolSite() {
  useEffect(() => {
    // Set random Win95 desktop color
    const colors = ['#008080', '#000080', '#808000', '#800080'];
    const pick = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.background = pick;

    // Load the main site JS
    const script = document.createElement('script');
    script.src = '/aol-site.js';
    script.async = false;
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      try { document.body.removeChild(script); } catch {}
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: AOL_CSS }} />
      <div id="aol-root" dangerouslySetInnerHTML={{ __html: AOL_HTML }} />
    </>
  );
}

const AOL_CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --cream: #F5F0E8;
  --navy: #000066;
  --gold: #FFD700;
  --red: #CC0000;
  --tan: #C8B898;
  --tan-2: #B8A888;
  --blue-link: #0000CC;
  --txt: #000000;
  --txt-2: #333333;
  --txt-3: #555555;
}

body {
  background: #008080;
  font-family: 'Inter', Arial, sans-serif;
  font-size: 13px;
  min-height: 100vh;
  overflow-x: hidden;
  cursor: default;
  transition: background 0.3s;
}
.raised { border-top:2px solid #fff; border-left:2px solid #fff; border-right:2px solid #404040; border-bottom:2px solid #404040; }
.sunken { border-top:2px solid #404040; border-left:2px solid #404040; border-right:2px solid #fff; border-bottom:2px solid #fff; }
.win-btn { background:#dde4ee; border:1px solid #99aacc; border-radius:3px; padding:3px 12px; font-size:11px; font-family:Arial,sans-serif; cursor:pointer; white-space:nowrap; color:#000; transition:background 0.12s; }
.win-btn:hover { background:#c8d8ee; border-color:#5577aa; }
.title-bar { background:linear-gradient(to right,#000055,#1a6ecf 60%,#0044aa); color:#fff; padding:3px 5px; display:flex; justify-content:space-between; align-items:center; font-size:11px; font-weight:bold; user-select:none; box-shadow:0 2px 8px rgba(0,0,150,0.4); }
.title-bar-btn { background:#d0d0d0; color:#000; font-size:9px; line-height:1; width:16px; height:14px; display:inline-flex; align-items:center; justify-content:center; border-top:1px solid #fff; border-left:1px solid #fff; border-right:1px solid #404040; border-bottom:1px solid #404040; border-radius:2px; cursor:pointer; margin-left:2px; font-weight:bold; vertical-align:middle; padding:0; transition:background 0.12s; }
.title-bar-btn:hover { background:#e85555; color:#fff; border-color:#cc3333; }
.blink { animation:blink 1s step-end infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
@keyframes buddyPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
@keyframes marqueeScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
@keyframes glowPulse { 0%,100%{text-shadow:0 0 8px rgba(255,215,0,0.6),0 0 16px rgba(255,215,0,0.3)} 50%{text-shadow:0 0 20px rgba(255,215,0,1),0 0 40px rgba(255,215,0,0.6),0 0 60px rgba(255,200,0,0.3)} }
@keyframes starfieldTwinkle { 0%,100%{opacity:0.8} 50%{opacity:0.3} }
@keyframes popIn { from{transform:scale(0.6);opacity:0} to{transform:scale(1);opacity:1} }
@keyframes glitch { 0%{transform:translateX(-5px);opacity:1} 25%{transform:translateX(5px)} 50%{transform:translateX(-3px)} 75%{transform:translateX(3px)} 100%{transform:translateX(0);opacity:0} }

#phase-cd { position:fixed; inset:0; background:radial-gradient(ellipse at center,#001a4d 0%,#000 70%); display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:1000; cursor:pointer; }
.cd-wrap { position:relative; width:240px; height:240px; }
.cd-disc { width:240px; height:240px; border-radius:50%; background:radial-gradient(circle at 50% 50%,rgba(255,255,255,0.18) 0%,transparent 55%),radial-gradient(circle at 35% 30%,#5577dd,#0033bb 40%,#001199 75%,#000d77 100%); animation:spin 4s linear infinite; box-shadow:0 0 80px rgba(80,130,255,0.7),0 0 160px rgba(50,100,255,0.3),inset 0 0 50px rgba(0,0,0,0.4); position:relative; }
.cd-disc::before { content:''; position:absolute; inset:4px; border-radius:50%; background:conic-gradient(from 0deg,rgba(255,0,80,0.25) 0deg,rgba(255,140,0,0.3) 30deg,rgba(255,215,0,0.35) 60deg,rgba(0,220,100,0.2) 90deg,rgba(0,180,255,0.3) 120deg,rgba(120,0,255,0.25) 150deg,rgba(255,0,180,0.2) 180deg,rgba(255,80,0,0.28) 210deg,rgba(255,215,0,0.32) 240deg,rgba(0,255,200,0.2) 270deg,rgba(80,160,255,0.28) 300deg,rgba(200,0,255,0.22) 330deg,rgba(255,0,80,0.25) 360deg); mix-blend-mode:screen; pointer-events:none; }
.cd-disc .cd-sheen { position:absolute; inset:0; border-radius:50%; background:linear-gradient(135deg,rgba(255,255,255,0.25) 0%,transparent 50%,rgba(255,255,255,0.08) 100%); pointer-events:none; z-index:2; }
.cd-disc::after { content:''; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:34px; height:34px; border-radius:50%; background:radial-gradient(circle,#333 0%,#111 100%); border:2px solid #555; z-index:4; }
.cd-text-wrap { position:absolute; inset:0; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:3; pointer-events:none; }
.cd-brand { font-family:Arial,sans-serif; font-size:10px; font-weight:bold; letter-spacing:4px; color:#fff; text-transform:uppercase; text-shadow:0 1px 4px rgba(0,0,0,0.9); margin-top:-18px; }
.cd-online { font-family:Georgia,'Times New Roman',serif; font-style:italic; font-size:24px; font-weight:bold; color:#fff; text-shadow:1px 2px 4px rgba(0,0,0,0.8),0 0 8px rgba(100,150,255,0.3); margin-top:-2px; letter-spacing:1px; }
.cd-hours { font-family:Impact,Arial Black,sans-serif; font-size:52px; font-weight:900; color:#FFD700; text-shadow:2px 2px 0 #000,3px 3px 0 rgba(0,0,0,0.5),0 0 30px rgba(255,215,0,0.8),0 0 60px rgba(255,215,0,0.4); line-height:1; margin-top:8px; }
.cd-hours-label { font-family:Arial Black,sans-serif; font-size:13px; font-weight:900; color:#fff; letter-spacing:2px; text-shadow:1px 1px 0 #000; }
.cd-free { font-family:Arial,sans-serif; font-size:9px; color:rgba(255,255,255,0.8); margin-top:6px; letter-spacing:1px; }
.cd-prompt { text-align:center; margin-top:28px; }
.cd-title { color:#FFD700; font-family:Impact,Arial Black,sans-serif; font-size:13px; letter-spacing:3px; text-transform:uppercase; text-shadow:0 0 10px rgba(255,215,0,0.5); }
.cd-sub { color:rgba(255,255,255,0.7); font-size:11px; margin-top:5px; letter-spacing:1px; }
.cd-click { color:#FFD700; font-size:13px; margin-top:20px; font-family:'Courier New',monospace; letter-spacing:3px; animation:glowPulse 1.8s ease-in-out infinite; }
#phase-cd::before { content:''; position:absolute; inset:0; pointer-events:none; background:transparent; box-shadow:12px 34px 0 0 rgba(255,255,255,0.7),89px 154px 0 0 rgba(255,255,255,0.5),200px 67px 0 0 rgba(255,255,255,0.8),310px 189px 0 0 rgba(255,255,255,0.4),450px 45px 0 0 rgba(255,255,255,0.6),512px 220px 0 0 rgba(255,255,255,0.7),678px 89px 0 0 rgba(255,255,255,0.5),720px 301px 0 0 rgba(255,255,255,0.6),900px 120px 0 0 rgba(255,255,255,0.7),980px 350px 0 0 rgba(255,255,255,0.5); width:2px; height:2px; animation:starfieldTwinkle 3s ease-in-out infinite; }

#phase-connect { position:fixed; inset:0; background:#008080; display:none; align-items:center; justify-content:center; z-index:999; flex-direction:column; }
#phase-connect.active { display:flex; }
.connect-window { background:#c0c0c0; border-top:3px solid #fff; border-left:3px solid #fff; border-right:3px solid #404040; border-bottom:3px solid #404040; width:420px; max-width:95vw; }
.connect-status-wrap { padding:6px 12px; }
.connect-status { font-size:12px; font-family:Arial; color:#000; }
.connect-progress-wrap { margin:2px 12px 6px; height:14px; background:#fff; border-top:1px solid #404040; border-left:1px solid #404040; border-right:1px solid #fff; border-bottom:1px solid #fff; }
.connect-progress-fill { background:#000080; height:100%; width:0%; transition:width 0.5s; }

#phase-portal { display:none; min-height:100vh; }
#phase-portal.active { display:block; }

.aol-window { margin:6px auto; width:calc(100% - 12px); max-width:1100px; background:#F5F0E8; border-top:3px solid #fff; border-left:3px solid #fff; border-right:3px solid #404040; border-bottom:3px solid #404040; min-height:calc(100vh - 12px); }
.aol-menubar { background:#e8e8e8; border-bottom:1px solid #aaa; padding:1px 2px; display:flex; gap:0; font-size:12px; }
.aol-menu-item { padding:2px 10px; cursor:default; color:#000; border-radius:2px; transition:background 0.1s; }
.aol-menu-item:hover { background:#000080; color:#fff; }
.aol-toolbar { background:linear-gradient(to bottom,#6688aa,#4a6a8a); padding:3px 4px; display:flex; align-items:center; gap:3px; border-bottom:2px solid #335577; flex-wrap:wrap; }
.aol-logo-mark { display:flex; flex-direction:column; align-items:center; margin-right:6px; padding-right:6px; border-right:1px solid #808080; }
.aol-logo-triangle { width:0; height:0; border-left:10px solid transparent; border-right:10px solid transparent; border-bottom:18px solid #000080; position:relative; }
.aol-logo-triangle::after { content:''; position:absolute; top:4px; left:-5px; width:10px; height:10px; border-radius:50%; background:#fff; }
.aol-logo-label { font-size:7px; font-weight:bold; color:#000080; letter-spacing:1px; font-family:Arial; }
.toolbar-icon-btn { display:flex; flex-direction:column; align-items:center; background:#c8d8e8; border:1px solid #7799bb; border-radius:5px; padding:2px 8px; cursor:pointer; min-width:44px; transition:background 0.12s,box-shadow 0.12s,transform 0.1s; }
.toolbar-icon-btn:hover { background:#ddeeff; border-color:#4477aa; box-shadow:0 2px 8px rgba(0,0,150,0.25); transform:translateY(-1px); }
.toolbar-icon-btn:active { transform:translateY(0); box-shadow:none; background:#b8c8d8; }
.toolbar-icon-btn .ico { font-size:18px; }
.toolbar-icon-btn .lbl { font-size:9px; color:#222; white-space:nowrap; }
.aol-keyword-bar { background:#dde4ee; padding:3px 6px; display:flex; align-items:center; gap:6px; border-bottom:1px solid #aabbcc; font-size:11px; }
.keyword-field { flex:1; background:#fff; border:1px solid #9999bb; border-radius:3px; padding:2px 4px; font-size:11px; font-family:'Inter',Arial,sans-serif; color:#000; outline:none; }
.keyword-field:focus { border-color:#0000cc; box-shadow:0 0 4px rgba(0,0,200,0.2); }
.aol-keyword-bar .win-btn { background:#ccd4e4; border:1px solid #99aacc; border-radius:3px; color:#000; }
.aol-keyword-bar .win-btn:hover { background:#bbccdd; border-color:#6688aa; }
.aol-welcome-bar { background:linear-gradient(90deg,#996600 0%,#ffd700 20%,#ffe566 40%,#ffd700 60%,#ffb300 80%,#996600 100%); background-size:200% auto; border-top:2px solid #ffe066; border-left:2px solid #ffe066; border-right:2px solid #996600; border-bottom:2px solid #996600; border-radius:4px; padding:5px 10px; display:flex; align-items:center; gap:10px; margin:3px; animation:shimmer 3s linear infinite; }
.welcome-aol-logo { display:flex; flex-direction:column; align-items:center; }
.welcome-triangle { width:0; height:0; border-left:12px solid transparent; border-right:12px solid transparent; border-bottom:22px solid #000080; }
.welcome-america { font-size:7px; font-weight:bold; color:#000080; letter-spacing:1px; margin-top:1px; }
.welcome-online { font-family:Georgia,serif; font-style:italic; font-size:11px; color:#000080; font-weight:bold; }
.welcome-text-block { flex:1; }
.welcome-name { font-size:14px; font-weight:bold; color:#000080; font-family:'Lora',serif; }
.welcome-date { font-size:10px; color:#664400; }
.welcome-tagline { font-size:10px; color:#000080; font-style:italic; font-family:'Lora',serif; }
.aol-body { display:grid; grid-template-columns:160px 1fr 250px; min-height:calc(100vh - 130px); background:var(--cream); }

@media (max-width:680px) {
  .cd-wrap,.cd-disc { width:180px; height:180px; }
  .cd-hours { font-size:32px; }
  .cd-online { font-size:18px; }
  .connect-window { width:95vw; }
  .aol-body { grid-template-columns:1fr; }
  .aol-sidebar-right { display:none; }
  .toolbar-icon-btn .lbl { display:none; }
  .toolbar-icon-btn { padding:4px 6px; min-width:32px; }
  .toolbar-icon-btn .ico { font-size:16px; }
  .aol-logo-mark { display:none; }
  .services-grid { grid-template-columns:1fr; }
  .got-row { grid-template-columns:1fr 1fr; }
  .pulse-grid { grid-template-columns:1fr; }
}
@media (max-width:400px) {
  .cd-wrap,.cd-disc { width:150px; height:150px; }
  .cd-hours { font-size:26px; }
  .aol-keyword-bar { display:none; }
}
@media (max-width:900px) {
  .pulse-grid { grid-template-columns:1fr 1fr; }
}

.aol-sidebar-left { background:#000055; border-right:3px solid #FFD700; }
.sidebar-header { background:linear-gradient(to bottom,#050e3a,#080f45); color:#FFD700; font-size:10px; font-weight:bold; padding:8px; text-align:center; border-bottom:2px solid rgba(255,215,0,0.35); letter-spacing:2px; font-family:'Lora',serif; }
.sidebar-ch { display:block; color:#c8d8ff; font-size:11px; padding:7px 8px 7px 12px; text-decoration:none; border-bottom:1px solid rgba(255,255,255,0.08); cursor:pointer; font-family:'Inter',Arial,sans-serif; transition:background 0.15s,color 0.12s,padding-left 0.12s; }
.sidebar-ch:hover { background:#1e4da8; color:#FFD700; padding-left:16px; }
.sidebar-ch.active-ch { background:#0a3a9a; color:#FFD700; border-left:3px solid #FFD700; font-weight:600; }
.sidebar-ch .ch-arrow { color:#7799ee; margin-right:4px; }
.aol-center { padding:5px; overflow-y:auto; background:var(--cream); scrollbar-width:thin; scrollbar-color:#aabbcc #e8e4dc; }
.aol-panel { background:#fff; border:1px solid #c8c0b0; border-radius:4px; box-shadow:0 2px 10px rgba(0,0,0,0.12); margin-bottom:6px; overflow:hidden; }
.aol-panel > .title-bar { background:linear-gradient(to right,#000055,#1a6ecf); font-size:11px; box-shadow:none; }
.panel-body { padding:8px 10px; line-height:1.6; font-size:12px; font-family:'Inter',Arial,sans-serif; background:#fff; color:var(--txt-2); }
.panel-body p { color:var(--txt-2); }
.panel-body p strong { color:var(--txt); }
.panel-body h2,.panel-body h3 { font-family:'Lora',serif; font-weight:700; color:var(--navy); margin:8px 0 4px; }
.panel-body a { color:var(--blue-link); }
.panel-body a:hover { color:var(--red); }
.got-row { display:grid; grid-template-columns:1fr 1fr; gap:4px; padding:4px; }
.got-btn { background:linear-gradient(to bottom,#cc0000,#aa0000); border:1px solid #880000; border-radius:6px; padding:8px 6px; text-align:center; cursor:pointer; color:#fff; box-shadow:0 3px 10px rgba(150,0,0,0.3); transition:box-shadow 0.15s,transform 0.1s; }
.got-btn .got-icon { font-size:28px; display:block; margin-bottom:3px; }
.got-btn .got-label { font-size:10px; font-weight:bold; letter-spacing:0.5px; }
.got-btn .got-count { font-size:9px; color:#ffaaaa; }
.got-btn:hover { background:linear-gradient(to bottom,#ee1111,#cc0000); box-shadow:0 4px 16px rgba(200,0,0,0.45); transform:translateY(-1px); }
.services-grid { display:grid; grid-template-columns:1fr 1fr; gap:4px; padding:4px; }
.service-tile { background:#f4f0e8; border:1px solid #d0c8b8; border-radius:5px; padding:8px; cursor:pointer; box-shadow:inset 0 1px 0 rgba(255,255,255,0.8); transition:background 0.15s,border-color 0.15s,box-shadow 0.15s,transform 0.12s; }
.service-tile:hover { background:#e8eeff; border-color:#6688bb; box-shadow:0 3px 12px rgba(0,0,150,0.15); transform:translateY(-2px); }
.svc-ico { display:none; }
.svc-name { font-size:13px; font-weight:700; color:#000080; margin:4px 0 3px; font-family:'Lora',serif; }
.svc-desc { font-size:10px; color:var(--txt-3); }
.svc-price { display:inline-block; font-size:9px; color:#fff; background:#006600; font-weight:bold; margin-top:4px; padding:1px 5px; border-radius:3px; }
.big-cta { display:inline-flex; align-items:center; gap:10px; background:linear-gradient(135deg,#FFD700 0%,#FFA500 100%); color:#000080; border:2px solid #fff; border-bottom:3px solid #B8860B; border-right:3px solid #B8860B; border-radius:4px; font-family:'Arial',sans-serif; font-weight:bold; font-size:13px; letter-spacing:1px; padding:9px 22px; text-decoration:none; cursor:pointer; transition:all 0.12s; box-shadow:2px 2px 0 #8B6914, 0 4px 12px rgba(0,0,0,0.3); }
.big-cta:hover { background:linear-gradient(135deg,#FFE033 0%,#FFB733 100%); transform:translateY(-1px); box-shadow:3px 3px 0 #8B6914, 0 6px 16px rgba(0,0,0,0.35); }
.big-cta:active { transform:translateY(1px); box-shadow:1px 1px 0 #8B6914; }
.big-cta .env-icon { display:inline-block; width:22px; height:16px; position:relative; flex-shrink:0; }
.big-cta .env-body { width:22px; height:16px; background:#fff; border:1.5px solid #000080; border-radius:1px; position:absolute; top:0; left:0; }
.big-cta .env-flap { position:absolute; top:0; left:0; width:0; height:0; border-left:11px solid transparent; border-right:11px solid transparent; border-top:8px solid #000080; }
.big-cta .env-flag { position:absolute; top:-5px; right:-3px; width:6px; height:9px; background:#cc0000; border:1px solid #880000; border-radius:0 0 2px 2px; }
.big-cta .env-flag::after { content:''; position:absolute; top:0; left:50%; transform:translateX(-50%); width:0; height:0; border-left:3px solid transparent; border-right:3px solid transparent; border-bottom:4px solid #fff; }
.aol-sidebar-right { background:var(--tan); border-left:2px solid #a09070; border-top:2px solid #fff; border-right:2px solid #404040; border-bottom:2px solid #404040; }
.buddy-title-bar { background:linear-gradient(to right,#5a3a1a,#8b7355); color:#fff; font-size:11px; font-weight:bold; font-family:'Inter',sans-serif; padding:4px 6px; display:flex; justify-content:space-between; align-items:center; }
.buddy-section { background:var(--tan-2); font-size:10px; font-weight:700; font-family:'Inter',sans-serif; color:#3a2000; padding:3px 6px; border-bottom:1px solid #a09070; border-top:1px solid #a09070; }
.buddy-item { display:flex; align-items:center; gap:4px; padding:3px 6px; font-size:11px; font-family:'Courier New',monospace; color:#1a0a00; cursor:pointer; border-bottom:1px solid rgba(0,0,0,0.06); transition:background 0.1s; }
.buddy-item:hover { background:#000080; color:#fff; }
.buddy-dot { color:#00aa00; font-size:8px; display:inline-block; animation:buddyPulse 2s ease-in-out infinite; }
.buddy-divider { height:1px; background:#a09070; margin:4px 0; border:none; }
.buddy-footer { display:flex; justify-content:space-around; padding:4px; border-top:1px solid #a09070; gap:2px; }
.buddy-foot-btn { background:#C0B090; border:1px solid #a09070; border-radius:3px; padding:2px 4px; font-size:9px; cursor:pointer; text-align:center; flex:1; font-family:Arial,sans-serif; color:#000; transition:background 0.12s; }
.buddy-foot-btn:hover { background:#000080; color:#fff; border-color:#0000cc; }
.news-box { background:#faf6ee; border:1px solid #c8b898; border-radius:4px; margin:4px 5px; }
.news-box-title { background:linear-gradient(to right,#000055,#336699); color:#fff; font-size:11px; font-weight:bold; font-family:'Lora',serif; padding:3px 6px; border-radius:3px 3px 0 0; }
.news-box-body { padding:5px 7px; font-size:10px; line-height:1.6; color:#000; background:#faf6ee; }
.news-link { color:#0000cc; text-decoration:underline; cursor:pointer; }
.news-link:hover { color:#cc0000; }
.news-box-body a { color:#0000cc; }
.news-box-body a:hover { color:#cc0000; }
.aol-statusbar { background:#d8d0c0; border-top:1px solid #b0a890; padding:2px 0; font-size:10px; font-family:'Courier New',monospace; overflow:hidden; white-space:nowrap; border-bottom:2px solid #404040; box-shadow:inset 0 1px 0 rgba(255,255,255,0.8); color:#444; }
.status-marquee-track { display:inline-block; white-space:nowrap; animation:marqueeScroll 35s linear infinite; padding-left:8px; will-change:transform; }
.pulse-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:5px; padding:6px; }
.pulse-tile { background:#fafaf5; border:1px solid #d0c8b8; border-radius:4px; padding:8px 10px; font-size:11px; cursor:default; transition:border-color 0.15s,box-shadow 0.15s; }
.pulse-tile:hover { border-color:#0000cc; box-shadow:0 2px 10px rgba(0,0,150,0.12); }
.pulse-tile .tile-label { font-size:9px; font-weight:700; letter-spacing:0.1em; color:#000080; text-transform:uppercase; margin-bottom:4px; }
.pulse-tile .tile-value { font-size:12px; color:var(--txt); line-height:1.4; }
.pulse-tile a { color:var(--blue-link); }
.pulse-tile a:hover { color:var(--red); }
.trivia-option { display:block; background:#f0ede8; border:1px solid #c8c0b0; border-radius:3px; padding:3px 8px; font-size:10px; margin:2px 0; cursor:pointer; text-align:left; width:100%; font-family:Arial,sans-serif; color:#000; transition:background 0.12s; }
.trivia-option:hover { background:#dde8ff; border-color:#0000cc; }
.trivia-option.correct { background:#ccffcc; border-color:#006600; color:#006600; font-weight:bold; }
.trivia-option.wrong { background:#ffcccc; border-color:#cc0000; color:#cc0000; }
.trivia-score { font-size:10px; color:#000080; font-weight:bold; margin-top:4px; }
#game-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,128,0.8); z-index:500; align-items:center; justify-content:center; }
#game-overlay.active { display:flex; }
#game-win { background:#c0c0c0; border-top:3px solid #fff; border-left:3px solid #fff; border-right:3px solid #404040; border-bottom:3px solid #404040; }
#game-canvas { display:block; background:#000080; }
.game-tip { font-size:10px; text-align:center; padding:4px; }
#tilt-popup { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:900; align-items:center; justify-content:center; }
#tilt-popup.active { display:flex; }
.tilt-win { background:#c0c0c0; border:2px solid #fff; box-shadow:4px 4px 0 #000,0 0 30px rgba(0,0,150,0.2); min-width:300px; max-width:92vw; animation:popIn 0.3s ease; }
.tilt-body { padding:18px; text-align:center; }
.tilt-disc { width:88px; height:88px; border-radius:50%; background:radial-gradient(circle at 38% 32%,#4466cc,#0022aa 50%,#001188 100%); animation:spin 2s linear infinite; margin:0 auto 12px; position:relative; box-shadow:0 0 20px rgba(50,80,255,0.5); }
.tilt-disc::after { content:''; position:absolute; top:50%;left:50%; transform:translate(-50%,-50%); width:14px;height:14px; border-radius:50%; background:#111; border:1px solid #444; }
.tilt-title { font-size:17px; font-weight:900; color:#000080; font-family:Arial Black; margin-bottom:2px; }
.tilt-sub { font-size:11px; font-weight:bold; color:#cc0000; margin-bottom:10px; letter-spacing:1px; }
.tilt-body p { font-size:11px; margin-bottom:5px; line-height:1.5; color:#333; }
.tilt-cta { display:inline-block; background:#000080; color:var(--gold); font-size:12px; font-weight:bold; padding:7px 20px; text-decoration:none; border:2px solid #4444cc; border-radius:3px; letter-spacing:1px; margin-top:10px; }
.tilt-cta:hover { background:#0000aa; }
.glitch-overlay { position:fixed; inset:0; background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.2) 2px,rgba(0,0,0,0.2) 4px); pointer-events:none; z-index:9999; animation:glitch 0.5s ease-out forwards; }
.arcade-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:12px; padding:16px; max-width:700px; margin:0 auto; }
.arcade-card { background:#F5F0E8; border:2px solid #000066; border-radius:4px; padding:14px 10px; text-align:center; cursor:pointer; transition:transform 0.15s,box-shadow 0.15s; box-shadow:2px 2px 0 rgba(0,0,102,0.15); }
.arcade-card:hover { transform:translateY(-2px); box-shadow:3px 4px 0 rgba(0,0,102,0.25); border-color:#FFD700; }
.arcade-card .ac-icon { font-size:32px; margin-bottom:6px; }
.arcade-card .ac-name { font-family:'Lora',serif; font-size:13px; font-weight:700; color:#000066; margin-bottom:4px; }
.arcade-card .ac-desc { font-size:10px; color:#555; margin-bottom:8px; line-height:1.3; }
.arcade-card .ac-play { display:inline-block; background:#000066; color:#FFD700; font-size:10px; font-weight:600; padding:3px 14px; border-radius:2px; border:1px solid #4444cc; }
.arcade-card:hover .ac-play { background:#000099; }
.game-overlay-generic { display:none; position:fixed; inset:0; background:rgba(0,0,128,0.85); z-index:500; align-items:center; justify-content:center; }
.game-overlay-generic.active { display:flex; }
.game-overlay-generic .game-window { background:#c0c0c0; border-top:3px solid #fff; border-left:3px solid #fff; border-right:3px solid #404040; border-bottom:3px solid #404040; max-width:96vw; max-height:96vh; overflow:auto; }
.game-overlay-generic .game-window .title-bar { white-space:nowrap; }
.game-overlay-generic canvas { display:block; background:#000066; }
.game-overlay-generic .game-controls { font-size:10px; text-align:center; padding:4px 8px; color:#333; background:#d0d0d0; border-top:1px solid #808080; }
.ms-grid { display:inline-grid; gap:1px; background:#808080; border:2px inset #808080; }
.ms-cell { width:24px; height:24px; background:#c0c0c0; border:2px outset #e0e0e0; font-size:12px; font-weight:bold; display:flex; align-items:center; justify-content:center; cursor:pointer; user-select:none; font-family:'Courier New',monospace; }
.ms-cell.revealed { border:1px solid #808080; background:#d0d0d0; }
.ms-cell.flagged { border:2px outset #e0e0e0; }
.ms-cell.mine { background:#ff4444; }
.ms-c1{color:#0000ff}.ms-c2{color:#008000}.ms-c3{color:#ff0000}.ms-c4{color:#000080}.ms-c5{color:#800000}.ms-c6{color:#008080}
.sb-game-row { padding:4px 8px 3px; border-bottom:1px solid #1a1500; }
.sb-game-row:last-child { border-bottom:none; }
.sb-game-name { font-family:'Courier New',monospace; font-size:9px; font-weight:bold; color:#FFD700; letter-spacing:1px; text-transform:uppercase; margin-bottom:2px; }
.sb-score-row { display:flex; align-items:center; gap:4px; font-family:'Courier New',monospace; font-size:9px; line-height:1.5; }
.sb-medal { font-size:8px; width:12px; }
.sb-initials { color:#ffaa00; font-weight:bold; letter-spacing:1px; min-width:22px; }
.sb-score { color:#ffe066; }
.sb-empty { color:#332200; }
.sanity-news-item { padding:6px 10px; border-bottom:1px solid #e8e0cc; }
.sanity-news-item:last-child { border-bottom:none; }
.sanity-news-title { font-weight:bold; color:#000080; font-family:'Lora',serif; font-size:12px; }
.sanity-news-body { color:#333; font-size:10px; line-height:1.5; margin-top:2px; }
.sanity-news-date { font-size:9px; color:#888; margin-top:2px; }
`;

const AOL_HTML = `
<div id="phase-cd" onclick="startConnect()">
  <div class="cd-wrap">
    <div class="cd-disc">
      <div class="cd-sheen"></div>
      <div class="cd-text-wrap">
        <div class="cd-brand">Abearica</div>
        <div class="cd-online">Online</div>
        <div class="cd-hours">1000</div>
        <div class="cd-hours-label">HOURS FREE!</div>
        <div class="cd-free">For 45 Days · Sign On Today!</div>
      </div>
    </div>
  </div>
  <div class="cd-prompt">
    <div class="cd-title">▸ FREE 1,000 HOURS ◂</div>
    <div class="cd-sub">Abearica Online Version 9.0</div>
    <div class="cd-click blink">▶ CLICK TO INSTALL ◀</div>
  </div>
</div>

<div id="phase-connect">
  <div class="connect-window">
    <img src="/banner.png" style="width:100%;display:block;" alt="Connecting To Abearica Online..." onerror="this.style.display='none'">
    <div class="connect-status-wrap"><div class="connect-status" id="connect-status">Connecting using TCP/IP ...</div></div>
    <div class="connect-progress-wrap"><div class="connect-progress-fill" id="conn-progress"></div></div>
  </div>
</div>

<div id="phase-portal">
  <div class="aol-window">
    <div class="title-bar">
      <div style="display:flex;align-items:center;gap:6px;"><span>🌐</span><span>Abearica Online — Welcome Screen</span></div>
      <div><span class="title-bar-btn">_</span><span class="title-bar-btn">□</span><span class="title-bar-btn">✕</span></div>
    </div>
    <div class="aol-menubar">
      <span class="aol-menu-item">File</span><span class="aol-menu-item">Edit</span><span class="aol-menu-item">Window</span><span class="aol-menu-item">Sign Off</span><span class="aol-menu-item">Help</span><span class="aol-menu-item">Area Manager</span>
    </div>
    <div class="aol-toolbar">
      <div class="aol-logo-mark"><div class="aol-logo-triangle"></div><div class="aol-logo-label">ABEARICA</div></div>
      <div class="toolbar-icon-btn"><span class="ico">📖</span><span class="lbl">Read</span></div>
      <div class="toolbar-icon-btn"><span class="ico">✏️</span><span class="lbl">Write</span></div>
      <div class="toolbar-icon-btn"><span class="ico">📬</span><span class="lbl">Mail Center</span></div>
      <div class="toolbar-icon-btn"><span class="ico">🖨️</span><span class="lbl">Print</span></div>
      <div class="toolbar-icon-btn"><span class="ico">📁</span><span class="lbl">My Files</span></div>
      <div class="toolbar-icon-btn"><span class="ico">❤️</span><span class="lbl">My AOL</span></div>
      <div class="toolbar-icon-btn"><span class="ico">⭐</span><span class="lbl">Favorites</span></div>
      <div class="toolbar-icon-btn"><span class="ico">🌐</span><span class="lbl">Internet</span></div>
      <div class="toolbar-icon-btn"><span class="ico">📺</span><span class="lbl">Channels</span></div>
      <div class="toolbar-icon-btn"><span class="ico">👥</span><span class="lbl">People</span></div>
      <div class="toolbar-icon-btn" onclick="launchGame()"><span class="ico">🎮</span><span class="lbl">Games</span></div>
      <div style="width:1px;background:#808080;margin:2px 3px;align-self:stretch;"></div>
      <div class="toolbar-icon-btn" onclick="typeof refreshPulse==='function'&&refreshPulse()" id="refresh-btn" title="Refresh (F5)"><span class="ico">🔄</span><span class="lbl">Refresh</span></div>
    </div>
    <div class="aol-keyword-bar">
      <span style="font-size:10px;">Find</span>
      <input class="keyword-field" value="abearicaonline.com" placeholder="Type Keyword or Web Address here and click Go">
      <button class="win-btn">Go</button><button class="win-btn">Keyword</button>
    </div>
    <div class="aol-welcome-bar" style="margin:3px;">
      <div class="welcome-aol-logo"><div class="welcome-triangle"></div><div class="welcome-america">ABEARICA</div><div class="welcome-online">Online</div></div>
      <img src="/bear.png" style="width:40px;height:40px;border-radius:50%;border:2px solid #996600;object-fit:cover;" onerror="this.style.display='none'" alt="🐻">
      <div class="welcome-text-block">
        <div class="welcome-name">Welcome, Abearica! Last Logout: Today</div>
        <div class="welcome-date" id="portal-date">Loading date...</div>
        <div class="welcome-tagline">AI-Powered · Human-Tested · 23 Years in the Making</div>
      </div>
    </div>
    <div class="aol-body">
      <div class="aol-sidebar-left">
        <div class="sidebar-header">AOL® Channels</div>
        <div style="background:#0d2560;margin:6px 6px 0;border-radius:3px;overflow:hidden;border:1px solid rgba(100,140,255,0.2);">
          <a class="sidebar-ch active-ch" href="#" data-section="welcome" onclick="loadSection('welcome');return false;"><span class="ch-arrow">▸</span>Welcome</a>
          <a class="sidebar-ch" href="#" data-section="services" onclick="loadSection('services');return false;"><span class="ch-arrow">▸</span>Services</a>
          <a class="sidebar-ch" href="#" data-section="games" onclick="loadSection('games');return false;"><span class="ch-arrow">▸</span>Gaming 🕹️</a>
          <a class="sidebar-ch" href="#" data-section="contact" onclick="loadSection('contact');return false;"><span class="ch-arrow">▸</span>Contact</a>
          <a class="sidebar-ch" href="#" data-section="computing" onclick="loadSection('computing');return false;"><span class="ch-arrow">▸</span>Computing</a>
          <a class="sidebar-ch" href="#" data-section="workplace" onclick="loadSection('workplace');return false;"><span class="ch-arrow">▸</span>WorkPlace</a>
          <a class="sidebar-ch" href="#" data-section="research" onclick="loadSection('research');return false;"><span class="ch-arrow">▸</span>Research</a>
        </div>
        <div style="background:#000066;padding:6px 8px;margin-top:8px;font-size:9px;color:#88aaff;line-height:1.8;">⚡ 23 yrs IT exp<br>🤖 9 AI agents<br>🌐 20+ live sites<br>⏱ 48hr delivery<br>📍 Oregon</div>
      </div>
      <div class="aol-center">
        <div data-section-content="welcome">
          <div class="aol-panel" id="about" style="margin-bottom:5px;">
            <div class="title-bar" style="font-size:10px;"><span>🐻 Abearica Online — Today</span><div><span class="title-bar-btn">_</span><span class="title-bar-btn">□</span><span class="title-bar-btn">✕</span></div></div>
            <div class="got-row">
              <div class="got-btn" onclick="openInbox()" style="cursor:pointer;"><span class="got-icon">📬</span><span class="got-label">You've Got Projects!</span><span class="got-count">Start a conversation →</span></div>
              <div id="auth-signin-btn" class="got-btn" onclick="openScreenNameModal()" style="cursor:pointer;background:linear-gradient(to bottom,#000080,#000055);border-color:#4444cc;"><span class="got-icon">🪪</span><span class="got-label">Sign In / Join</span><span class="got-count">Free — takes 30 seconds →</span></div>
            </div>
          </div>
          <div id="sanity-news-panel" class="aol-panel" style="display:none;">
            <div class="title-bar" style="font-size:10px;"><span>📢 Latest News from Abearica Online</span><div><span class="title-bar-btn">_</span><span class="title-bar-btn">□</span><span class="title-bar-btn">✕</span></div></div>
            <div id="sanity-news-body" class="panel-body" style="padding:0;"></div>
          </div>
          <div class="aol-panel">
            <div class="title-bar" style="font-size:10px;"><span>📡 Daily Pulse — What's Happening Today</span><div><span class="title-bar-btn">_</span><span class="title-bar-btn">□</span><span class="title-bar-btn">✕</span></div></div>
            <div class="pulse-grid">
              <div class="pulse-tile" id="pulse-weather"><div class="tile-label"> Weather</div><div class="tile-value">Loading...</div></div>
              <div class="pulse-tile" id="pulse-news"><div class="tile-label">📰 Top Story</div><div class="tile-value">Loading...</div></div>
              <div class="pulse-tile" id="pulse-crypto"><div class="tile-label">₿ Crypto</div><div class="tile-value">Loading...</div></div>
              <div class="pulse-tile" id="pulse-sports" style="grid-row:span 2;"><div class="tile-label">🏆 Sports Today</div><div class="tile-value">Loading...</div></div>
              <div class="pulse-tile" id="pulse-horoscope"><div class="tile-label">♈ Horoscope</div><div class="tile-value">Loading...</div></div>
              <div class="pulse-tile" id="pulse-trivia" style="cursor:default;"><div class="tile-label">🎲 Daily Trivia</div><div class="tile-value" id="trivia-content">Loading...</div></div>
            </div>
          </div>
          <div class="aol-panel" id="today-in-tech">
            <div class="title-bar" style="font-size:10px;"><span>📅 On This Day in Tech</span><div><span class="title-bar-btn">_</span><span class="title-bar-btn">□</span><span class="title-bar-btn">✕</span></div></div>
            <div class="panel-body" style="font-size:11px;"><div id="on-this-day-content" style="line-height:1.7;color:#000;">Loading...</div></div>
          </div>
          <div class="aol-panel">
            <div class="title-bar" style="font-size:10px;"><span>C:\\ABEARICA\\about.txt</span><div><span class="title-bar-btn">_</span><span class="title-bar-btn">□</span><span class="title-bar-btn">✕</span></div></div>
            <div class="panel-body" style="font-size:11px;">
              <img src="/bear.png" style="float:left;width:72px;height:72px;object-fit:cover;margin:0 10px 6px 0;border-top:2px solid #fff;border-left:2px solid #fff;border-right:2px solid #404040;border-bottom:2px solid #404040;" onerror="this.style.display='none'" alt="🐻">
              <p><strong>I'm Tim — aka Abearica.</strong> 43 / M / Klamath Falls, Oregon. 23 years of enterprise IT — Active Directory, GSuite, MDM, VMware, networking. The full stack.</p>
              <p style="margin-top:6px;">Today I run a team of 9 AI agents that delivers what used to take agencies weeks — in hours. Serial entrepreneur. Father of two. Bass player. I never stop. I never give up.</p>
              <div style="clear:both;margin-top:8px;padding:5px 8px;background:#fffff0;border-top:1px solid #cccc99;border-left:1px solid #cccc99;border-right:1px solid #fff;border-bottom:1px solid #fff;font-family:'Courier New',monospace;font-size:10px;">
                C:\\ABEARICA&gt; whoami<br>IT veteran. AI builder. Oregon original. Never stops.<br>C:\\ABEARICA&gt; asl<br>43 / M / Klamath Falls, Oregon<br>C:\\ABEARICA&gt; <span class="blink">█</span>
              </div>
            </div>
          </div>
        </div>
        <div data-section-content="services" style="display:none;">
          <div class="aol-panel" id="services">
            <div class="title-bar" style="font-size:10px;"><span>C:\\ABEARICA\\services.txt</span><div><span class="title-bar-btn">_</span><span class="title-bar-btn">□</span><span class="title-bar-btn">✕</span></div></div>
            <div class="services-grid">
              <div class="service-tile"><div class="svc-name">AI Agent Architecture</div><div class="svc-desc">Custom multi-agent systems. Built, configured, handed to you running.</div><div class="svc-price">$2,500–$5,000 + $500–$1,500/mo</div></div>
              <div class="service-tile" onclick="window.open('https://abearicaonline.com/portfolio.html','_blank','noopener,noreferrer')" style="cursor:pointer;"><div class="svc-name">Website Design &amp; Dev</div><div class="svc-desc">Professional sites delivered in 48 hours.</div><div class="svc-price">48-hour delivery · <span style="color:#00d4ff;font-weight:bold;">View Portfolio →</span></div></div>
              <div class="service-tile"><div class="svc-name">IT Consulting</div><div class="svc-desc">Active Directory, GSuite, MDM, VMware, networking, security.</div><div class="svc-price">Hourly or retainer</div></div>
              <div class="service-tile"><div class="svc-name">Full Marketing Campaigns</div><div class="svc-desc">Ads, email, SMS, social, landing pages — complete campaigns.</div><div class="svc-price">Custom quote</div></div>
              <div class="service-tile"><div class="svc-name">Google Business Profile</div><div class="svc-desc">Complete setup and optimization. Show up when people search.</div><div class="svc-price">One-time setup</div></div>
              <div class="service-tile"><div class="svc-name">Monthly Support</div><div class="svc-desc">Ongoing updates, monitoring, and support. Hands-off for you.</div><div class="svc-price">Monthly retainer</div></div>
            </div>
          </div>
          <div class="aol-panel">
            <div class="title-bar" style="font-size:10px;"><span>C:\\ABEARICA\\hire.txt</span><div><span class="title-bar-btn">_</span><span class="title-bar-btn">□</span><span class="title-bar-btn">✕</span></div></div>
            <div class="panel-body" style="text-align:center;">
              <p style="font-size:12px;margin-bottom:10px;">Most projects quoted within 24 hours. Websites delivered in 48.</p>
              <a href="#" onclick="openWriteMail();return false;" class="big-cta"><span class="env-icon"><span class="env-body"></span><span class="env-flap"></span><span class="env-flag"></span></span>Start a Project</a>
              <p style="font-size:10px;color:#555;margin-top:8px;">hello@abearicaonline.com</p>
            </div>
          </div>
        </div>
        <div data-section-content="games" style="display:none;">
          <div class="aol-panel">
            <div class="title-bar" style="font-size:10px;"><span>🕹️ Abearica Online Gaming — The Arcade</span><div><span class="title-bar-btn">_</span><span class="title-bar-btn">□</span><span class="title-bar-btn">✕</span></div></div>
            <div class="panel-body" style="padding:10px 12px 6px;">
              <div style="font-size:15px;font-weight:bold;color:#000080;font-family:'Lora',serif;">Free Classic Games. No Download. No Login.</div>
              <div style="font-size:11px;color:#555;margin-top:2px;">7 games live now. More dropping every week. Compete for the leaderboard.</div>
            </div>
          </div>
          <div class="aol-panel">
            <div class="title-bar" style="font-size:10px;"><span>🎮 Arcade — Play Now</span><div><span class="title-bar-btn">_</span><span class="title-bar-btn">□</span><span class="title-bar-btn">✕</span></div></div>
            <div class="panel-body" style="padding:10px;">
              <div class="arcade-grid">
                <div class="arcade-card" onclick="launchGame()"><div class="ac-icon">🏓</div><div class="ac-name">Block RAID</div><div class="ac-desc">Raid the grid. Smash every block.</div><div class="ac-play">Play</div></div>
                <div class="arcade-card" onclick="launchMinesweeper()"><div class="ac-icon">💣</div><div class="ac-name">BugSweep</div><div class="ac-desc">Flag the bugs before they crash the system.</div><div class="ac-play">Play</div></div>
                <div class="arcade-card" onclick="launchTetris()"><div class="ac-icon">🧱</div><div class="ac-name">Block Drop</div><div class="ac-desc">Drop the blocks. Clear the lines.</div><div class="ac-play">Play</div></div>
                <div class="arcade-card" onclick="launchWordMuncher()"><div class="ac-icon">📖</div><div class="ac-name">Parse Munch</div><div class="ac-desc">Eat the correct words before the Troggles crash you.</div><div class="ac-play">Play</div></div>
                <div class="arcade-card" onclick="launchNumberMuncher()"><div class="ac-icon">🔢</div><div class="ac-name">BitCruncher</div><div class="ac-desc">Crunch the right bits.</div><div class="ac-play">Play</div></div>
                <div class="arcade-card" onclick="launchAsteroids()"><div class="ac-icon">🚀</div><div class="ac-name">Void Shred</div><div class="ac-desc">Rotate, thrust, shoot. Split rocks.</div><div class="ac-play">Play</div></div>
                <div class="arcade-card" onclick="launchPong()"><div class="ac-icon">🏸</div><div class="ac-name">Ping_</div><div class="ac-desc">Return the ping. First to 7 wins.</div><div class="ac-play">Play</div></div>
              </div>
            </div>
          </div>
          <div class="aol-panel">
            <div class="title-bar" style="font-size:10px;"><span>🏆 Arcade High Scores — All Games</span><div><span class="title-bar-btn">_</span><span class="title-bar-btn">□</span><span class="title-bar-btn">✕</span></div></div>
            <div class="panel-body" style="padding:10px;"><div id="arcade-scoreboard-body-main" style="min-height:60px;">Loading scores...</div></div>
          </div>
          <div class="aol-panel" id="news-informer">
            <div class="title-bar" style="font-size:10px;"><span>📰 The News Informer — Gaming &amp; Esports</span><div><span class="title-bar-btn">_</span><span class="title-bar-btn">□</span><span class="title-bar-btn">✕</span></div></div>
            <div class="panel-body" style="padding:0;">
              <div style="background:#000066;padding:10px 14px;border-bottom:3px solid #FFD700;text-align:center;">
                <div style="font-family:'Lora',serif;font-size:22px;font-weight:700;color:#FFD700;letter-spacing:3px;text-transform:uppercase;">The News Informer</div>
                <div style="font-family:'Courier New',monospace;font-size:9px;color:#aaaaff;letter-spacing:2px;margin-top:2px;">GAMING · ESPORTS · CULTURE · REVIEWS</div>
                <div id="ni-dateline" style="font-size:9px;color:#6666aa;margin-top:3px;font-family:'Courier New',monospace;"></div>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;min-height:200px;">
                <div style="padding:10px;border-right:1px solid #e8e0d0;"><div style="font-family:'Lora',serif;font-size:11px;font-weight:700;color:#000080;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #000066;padding-bottom:4px;margin-bottom:8px;">📰 Top Stories</div><div id="ni-stories" style="font-size:11px;line-height:1.6;"><div style="color:#aaa;font-size:10px;">Loading...</div></div></div>
                <div style="padding:10px;border-right:1px solid #e8e0d0;"><div style="font-family:'Lora',serif;font-size:11px;font-weight:700;color:#000080;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #cc0000;padding-bottom:4px;margin-bottom:8px;">🏆 Esports</div><div id="ni-esports" style="font-size:11px;line-height:1.6;"><div style="color:#aaa;font-size:10px;">Loading...</div></div></div>
                <div style="padding:10px;"><div style="font-family:'Lora',serif;font-size:11px;font-weight:700;color:#000080;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #006600;padding-bottom:4px;margin-bottom:8px;">🎮 Reviews &amp; Releases</div><div id="ni-reviews" style="font-size:11px;line-height:1.6;"><div style="color:#aaa;font-size:10px;">Loading...</div></div></div>
              </div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            <div class="aol-panel">
              <div class="title-bar" style="font-size:10px;"><span>📅 Coming Soon</span><div><span class="title-bar-btn">_</span><span class="title-bar-btn">□</span><span class="title-bar-btn">✕</span></div></div>
              <div class="panel-body" style="padding:8px 10px;font-size:11px;">
                <div style="margin-bottom:6px;padding-bottom:5px;border-bottom:1px solid #e8e0d0;display:flex;align-items:center;gap:6px;"><span style="font-size:18px;">🐍</span><div><div style="font-weight:bold;color:#000080;">Snake</div><div style="color:#555;font-size:10px;">Eat, grow, don't bite yourself.</div></div></div>
                <div style="margin-bottom:6px;padding-bottom:5px;border-bottom:1px solid #e8e0d0;display:flex;align-items:center;gap:6px;"><span style="font-size:18px;">🃏</span><div><div style="font-weight:bold;color:#000080;">Solitaire</div><div style="color:#555;font-size:10px;">Classic Klondike.</div></div></div>
                <div style="margin-bottom:6px;padding-bottom:5px;border-bottom:1px solid #e8e0d0;display:flex;align-items:center;gap:6px;"><span style="font-size:18px;">🔵</span><div><div style="font-weight:bold;color:#000080;">Connect Four</div><div style="color:#555;font-size:10px;">Drop discs. Get four in a row.</div></div></div>
                <div style="display:flex;align-items:center;gap:6px;"><span style="font-size:18px;">🎯</span><div><div style="font-weight:bold;color:#000080;">Oregon Trail</div><div style="color:#555;font-size:10px;">You have died of dysentery.</div></div></div>
              </div>
            </div>
          </div>
        </div>
        <div data-section-content="contact" style="display:none;">
          <div class="aol-panel">
            <div class="title-bar" style="font-size:10px;"><span>📬 Contact Abearica — Write Mail</span><div><span class="title-bar-btn">_</span><span class="title-bar-btn">□</span><span class="title-bar-btn">✕</span></div></div>
            <div class="panel-body" style="text-align:center;padding:24px;">
              <div style="font-size:36px;margin-bottom:12px;">📬</div>
              <div style="font-size:16px;font-weight:bold;color:#000080;font-family:'Lora',serif;margin-bottom:8px;">You've Got Questions?</div>
              <p style="font-size:12px;margin-bottom:6px;">Most projects quoted within 24 hours. Websites delivered in 48.</p>
              <p style="font-size:11px;color:#555;margin-bottom:20px;">hello@abearicaonline.com · Oregon · AI-Powered</p>
              <a href="#" onclick="openWriteMail();return false;" class="big-cta">[ WRITE MAIL ]</a>
            </div>
          </div>
        </div>
        <div data-section-content="computing" style="display:none;">
          <div class="aol-panel">
            <div class="title-bar" style="font-size:10px;"><span>🖥️ Computing — IT Services &amp; Infrastructure</span><div><span class="title-bar-btn">_</span><span class="title-bar-btn">□</span><span class="title-bar-btn">✕</span></div></div>
            <div class="panel-body">
              <p style="margin-bottom:10px;"><strong>23 years of enterprise IT.</strong> Not theory — real infrastructure, real scale.</p>
              <div class="services-grid">
                <div class="service-tile"><div class="svc-name">Active Directory</div><div class="svc-desc">300+ user environments. Group policy, permissions, SSO.</div></div>
                <div class="service-tile"><div class="svc-name">GSuite / Google Workspace</div><div class="svc-desc">Enterprise setup, migration, admin.</div></div>
                <div class="service-tile"><div class="svc-name">MDM — Cisco Meraki</div><div class="svc-desc">500+ device fleet management.</div></div>
                <div class="service-tile"><div class="svc-name">VMware &amp; Virtualization</div><div class="svc-desc">vSphere, ESXi, VM provisioning.</div></div>
                <div class="service-tile"><div class="svc-name">Network Infrastructure</div><div class="svc-desc">Switching, routing, VLANs, VPN, firewall.</div></div>
                <div class="service-tile"><div class="svc-name">Security Hardening</div><div class="svc-desc">Audit, patch, harden. Endpoint protection.</div></div>
              </div>
              <div style="text-align:center;margin-top:12px;"><a href="#" onclick="openWriteMail();return false;" class="big-cta"><span class="env-icon"><span class="env-body"></span><span class="env-flap"></span><span class="env-flag"></span></span>Get a Quote</a></div>
            </div>
          </div>
        </div>
        <div data-section-content="workplace" style="display:none;">
          <div class="aol-panel">
            <div class="title-bar" style="font-size:10px;"><span>💼 WorkPlace — AI for Business</span><div><span class="title-bar-btn">_</span><span class="title-bar-btn">□</span><span class="title-bar-btn">✕</span></div></div>
            <div class="panel-body">
              <p style="margin-bottom:10px;"><strong>AI agents built for how your business actually works.</strong></p>
              <div class="services-grid">
                <div class="service-tile"><div class="svc-name">Multi-Agent Architecture</div><div class="svc-desc">9-agent systems that handle marketing, trading, monitoring — 24/7.</div><div class="svc-price">$2,500–$5,000 setup</div></div>
                <div class="service-tile"><div class="svc-name">AI Marketing Automation</div><div class="svc-desc">Ads, email, SMS, social — fully automated campaigns.</div><div class="svc-price">Custom quote</div></div>
                <div class="service-tile"><div class="svc-name">48-Hour Website Delivery</div><div class="svc-desc">Professional sites designed, built, and deployed.</div><div class="svc-price">48-hour turnaround</div></div>
                <div class="service-tile"><div class="svc-name">Monthly AI Retainer</div><div class="svc-desc">Ongoing agent ops, maintenance, new automations.</div><div class="svc-price">$500–$1,500/mo</div></div>
              </div>
              <div style="text-align:center;margin-top:12px;"><a href="#" onclick="openWriteMail();return false;" class="big-cta"><span class="env-icon"><span class="env-body"></span><span class="env-flap"></span><span class="env-flag"></span></span>Start a Project</a></div>
            </div>
          </div>
        </div>
        <div data-section-content="research" style="display:none;">
          <div class="aol-panel">
            <div class="title-bar" style="font-size:10px;"><span>🔬 Research — Tech &amp; AI Intel</span><div><span class="title-bar-btn">_</span><span class="title-bar-btn">□</span><span class="title-bar-btn">✕</span></div></div>
            <div class="panel-body">
              <p style="margin-bottom:10px;"><strong>Staying current is part of the job.</strong></p>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
                <div class="service-tile"><div class="svc-name">OpenClaw</div><div class="svc-desc">Multi-agent infrastructure. What powers the 9-agent clan.</div></div>
                <div class="service-tile"><div class="svc-name">Anthropic / Claude</div><div class="svc-desc">Primary AI backbone.</div></div>
                <div class="service-tile"><div class="svc-name">Vercel</div><div class="svc-desc">20+ sites deployed here.</div></div>
                <div class="service-tile"><div class="svc-name">Supabase</div><div class="svc-desc">Postgres backend. Leaderboards, contact forms.</div></div>
                <div class="service-tile"><div class="svc-name">Fal.ai</div><div class="svc-desc">FLUX-2 image generation.</div></div>
                <div class="service-tile"><div class="svc-name">Cloudflare</div><div class="svc-desc">DNS, email routing, CDN across 20+ domains.</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="aol-sidebar-right">
        <div class="buddy-title-bar"><span>🟢 Buddy List</span><span class="title-bar-btn" style="font-size:8px;">✕</span></div>
        <div class="buddy-section">Online Now (9/9)</div>
        <div class="buddy-item"><span class="buddy-dot">●</span>Abearica</div>
        <div class="buddy-item"><span class="buddy-dot">●</span>BearMaster3K</div>
        <div class="buddy-item"><span class="buddy-dot">●</span>DialUp_Dave</div>
        <div class="buddy-item"><span class="buddy-dot">●</span>PacificNW_Tim</div>
        <div class="buddy-item"><span class="buddy-dot">●</span>PNW_Bear99</div>
        <div class="buddy-item"><span class="buddy-dot">●</span>BassBoy99</div>
        <div class="buddy-item"><span class="buddy-dot">●</span>AgentX_AI</div>
        <div class="buddy-item"><span class="buddy-dot">●</span>RetroRobot</div>
        <div class="buddy-item"><span class="buddy-dot">●</span>CodeBear_OR</div>
        <div class="buddy-divider"></div>
        <div class="buddy-footer"><div class="buddy-foot-btn">Locate</div><div class="buddy-foot-btn">IM</div><div class="buddy-foot-btn">Chat</div></div>
        <div id="arcade-scoreboard-box" style="margin:6px 5px;background:#0a0a0a;border:2px solid #333;border-radius:4px;overflow:hidden;">
          <div style="background:linear-gradient(to right,#1a0a00,#3a1a00);padding:5px 8px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #3a2a00;"><span style="font-family:'Courier New',monospace;font-size:11px;font-weight:bold;color:#FFD700;letter-spacing:2px;">🏆 ARCADE SCOREBOARD</span><span style="font-family:'Courier New',monospace;font-size:8px;color:#aa7700;letter-spacing:1px;">TOP 3</span></div>
          <div id="arcade-scoreboard-body" style="padding:4px 0;"><div style="padding:8px;font-family:'Courier New',monospace;font-size:9px;color:#554400;text-align:center;">LOADING...</div></div>
          <div style="padding:4px 6px;border-top:1px solid #1a1a00;text-align:center;"><button onclick="loadSection('games')" style="background:transparent;border:1px solid #3a2a00;color:#aa7700;font-family:'Courier New',monospace;font-size:8px;padding:2px 8px;cursor:pointer;border-radius:2px;letter-spacing:1px;" onmouseover="this.style.borderColor='#FFD700';this.style.color='#FFD700'" onmouseout="this.style.borderColor='#3a2a00';this.style.color='#aa7700'">PLAY NOW →</button></div>
        </div>
        <div class="news-box" style="margin-top:4px;"><div class="news-box-title">📰 Top News</div><div class="news-box-body"><div class="news-link">AI Agents Replace Agency Teams</div><div class="news-link" style="margin-top:3px;">Oregon IT Vet Builds 9-Agent System</div></div></div>
        <div class="news-box"><div class="news-box-title"> My Weather</div><div class="news-box-body">Oregon<br><span id="weather-temp">Loading...</span></div></div>
        <div class="news-box"><div class="news-box-title">📌 My Places</div><div class="news-box-body"><div class="news-link" onclick="launchGame()">Play Block RAID</div><div class="news-link" style="margin-top:2px;"><a href="#" onclick="openWriteMail();return false;" style="color:#0000cc;">Hire Abearica</a></div><div style="margin-top:4px;font-size:9px;color:#666;">Keyword: abearicaonline</div></div></div>
      </div>
    </div>
    <div class="aol-statusbar">
      <div class="status-marquee-track">🌐 Abearica Online v9.0 &nbsp;·&nbsp; ⚡ 23 Years IT Experience &nbsp;·&nbsp; 🤖 9 AI Agents Online &nbsp;·&nbsp; ⏱ 48hr Website Delivery &nbsp;·&nbsp; 🎮 Play Arcade Games &nbsp;·&nbsp; 📧 hello@abearicaonline.com &nbsp;·&nbsp; 💻 AI-Powered Solutions &nbsp;·&nbsp; 🚀 Full-Stack Infrastructure &nbsp;·&nbsp; 🌐 Abearica Online v9.0 &nbsp;·&nbsp; ⚡ 23 Years IT Experience &nbsp;·&nbsp; 🤖 9 AI Agents Online &nbsp;·&nbsp; ⏱ 48hr Website Delivery &nbsp;·&nbsp; 🎮 Play Arcade Games &nbsp;·&nbsp; 📧 hello@abearicaonline.com &nbsp;·&nbsp; 💻 AI-Powered Solutions &nbsp;·&nbsp; 🚀 Full-Stack Infrastructure &nbsp;·&nbsp;</div>
    </div>
  </div>
</div>

<div id="game-overlay"><div id="game-win"><div class="title-bar"><span>🎮 Block RAID — Abearica Online Arcade</span><div><span class="title-bar-btn" onclick="closeGame()">✕</span></div></div><canvas id="game-canvas" width="400" height="280"></canvas><div class="game-tip">Arrow keys or swipe to move · Break all bricks!</div></div></div>
<div id="minesweeper-overlay" class="game-overlay-generic"><div class="game-window"><div class="title-bar"><span>💣 BugSweep — Abearica Online Arcade</span><div><span class="title-bar-btn" onclick="closeMinesweeper()">✕</span></div></div><div style="padding:8px;text-align:center;"><div id="ms-status" style="font-size:12px;font-weight:bold;color:#000080;margin-bottom:6px;">Mines: 10 | Click to reveal, right-click to flag</div><div id="ms-board" style="display:inline-block;"></div><div style="margin-top:6px;"><button class="win-btn" onclick="initMinesweeper()">New Game</button><button class="win-btn" onclick="closeMinesweeper()">Close</button></div></div><div class="game-controls">Left click: reveal · Right click: flag</div></div></div>
<div id="tetris-overlay" class="game-overlay-generic"><div class="game-window"><div class="title-bar"><span>🧱 Block Drop — Abearica Online Arcade</span><div><span class="title-bar-btn" onclick="closeTetris()">✕</span></div></div><canvas id="tetris-canvas" width="240" height="400"></canvas><div class="game-controls">← → Move · ↑ Rotate · ↓ Soft drop · Space: Hard drop</div><div style="text-align:center;padding:4px;"><button class="win-btn" onclick="closeTetris()">Close</button></div></div></div>
<div id="wordmuncher-overlay" class="game-overlay-generic"><div class="game-window"><div class="title-bar"><span>📖 Parse Munch — Abearica Online Arcade</span><div><span class="title-bar-btn" onclick="closeWordMuncher()">✕</span></div></div><canvas id="wordmuncher-canvas" width="360" height="320"></canvas><div class="game-controls">Arrow keys: move · Space: eat</div><div style="text-align:center;padding:4px;"><button class="win-btn" onclick="closeWordMuncher()">Close</button></div></div></div>
<div id="numbermuncher-overlay" class="game-overlay-generic"><div class="game-window"><div class="title-bar"><span>🔢 BitCruncher — Abearica Online Arcade</span><div><span class="title-bar-btn" onclick="closeNumberMuncher()">✕</span></div></div><canvas id="numbermuncher-canvas" width="360" height="320"></canvas><div class="game-controls">Arrow keys: move · Space: eat</div><div style="text-align:center;padding:4px;"><button class="win-btn" onclick="closeNumberMuncher()">Close</button></div></div></div>
<div id="asteroids-overlay" class="game-overlay-generic"><div class="game-window"><div class="title-bar"><span>🚀 Void Shred — Abearica Online Arcade</span><div><span class="title-bar-btn" onclick="closeAsteroids()">✕</span></div></div><canvas id="asteroids-canvas" width="400" height="400"></canvas><div class="game-controls">← → Rotate · ↑ Thrust · Space: Shoot · H: Hyperspace</div><div style="text-align:center;padding:4px;"><button class="win-btn" onclick="closeAsteroids()">Close</button></div></div></div>
<div id="pong-overlay" class="game-overlay-generic"><div class="game-window"><div class="title-bar"><span>🏸 Ping_ — Abearica Online Arcade</span><div><span class="title-bar-btn" onclick="closePong()">✕</span></div></div><canvas id="pong-canvas" width="400" height="280"></canvas><div class="game-controls">↑ ↓ or W/S: Move paddle · First to 7 wins!</div><div style="text-align:center;padding:4px;"><button class="win-btn" onclick="closePong()">Close</button></div></div></div>

<div id="tilt-popup"><div class="tilt-win"><div class="title-bar"><span>🌐 AbearicaOnline.com — Special Offer!</span><div><span class="title-bar-btn" onclick="closeTilt()">✕</span></div></div><div class="tilt-body"><div class="tilt-disc"></div><div class="tilt-title">Abearica Online</div><div class="tilt-sub">FREE CONSULTATION — LIMITED TIME!</div><p><strong>AI Agents built for your business.</strong></p><p>Tim · 23 years IT · Oregon</p><div><a href="#" onclick="openWriteMail();return false;" class="big-cta" style="font-size:12px;padding:7px 18px;"><span class="env-icon"><span class="env-body"></span><span class="env-flap"></span><span class="env-flag"></span></span>Start a Project</a></div><div style="margin-top:10px;display:flex;justify-content:center;gap:8px;"><button class="win-btn" onclick="closeTilt()">Close</button><button class="win-btn" onclick="closeTilt()">Remind Me Later</button></div></div></div></div>

<div id="inbox-overlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,128,0.75);z-index:9998;align-items:center;justify-content:center;"><div style="background:#c0c0c0;border-top:3px solid #fff;border-left:3px solid #fff;border-right:3px solid #404040;border-bottom:3px solid #404040;width:520px;max-width:96vw;font-family:Arial,sans-serif;"><div style="background:linear-gradient(to right,#000055,#1a6ecf);color:#fff;padding:3px 6px;display:flex;align-items:center;justify-content:space-between;"><div style="display:flex;align-items:center;gap:6px;"><span style="font-size:13px;">📬</span><span style="font-size:11px;font-weight:bold;">Abearica Online Mail — Inbox</span></div><span onclick="closeInbox()" class="title-bar-btn" style="cursor:pointer;">✕</span></div><div style="background:#d4d0c8;border-bottom:1px solid #808080;padding:3px 6px;display:flex;gap:4px;align-items:center;"><button onclick="openWriteMail();closeInbox();" style="background:#c0c0c0;border-top:2px solid #fff;border-left:2px solid #fff;border-right:2px solid #404040;border-bottom:2px solid #404040;padding:2px 10px;font-size:11px;cursor:pointer;">✏️ Compose</button><div style="width:1px;background:#808080;height:16px;margin:0 3px;"></div><span style="font-size:10px;color:#444;">To: abearica@abearicaonline.com</span></div><div style="background:#ece9d8;border-bottom:1px solid #aca899;display:flex;gap:0;font-size:11px;"><div style="padding:4px 14px;background:#fff;border-right:1px solid #aca899;border-bottom:2px solid #fff;margin-bottom:-1px;font-weight:bold;color:#000080;">📥 Inbox (0)</div><div style="padding:4px 14px;color:#555;border-right:1px solid #aca899;cursor:pointer;">📤 Sent</div><div style="padding:4px 14px;color:#555;cursor:pointer;">🗑️ Trash</div></div><div style="background:#fff;min-height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;border-bottom:1px solid #d0d0d0;"><div style="font-size:40px;margin-bottom:10px;">📭</div><div style="font-size:14px;font-weight:bold;color:#000080;font-family:'Lora',serif;margin-bottom:6px;">Your inbox is empty.</div><div style="font-size:11px;color:#555;margin-bottom:16px;max-width:300px;line-height:1.6;">Send Abearica a message about your project.</div><button onclick="openWriteMail();closeInbox();" style="background:linear-gradient(to bottom,#000080,#000055);color:#FFD700;border:none;padding:8px 24px;font-size:12px;font-weight:bold;font-family:Arial,sans-serif;cursor:pointer;letter-spacing:1px;border-radius:2px;">📨 Send Abearica a Message</button></div><div style="background:#d4d0c8;padding:6px 10px;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#444;border-top:1px solid #fff;"><span>0 messages · 0 unread</span><div style="display:flex;gap:6px;"><button onclick="openScreenNameModal();closeInbox();" style="background:#c0c0c0;border-top:2px solid #fff;border-left:2px solid #fff;border-right:2px solid #404040;border-bottom:2px solid #404040;padding:2px 8px;font-size:10px;cursor:pointer;">🪪 Get a Screen Name</button><button onclick="closeInbox()" style="background:#c0c0c0;border-top:2px solid #fff;border-left:2px solid #fff;border-right:2px solid #404040;border-bottom:2px solid #404040;padding:2px 8px;font-size:10px;cursor:pointer;">Close</button></div></div></div></div>

<style>#screenname-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,20,0.82);backdrop-filter:blur(6px);z-index:9998;align-items:center;justify-content:center;}
#auth-card{background:rgba(10,10,40,0.92);border:1px solid rgba(255,255,255,0.12);border-radius:16px;width:380px;max-width:94vw;box-shadow:0 24px 80px rgba(0,0,0,0.7),0 0 0 1px rgba(255,215,0,0.08);overflow:hidden;font-family:'Inter',Arial,sans-serif;}
#auth-card-header{background:linear-gradient(135deg,#000066 0%,#001a99 100%);padding:20px 24px 16px;text-align:center;position:relative;border-bottom:1px solid rgba(255,215,0,0.15);}
#auth-card-header .close-x{position:absolute;top:12px;right:14px;background:rgba(255,255,255,0.1);border:none;color:#aaa;width:26px;height:26px;border-radius:50%;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:all 0.15s;}
#auth-card-header .close-x:hover{background:rgba(220,0,0,0.7);color:#fff;}
#auth-logo{width:52px;height:52px;margin:0 auto 10px;background:linear-gradient(135deg,#FFD700,#FFA500);border-radius:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(255,215,0,0.3);}
#auth-logo svg{width:28px;height:28px;fill:#000066;}
#auth-card-header h2{color:#fff;font-size:17px;font-weight:700;letter-spacing:0.3px;margin:0 0 3px;}
#auth-card-header p{color:rgba(255,255,255,0.5);font-size:11px;margin:0;}
#auth-tabs{display:flex;background:rgba(0,0,0,0.3);border-bottom:1px solid rgba(255,255,255,0.08);}
#auth-tabs button{flex:1;background:none;border:none;padding:11px;font-size:12px;font-weight:600;color:rgba(255,255,255,0.45);cursor:pointer;transition:all 0.15s;letter-spacing:0.3px;}
#auth-tabs button.active{color:#FFD700;border-bottom:2px solid #FFD700;}
#auth-tabs button:hover:not(.active){color:rgba(255,255,255,0.75);}
#auth-card-body{padding:20px 24px 16px;}
.auth-label{display:block;font-size:11px;font-weight:600;color:rgba(255,255,255,0.55);letter-spacing:0.5px;text-transform:uppercase;margin-bottom:5px;}
.auth-input{width:100%;box-sizing:border-box;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:10px 12px;font-size:13px;color:#fff;font-family:'Inter',Arial,sans-serif;outline:none;transition:border 0.15s;}
.auth-input:focus{border-color:rgba(255,215,0,0.5);background:rgba(255,255,255,0.1);}
.auth-input::placeholder{color:rgba(255,255,255,0.25);}
.auth-field{margin-bottom:14px;}
.auth-hint{font-size:10px;color:rgba(255,255,255,0.3);margin-top:4px;}
.auth-status{font-size:11px;min-height:16px;margin-bottom:10px;padding:6px 10px;border-radius:6px;display:none;}
.auth-status.error{display:block;background:rgba(220,0,0,0.15);border:1px solid rgba(220,0,0,0.3);color:#ff8080;}
.auth-status.success{display:block;background:rgba(0,180,80,0.15);border:1px solid rgba(0,180,80,0.3);color:#80ffb0;}
.auth-submit{width:100%;background:linear-gradient(135deg,#FFD700 0%,#FFA500 100%);color:#000066;border:none;border-radius:8px;padding:11px;font-size:13px;font-weight:700;cursor:pointer;letter-spacing:0.5px;transition:all 0.15s;margin-top:4px;}
.auth-submit:hover{background:linear-gradient(135deg,#FFE033 0%,#FFB733 100%);box-shadow:0 4px 20px rgba(255,215,0,0.3);}
.auth-submit:active{transform:translateY(1px);}
.auth-footer{padding:12px 24px 16px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);}
.auth-footer a,.auth-footer span[onclick]{font-size:11px;color:rgba(255,215,0,0.7);cursor:pointer;text-decoration:none;}
.auth-footer a:hover,.auth-footer span[onclick]:hover{color:#FFD700;}</style>
<div id="screenname-overlay">
  <div id="auth-card">
    <div id="auth-card-header">
      <button class="close-x" onclick="closeScreenNameModal()">✕</button>
      <div id="auth-logo"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></div>
      <h2 id="auth-modal-title">Abearica Online</h2>
      <p>Members get more</p>
    </div>
    <div id="auth-tabs">
      <button id="tab-signin" class="active" onclick="switchAuthTab('signin')">Sign In</button>
      <button id="tab-signup" onclick="switchAuthTab('signup')">Create Account</button>
    </div>
    <div id="auth-card-body">
      <div id="auth-signin-form">
        <div class="auth-field"><label class="auth-label">Email</label><input id="si-email" class="auth-input" type="email" placeholder="you@email.com"></div>
        <div class="auth-field"><label class="auth-label">Password</label><input id="si-password" class="auth-input" type="password" placeholder="••••••••" onkeydown="if(event.key==='Enter')doSignIn()"></div>
        <div id="si-status" class="auth-status"></div>
        <button class="auth-submit" onclick="doSignIn()">Sign In</button>
      </div>
      <div id="auth-signup-form" style="display:none;">
        <div class="auth-field"><label class="auth-label">Screen Name</label><input id="su-screenname" class="auth-input" type="text" maxlength="20" placeholder="CoolBear99"><div class="auth-hint">3–20 chars · letters, numbers, underscores</div></div>
        <div class="auth-field"><label class="auth-label">Email</label><input id="su-email" class="auth-input" type="email" placeholder="you@email.com"></div>
        <div class="auth-field"><label class="auth-label">Password</label><input id="su-password" class="auth-input" type="password" placeholder="Min 6 characters" onkeydown="if(event.key==='Enter')doSignUp()"></div>
        <div id="su-status" class="auth-status"></div>
        <button class="auth-submit" onclick="doSignUp()">Create Account</button>
      </div>
    </div>
    <div class="auth-footer">
      <span onclick="doForgotPassword()">Forgot password?</span>
    </div>
  </div>
</div>

<div id="writemail-overlay" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;font-family:'MS Sans Serif',Arial,sans-serif;"><div style="background:#c0c0c0;border:2px solid;border-color:#ffffff #808080 #808080 #ffffff;box-shadow:2px 2px 0 #000;width:480px;max-width:96vw;user-select:none;"><div style="background:linear-gradient(90deg,#000080,#1084d0);padding:3px 6px;display:flex;align-items:center;justify-content:space-between;cursor:default;"><div style="display:flex;align-items:center;gap:6px;"><img src="/bear.png" style="width:16px;height:16px;image-rendering:pixelated;" alt=""><span style="color:#fff;font-size:12px;font-weight:bold;font-family:'MS Sans Serif',Arial,sans-serif;">Write Mail</span></div><div style="display:flex;gap:2px;"><button onclick="closeWriteMail()" style="width:16px;height:14px;background:#c0c0c0;border:1px solid;border-color:#fff #808080 #808080 #fff;font-size:9px;cursor:pointer;padding:0;line-height:1;">✕</button></div></div><div style="background:#c0c0c0;border-bottom:1px solid #808080;padding:4px 6px;display:flex;gap:4px;"><button id="wm-send-btn" onclick="sendWriteMail()" style="background:#c0c0c0;border:2px solid;border-color:#fff #808080 #808080 #fff;font-family:'MS Sans Serif',Arial,sans-serif;font-size:11px;padding:2px 10px;cursor:pointer;">Send</button><button onclick="closeWriteMail()" style="background:#c0c0c0;border:2px solid;border-color:#fff #808080 #808080 #fff;font-family:'MS Sans Serif',Arial,sans-serif;font-size:11px;padding:2px 10px;cursor:pointer;">Cancel</button></div><div style="padding:8px 10px 4px;border-bottom:1px solid #808080;"><table style="width:100%;border-collapse:collapse;font-size:12px;"><tr><td style="width:55px;color:#000;padding:3px 4px 3px 0;vertical-align:middle;font-weight:bold;">To:</td><td><div style="background:#c0c0c0;border:2px solid;border-color:#808080 #fff #fff #808080;padding:2px 6px;color:#000;font-size:12px;">Abearica (abearicaonline.com)</div></td></tr><tr><td style="color:#000;padding:3px 4px 3px 0;vertical-align:middle;font-weight:bold;">From:</td><td><input id="wm-from" type="email" placeholder="your@email.com" style="width:100%;box-sizing:border-box;background:#fff;border:2px solid;border-color:#808080 #fff #fff #808080;padding:2px 6px;font-family:'MS Sans Serif',Arial,sans-serif;font-size:12px;outline:none;"></td></tr><tr><td style="color:#000;padding:3px 4px 3px 0;vertical-align:middle;font-weight:bold;">Subject:</td><td><select id="wm-subject" style="width:100%;background:#fff;border:2px solid;border-color:#808080 #fff #fff #808080;padding:2px 4px;font-family:'MS Sans Serif',Arial,sans-serif;font-size:12px;outline:none;"><option value="">-- Select a subject --</option><option value="I want AI agents built">I want AI agents built</option><option value="Website / IT help">Website / IT help</option><option value="Just curious">Just curious</option><option value="Something else">Something else</option></select></td></tr></table></div><div style="padding:6px 10px;"><textarea id="wm-message" placeholder="Type your message here..." style="width:100%;height:140px;box-sizing:border-box;background:#fff;border:2px solid;border-color:#808080 #fff #fff #808080;padding:6px;font-family:'MS Sans Serif',Arial,sans-serif;font-size:12px;resize:vertical;outline:none;"></textarea></div><div style="padding:0 10px 8px;font-size:12px;min-height:18px;"><span id="wm-status"></span></div></div></div>
`;
