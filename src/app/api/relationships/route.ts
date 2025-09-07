import { NextRequest, NextResponse } from 'next/server';
import { getRelationships, saveRelationship, deleteRelationship } from '@/lib/firebaseService';

export async function GET() {
  try {
    const relationships = await getRelationships();
    return NextResponse.json({ success: true, relationships });
  } catch (error) {
    console.error('Error fetching relationships:', error);
    return NextResponse.json({ success: false, error: 'Error fetching relationships' });
  }
}

export async function POST(request: NextRequest) {
  try {
    const relationshipData = await request.json();
    const relationshipId = await saveRelationship(relationshipData);
    return NextResponse.json({ success: true, relationshipId });
  } catch (error) {
    console.error('Error saving relationship:', error);
    return NextResponse.json({ success: false, error: 'Error saving relationship' });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const relationshipId = searchParams.get('id');
    
    if (!relationshipId) {
      return NextResponse.json({ success: false, error: 'Relationship ID is required' });
    }

    await deleteRelationship(relationshipId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting relationship:', error);
    return NextResponse.json({ success: false, error: 'Error deleting relationship' });
  }
}