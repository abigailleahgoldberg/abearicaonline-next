
/* ============ SUPABASE LEADERBOARD ============ */
const SB_URL = 'https://ipvhaomxpgwtqmlbigdv.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwdmhhb214cGd3dHFtbGJpZ2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMzc3MDcsImV4cCI6MjA4OTcxMzcwN30.XO4ZegjViPbFw5py9apcyHq2vWmiaGkv08f9hITnL9w';

const ARCADE_GAME_NAMES = {
  'breakout':'Block RAID','minesweeper':'BugSweep','tetris':'Block Drop',
  'word-muncher':'Parse Munch','number-muncher':'BitCruncher',
  'asteroids':'Void Shred','pong':'Ping_'
};
const ARCADE_GAME_ICONS = {
  'breakout':'🏓','minesweeper':'💣','tetris':'🧱',
  'word-muncher':'📖','number-muncher':'🔢',
  'asteroids':'🚀','pong':'🏸'
};

/* --- Unified arcade score submission --- */
window.submitArcadeScore = async function(gameName, initials, score) {
  try {
    await fetch(`${SB_URL}/rest/v1/arcade_scores`, {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ game: gameName, initials: initials.substring(0,3).toUpperCase(), score })
    });
    renderArcadeScoreboard();
  } catch(e) {}
};

let _scoreEntryOverlay = null;
window.showScoreEntry = function(gameName, finalScore, onDismiss) {
  if(_scoreEntryOverlay) return;
  const displayName = ARCADE_GAME_NAMES[gameName] || gameName;
  const isLowBetter = gameName === 'minesweeper';
  const scoreLabel = isLowBetter ? `TIME: ${finalScore}s` : `SCORE: ${finalScore.toLocaleString()}`;

  _scoreEntryOverlay = document.createElement('div');
  _scoreEntryOverlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,128,0.85);z-index:600;display:flex;align-items:center;justify-content:center;';
  _scoreEntryOverlay.innerHTML = `
    <div style="background:#c0c0c0;border-top:3px solid #fff;border-left:3px solid #fff;border-right:3px solid #404040;border-bottom:3px solid #404040;min-width:260px;">
      <div style="background:linear-gradient(to right,#000080,#1084d0);color:#fff;font-size:11px;font-weight:bold;padding:3px 6px;">
        <span>🏆 ${displayName} — Enter Your Initials</span>
      </div>
      <div style="padding:16px;text-align:center;">
        <div style="font-size:22px;font-weight:900;color:#000080;margin-bottom:4px;">${scoreLabel}</div>
        <div style="font-size:12px;margin-bottom:12px;">3 letters for the leaderboard:</div>
        <input id="initials-input" maxlength="3"
          style="width:100px;text-align:center;font-size:28px;font-weight:bold;font-family:Arial Black,sans-serif;letter-spacing:4px;text-transform:uppercase;
          border-top:2px solid #404040;border-left:2px solid #404040;border-right:2px solid #fff;border-bottom:2px solid #fff;
          padding:6px 4px;background:#fff;outline:none;"
          placeholder="AAA">
        <div style="display:flex;gap:8px;justify-content:center;margin-top:14px;">
          <button id="submit-initials-btn"
            style="background:#c0c0c0;border-top:2px solid #fff;border-left:2px solid #fff;border-right:2px solid #404040;border-bottom:2px solid #404040;padding:4px 16px;font-size:12px;font-weight:bold;cursor:pointer;">
            [ SUBMIT ]
          </button>
          <button id="skip-initials-btn"
            style="background:#c0c0c0;border-top:2px solid #fff;border-left:2px solid #fff;border-right:2px solid #404040;border-bottom:2px solid #404040;padding:4px 12px;font-size:12px;cursor:pointer;">
            Skip
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(_scoreEntryOverlay);
  setTimeout(() => document.getElementById('initials-input')?.focus(), 100);

  function dismiss(submit) {
    const input = document.getElementById('initials-input');
    const initials = submit ? ((input?.value || '').trim().replace(/[^a-zA-Z]/g,'').substring(0,3).toUpperCase() || 'AAA') : null;
    if(_scoreEntryOverlay) { _scoreEntryOverlay.remove(); _scoreEntryOverlay = null; }
    if(initials) window.submitArcadeScore(gameName, initials, finalScore);
    if(onDismiss) onDismiss();
  }

  document.getElementById('submit-initials-btn').addEventListener('click', () => dismiss(true));
  document.getElementById('skip-initials-btn').addEventListener('click', () => dismiss(false));
  document.getElementById('initials-input').addEventListener('keydown', e => { if(e.key === 'Enter') dismiss(true); });
};

/* --- Sidebar Breakout leaderboard (top 5 from arcade_scores) --- */
// fetchLeaderboard removed — replaced by renderArcadeScoreboard()

// Sanitize external text before inserting into DOM — global scope
function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/* ── ARCADE SCOREBOARD (sidebar, always visible) ── */
const GAME_META = [
  { key: 'breakout',       icon: '🏓', name: 'BLOCK RAID'  },
  { key: 'minesweeper',    icon: '💣', name: 'BUGSWEEP'    },
  { key: 'tetris',         icon: '🧱', name: 'BLOCK DROP'  },
  { key: 'word-muncher',   icon: '📖', name: 'PARSE MUNCH' },
  { key: 'number-muncher', icon: '🔢', name: 'BITCRUNCHER' },
  { key: 'asteroids',      icon: '🚀', name: 'VOID SHRED'  },
  { key: 'pong',           icon: '🏸', name: 'PING_'       },
];
const MEDALS = ['🥇','🥈','🥉'];

async function renderArcadeScoreboard() {
  const sidebar = document.getElementById('arcade-scoreboard-body');
  const main    = document.getElementById('arcade-scoreboard-body-main');
  if(!sidebar && !main) return;
  try {
    const res = await fetch(`${SB_URL}/rest/v1/arcade_scores?select=game,initials,score&order=score.desc&limit=200`, {
      headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
    });
    const all = await res.json();
    // Group by game, top 3 each (minesweeper: lowest time wins)
    const byGame = {};
    (all || []).forEach(r => {
      if(!byGame[r.game]) byGame[r.game] = [];
      byGame[r.game].push(r);
    });
    if(byGame['minesweeper']) byGame['minesweeper'].sort((a,b)=>a.score-b.score);

    // Sidebar: compact version
    const sidebarHTML = GAME_META.map(g => {
      const scores = (byGame[g.key] || []).slice(0,3);
      const rows = [0,1,2].map(i => {
        const s = scores[i];
        if(s) return `<div class="sb-score-row"><span class="sb-medal">${MEDALS[i]}</span><span class="sb-initials">${s.initials.toUpperCase()}</span><span class="sb-score">${s.score.toLocaleString()}</span></div>`;
        return `<div class="sb-score-row"><span class="sb-medal sb-empty">·</span><span class="sb-initials sb-empty">---</span><span class="sb-score sb-empty">---</span></div>`;
      }).join('');
      return `<div class="sb-game-row"><div class="sb-game-name">${g.icon} ${g.name}</div>${rows}</div>`;
    }).join('');
    if(sidebar) sidebar.innerHTML = sidebarHTML;

    // Main (gaming section): full-width table style
    if(main) {
      const medals2 = ['🥇','🥈','🥉'];
      main.innerHTML = `<table style="width:100%;border-collapse:collapse;font-family:'Courier New',monospace;font-size:11px;">
        <thead>
          <tr style="background:#000066;color:#FFD700;">
            <th style="padding:5px 8px;text-align:left;font-weight:bold;letter-spacing:1px;">GAME</th>
            <th style="padding:5px 8px;text-align:center;">🥇 1ST</th>
            <th style="padding:5px 8px;text-align:center;">🥈 2ND</th>
            <th style="padding:5px 8px;text-align:center;">🥉 3RD</th>
          </tr>
        </thead>
        <tbody>
          ${GAME_META.map((g,gi) => {
            const scores = (byGame[g.key] || []).slice(0,3);
            const cell = (i) => {
              const s = scores[i];
              if(s) return `<div style="font-weight:bold;color:#000080;">${s.initials.toUpperCase()}</div><div style="color:#333;font-size:10px;">${s.score.toLocaleString()}</div>`;
              return `<div style="color:#ccc;">---</div>`;
            };
            return `<tr style="background:${gi%2===0?'#fafaf5':'#f0ece0'};border-bottom:1px solid #ddd;">
              <td style="padding:6px 8px;font-weight:bold;color:#000080;">${g.icon} ${g.name}</td>
              <td style="padding:6px 8px;text-align:center;">${cell(0)}</td>
              <td style="padding:6px 8px;text-align:center;">${cell(1)}</td>
              <td style="padding:6px 8px;text-align:center;">${cell(2)}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>`;
    }
  } catch(e) {
    const msg = '<div style="padding:6px;font-family:Courier New;font-size:9px;color:#443300;text-align:center;">SCORES UNAVAILABLE</div>';
    if(sidebar) sidebar.innerHTML = msg;
    if(main) main.innerHTML = msg;
  }
}

// renderLeaderboard removed — replaced by renderArcadeScoreboard()

/* --- Arcade Scoreboard (all games, top 3 each) --- */
// fetchArcadeScoreboard — alias for renderArcadeScoreboard, one code path
function fetchArcadeScoreboard() { renderArcadeScoreboard(); }

/* ============ MODEM SOUND ============ */
function playModemSound(audioFiles) {
  // Try real audio files first, fall back to synthesized
  if (audioFiles && audioFiles.length) {
    const a = new Audio(audioFiles[0]);
    a.play().catch(() => playModemSynth());
  } else {
    playModemSynth();
  }
}

function playModemSynth() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const patterns = [
      {t:'sine', f:1270, s:0, d:0.25},
      {t:'square', f:2100, s:0.25, d:0.2},
      {t:'sine', f:600, s:0.45, d:0.35},
      {t:'sawtooth', f:1800, s:0.8, d:0.25},
      {t:'sine', f:2400, s:1.05, d:0.15},
      {t:'square', f:960, s:1.2, d:0.4},
      {t:'sine', f:1440, s:1.6, d:0.25},
      {t:'sawtooth', f:2200, s:1.85, d:0.35},
      {t:'sine', f:720, s:2.2, d:0.5},
      {t:'square', f:1680, s:2.7, d:0.2},
      {t:'sine', f:3000, s:2.9, d:0.15},
      {t:'sine', f:480, s:3.05, d:0.6},
      {t:'sawtooth', f:1200, s:3.65, d:0.3},
    ];
    patterns.forEach(p => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = p.t;
      osc.frequency.setValueAtTime(p.f, ctx.currentTime + p.s);
      osc.frequency.linearRampToValueAtTime(p.f * (0.8 + Math.random() * 0.5), ctx.currentTime + p.s + p.d);
      g.gain.setValueAtTime(0.12, ctx.currentTime + p.s);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + p.s + p.d);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(ctx.currentTime + p.s);
      osc.stop(ctx.currentTime + p.s + p.d + 0.05);
    });
  } catch(e) {}
}

/* ============ WIN95 DESKTOP COLOR ============ */
(function() {
  const colors = ['#008080','#000080','#808000','#800080'];
  const pick = colors[Math.floor(Math.random() * colors.length)];
  document.body.style.background = pick;
  // Also set connecting screen bg to match
  document.addEventListener('DOMContentLoaded', function() {
    const conn = document.getElementById('phase-connect');
    if(conn) conn.style.background = pick;
  });
})();

