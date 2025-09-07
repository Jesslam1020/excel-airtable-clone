import { NextRequest, NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import { saveFileSession } from '@/lib/firebaseService';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload route called');
    console.log('Environment check:', {
      hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      nodeEnv: process.env.NODE_ENV
    });
    
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      console.log('No file provided');
      return NextResponse.json({ success: false, error: 'No file provided' });
    }

    console.log('Processing file:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        success: false, 
        error: 'File too large. Maximum size is 10MB.' 
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('File converted to buffer, size:', buffer.length);

    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetNames = workbook.SheetNames;
    const sheetsData: { [key: string]: any[] } = {};

    console.log('Workbook loaded, sheets:', sheetNames);

    sheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
      sheetsData[sheetName] = jsonData;
      console.log(`Sheet "${sheetName}" processed, rows:`, jsonData.length);
    });

    console.log('File processed, saving to Firebase...');

    // Save to Firebase with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Firebase timeout after 30 seconds')), 30000);
    });

    const savePromise = saveFileSession({
      fileName: file.name,
      sheets: sheetsData
    });

    const sessionId = await Promise.race([savePromise, timeoutPromise]) as string;

    console.log('File saved successfully with ID:', sessionId);

    return NextResponse.json({ 
      success: true, 
      sessionId: sessionId,
      sheets: sheetsData,
      message: 'File uploaded and saved successfully!'
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
      if (error.message.includes('timeout')) {
        return NextResponse.json({ 
          success: false, 
          error: 'Upload timeout. Please try with a smaller file or check your internet connection.' 
        });
      }
      if (error.message.includes('invalid-argument')) {
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid data format. Please try uploading a different Excel file.' 
        });
      }
      return NextResponse.json({ 
        success: false, 
        error: `Error processing file: ${error.message}` 
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Unknown error processing file. Please try again.' 
    });
  }
}
