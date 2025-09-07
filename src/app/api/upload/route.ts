import { NextRequest, NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import { saveFileSession } from '@/lib/firebaseService';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload route called');
    
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      console.log('No file provided');
      return NextResponse.json({ success: false, error: 'No file provided' });
    }

    console.log('Processing file:', file.name);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetNames = workbook.SheetNames;
    const sheetsData: { [key: string]: any[] } = {};

    sheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
      sheetsData[sheetName] = jsonData;
    });

    console.log('File processed, saving to Firebase...');

    // Save to Firebase
    const sessionId = await saveFileSession({
      fileName: file.name,
      sheets: sheetsData
    });

    console.log('File saved successfully with ID:', sessionId);

    return NextResponse.json({ 
      success: true, 
      sessionId: sessionId,
      sheets: sheetsData 
    });
  } catch (error) {
    console.error('Detailed error in upload route:', error);
    
    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes('permission-denied')) {
        return NextResponse.json({ 
          success: false, 
          error: 'Firebase permission denied. Please check your Firestore security rules and project configuration.' 
        });
      }
      if (error.message.includes('not-found')) {
        return NextResponse.json({ 
          success: false, 
          error: 'Firebase project not found. Please verify your project ID in environment variables.' 
        });
      }
      return NextResponse.json({ 
        success: false, 
        error: `Error processing file: ${error.message}` 
      });
    }
    
    return NextResponse.json({ success: false, error: 'Unknown error processing file' });
  }
}