/* ============ PHASE TRANSITIONS ============ */
function startConnect() {
  document.getElementById('phase-cd').style.display = 'none';
  document.getElementById('phase-connect').classList.add('active');
  // Play the real AOL modem sound
  const modem = new Audio('https://raw.githubusercontent.com/abigailleahgoldberg/abearicaonline/main/modem.mp3');
  modem.volume = 0.85;
  modem.play().catch(() => playModemSynth()); // fallback if autoplay blocked

  setTimeout(() => {
    const fadeInterval = setInterval(() => {
      if (modem.volume > 0.05) { modem.volume -= 0.05; }
      else { modem.volume = 0; modem.pause(); clearInterval(fadeInterval); }
    }, 200);
  }, 15000); // start fading at 15s, audio is ~19s total

  const steps = [
    {delay:400,   pct:6,  txt:'Initializing modem...', panel:1},
    {delay:1400,  pct:12, txt:'Dialing 1-800-AOL-ONLINE...', panel:1},
    {delay:2800,  pct:20, txt:'ATDT18004265677', panel:1},
    {delay:4400,  pct:28, txt:'CONNECT 28800', panel:1},
    {delay:6200,  pct:38, txt:'Negotiating connection...', panel:1},
    {delay:8000,  pct:48, txt:'Establishing secure link...', panel:1},
    {delay:9600,  pct:58, txt:'Verifying username: Abearica...', panel:2},
    {delay:11200, pct:68, txt:'Password: ••••••••••••', panel:2},
    {delay:12600, pct:77, txt:'Checking account access...', panel:2},
    {delay:14000, pct:85, txt:'Welcome to Abearica Online!', panel:3},
    {delay:15600, pct:92, txt:'Loading your experience... 🐻', panel:3},
    {delay:17200, pct:97, txt:'Almost there...', panel:3},
    {delay:18400, pct:100, txt:"You've got projects!", panel:3},
  ];

  steps.forEach(s => {
    setTimeout(() => {
      document.getElementById('connect-status').textContent = s.txt;
      document.getElementById('conn-progress').style.width = s.pct + '%';
      // panel lights in banner image, no DOM elements needed
    }, s.delay);
  });

  setTimeout(() => {
    document.getElementById('phase-connect').classList.remove('active');
    document.getElementById('phase-portal').classList.add('active');
    window._aolSignedIn = true;
    initPortal();
  }, 19000);
}

function initPortal() {
  // Auto-launch game if coming from Games page
  if(localStorage.getItem('autoLaunchGame')) {
    localStorage.removeItem('autoLaunchGame');
    setTimeout(launchGame, 500);
  }

  // Date
  const now = new Date();
  const pdEl = document.getElementById('portal-date');
  if(pdEl) pdEl.textContent =
    now.toLocaleDateString('en-US', {weekday:'long', year:'numeric', month:'long', day:'numeric'}) +
    ' — Today on Abearica Online';

  // Clock element removed from UI — interval disabled

  // Sidebar weather — updated by wttr.in fetch below
  const wtEl = document.getElementById('weather-temp');
  if(wtEl) wtEl.textContent = 'Checking...';

  // Load leaderboard (legacy Breakout sidebar - now replaced by arcade scoreboard)
    renderArcadeScoreboard();

  // ── REFRESH FUNCTION — F5 within portal, no reconnect needed ──
  window.refreshPulse = function() {
    const ico = document.querySelector('#refresh-btn .ico');
    if(ico) { ico.style.transition='transform 0.6s'; ico.style.transform='rotate(360deg)'; setTimeout(()=>{ ico.style.transition=''; ico.style.transform=''; }, 700); }
    runDailyPulse();
    renderArcadeScoreboard();
    loadNewsInformer();
  };

  function runDailyPulse() {
  // Daily Pulse: Weather — auto-detect by IP, user can override
  (function() {
    const savedLocation = localStorage.getItem('aol_weather_location') || '';
    const weatherUrl = 'https://wttr.in/' + encodeURIComponent(savedLocation) + '?format=3&u';
    fetch(weatherUrl)
      .then(r=>r.text()).then(t=>{
        const w = t.trim() || 'Weather unavailable';
        document.getElementById('pulse-weather').querySelector('.tile-value').innerHTML =
          w + '<br><span style="font-size:9px;color:#0000cc;cursor:pointer;" onclick="changeWeatherLocation()">' +
          (savedLocation ? '[change location]' : '[set location]') + '</span>';
        document.getElementById('weather-temp').textContent = w;
      })
      .catch(()=>{
        document.getElementById('pulse-weather').querySelector('.tile-value').textContent = 'Weather unavailable';
        document.getElementById('weather-temp').textContent = 'Unavailable';
      });
  })();
  window.changeWeatherLocation = function() {
    const loc = prompt('Enter your city or zip code (leave blank for auto-detect):');
    if(loc !== null) {
      if(loc.trim()) localStorage.setItem('aol_weather_location', loc.trim());
      else localStorage.removeItem('aol_weather_location');
      location.reload();
    }
  };

  // Daily Pulse: Crypto
  fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd')
    .then(r=>r.json()).then(d=>{
      const btc = d.bitcoin?.usd ? '$'+d.bitcoin.usd.toLocaleString() : '—';
      const eth = d.ethereum?.usd ? '$'+d.ethereum.usd.toLocaleString() : '—';
      document.getElementById('pulse-crypto').querySelector('.tile-value').innerHTML = '₿ BTC: <b>'+btc+'</b><br>Ξ ETH: <b>'+eth+'</b>';
    }).catch(()=>{ document.getElementById('pulse-crypto').querySelector('.tile-value').textContent = 'Price data unavailable'; });

  // Daily Pulse: News
  fetch('https://api.rss2json.com/v1/api.json?rss_url=https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml')
    .then(r=>r.json()).then(d=>{
      const item = d.items?.[0];
      if(item) {
        const el = document.getElementById('pulse-news').querySelector('.tile-value');
        const safeTitle = sanitizeText(item.title);
        const safeLink = item.link.startsWith('http') ? item.link : '#';
        el.innerHTML = '<a href="'+safeLink+'" target="_blank" rel="noopener noreferrer" style="color:#0000cc;text-decoration:underline;">'+safeTitle+'</a>';
      }
    }).catch(()=>{ document.getElementById('pulse-news').querySelector('.tile-value').textContent = 'News unavailable'; });

  // ── UPGRADED TRIVIA GAME ──
  const triviaBank = [
    {q:'What does "WWW" stand for?', opts:['World Wide Web','Wide World Web','Wireless Web World','Web World Wide'], a:0},
    {q:'What year was AOL founded?', opts:['1983','1985','1991','1988'], a:1},
    {q:'What was the first domain ever registered?', opts:['google.com','mit.edu','symbolics.com','ibm.com'], a:2},
    {q:'How many free hours did AOL CDs advertise?', opts:['500','750','1000','2000'], a:2},
    {q:'What does "HTML" stand for?', opts:['HyperText Markup Language','High Transfer Markup Link','HyperText Main Logic','Hyperlink Text Markup Language'], a:0},
    {q:'Who made the first commercial web browser?', opts:['Microsoft','Apple','Netscape','IBM'], a:2},
    {q:'What was Google originally called?', opts:['PageSearch','BackRub','WebCrawler','SearchRank'], a:1},
    {q:'What does "ISP" stand for?', opts:['Internet Speed Provider','Internal System Protocol','Internet Service Provider','Integrated Signal Processor'], a:2},
    {q:'What year did the first iPhone launch?', opts:['2005','2006','2007','2008'], a:2},
    {q:'What does "URL" stand for?', opts:['Universal Resource Link','Uniform Resource Locator','Unified Remote Line','User Reference Library'], a:1},
    {q:'What was the max speed of a 56k modem?', opts:['33.6 Kbps','53.3 Kbps','64 Kbps','128 Kbps'], a:1},
    {q:'Who invented the World Wide Web?', opts:['Bill Gates','Steve Jobs','Tim Berners-Lee','Vint Cerf'], a:2},
    {q:'What year did Facebook open to the public?', opts:['2004','2005','2006','2007'], a:2},
    {q:'What company made Windows 95?', opts:['IBM','Apple','Microsoft','Intel'], a:2},
  ];
  const todayQ = triviaBank[new Date().getDate() % triviaBank.length];
  let triviaAnswered = false;
  const triviaContent = document.getElementById('trivia-content');
  function renderTrivia() {
    let html = '<div style="font-size:11px;font-weight:bold;margin-bottom:5px;color:#000080;">'+todayQ.q+'</div>';
    todayQ.opts.forEach((opt, i) => {
      html += '<button class="trivia-option" id="topt-'+i+'" onclick="checkTrivia('+i+')">'+(String.fromCharCode(65+i))+'. '+opt+'</button>';
    });
    triviaContent.innerHTML = html;
  }
  window.checkTrivia = function(idx) {
    if(triviaAnswered) return;
    triviaAnswered = true;
    const correct = todayQ.a;
    document.getElementById('topt-'+correct).classList.add('correct');
    if(idx !== correct) document.getElementById('topt-'+idx).classList.add('wrong');
    triviaContent.insertAdjacentHTML('beforeend', '<div class="trivia-score">'+(idx===correct?'✅ Correct!':'❌ Wrong — correct answer: '+String.fromCharCode(65+correct))+'</div>');
  };
  renderTrivia();

  // ── SPORTS — ESPN Multi-Sport ──
  const today = new Date();
  const sEl = document.getElementById('pulse-sports').querySelector('.tile-value');

  function fmtGame(e, sport) {
    const comp = e.competitions&&e.competitions[0];
    const teams = comp&&comp.competitors||[];
    if(teams.length<2) return '';
    const h=teams[0], a=teams[1];
    const hn=h.team&&(h.team.abbreviation||h.team.shortDisplayName)||h.athlete&&h.athlete.shortName||'?';
    const an=a.team&&(a.team.abbreviation||a.team.shortDisplayName)||a.athlete&&a.athlete.shortName||'?';
    const hs=h.score||'', as_=a.score||'';
    const score=(hs&&as_)?'<b>'+hs+'-'+as_+'</b>':'';
    const status=e.status&&e.status.type&&e.status.type.shortDetail||'';
    const label='<span style="color:#808080;font-size:8px;text-transform:uppercase;letter-spacing:.05em;">'+sport+'</span> ';
    return '<div style="margin-bottom:4px;font-size:10px;border-bottom:1px solid #e0e0e0;padding-bottom:3px;">'+label+hn+' vs '+an+(score?' '+score:'')+' <span style="color:#555;font-size:9px;">'+status+'</span></div>';
  }

  const SPORTS = [
    {url:'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard', label:'NBA'},
    {url:'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard', label:'NHL'},
    {url:'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard', label:'MLB'},
    {url:'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard', label:'NCAA'},
    {url:'https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard', label:'UFC'},
  ];

  Promise.all(SPORTS.map(s=>fetch(s.url).then(r=>r.json()).then(d=>({label:s.label, events:(d.events||[]).slice(0,3)})).catch(()=>({label:s.label,events:[]}))))
    .then(results=>{
      let html = '';
      let totalGames = 0;
      results.forEach(({label, events})=>{
        if(!events.length) return;
        // For UFC show event name not team vs team
        if(label==='UFC') {
          const e=events[0];
          const name=e.name||e.shortName||'UFC Event';
          const date=e.date?new Date(e.date).toLocaleDateString('en-US',{month:'short',day:'numeric'}):'';
          html+='<div style="margin-bottom:4px;font-size:10px;border-bottom:1px solid #e0e0e0;padding-bottom:3px;"><span style="color:#808080;font-size:8px;text-transform:uppercase;letter-spacing:.05em;">UFC</span> '+name+(date?' · '+date:'')+'</div>';
          totalGames++;
          return;
        }
        events.forEach(e=>{
          const row=fmtGame(e,label);
          if(row){html+=row;totalGames++;}
        });
      });
      sEl.innerHTML = totalGames ? html : '<div>No games scheduled today</div>';
    })
    .catch(()=>{ sEl.textContent = 'Scores unavailable'; });

  // ── HOROSCOPE — ohmanda API ──
  const signs = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];
  const signEmojis = ['\u2648','\u2649','\u264A','\u264B','\u264C','\u264D','\u264E','\u264F','\u2650','\u2651','\u2652','\u2653'];
  const todaySign = signs[today.getDate() % 12];
  const todaySignEmoji = signEmojis[today.getDate() % 12];
  fetch('/api/horoscope?sign='+todaySign)
    .then(r=>r.json()).then(d=>{
      const hEl = document.getElementById('pulse-horoscope').querySelector('.tile-value');
      document.getElementById('pulse-horoscope').querySelector('.tile-label').textContent = todaySignEmoji+' '+todaySign.charAt(0).toUpperCase()+todaySign.slice(1);
      hEl.innerHTML = '<div style="font-size:10px;line-height:1.5;">'+sanitizeText(d.horoscope||'No reading today')+'</div>';
    }).catch(()=>{ document.getElementById('pulse-horoscope').querySelector('.tile-value').textContent = 'Horoscope unavailable'; });

  // ── ON THIS DAY IN TECH ──
  fetch('https://history.muffinlabs.com/date')
    .then(r=>r.json()).then(d=>{
      const events = d.data && d.data.Events ? d.data.Events : [];
      // Filter for tech-relevant keywords
      const techKeywords = ['computer','internet','software','Apple','Microsoft','Google','IBM','NASA','space','moon','robot','telephone','radio','television','electric','nuclear','patent','invention','discovered','launched','first'];
      const techEvents = events.filter(e => techKeywords.some(kw => e.text.toLowerCase().includes(kw.toLowerCase()))).slice(0,4);
      const showEvents = techEvents.length ? techEvents : events.slice(0,4);
      const otdEl = document.getElementById('on-this-day-content');
      if(showEvents.length) {
        otdEl.innerHTML = showEvents.map(e=>
          '<div style="margin-bottom:8px;"><span style="color:#000080;font-weight:bold;">'+sanitizeText(String(e.year))+'</span> — '+sanitizeText(e.text)+(e.links&&e.links[0]&&e.links[0].link.startsWith('http')?' <a href="'+e.links[0].link+'" target="_blank" rel="noopener noreferrer" style="color:#0000cc;font-size:10px;">[more]</a>':'')+'</div>'
        ).join('');
      } else {
        otdEl.textContent = 'No events found for today.';
      }
    }).catch(()=>{ document.getElementById('on-this-day-content').textContent = 'History data unavailable'; });
  }

  runDailyPulse();
  loadSanityAnnouncements();

  // Tilt popup disabled
}

