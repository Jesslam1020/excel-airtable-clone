import { NextRequest, NextResponse } from 'next/server';
import { getFileSessions, deleteFileSession } from '@/lib/firebaseService';

export async function GET() {
  try {
    const sessions = await getFileSessions();
    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    console.error('Error fetching file sessions:', error);
    return NextResponse.json({ success: false, error: 'Error fetching file sessions' });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('id');
    
    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Session ID is required' });
    }

    await deleteFileSession(sessionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file session:', error);
    return NextResponse.json({ success: false, error: 'Error deleting file session' });
  }
}