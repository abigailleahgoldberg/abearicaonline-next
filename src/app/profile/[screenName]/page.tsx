import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const SB_URL = 'https://ipvhaomxpgwtqmlbigdv.supabase.co';
const SB_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwdmhhb214cGd3dHFtbGJpZ2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMzc3MDcsImV4cCI6MjA4OTcxMzcwN30.XO4ZegjViPbFw5py9apcyHq2vWmiaGkv08f9hITnL9w';

type Profile = {
  id: string;
  screen_name: string;
  away_message: string | null;
  avatar_url: string | null;
  created_at: string | null;
};

type Score = {
  game: string;
  initials: string | null;
  score: number;
  screen_name: string | null;
  created_at: string | null;
};

const GAME_META: Record<string, { icon: string; name: string; lowerIsBetter?: boolean; unit?: string }> = {
  breakout:        { icon: '🏓', name: 'Block RAID' },
  minesweeper:     { icon: '💣', name: 'BugSweep', lowerIsBetter: true, unit: 's' },
  tetris:          { icon: '🧱', name: 'Block Drop' },
  'word-muncher':  { icon: '📖', name: 'Parse Munch' },
  'number-muncher':{ icon: '🔢', name: 'BitCruncher' },
  asteroids:       { icon: '🚀', name: 'Void Shred' },
  pong:            { icon: '🏸', name: 'Ping_' },
};

async function sb(path: string) {
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    headers: { apikey: SB_ANON_KEY, Authorization: `Bearer ${SB_ANON_KEY}` },
    next: { revalidate: 30 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata(
  { params }: { params: Promise<{ screenName: string }> }
): Promise<Metadata> {
  const { screenName } = await params;
  return {
    title: `${screenName} — Abearica Online`,
    description: `High scores and profile for ${screenName} on Abearica Online.`,
  };
}

export default async function ProfilePage(
  { params }: { params: Promise<{ screenName: string }> }
) {
  const { screenName } = await params;
  const decoded = decodeURIComponent(screenName);

  const profiles: Profile[] | null = await sb(
    `profiles?screen_name=eq.${encodeURIComponent(decoded)}&select=id,screen_name,away_message,avatar_url,created_at&limit=1`
  );
  if (!profiles || profiles.length === 0) notFound();
  const profile = profiles[0];

  const scoresRaw: Score[] | null = await sb(
    `arcade_scores?screen_name=eq.${encodeURIComponent(decoded)}&select=game,score,screen_name,created_at&limit=1000`
  );
  const scores = scoresRaw ?? [];

  // Best score per game (handle minesweeper = lower is better)
  const bestByGame: Record<string, Score | undefined> = {};
  for (const s of scores) {
    const lower = GAME_META[s.game]?.lowerIsBetter;
    const cur = bestByGame[s.game];
    if (!cur) bestByGame[s.game] = s;
    else if (lower ? s.score < cur.score : s.score > cur.score) bestByGame[s.game] = s;
  }

  const totalGamesPlayed = scores.length;
  const gamesWithScore = Object.keys(bestByGame).length;
  const joined = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return (
    <div style={{ minHeight: '100vh', background: '#000080', padding: '24px 12px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ marginBottom: 12 }}>
          <Link href="/" style={{ color: '#FFD700', fontSize: 12, textDecoration: 'none', fontFamily: "'Courier New', monospace" }}>
            ← Back to Abearica Online
          </Link>
        </div>

        <div style={{
          background: '#c0c0c0',
          borderTop: '3px solid #fff',
          borderLeft: '3px solid #fff',
          borderRight: '3px solid #404040',
          borderBottom: '3px solid #404040',
        }}>
          <div style={{
            background: 'linear-gradient(to right, #000080, #1084d0)',
            color: '#fff',
            fontSize: 12,
            fontWeight: 'bold',
            padding: '4px 8px',
          }}>
            👤 {profile.screen_name} — Profile &amp; High Scores
          </div>

          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
              <div style={{
                width: 72, height: 72, borderRadius: 4,
                background: 'linear-gradient(135deg, #000080, #1084d0)',
                color: '#FFD700',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, fontWeight: 900, fontFamily: 'Arial Black, sans-serif',
                borderTop: '2px solid #fff', borderLeft: '2px solid #fff',
                borderRight: '2px solid #404040', borderBottom: '2px solid #404040',
              }}>
                {profile.screen_name.substring(0, 1).toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 'bold', color: '#000080' }}>
                  {profile.screen_name}
                </div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>Member since {joined}</div>
                {profile.away_message && (
                  <div style={{ marginTop: 6, padding: '4px 8px', background: '#fffbe6', border: '1px solid #e8cf4b', fontSize: 11, fontStyle: 'italic', color: '#664d00', fontFamily: "'Lora', serif" }}>
                    💬 {profile.away_message}
                  </div>
                )}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 10,
              marginBottom: 18,
            }}>
              <div style={{ background: '#0a0a0a', color: '#FFD700', padding: 10, border: '1px solid #333', textAlign: 'center', fontFamily: "'Courier New', monospace" }}>
                <div style={{ fontSize: 22, fontWeight: 'bold' }}>{gamesWithScore}<span style={{ fontSize: 12, color: '#aa7700' }}>/7</span></div>
                <div style={{ fontSize: 10, letterSpacing: 1, color: '#aa7700' }}>GAMES WITH A HIGH SCORE</div>
              </div>
              <div style={{ background: '#0a0a0a', color: '#FFD700', padding: 10, border: '1px solid #333', textAlign: 'center', fontFamily: "'Courier New', monospace" }}>
                <div style={{ fontSize: 22, fontWeight: 'bold' }}>{totalGamesPlayed}</div>
                <div style={{ fontSize: 10, letterSpacing: 1, color: '#aa7700' }}>TOTAL SCORES RECORDED</div>
              </div>
            </div>

            <div style={{
              background: '#0a0a0a',
              border: '2px solid #333',
              borderRadius: 4,
              overflow: 'hidden',
              marginBottom: 10,
            }}>
              <div style={{
                background: 'linear-gradient(to right, #1a0a00, #3a1a00)',
                padding: '6px 10px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid #3a2a00',
              }}>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 12, fontWeight: 'bold', color: '#FFD700', letterSpacing: 2 }}>
                  🏆 PERSONAL HIGH SCORES
                </span>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: '#aa7700', letterSpacing: 1 }}>
                  BY GAME
                </span>
              </div>
              <div>
                {Object.entries(GAME_META).map(([key, meta]) => {
                  const best = bestByGame[key];
                  return (
                    <div key={key} style={{ padding: '8px 12px', borderBottom: '1px solid #1a1500', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'Courier New', monospace" }}>
                      <div style={{ color: '#FFD700', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 }}>
                        {meta.icon} {meta.name.toUpperCase()}
                      </div>
                      {best ? (
                        <div style={{ color: '#ffe066', fontSize: 13, fontWeight: 'bold' }}>
                          {meta.lowerIsBetter ? `${best.score}${meta.unit || ''}` : best.score.toLocaleString()}
                        </div>
                      ) : (
                        <div style={{ color: '#554400', fontSize: 11, fontStyle: 'italic' }}>no high score yet</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: 11, color: '#555', marginTop: 14 }}>
              <Link href="/" style={{ color: '#000080', fontWeight: 'bold', textDecoration: 'underline' }}>
                ← Play more on Abearica Online
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