/* ============ BREAKOUT GAME ============ */
let gameRunning = false, animFrame, paddle, ball, bricks, score, tiltFired=false;

function launchGame() {
  // Resize canvas for screen
  const canvas = document.getElementById('game-canvas');
  const maxW = Math.min(400, window.innerWidth - 20);
  canvas.width = maxW;
  canvas.height = Math.round(maxW * 0.7);
  document.getElementById('game-overlay').classList.add('active');
  initGame();
}
function closeGame() {
  document.getElementById('game-overlay').classList.remove('active');
  gameRunning = false;
  cancelAnimationFrame(animFrame);
}

function initGame() {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  paddle = {x: W/2-45, y:H-20, w:90, h:10, spd:7};
  // Ball starts stationary — countdown before it moves
  ball = {x:W/2, y:H-50, vx:0, vy:0, r:7, moving:false};
  score = 0; gameRunning = true; tiltFired = false;
  let startTime = null;
  let countdown = 0;
  let countingDown = false;
  let lastCountdown = Date.now();

  const cols=8, rows=4;
  const colors=['#cc0000','#cc6600','#0000cc','#006600'];
  bricks = [];
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
    bricks.push({
      x: 8 + c*(W-16)/cols,
      y: 42 + r*24,
      w: (W-16)/cols-4, h:18,
      color:colors[r], alive:true
    });
  }

  const keys = {};
  document.onkeydown = e => {
    keys[e.key]=true;
    if(['ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
    if(e.key === 'Enter' && !ball.moving && !countingDown) startCountdown();
  };
  document.onkeyup = e => keys[e.key]=false;

  function startCountdown() {
    if(countingDown || ball.moving) return;
    countingDown = true;
    countdown = 3;
    lastCountdown = Date.now();
  }

  function launchBall() {
    if(ball.moving) return;
    ball.moving = true;
    countingDown = false;
    ball.vx = (Math.random() > 0.5 ? 1 : -1) * 3.5;
    ball.vy = -4.5;
    startTime = Date.now();
  }

  let touchX = null;
  canvas.ontouchstart = e => {
    touchX = e.touches[0].clientX;
    if(!ball.moving && !countingDown) startCountdown();
    e.preventDefault();
  };
  canvas.ontouchmove = e => {
    if(touchX===null) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const dx = (e.touches[0].clientX - touchX) * scaleX;
    paddle.x = Math.max(0, Math.min(W-paddle.w, paddle.x+dx));
    touchX = e.touches[0].clientX;
    e.preventDefault();
  };

  const stars = Array.from({length:15},()=>({x:Math.random()*W, y:Math.random()*H*0.7}));

  function loop() {
    if(!gameRunning) return;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#000080'; ctx.fillRect(0,0,W,H);

    // Stars
    ctx.fillStyle='rgba(255,255,255,0.4)';
    stars.forEach(s => ctx.fillRect(s.x,s.y,1,1));

    // Paddle controls
    if(keys['ArrowLeft']) paddle.x = Math.max(0, paddle.x-paddle.spd);
    if(keys['ArrowRight']) paddle.x = Math.min(W-paddle.w, paddle.x+paddle.spd);

    // Ball follows paddle until launched
    if(!ball.moving) {
      ball.x = paddle.x + paddle.w/2;
    }

    // Move ball only when launched
    if(ball.moving) {
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Side walls
      if(ball.x - ball.r <= 0) { ball.x = ball.r; ball.vx = Math.abs(ball.vx); }
      if(ball.x + ball.r >= W) { ball.x = W - ball.r; ball.vx = -Math.abs(ball.vx); }

      // Top wall — hard clamp, always bounce DOWN
      if(ball.y - ball.r <= 0) { ball.y = ball.r + 1; ball.vy = Math.abs(ball.vy); }

      // Paddle collision
      if(ball.vy > 0 &&
         ball.y + ball.r >= paddle.y &&
         ball.y - ball.r <= paddle.y + paddle.h &&
         ball.x >= paddle.x - ball.r &&
         ball.x <= paddle.x + paddle.w + ball.r) {
        ball.y = paddle.y - ball.r - 1;
        ball.vy = -Math.abs(ball.vy);
        // Add spin based on where it hits the paddle
        const hitPos = (ball.x - (paddle.x + paddle.w/2)) / (paddle.w/2);
        ball.vx = hitPos * 5;
        // Cap speed so it can't go insane
        const speed = Math.sqrt(ball.vx*ball.vx + ball.vy*ball.vy);
        const maxSpeed = 7;
        if(speed > maxSpeed) { ball.vx = (ball.vx/speed)*maxSpeed; ball.vy = (ball.vy/speed)*maxSpeed; }
        // Make sure it's always going up after hitting paddle
        ball.vy = -Math.abs(ball.vy);
        // Minimum horizontal speed so it doesn't go straight up forever
        if(Math.abs(ball.vx) < 1) ball.vx = (ball.vx >= 0 ? 1 : -1) * 1.5;
      }
    }

    // Bricks
    let aliveCount=0;
    bricks.forEach(b=>{
      if(!b.alive) return; aliveCount++;
      if(ball.moving &&
         ball.x + ball.r > b.x && ball.x - ball.r < b.x + b.w &&
         ball.y + ball.r > b.y && ball.y - ball.r < b.y + b.h) {
        b.alive=false; ball.vy*=-1; score++;
        // Ensure ball exits brick zone properly
        if(ball.vy > 0) ball.y = b.y + b.h + ball.r + 1;
        else ball.y = b.y - ball.r - 1;
      }
      ctx.fillStyle=b.color; ctx.fillRect(b.x,b.y,b.w,b.h);
      ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1; ctx.strokeRect(b.x,b.y,b.w,b.h);
      // Brick highlight
      ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.fillRect(b.x+1,b.y+1,b.w-2,3);
    });

    // Draw paddle
    ctx.fillStyle='#c0c0c0'; ctx.fillRect(paddle.x,paddle.y,paddle.w,paddle.h);
    ctx.fillStyle='#ffffff'; ctx.fillRect(paddle.x+1,paddle.y+1,paddle.w-2,3);
    ctx.fillStyle='#808080'; ctx.fillRect(paddle.x+1,paddle.y+7,paddle.w-2,2);

    // Draw ball
    ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);
    ctx.fillStyle='#FFD700'; ctx.fill();
    ctx.strokeStyle='#cc8800'; ctx.lineWidth=1; ctx.stroke();

    // Score
    ctx.fillStyle='#FFD700'; ctx.font='bold 12px Courier New';
    ctx.fillText('SCORE: '+score, 8, 22);

    // Waiting to start
    if(!ball.moving && !countingDown) {
      ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#FFD700'; ctx.font='bold 16px Arial Black';
      ctx.textAlign='center';
      ctx.fillText('Press Enter to start', W/2, H/2);
      ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font='11px Arial';
      ctx.fillText('(or tap on mobile)', W/2, H/2+22);
      ctx.textAlign='left';
    }

    // Countdown overlay
    if(countingDown) {
      const now = Date.now();
      if(now - lastCountdown >= 1000) {
        countdown--;
        lastCountdown = now;
        if(countdown <= 0) { launchBall(); }
      }
      ctx.fillStyle='rgba(0,0,0,0.55)'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#FFD700'; ctx.font='bold 72px Arial Black';
      ctx.textAlign='center';
      ctx.fillText(countdown > 0 ? countdown : 'GO!', W/2, H/2+25);
      ctx.fillStyle='#fff'; ctx.font='13px Arial';
      ctx.fillText('Get ready...', W/2, H/2-35);
      ctx.textAlign='left';
    }

    // Game over
    if(ball.moving && ball.y > H + 20) {
      ctx.fillStyle='rgba(0,0,0,0.75)'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#ff4444'; ctx.font='bold 28px Arial Black';
      ctx.textAlign='center'; ctx.fillText('GAME OVER',W/2,H/2-15);
      ctx.fillStyle='#FFD700'; ctx.font='16px Arial';
      ctx.fillText('Score: '+score,W/2,H/2+20);
      ctx.textAlign='left';
      gameRunning=false;
      if(!_scoreEntryOverlay){
        setTimeout(() => window.showScoreEntry('breakout', score, closeGame), 600);
      }
      return;
    }

    // Win / time limit
    if(aliveCount===0 || (startTime && Date.now()-startTime > 60000)){
      if(!_scoreEntryOverlay){
        gameRunning=false;
        cancelAnimationFrame(animFrame);
        setTimeout(() => window.showScoreEntry('breakout', score, closeGame), 600);
      }
      return;
    }

    animFrame=requestAnimationFrame(loop);
  }
  cancelAnimationFrame(animFrame);
  animFrame=requestAnimationFrame(loop);
}

