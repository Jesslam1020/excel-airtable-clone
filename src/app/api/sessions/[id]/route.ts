import { NextRequest, NextResponse } from 'next/server';
import { getFileSession, updateFileSession } from '@/lib/firebaseService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getFileSession(params.id);
    if (!session) {
      return NextResponse.json({ success: false, error: 'File session not found' });
    }
    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error('Error fetching file session:', error);
    return NextResponse.json({ success: false, error: 'Error fetching file session' });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    await updateFileSession(params.id, updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating file session:', error);
    return NextResponse.json({ success: false, error: 'Error updating file session' });
  }
}