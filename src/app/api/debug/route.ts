import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envCheck = {
      nodeEnv: process.env.NODE_ENV,
      firebaseConfig: {
        hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        hasStorageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        hasMessagingSenderId: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        hasAppId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      },
      timestamp: new Date().toISOString(),
    };

    console.log('?? Environment check:', envCheck);

    return NextResponse.json({ 
      success: true, 
      environment: envCheck,
      message: 'Debug information retrieved successfully'
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Debug check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}