/* promptInitials / dismissInitials / saveInitials removed — replaced by showScoreEntry / submitArcadeScore */

function triggerTilt() {
  // Make sure initials overlay is gone
  if(_scoreEntryOverlay){ _scoreEntryOverlay.remove(); _scoreEntryOverlay=null; }
  // Close game overlay
  closeGame();
  // Glitch then show tilt
  const g=document.createElement('div');
  g.className='glitch-overlay';
  document.body.appendChild(g);
  setTimeout(()=>{ g.remove(); document.getElementById('tilt-popup').classList.add('active'); }, 400);
}
function closeTilt() {
  document.getElementById('tilt-popup').classList.remove('active');
}

/* ============ MINESWEEPER ============ */
let msGrid, msRevealed, msFlags, msMines, msGameOver, msRows=9, msCols=9, msNumMines=10, msStartTime=0;

function launchMinesweeper() {
  document.getElementById('minesweeper-overlay').classList.add('active');
  initMinesweeper();
}
function closeMinesweeper() {
  document.getElementById('minesweeper-overlay').classList.remove('active');
  msGameOver = true;
}

function initMinesweeper() {
  msGameOver = false;
  msStartTime = Date.now();
  msGrid = Array.from({length:msRows}, ()=> Array(msCols).fill(0));
  msRevealed = Array.from({length:msRows}, ()=> Array(msCols).fill(false));
  msFlags = Array.from({length:msRows}, ()=> Array(msCols).fill(false));
  msMines = [];
  // Place mines
  let placed = 0;
  while(placed < msNumMines) {
    const r = Math.floor(Math.random()*msRows), c = Math.floor(Math.random()*msCols);
    if(msGrid[r][c] !== -1) { msGrid[r][c] = -1; msMines.push([r,c]); placed++; }
  }
  // Count neighbors
  for(let r=0;r<msRows;r++) for(let c=0;c<msCols;c++) {
    if(msGrid[r][c]===-1) continue;
    let cnt=0;
    for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++) {
      const nr=r+dr, nc=c+dc;
      if(nr>=0&&nr<msRows&&nc>=0&&nc<msCols&&msGrid[nr][nc]===-1) cnt++;
    }
    msGrid[r][c]=cnt;
  }
  renderMinesweeper();
  document.getElementById('ms-status').textContent = 'Mines: '+msNumMines+' | Click to reveal, right-click to flag';
  document.getElementById('ms-status').style.color = '#000080';
}

function renderMinesweeper() {
  const board = document.getElementById('ms-board');
  board.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'ms-grid';
  grid.style.gridTemplateColumns = 'repeat('+msCols+', 24px)';
  for(let r=0;r<msRows;r++) for(let c=0;c<msCols;c++) {
    const cell = document.createElement('div');
    cell.className = 'ms-cell';
    if(msRevealed[r][c]) {
      cell.classList.add('revealed');
      if(msGrid[r][c]===-1) { cell.classList.add('mine'); cell.textContent='💣'; }
      else if(msGrid[r][c]>0) { cell.textContent=msGrid[r][c]; cell.classList.add('ms-c'+msGrid[r][c]); }
    } else if(msFlags[r][c]) {
      cell.classList.add('flagged');
      cell.textContent='🚩';
    }
    cell.addEventListener('click', ()=> msReveal(r,c));
    cell.addEventListener('contextmenu', (e)=>{ e.preventDefault(); msFlag(r,c); });
    grid.appendChild(cell);
  }
  board.appendChild(grid);
}

function msReveal(r,c) {
  if(msGameOver || msRevealed[r][c] || msFlags[r][c]) return;
  msRevealed[r][c] = true;
  if(msGrid[r][c]===-1) {
    // Reveal all mines
    msMines.forEach(([mr,mc])=> msRevealed[mr][mc]=true);
    msGameOver=true;
    renderMinesweeper();
    document.getElementById('ms-status').textContent='💥 BOOM! Game over.';
    document.getElementById('ms-status').style.color='#cc0000';
    return;
  }
  if(msGrid[r][c]===0) {
    // Flood fill
    for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++) {
      const nr=r+dr, nc=c+dc;
      if(nr>=0&&nr<msRows&&nc>=0&&nc<msCols&&!msRevealed[nr][nc]) msReveal(nr,nc);
    }
  }
  renderMinesweeper();
  msCheckWin();
}

function msFlag(r,c) {
  if(msGameOver || msRevealed[r][c]) return;
  msFlags[r][c] = !msFlags[r][c];
  renderMinesweeper();
  const flagCount = msFlags.flat().filter(Boolean).length;
  document.getElementById('ms-status').textContent = 'Mines: '+(msNumMines-flagCount)+' remaining';
}

function msCheckWin() {
  let safeCount=0, revealedCount=0;
  for(let r=0;r<msRows;r++) for(let c=0;c<msCols;c++) {
    if(msGrid[r][c]!==-1) safeCount++;
    if(msRevealed[r][c] && msGrid[r][c]!==-1) revealedCount++;
  }
  if(revealedCount===safeCount) {
    msGameOver=true;
    const msTime = Math.round((Date.now()-msStartTime)/1000);
    document.getElementById('ms-status').textContent='🎉 YOU WIN! Time: '+msTime+'s';
    document.getElementById('ms-status').style.color='#006600';
    setTimeout(() => window.showScoreEntry('minesweeper', msTime, closeMinesweeper), 600);
  }
}

/* ============ TETRIS ============ */
let tetrisRunning=false, tetrisAnim, tetrisScore, tetrisLevel, tetrisLines;
let tetrisBoard, tetrisPiece, tetrisNext, tetrisDropTimer, tetrisDropInterval;

const TETRIS_COLS=10, TETRIS_ROWS=20, TETRIS_SZ=20;
const TETRIS_SHAPES = [
  [[1,1,1,1]],                          // I
  [[1,1],[1,1]],                         // O
  [[0,1,0],[1,1,1]],                     // T
  [[1,0,0],[1,1,1]],                     // L
  [[0,0,1],[1,1,1]],                     // J
  [[0,1,1],[1,1,0]],                     // S
  [[1,1,0],[0,1,1]]                      // Z
];
const TETRIS_COLORS = ['#00FFFF','#FFFF00','#AA00FF','#FF8800','#0000FF','#00FF00','#FF0000'];

function launchTetris() {
  const cv = document.getElementById('tetris-canvas');
  cv.width = TETRIS_COLS*TETRIS_SZ + 80;
  cv.height = TETRIS_ROWS*TETRIS_SZ;
  document.getElementById('tetris-overlay').classList.add('active');
  initTetris();
}
function closeTetris() {
  document.getElementById('tetris-overlay').classList.remove('active');
  tetrisRunning=false;
  cancelAnimationFrame(tetrisAnim);
}

function tetrisNewPiece() {
  const idx = Math.floor(Math.random()*TETRIS_SHAPES.length);
  return { shape: TETRIS_SHAPES[idx].map(r=>[...r]), color: TETRIS_COLORS[idx], x: 3, y: 0 };
}

function initTetris() {
  tetrisRunning=true;
  tetrisScore=0; tetrisLevel=1; tetrisLines=0;
  tetrisBoard = Array.from({length:TETRIS_ROWS}, ()=>Array(TETRIS_COLS).fill(null));
  tetrisPiece = tetrisNewPiece();
  tetrisNext = tetrisNewPiece();
  tetrisDropInterval = 500;
  tetrisDropTimer = Date.now();

  const keys = {};
  const cv = document.getElementById('tetris-canvas');

  // Remove old listener if any
  if(cv._tetKeyDown) document.removeEventListener('keydown', cv._tetKeyDown);
  cv._tetKeyDown = function(e) {
    if(!tetrisRunning) return;
    if(!document.getElementById('tetris-overlay').classList.contains('active')) return;
    if(e.key==='ArrowLeft') { tetrisMove(-1,0); e.preventDefault(); }
    if(e.key==='ArrowRight') { tetrisMove(1,0); e.preventDefault(); }
    if(e.key==='ArrowDown') { tetrisMove(0,1); e.preventDefault(); }
    if(e.key==='ArrowUp') { tetrisRotate(); e.preventDefault(); }
    if(e.key===' ') { tetrisHardDrop(); e.preventDefault(); }
  };
  document.addEventListener('keydown', cv._tetKeyDown);

  cancelAnimationFrame(tetrisAnim);
  function loop() {
    if(!tetrisRunning) { tetrisDraw(); return; }
    const now = Date.now();
    if(now - tetrisDropTimer > tetrisDropInterval) {
      tetrisDropTimer = now;
      if(!tetrisMove(0,1)) tetrisLock();
    }
    tetrisDraw();
    tetrisAnim = requestAnimationFrame(loop);
  }
  tetrisAnim = requestAnimationFrame(loop);
}

function tetrisCollides(piece, dx, dy) {
  const s = piece.shape;
  for(let r=0;r<s.length;r++) for(let c=0;c<s[r].length;c++) {
    if(!s[r][c]) continue;
    const nx=piece.x+c+dx, ny=piece.y+r+dy;
    if(nx<0||nx>=TETRIS_COLS||ny>=TETRIS_ROWS) return true;
    if(ny>=0 && tetrisBoard[ny][nx]) return true;
  }
  return false;
}

function tetrisMove(dx,dy) {
  if(tetrisCollides(tetrisPiece,dx,dy)) return false;
  tetrisPiece.x+=dx; tetrisPiece.y+=dy;
  return true;
}

function tetrisRotate() {
  const s = tetrisPiece.shape;
  const rows=s.length, cols=s[0].length;
  const rotated = Array.from({length:cols},(_,c)=> Array.from({length:rows},(_,r)=> s[rows-1-r][c]));
  const old = tetrisPiece.shape;
  tetrisPiece.shape = rotated;
  if(tetrisCollides(tetrisPiece,0,0)) tetrisPiece.shape = old;
}

function tetrisHardDrop() {
  while(tetrisMove(0,1)) tetrisScore++;
  tetrisLock();
}

function tetrisLock() {
  const s = tetrisPiece.shape;
  for(let r=0;r<s.length;r++) for(let c=0;c<s[r].length;c++) {
    if(!s[r][c]) continue;
    const ny=tetrisPiece.y+r, nx=tetrisPiece.x+c;
    if(ny<0) { tetrisRunning=false; return; }
    tetrisBoard[ny][nx] = tetrisPiece.color;
  }
  // Clear lines
  let cleared=0;
  for(let r=TETRIS_ROWS-1;r>=0;r--) {
    if(tetrisBoard[r].every(c=>c)) {
      tetrisBoard.splice(r,1);
      tetrisBoard.unshift(Array(TETRIS_COLS).fill(null));
      cleared++; r++;
    }
  }
  if(cleared) {
    tetrisLines+=cleared;
    tetrisScore += [0,100,300,500,800][cleared]*tetrisLevel;
    tetrisLevel = Math.floor(tetrisLines/10)+1;
    tetrisDropInterval = Math.max(80, 500-((tetrisLevel-1)*40));
  }
  tetrisPiece = tetrisNext;
  tetrisNext = tetrisNewPiece();
  if(tetrisCollides(tetrisPiece,0,0)) {
    tetrisRunning=false;
    setTimeout(() => window.showScoreEntry('tetris', tetrisScore, closeTetris), 600);
  }
}

