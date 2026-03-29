import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sign = searchParams.get('sign') || 'aries';

  try {
    const res = await fetch(`https://ohmanda.com/api/horoscope/${sign}/`, {
      headers: { 'User-Agent': 'AbearicaOnline/1.0' },
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    return NextResponse.json({ horoscope: data.horoscope || 'No reading available.' });
  } catch {
    return NextResponse.json({ horoscope: 'The stars are quiet today.' });
  }
}
