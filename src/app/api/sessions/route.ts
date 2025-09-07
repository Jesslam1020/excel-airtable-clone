import { NextResponse } from 'next/server';
import { getFileSessions } from '@/lib/firebaseService';

export async function GET() {
  try {
    const sessions = await getFileSessions();
    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    console.error('Error fetching file sessions:', error);
    return NextResponse.json({ success: false, error: 'Error fetching file sessions' });
  }
}