function tetrisDraw() {
  const cv=document.getElementById('tetris-canvas'), ctx=cv.getContext('2d');
  const W=TETRIS_COLS*TETRIS_SZ, H=TETRIS_ROWS*TETRIS_SZ;
  ctx.fillStyle='#000033'; ctx.fillRect(0,0,cv.width,cv.height);
  // Grid
  ctx.strokeStyle='rgba(255,255,255,0.05)';
  for(let r=0;r<=TETRIS_ROWS;r++) { ctx.beginPath(); ctx.moveTo(0,r*TETRIS_SZ); ctx.lineTo(W,r*TETRIS_SZ); ctx.stroke(); }
  for(let c=0;c<=TETRIS_COLS;c++) { ctx.beginPath(); ctx.moveTo(c*TETRIS_SZ,0); ctx.lineTo(c*TETRIS_SZ,H); ctx.stroke(); }
  // Board
  for(let r=0;r<TETRIS_ROWS;r++) for(let c=0;c<TETRIS_COLS;c++) {
    if(tetrisBoard[r][c]) {
      ctx.fillStyle=tetrisBoard[r][c];
      ctx.fillRect(c*TETRIS_SZ+1,r*TETRIS_SZ+1,TETRIS_SZ-2,TETRIS_SZ-2);
      ctx.fillStyle='rgba(255,255,255,0.3)';
      ctx.fillRect(c*TETRIS_SZ+1,r*TETRIS_SZ+1,TETRIS_SZ-2,3);
    }
  }
  // Current piece
  if(tetrisPiece) {
    const s=tetrisPiece.shape;
    ctx.fillStyle=tetrisPiece.color;
    for(let r=0;r<s.length;r++) for(let c=0;c<s[r].length;c++) {
      if(!s[r][c]) continue;
      const px=(tetrisPiece.x+c)*TETRIS_SZ, py=(tetrisPiece.y+r)*TETRIS_SZ;
      ctx.fillRect(px+1,py+1,TETRIS_SZ-2,TETRIS_SZ-2);
      ctx.fillStyle='rgba(255,255,255,0.3)';
      ctx.fillRect(px+1,py+1,TETRIS_SZ-2,3);
      ctx.fillStyle=tetrisPiece.color;
    }
  }
  // Sidebar
  const sx=W+8;
  ctx.fillStyle='#FFD700'; ctx.font='bold 12px Courier New';
  ctx.fillText('SCORE',sx,20); ctx.fillText(tetrisScore,sx,36);
  ctx.fillText('LEVEL',sx,60); ctx.fillText(tetrisLevel,sx,76);
  ctx.fillText('LINES',sx,100); ctx.fillText(tetrisLines,sx,116);
  ctx.fillText('NEXT',sx,150);
  // Draw next piece
  if(tetrisNext) {
    const ns=tetrisNext.shape;
    ctx.fillStyle=tetrisNext.color;
    for(let r=0;r<ns.length;r++) for(let c=0;c<ns[r].length;c++) {
      if(!ns[r][c]) continue;
      ctx.fillRect(sx+c*14, 160+r*14, 12, 12);
    }
  }
  // Game over
  if(!tetrisRunning) {
    ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#ff4444'; ctx.font='bold 22px Arial';
    ctx.textAlign='center'; ctx.fillText('GAME OVER',W/2,H/2-10);
    ctx.fillStyle='#FFD700'; ctx.font='14px Arial';
    ctx.fillText('Score: '+tetrisScore,W/2,H/2+15);
    ctx.textAlign='left';
  }
}

/* ============ WORD MUNCHER ============ */
let wmRunning=false, wmAnim;

function launchWordMuncher() {
  const cv=document.getElementById('wordmuncher-canvas');
  cv.width=360; cv.height=320;
  document.getElementById('wordmuncher-overlay').classList.add('active');
  initMuncher('word');
}
function closeWordMuncher() {
  document.getElementById('wordmuncher-overlay').classList.remove('active');
  wmRunning=false; cancelAnimationFrame(wmAnim);
}

function launchNumberMuncher() {
  const cv=document.getElementById('numbermuncher-canvas');
  cv.width=360; cv.height=320;
  document.getElementById('numbermuncher-overlay').classList.add('active');
  initMuncher('number');
}
function closeNumberMuncher() {
  document.getElementById('numbermuncher-overlay').classList.remove('active');
  wmRunning=false; cancelAnimationFrame(wmAnim);
}

