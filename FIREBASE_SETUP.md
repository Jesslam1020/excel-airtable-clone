# Firebase Setup Guide for Excel-Airtable Clone

## ?? Firebase Project Setup

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Follow the setup wizard (you can skip Google Analytics for now)

### Step 2: Enable Firestore Database
1. In your Firebase project, go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location close to your users

### Step 3: Get Firebase Configuration
1. Go to **Project Settings** (gear icon in left sidebar)
2. Scroll down to **"Your apps"** section
3. Click **"Add app"** and select the web icon (`</>`)
4. Register your app with name: `excel-airtable-clone`
5. Copy the Firebase configuration object

### Step 4: Configure Environment Variables
1. Open the `.env.local` file in your project root
2. Replace the placeholder values with your actual Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id_here
```

### Step 5: Deploy Firestore Security Rules (Optional)
If you have Firebase CLI installed:
```bash
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

## ?? Running the Application

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to [http://localhost:3000](http://localhost:3000)

## ?? Database Structure

The application creates two main collections in Firestore:

### fileSessions Collection
```javascript
{
  id: "auto-generated-id",
  fileName: "example.xlsx",
  sheets: {
    "Sheet1": [
      ["Header1", "Header2", "Header3"],
      ["Row1Col1", "Row1Col2", "Row1Col3"],
      // ... more rows
    ]
  },
  uploadedAt: Timestamp,
  userId: "optional-for-future-auth"
}
```

### relationships Collection
```javascript
{
  id: "auto-generated-id",
  source: {
    fileId: "session-id",
    sheetName: "Sheet1",
    columnName: "ID"
  },
  target: {
    fileId: "another-session-id",
    sheetName: "Sheet2", 
    columnName: "UserID"
  },
  createdAt: Timestamp,
  userId: "optional-for-future-auth"
}
```

## ?? Security Considerations

**Important**: The current Firestore rules allow open read/write access for development. For production:

1. **Enable Authentication**: Add Firebase Auth
2. **Update Security Rules**: Restrict access to authenticated users
3. **Add User Context**: Associate data with specific users

Example production rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /fileSessions/{sessionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    match /relationships/{relationshipId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## ?? Features Enabled by Firebase

- ? **Persistent Storage**: Files and relationships persist across sessions
- ? **Real-time Sync**: Multiple users can see updates in real-time
- ? **Scalability**: Handles large datasets and multiple users
- ? **Global Search**: Search across all saved files efficiently
- ? **Relationship Management**: Create and manage data relationships
- ?? **Future**: User authentication and multi-tenancy support

## ??? Troubleshooting

### Firebase Connection Issues
- Ensure your `.env.local` file has correct values
- Check that Firestore is enabled in your Firebase project
- Verify your Firebase project ID is correct

### Build Errors
- Make sure all environment variables are set
- Run `npm install` to ensure all dependencies are installed
- Check that your Firebase config values don't contain special characters

### Permission Denied Errors
- During development, these are normal if you haven't set up the Firebase project yet
- In production, ensure your Firestore security rules are properly configured

## ?? Next Steps

1. **Set up your Firebase project** using the steps above
2. **Test file upload** and verify data appears in Firestore console
3. **Create relationships** between different files
4. **Consider adding user authentication** for production use

Happy coding! ??