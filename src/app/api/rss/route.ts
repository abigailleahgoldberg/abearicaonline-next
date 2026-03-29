import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'AbearicaOnline/1.0 RSS Reader',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      next: { revalidate: 900 } // 15 min cache
    });

    if (!res.ok) {
      return new NextResponse('RSS fetch failed', { status: res.status });
    }

    const text = await res.text();
    return new NextResponse(text, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=900',
      }
    });
  } catch {
    return new NextResponse('RSS proxy error', { status: 500 });
  }
}