function initMuncher(type) {
  wmRunning=true;
  const isWord = type==='word';
  const canvasId = isWord ? 'wordmuncher-canvas' : 'numbermuncher-canvas';
  const cv=document.getElementById(canvasId), ctx=cv.getContext('2d');
  const W=cv.width, H=cv.height;
  const GCOLS=6, GROWS=5, CW=W/GCOLS, CH=40;
  const gridTop=60;

  // Generate challenge
  const challenges = isWord ? [
    {prompt:'Eat the VOWELS!', test: v=>'AEIOU'.includes(v), gen:()=>'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random()*26)]},
    {prompt:'Eat words with DOUBLE letters!', test: v=>/(.).*\1/i.test(v), gen:()=>{const ws=['BALL','TREE','BOOK','DOOR','HILL','MOON','BELL','WALL','BUZZ','POOL','SEED','BOOT','COOL','FOOD','DEEP','KEEN','FALL','LOOP','TALL','MITT','CAT','DOG','RUN','SIT','HOP','MAN','PEN','RED','BIG','CUP'];return ws[Math.floor(Math.random()*ws.length)]}},
  ] : [
    {prompt:'Eat MULTIPLES of 3!', test: v=>v%3===0, gen:()=>Math.floor(Math.random()*30)+1},
    {prompt:'Eat EVEN numbers!', test: v=>v%2===0, gen:()=>Math.floor(Math.random()*30)+1},
    {prompt:'Eat numbers LESS than 15!', test: v=>v<15, gen:()=>Math.floor(Math.random()*30)+1},
    {prompt:'Eat MULTIPLES of 5!', test: v=>v%5===0, gen:()=>Math.floor(Math.random()*30)+1},
  ];
  const challenge = challenges[Math.floor(Math.random()*challenges.length)];

  let grid = [];
  for(let r=0;r<GROWS;r++) for(let c=0;c<GCOLS;c++) {
    grid.push({r,c, val: challenge.gen(), eaten:false});
  }

  let player={r:0,c:0}, mScore=0, lives=3, level=1;
  let troggles=[{r:Math.floor(Math.random()*GROWS), c:Math.floor(Math.random()*GCOLS), dir:1}];
  let trogTimer=Date.now(), trogInterval=1200;
  let message='', msgTimer=0;
  let muncherScoreShown=false;
  const muncherGameName = isWord ? 'word-muncher' : 'number-muncher';
  const muncherClose = isWord ? closeWordMuncher : closeNumberMuncher;

  if(cv._munKeyDown) document.removeEventListener('keydown', cv._munKeyDown);
  cv._munKeyDown = function(e) {
    if(!wmRunning) return;
    const overlayId = isWord ? 'wordmuncher-overlay' : 'numbermuncher-overlay';
    if(!document.getElementById(overlayId).classList.contains('active')) return;
    if(e.key==='ArrowUp' && player.r>0) { player.r--; e.preventDefault(); }
    if(e.key==='ArrowDown' && player.r<GROWS-1) { player.r++; e.preventDefault(); }
    if(e.key==='ArrowLeft' && player.c>0) { player.c--; e.preventDefault(); }
    if(e.key==='ArrowRight' && player.c<GCOLS-1) { player.c++; e.preventDefault(); }
    if(e.key===' ') { munchCell(); e.preventDefault(); }
  };
  document.addEventListener('keydown', cv._munKeyDown);

  function munchCell() {
    const cell = grid.find(g=>g.r===player.r&&g.c===player.c&&!g.eaten);
    if(!cell) return;
    if(challenge.test(cell.val)) {
      cell.eaten=true; mScore+=10;
      message='YUM! +10'; msgTimer=Date.now();
      // Check if level complete
      const remaining = grid.filter(g=>!g.eaten && challenge.test(g.val));
      if(remaining.length===0) {
        level++;
        message='LEVEL '+level+'!'; msgTimer=Date.now();
        grid.forEach(g=>{g.eaten=false; g.val=challenge.gen();});
        trogInterval=Math.max(400, trogInterval-100);
        if(troggles.length<3) troggles.push({r:Math.floor(Math.random()*GROWS),c:Math.floor(Math.random()*GCOLS),dir:1});
      }
    } else {
      lives--;
      message='WRONG! -1 life'; msgTimer=Date.now();
      if(lives<=0) { wmRunning=false; }
    }
  }

  cancelAnimationFrame(wmAnim);
  function loop() {
    if(!wmRunning) {
      // Draw game over
      ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#ff4444'; ctx.font='bold 24px Arial';
      ctx.textAlign='center'; ctx.fillText('GAME OVER',W/2,H/2-10);
      ctx.fillStyle='#FFD700'; ctx.font='16px Arial';
      ctx.fillText('Score: '+mScore,W/2,H/2+20);
      ctx.textAlign='left';
      if(!muncherScoreShown) {
        muncherScoreShown=true;
        setTimeout(() => window.showScoreEntry(muncherGameName, mScore, muncherClose), 600);
      }
      return;
    }
    ctx.fillStyle='#1a0a3e'; ctx.fillRect(0,0,W,H);

    // Header
    ctx.fillStyle='#FFD700'; ctx.font='bold 12px Courier New';
    ctx.fillText('SCORE: '+mScore+'  LIVES: '+'❤️'.repeat(lives)+'  LVL: '+level, 8, 18);
    ctx.fillStyle='#fff'; ctx.font='bold 13px Arial';
    ctx.textAlign='center'; ctx.fillText(challenge.prompt, W/2, 42);
    ctx.textAlign='left';

    // Grid
    for(let r=0;r<GROWS;r++) for(let c=0;c<GCOLS;c++) {
      const x=c*CW, y=gridTop+r*CH;
      ctx.fillStyle=(r+c)%2===0?'#2a1a5e':'#3a2a6e';
      ctx.fillRect(x,y,CW,CH);
      ctx.strokeStyle='#5a4a8e'; ctx.strokeRect(x,y,CW,CH);
    }

    // Values
    ctx.font='bold 14px Courier New'; ctx.textAlign='center';
    grid.forEach(g=>{
      if(g.eaten) return;
      const x=g.c*CW+CW/2, y=gridTop+g.r*CH+CH/2+5;
      ctx.fillStyle=challenge.test(g.val)?'#88ff88':'#ffffff';
      ctx.fillText(String(g.val), x, y);
    });

    // Player (muncher)
    const px=player.c*CW+CW/2, py=gridTop+player.r*CH+CH/2;
    ctx.font='24px Arial'; ctx.fillText('😋',px,py+8);

    // Troggles
    const now=Date.now();
    if(now-trogTimer>trogInterval) {
      trogTimer=now;
      troggles.forEach(t=>{
        const dirs=[[0,1],[0,-1],[1,0],[-1,0]];
        const d=dirs[Math.floor(Math.random()*4)];
        const nr=t.r+d[0], nc=t.c+d[1];
        if(nr>=0&&nr<GROWS&&nc>=0&&nc<GCOLS) { t.r=nr; t.c=nc; }
      });
    }
    troggles.forEach(t=>{
      const tx=t.c*CW+CW/2, ty=gridTop+t.r*CH+CH/2;
      ctx.font='22px Arial'; ctx.fillText('👾',tx,ty+7);
      // Collision
      if(t.r===player.r&&t.c===player.c) {
        lives--;
        message='TROGGLE! -1 life'; msgTimer=now;
        player.r=0; player.c=0;
        if(lives<=0) wmRunning=false;
      }
    });

    ctx.textAlign='left';

    // Message
    if(message && now-msgTimer<1500) {
      ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(W/2-80,H-35,160,25);
      ctx.fillStyle='#FFD700'; ctx.font='bold 14px Arial';
      ctx.textAlign='center'; ctx.fillText(message,W/2,H-17);
      ctx.textAlign='left';
    }

    wmAnim=requestAnimationFrame(loop);
  }
  wmAnim=requestAnimationFrame(loop);
}

/* ============ ASTEROIDS ============ */
let astRunning=false, astAnim;

function launchAsteroids() {
  const cv=document.getElementById('asteroids-canvas');
  const sz=Math.min(400, window.innerWidth-20);
  cv.width=sz; cv.height=sz;
  document.getElementById('asteroids-overlay').classList.add('active');
  initAsteroids();
}
function closeAsteroids() {
  document.getElementById('asteroids-overlay').classList.remove('active');
  astRunning=false; cancelAnimationFrame(astAnim);
}

function initAsteroids() {
  astRunning=true;
  window._astScoreShown=false;
  const cv=document.getElementById('asteroids-canvas'), ctx=cv.getContext('2d');
  const W=cv.width, H=cv.height;
  let ship={x:W/2,y:H/2,angle:0,vx:0,vy:0,thrust:false};
  let bullets=[], rocks=[], particles=[];
  let aScore=0, aLives=3, aLevel=1;
  let keys={}, shootCooldown=0;

  function spawnRocks(n, size) {
    for(let i=0;i<n;i++) {
      let rx,ry;
      do { rx=Math.random()*W; ry=Math.random()*H; }
      while(Math.hypot(rx-ship.x,ry-ship.y)<100);
      const angle=Math.random()*Math.PI*2;
      const spd=0.5+Math.random()*1.5;
      // Generate jagged shape
      const pts=[];
      const numPts=8+Math.floor(Math.random()*5);
      for(let j=0;j<numPts;j++) {
        const a=(j/numPts)*Math.PI*2;
        const r=size*(0.7+Math.random()*0.3);
        pts.push({x:Math.cos(a)*r, y:Math.sin(a)*r});
      }
      rocks.push({x:rx,y:ry,vx:Math.cos(angle)*spd,vy:Math.sin(angle)*spd,size,pts,rot:0,rotSpd:(Math.random()-0.5)*0.02});
    }
  }
  spawnRocks(4+aLevel, 30);

  if(cv._astKeyDown) document.removeEventListener('keydown',cv._astKeyDown);
  if(cv._astKeyUp) document.removeEventListener('keyup',cv._astKeyUp);
  cv._astKeyDown=function(e){
    if(!astRunning||!document.getElementById('asteroids-overlay').classList.contains('active'))return;
    keys[e.key]=true;
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
    if((e.key==='h'||e.key==='H')&&aLives>0) {
      // Hyperspace
      ship.x=Math.random()*W; ship.y=Math.random()*H; ship.vx=0; ship.vy=0;
    }
  };
  cv._astKeyUp=function(e){ keys[e.key]=false; };
  document.addEventListener('keydown',cv._astKeyDown);
  document.addEventListener('keyup',cv._astKeyUp);

  cancelAnimationFrame(astAnim);
  function loop() {
    if(!astRunning) return;
    ctx.fillStyle='#000011'; ctx.fillRect(0,0,W,H);

    // Ship controls
    if(keys['ArrowLeft']) ship.angle-=0.07;
    if(keys['ArrowRight']) ship.angle+=0.07;
    if(keys['ArrowUp']) {
      ship.vx+=Math.cos(ship.angle)*0.15;
      ship.vy+=Math.sin(ship.angle)*0.15;
      ship.thrust=true;
      // Thrust particles
      particles.push({x:ship.x-Math.cos(ship.angle)*12,y:ship.y-Math.sin(ship.angle)*12,
        vx:-Math.cos(ship.angle)*2+Math.random()-0.5,vy:-Math.sin(ship.angle)*2+Math.random()-0.5,
        life:15+Math.random()*10,maxLife:25,color:'#ff8800'});
    } else { ship.thrust=false; }

    // Shoot
    if(keys[' '] && shootCooldown<=0) {
      bullets.push({x:ship.x+Math.cos(ship.angle)*14,y:ship.y+Math.sin(ship.angle)*14,
        vx:Math.cos(ship.angle)*6,vy:Math.sin(ship.angle)*6,life:60});
      shootCooldown=8;
    }
    if(shootCooldown>0) shootCooldown--;

    // Move ship
    ship.x+=ship.vx; ship.y+=ship.vy;
    ship.vx*=0.995; ship.vy*=0.995;
    // Wrap
    if(ship.x<0)ship.x=W; if(ship.x>W)ship.x=0;
    if(ship.y<0)ship.y=H; if(ship.y>H)ship.y=0;

    // Move bullets
    bullets.forEach(b=>{b.x+=b.vx;b.y+=b.vy;b.life--;
      if(b.x<0)b.x=W;if(b.x>W)b.x=0;if(b.y<0)b.y=H;if(b.y>H)b.y=0;});
    bullets=bullets.filter(b=>b.life>0);

    // Move rocks
    rocks.forEach(r=>{r.x+=r.vx;r.y+=r.vy;r.rot+=r.rotSpd;
      if(r.x<-40)r.x=W+40;if(r.x>W+40)r.x=-40;
      if(r.y<-40)r.y=H+40;if(r.y>H+40)r.y=-40;});

    // Bullet-rock collision
    bullets.forEach(b=>{
      rocks.forEach(r=>{
        if(Math.hypot(b.x-r.x,b.y-r.y)<r.size) {
          b.life=0;
          aScore += r.size>20?20:r.size>12?50:100;
          // Explosion particles
          for(let i=0;i<6;i++) particles.push({x:r.x,y:r.y,vx:(Math.random()-0.5)*3,vy:(Math.random()-0.5)*3,life:20+Math.random()*10,maxLife:30,color:'#FFD700'});
          if(r.size>12) {
            // Split
            const ns=r.size*0.55;
            for(let i=0;i<2;i++){
              const a=Math.random()*Math.PI*2,spd=1+Math.random()*1.5;
              const pts=[];const np=7+Math.floor(Math.random()*4);
              for(let j=0;j<np;j++){const aa=(j/np)*Math.PI*2;pts.push({x:Math.cos(aa)*ns*(0.7+Math.random()*0.3),y:Math.sin(aa)*ns*(0.7+Math.random()*0.3)});}
              rocks.push({x:r.x,y:r.y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,size:ns,pts,rot:0,rotSpd:(Math.random()-0.5)*0.03});
            }
          }
          r.size=0;
        }
      });
    });
    rocks=rocks.filter(r=>r.size>0);

    // Ship-rock collision
    if(aLives>0) {
      rocks.forEach(r=>{
        if(Math.hypot(ship.x-r.x,ship.y-r.y)<r.size+8) {
          aLives--;
          for(let i=0;i<12;i++) particles.push({x:ship.x,y:ship.y,vx:(Math.random()-0.5)*4,vy:(Math.random()-0.5)*4,life:25,maxLife:25,color:'#ff4444'});
          ship.x=W/2;ship.y=H/2;ship.vx=0;ship.vy=0;
          if(aLives<=0) { astRunning=false; }
        }
      });
    }

    // Level complete
    if(rocks.length===0 && astRunning) {
      aLevel++;
      spawnRocks(4+aLevel, 30);
    }

    // Particles
    particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.life--;});
    particles=particles.filter(p=>p.life>0);

    // Draw particles
    particles.forEach(p=>{
      ctx.globalAlpha=p.life/p.maxLife;
      ctx.fillStyle=p.color;
      ctx.fillRect(p.x-1,p.y-1,3,3);
    });
    ctx.globalAlpha=1;

    // Draw rocks
    rocks.forEach(r=>{
      ctx.save(); ctx.translate(r.x,r.y); ctx.rotate(r.rot);
      ctx.strokeStyle='#aaa'; ctx.lineWidth=1.5;
      ctx.beginPath();
      r.pts.forEach((p,i)=>{i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);});
      ctx.closePath(); ctx.stroke();
      ctx.fillStyle='rgba(100,100,100,0.3)'; ctx.fill();
      ctx.restore();
    });

    // Draw ship
    if(aLives>0) {
      ctx.save(); ctx.translate(ship.x,ship.y); ctx.rotate(ship.angle);
      ctx.strokeStyle='#fff'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(14,0); ctx.lineTo(-10,8); ctx.lineTo(-6,0); ctx.lineTo(-10,-8); ctx.closePath(); ctx.stroke();
      if(ship.thrust && Math.random()>0.3) {
        ctx.strokeStyle='#ff6600';
        ctx.beginPath(); ctx.moveTo(-6,3); ctx.lineTo(-14+Math.random()*4,0); ctx.lineTo(-6,-3); ctx.stroke();
      }
      ctx.restore();
    }

    // Draw bullets
    ctx.fillStyle='#fff';
    bullets.forEach(b=>{ctx.beginPath();ctx.arc(b.x,b.y,2,0,Math.PI*2);ctx.fill();});

    // HUD
    ctx.fillStyle='#FFD700'; ctx.font='bold 12px Courier New';
    ctx.fillText('SCORE: '+aScore, 8, 18);
    ctx.fillText('LIVES: '+aLives, 8, 34);
    ctx.fillText('LEVEL: '+aLevel, W-90, 18);

    // Game over
    if(!astRunning) {
      ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#ff4444'; ctx.font='bold 26px Arial';
      ctx.textAlign='center'; ctx.fillText('GAME OVER',W/2,H/2-10);
      ctx.fillStyle='#FFD700'; ctx.font='14px Arial';
      ctx.fillText('Score: '+aScore,W/2,H/2+18);
      ctx.textAlign='left';
      if(!window._astScoreShown) {
        window._astScoreShown=true;
        setTimeout(() => window.showScoreEntry('asteroids', aScore, closeAsteroids), 600);
      }
      return;
    }

    astAnim=requestAnimationFrame(loop);
  }
  astAnim=requestAnimationFrame(loop);
}

/* ============ PONG ============ */
let pongRunning=false, pongAnim;

function launchPong() {
  const cv=document.getElementById('pong-canvas');
  const maxW=Math.min(400, window.innerWidth-20);
  cv.width=maxW; cv.height=Math.round(maxW*0.7);
  document.getElementById('pong-overlay').classList.add('active');
  initPong();
}
function closePong() {
  document.getElementById('pong-overlay').classList.remove('active');
  pongRunning=false; cancelAnimationFrame(pongAnim);
}

