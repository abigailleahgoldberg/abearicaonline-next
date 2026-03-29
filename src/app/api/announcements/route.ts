import { NextResponse } from 'next/server';
import { getAnnouncements } from '@/lib/sanity';

export async function GET() {
  try {
    const announcements = await getAnnouncements();
    return NextResponse.json(announcements);
  } catch {
    return NextResponse.json([]);
  }
}