function initPong() {
  pongRunning=true;
  window._pongScoreShown=false;
  const cv=document.getElementById('pong-canvas'), ctx=cv.getContext('2d');
  const W=cv.width, H=cv.height;
  const paddleH=50, paddleW=8, ballR=5;
  let player={y:H/2-paddleH/2}, cpu={y:H/2-paddleH/2};
  let ball={x:W/2,y:H/2,vx:3,vy:2};
  let pScore=0, cScore=0;
  let keys={};
  let serving=true, serveTimer=Date.now();
  const winScore=7;

  if(cv._pongKeyDown) document.removeEventListener('keydown',cv._pongKeyDown);
  if(cv._pongKeyUp) document.removeEventListener('keyup',cv._pongKeyUp);
  cv._pongKeyDown=function(e){
    if(!pongRunning||!document.getElementById('pong-overlay').classList.contains('active'))return;
    keys[e.key]=true;
    if(['ArrowUp','ArrowDown','w','s'].includes(e.key)) e.preventDefault();
  };
  cv._pongKeyUp=function(e){ keys[e.key]=false; };
  document.addEventListener('keydown',cv._pongKeyDown);
  document.addEventListener('keyup',cv._pongKeyUp);

  function resetBall(dir) {
    ball.x=W/2; ball.y=H/2;
    ball.vx=dir*3; ball.vy=(Math.random()-0.5)*4;
    serving=true; serveTimer=Date.now();
  }

  cancelAnimationFrame(pongAnim);
  function loop() {
    if(!pongRunning) return;
    ctx.fillStyle='#000044'; ctx.fillRect(0,0,W,H);

    // Center line
    ctx.setLineDash([4,4]); ctx.strokeStyle='rgba(255,255,255,0.3)';
    ctx.beginPath(); ctx.moveTo(W/2,0); ctx.lineTo(W/2,H); ctx.stroke();
    ctx.setLineDash([]);

    // Player movement
    const spd=5;
    if(keys['ArrowUp']||keys['w']) player.y=Math.max(0,player.y-spd);
    if(keys['ArrowDown']||keys['s']) player.y=Math.min(H-paddleH,player.y+spd);

    // CPU AI — tracks ball with slight delay
    const cpuCenter=cpu.y+paddleH/2;
    const cpuSpd=3.2;
    if(ball.vx>0) {
      if(cpuCenter<ball.y-8) cpu.y+=cpuSpd;
      else if(cpuCenter>ball.y+8) cpu.y-=cpuSpd;
    } else {
      // Drift to center
      if(cpuCenter<H/2-5) cpu.y+=1.5;
      else if(cpuCenter>H/2+5) cpu.y-=1.5;
    }
    cpu.y=Math.max(0,Math.min(H-paddleH,cpu.y));

    // Ball movement
    if(!serving) {
      ball.x+=ball.vx; ball.y+=ball.vy;
      // Top/bottom bounce
      if(ball.y-ballR<0) { ball.y=ballR; ball.vy=Math.abs(ball.vy); }
      if(ball.y+ballR>H) { ball.y=H-ballR; ball.vy=-Math.abs(ball.vy); }
      // Player paddle
      if(ball.vx<0 && ball.x-ballR<=paddleW+10 && ball.y>=player.y && ball.y<=player.y+paddleH) {
        ball.x=paddleW+10+ballR;
        ball.vx=Math.abs(ball.vx)*1.05;
        ball.vy+=((ball.y-(player.y+paddleH/2))/paddleH)*4;
      }
      // CPU paddle
      if(ball.vx>0 && ball.x+ballR>=W-paddleW-10 && ball.y>=cpu.y && ball.y<=cpu.y+paddleH) {
        ball.x=W-paddleW-10-ballR;
        ball.vx=-Math.abs(ball.vx)*1.05;
        ball.vy+=((ball.y-(cpu.y+paddleH/2))/paddleH)*4;
      }
      // Cap speed
      const maxBallSpd=8;
      if(Math.abs(ball.vx)>maxBallSpd) ball.vx=Math.sign(ball.vx)*maxBallSpd;
      if(Math.abs(ball.vy)>maxBallSpd) ball.vy=Math.sign(ball.vy)*maxBallSpd;
      // Score
      if(ball.x<0) { cScore++; resetBall(-1); }
      if(ball.x>W) { pScore++; resetBall(1); }
    } else {
      if(Date.now()-serveTimer>1000) serving=false;
    }

    // Draw paddles
    ctx.fillStyle='#c0c0c0';
    ctx.fillRect(10,player.y,paddleW,paddleH);
    ctx.fillRect(W-10-paddleW,cpu.y,paddleW,paddleH);
    // Paddle highlights
    ctx.fillStyle='rgba(255,255,255,0.3)';
    ctx.fillRect(10,player.y,2,paddleH);
    ctx.fillRect(W-10-paddleW,cpu.y,2,paddleH);

    // Draw ball
    if(!serving || Math.floor(Date.now()/150)%2) {
      ctx.beginPath(); ctx.arc(ball.x,ball.y,ballR,0,Math.PI*2);
      ctx.fillStyle='#FFD700'; ctx.fill();
    }

    // Scores
    ctx.fillStyle='#FFD700'; ctx.font='bold 28px Courier New';
    ctx.textAlign='center';
    ctx.fillText(pScore,W/4,40);
    ctx.fillText(cScore,3*W/4,40);
    ctx.font='10px Arial'; ctx.fillStyle='rgba(255,255,255,0.5)';
    ctx.fillText('YOU',W/4,55);
    ctx.fillText('CPU',3*W/4,55);
    ctx.textAlign='left';

    // Win condition
    if(pScore>=winScore || cScore>=winScore) {
      pongRunning=false;
      ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(0,0,W,H);
      ctx.textAlign='center';
      if(pScore>=winScore) {
        ctx.fillStyle='#00ff00'; ctx.font='bold 24px Arial';
        ctx.fillText('YOU WIN!',W/2,H/2-10);
      } else {
        ctx.fillStyle='#ff4444'; ctx.font='bold 24px Arial';
        ctx.fillText('CPU WINS!',W/2,H/2-10);
      }
      ctx.fillStyle='#FFD700'; ctx.font='14px Arial';
      ctx.fillText(pScore+' - '+cScore,W/2,H/2+18);
      ctx.textAlign='left';
      if(!window._pongScoreShown) {
        window._pongScoreShown=true;
        setTimeout(() => window.showScoreEntry('pong', pScore, closePong), 600);
      }
      return;
    }

    pongAnim=requestAnimationFrame(loop);
  }
  pongAnim=requestAnimationFrame(loop);
}

/* ============ WRITE MAIL MODAL ============ */
function openWriteMail() {
  document.getElementById('writemail-overlay').style.display = 'flex';
  document.getElementById('wm-from').focus();
  resetWriteMail();
}
function closeWriteMail() {
  document.getElementById('writemail-overlay').style.display = 'none';
}
function resetWriteMail() {
  document.getElementById('wm-from').value = '';
  document.getElementById('wm-subject').value = '';
  document.getElementById('wm-message').value = '';
  document.getElementById('wm-status').textContent = '';
  document.getElementById('wm-send-btn').disabled = false;
  document.getElementById('wm-send-btn').textContent = 'Send';
}
async function sendWriteMail() {
  const from = document.getElementById('wm-from').value.trim();
  const subject = document.getElementById('wm-subject').value;
  const message = document.getElementById('wm-message').value.trim();
  const status = document.getElementById('wm-status');
  const btn = document.getElementById('wm-send-btn');

  if (!from || !subject || !message) {
    status.style.color = '#cc0000';
    status.textContent = 'Please fill in all fields.';
    return;
  }
  // Basic email check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from)) {
    status.style.color = '#cc0000';
    status.textContent = 'Please enter a valid email address.';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending...';
  status.style.color = '#000080';
  status.textContent = '';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: from, subject: subject, message: message })
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      status.style.color = '#006600';
      status.textContent = '✉️ Mail Sent!';
      btn.textContent = 'Sent ✓';
      setTimeout(closeWriteMail, 2000);
    } else {
      throw new Error('Send failed');
    }
  } catch (e) {
    btn.disabled = false;
    btn.textContent = 'Send';
    status.style.color = '#cc0000';
    status.textContent = 'Send failed. Please try again.';
  }
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeWriteMail();
});

/* ── INBOX MODAL ── */
function openInbox() {
  document.getElementById('inbox-overlay').style.display = 'flex';
}
function closeInbox() {
  document.getElementById('inbox-overlay').style.display = 'none';
}

/* ── SCREEN NAME MODAL ── */
/* ============ SUPABASE AUTH ============ */
const SB_AUTH_URL = SB_URL + '/auth/v1';

// Current session state
window._aolUser = null;
window._aolProfile = null;

// Restore session on load
(async function restoreSession() {
  try {
    const stored = localStorage.getItem('aol_session');
    if (!stored) return;
    const { access_token, refresh_token } = JSON.parse(stored);
    const res = await fetch(`${SB_AUTH_URL}/user`, {
      headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${access_token}` }
    });
    if (res.ok) {
      window._aolUser = await res.json();
      await loadProfile(access_token);
      updateAuthUI();
    } else {
      localStorage.removeItem('aol_session');
    }
  } catch(e) {}
})();

async function loadProfile(token) {
  if (!window._aolUser) return;
  try {
    const res = await fetch(`${SB_URL}/rest/v1/profiles?id=eq.${window._aolUser.id}&select=*`, {
      headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      window._aolProfile = data[0] || null;
    }
  } catch(e) {}
}

function updateAuthUI() {
  const screenName = window._aolProfile?.screen_name || window._aolUser?.email?.split('@')[0] || null;
  const signInBtn = document.getElementById('auth-signin-btn');
  if (signInBtn) {
    if (window._aolUser) {
      signInBtn.textContent = `👤 ${screenName}`;
      signInBtn.onclick = openProfileModal;
    } else {
      signInBtn.textContent = '🪪 Sign In';
      signInBtn.onclick = openScreenNameModal;
    }
  }
}

function openScreenNameModal() {
  document.getElementById('screenname-overlay').style.display = 'flex';
  switchAuthTab('signin');
}

function closeScreenNameModal() {
  document.getElementById('screenname-overlay').style.display = 'none';
  document.getElementById('si-status').textContent = '';
  document.getElementById('su-status').textContent = '';
}

function switchAuthTab(tab) {
  const isSignin = tab === 'signin';
  document.getElementById('auth-signin-form').style.display = isSignin ? 'block' : 'none';
  document.getElementById('auth-signup-form').style.display = isSignin ? 'none' : 'block';
  document.getElementById('auth-modal-title').textContent = isSignin ? 'Abearica Online — Sign In' : 'Abearica Online — Create Account';
  document.getElementById('tab-signin').className = isSignin ? 'active' : '';
  document.getElementById('tab-signup').className = isSignin ? '' : 'active';
}

function setAuthStatus(el, msg, type) {
  el.textContent = msg;
  el.className = 'auth-status ' + (type || 'error');
}

async function doSignIn() {
  const email = document.getElementById('si-email').value.trim();
  const password = document.getElementById('si-password').value;
  const status = document.getElementById('si-status');
  if (!email || !password) { setAuthStatus(status, 'Please enter your email and password.', 'error'); return; }
  setAuthStatus(status, 'Signing in...', 'success');
  try {
    const res = await fetch(`${SB_AUTH_URL}/token?grant_type=password`, {
      method: 'POST',
      headers: { 'apikey': SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error_description || data.msg || 'Sign in failed');
    localStorage.setItem('aol_session', JSON.stringify({ access_token: data.access_token, refresh_token: data.refresh_token }));
    window._aolUser = data.user;
    await loadProfile(data.access_token);
    updateAuthUI();
    closeScreenNameModal();
    showAuthToast(`Welcome back, ${window._aolProfile?.screen_name || email.split('@')[0]}! 👋`);
  } catch(e) {
    setAuthStatus(status, e.message || 'Sign in failed. Check your email and password.', 'error');
  }
}

async function doSignUp() {
  const screenName = document.getElementById('su-screenname').value.trim();
  const email = document.getElementById('su-email').value.trim();
  const password = document.getElementById('su-password').value;
  const status = document.getElementById('su-status');

  if (!screenName || !email || !password) { setAuthStatus(status, 'All fields are required.', 'error'); return; }
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(screenName)) { setAuthStatus(status, 'Screen name: 3-20 chars, letters/numbers/underscores only.', 'error'); return; }
  if (password.length < 6) { setAuthStatus(status, 'Password must be at least 6 characters.', 'error'); return; }

  setAuthStatus(status, 'Creating your account...', 'success');

  try {
    // 1. Create auth user
    const res = await fetch(`${SB_AUTH_URL}/signup`, {
      method: 'POST',
      headers: { 'apikey': SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error_description || data.msg || 'Signup failed');

    // 2. If we have an access token, create profile immediately
    if (data.access_token) {
      await fetch(`${SB_URL}/rest/v1/profiles`, {
        method: 'POST',
        headers: {
          'apikey': SB_KEY,
          'Authorization': `Bearer ${data.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ id: data.user.id, screen_name: screenName })
      });
      localStorage.setItem('aol_session', JSON.stringify({ access_token: data.access_token, refresh_token: data.refresh_token }));
      window._aolUser = data.user;
      await loadProfile(data.access_token);
      updateAuthUI();
      closeScreenNameModal();
      showAuthToast(`Welcome to Abearica Online, ${screenName}! 🐻`);
    } else {
      // Email confirmation required — show success, hide form fields
      setAuthStatus(status, '✅ Account created! Check your email to confirm, then sign in.', 'success');
      document.getElementById('su-screenname').dataset.pendingScreenName = screenName;
      document.getElementById('su-email').dataset.pendingEmail = email;
    }
  } catch(e) {
    setAuthStatus(status, e.message || 'Signup failed. Try a different email or screen name.', 'error');
  }
}

async function doForgotPassword() {
  const email = document.getElementById('si-email').value.trim();
  const status = document.getElementById('si-status');
  if (!email) { status.textContent = 'Enter your email above first.'; return; }
  status.style.color = '#000080';
  status.textContent = 'Sending reset email...';
  try {
    await fetch(`${SB_AUTH_URL}/recover`, {
      method: 'POST',
      headers: { 'apikey': SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    status.style.color = '#006600';
    status.textContent = '✅ Reset email sent! Check your inbox.';
  } catch(e) {
    status.style.color = '#cc0000';
    status.textContent = 'Could not send reset email.';
  }
}

function doSignOut() {
  localStorage.removeItem('aol_session');
  window._aolUser = null;
  window._aolProfile = null;
  updateAuthUI();
  showAuthToast('You have signed off. Goodbye! 👋');
}

function showAuthToast(msg) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#000080;color:#FFD700;padding:8px 20px;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;z-index:99999;border:2px solid #FFD700;white-space:nowrap;';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

function openProfileModal() {
  // Phase 2 — placeholder for now
  showAuthToast(`Signed in as ${window._aolProfile?.screen_name || window._aolUser?.email} · Sign out coming soon`);
}

// Legacy stub — no longer used
function submitScreenNameInterest() {
}

/* ── F5 IN-PAGE REFRESH ── */
document.addEventListener('keydown', function(e) {
  if((e.key === 'F5' || (e.ctrlKey && e.key === 'r')) && document.getElementById('phase-portal').classList.contains('active')) {
    e.preventDefault();
    window.refreshPulse();
  }
});

/* ── SECTION ROUTER ── */
const SECTION_TITLES = {
  welcome:   'Abearica Online — Welcome Screen',
  services:  'Abearica Online — Services',
  games:     'Abearica Online — Gaming',
  contact:   'Abearica Online — Contact',
  computing: 'Abearica Online — Computing',
  workplace: 'Abearica Online — WorkPlace',
  research:  'Abearica Online — Research',
};
const SECTION_KEYWORDS = {
  welcome:   'abearicaonline.com',
  services:  'Keyword: services',
  games:     'Keyword: gaming',
  contact:   'Keyword: contact',
  computing: 'Keyword: computing',
  workplace: 'Keyword: workplace',
  research:  'Keyword: research',
};

window.loadSection = function(name) {
  // Hide all sections
  document.querySelectorAll('[data-section-content]').forEach(el => el.style.display = 'none');
  // Show requested section
  const target = document.querySelector('[data-section-content="'+name+'"]');
  if(target) target.style.display = '';
  // Update sidebar active state
  document.querySelectorAll('.sidebar-ch').forEach(el => {
    el.classList.toggle('active-ch', el.dataset.section === name);
  });
  // Update title bar
  const titleBar = document.querySelector('#phase-portal .title-bar span:last-child, #phase-portal .title-bar span');
  const titleSpans = document.querySelectorAll('#phase-portal > .aol-window > .title-bar span');
  if(titleSpans.length >= 2) titleSpans[1].textContent = SECTION_TITLES[name] || 'Abearica Online';
  // Update keyword bar
  const kwField = document.querySelector('.keyword-field');
  if(kwField) kwField.value = SECTION_KEYWORDS[name] || 'abearicaonline.com';
  // Scroll center to top
  const center = document.querySelector('.aol-center');
  if(center) center.scrollTop = 0;
  // Always refresh sidebar arcade scoreboard
  renderArcadeScoreboard();

  // Gaming section — scoreboard + news informer
  if(name === 'games') {
    loadNewsInformer();
    fetchArcadeScoreboard();
  }
};

/* ── THE NEWS INFORMER ── */
const NI_FEEDS = {
  stories: 'https://www.eurogamer.net/feed',
  esports:  'https://www.eurogamer.net/feed',
  reviews:  'https://www.eurogamer.net/feed'
};
const NI_ESPORTS_KEYWORDS = ['esport','tournament','championship','league','competitive','team','match','finals','qualifier','roster','lcs','lck','worlds','major','blast','esl'];
const NI_REVIEW_KEYWORDS  = ['review','release','launch','dlc','update','patch','expansion','drops','out now','available','trailer','announced'];

function niArticleHTML(item) {
  const title = sanitizeText(item.title || '');
  const link  = (item.link || '').startsWith('http') ? item.link : '#';
  const source = sanitizeText(item.author || new URL(link).hostname.replace('www.','') || '');
  return `<div style="margin-bottom:8px;padding-bottom:7px;border-bottom:1px solid #f0ece0;">
    <a href="${link}" target="_blank" rel="noopener noreferrer"
       style="color:#0000cc;font-weight:bold;font-size:11px;text-decoration:none;line-height:1.4;display:block;"
       onmouseover="this.style.color='#cc0000'" onmouseout="this.style.color='#0000cc'">${title}</a>
    ${source ? `<span style="font-size:9px;color:#888;font-family:'Courier New',monospace;">${source}</span>` : ''}
  </div>`;
}

// Parse RSS XML text into array of {title, link} objects
function parseRSS(xmlText) {
  try {
    // Try XML parser first, fall back to text/html which is more lenient
    let doc;
    const parser = new DOMParser();
    doc = parser.parseFromString(xmlText, 'text/xml');
    // Check for parse error
    if (doc.querySelector('parsererror')) {
      doc = parser.parseFromString(xmlText, 'text/html');
    }
    const items = Array.from(doc.querySelectorAll('item, entry'));
    return items.map(item => {
      const title = item.querySelector('title')?.textContent?.trim() || '';
      let link = '#';
      const linkEl = item.querySelector('link');
      if (linkEl) {
        const txt = linkEl.textContent?.trim();
        const href = linkEl.getAttribute('href');
        if (txt && txt.startsWith('http')) link = txt;
        else if (href && href.startsWith('http')) link = href;
      }
      if (link === '#') {
        const guid = item.querySelector('guid')?.textContent?.trim();
        if (guid && guid.startsWith('http')) link = guid;
      }
      const categories = Array.from(item.querySelectorAll('category')).map(c=>c.textContent).join(' ');
      return { title, link, categories };
    }).filter(i => i.title);
  } catch(e) { return []; }
}

// Fetch RSS via our own Vercel API proxy (no CORS issues)
async function fetchRSS(url) {
  const res = await fetch('/api/rss?url=' + encodeURIComponent(url));
  if (!res.ok) throw new Error('RSS proxy returned ' + res.status);
  const xml = await res.text();
  const items = parseRSS(xml);
  if (!items.length) throw new Error('No items parsed from feed');
  return items;
}

async function loadNewsInformer() {
  const dl = document.getElementById('ni-dateline');
  if(dl) dl.textContent = new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'}).toUpperCase() + ' EDITION';

  function renderItems(elId, items) {
    const el = document.getElementById(elId);
    if(!el) return;
    if(!items.length) { el.innerHTML = '<div style="color:#999;font-size:10px;font-style:italic;">No articles found.</div>'; return; }
    el.innerHTML = items.slice(0,5).map(niArticleHTML).join('');
  }

  // All three columns pull from same Eurogamer feed, filtered by keyword
  fetchRSS(NI_FEEDS.stories).then(allItems => {

    // Top Stories — general gaming news (everything not esports/review filtered)
    const esportsItems = allItems.filter(i => {
      const t = (i.title+i.categories).toLowerCase();
      return NI_ESPORTS_KEYWORDS.some(k=>t.includes(k));
    });
    const reviewItems = allItems.filter(i => {
      const t = (i.title+i.categories).toLowerCase();
      return NI_REVIEW_KEYWORDS.some(k=>t.includes(k));
    });
    // Top Stories = items not in either filtered set, fallback to all
    const topItems = allItems.filter(i => !esportsItems.includes(i) && !reviewItems.includes(i));
    renderItems('ni-stories', topItems.length ? topItems : allItems);
    renderItems('ni-esports', esportsItems.length ? esportsItems : allItems.slice(5,10));
    renderItems('ni-reviews', reviewItems.length ? reviewItems : allItems.slice(10,15));

  }).catch(() => {
    ['ni-stories','ni-esports','ni-reviews'].forEach(id => {
      const el = document.getElementById(id);
      if(el) el.innerHTML = '<div style="color:#999;font-size:10px;font-style:italic;">Check back soon.</div>';
    });
  });
}

/* ── IN-PAGE SIGN-ON SKIP ── */
// window._aolSignedIn resets on every page load/refresh (sign-on shows fresh every time)
// but persists during section navigation (no page reload = no sign-on repeat).
// This is the correct behavior: real AOL feel on load, smooth nav inside.
window._aolSignedIn = false;
// Clear any stuck sessionStorage flag from previous builds
try { sessionStorage.removeItem('aol_signed_in'); } catch(e) {}


/* ============ SANITY ANNOUNCEMENTS ============ */
async function loadSanityAnnouncements() {
  try {
    const res = await fetch('/api/announcements');
    if (!res.ok) return;
    const announcements = await res.json();
    if (!announcements || !announcements.length) return;
    const panel = document.getElementById('sanity-news-panel');
    const body = document.getElementById('sanity-news-body');
    if (!panel || !body) return;
    body.innerHTML = announcements.map(a => {
      const date = a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'}) : '';
      const bodyText = typeof a.body === 'string' ? a.body : (Array.isArray(a.body) ? a.body.map(b => b.children ? b.children.map(c => c.text || '').join('') : '').join(' ') : '');
      return '<div class="sanity-news-item"><div class="sanity-news-title">'+sanitizeText(a.title||'')+'</div>'+(bodyText?'<div class="sanity-news-body">'+sanitizeText(bodyText.substring(0,200))+'</div>':'')+(date?'<div class="sanity-news-date">'+date+'</div>':'')+'</div>';
    }).join('');
    panel.style.display = 'block';
  } catch(e) {}
}
