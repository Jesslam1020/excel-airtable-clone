# Firebase Troubleshooting Guide

## ?? Current Issues and Solutions

### Issue 1: Permission Denied Errors
**Error**: `Missing or insufficient permissions`

**Solution**: Update your Firestore security rules:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **essay-460509**
3. Navigate to **Firestore Database** ? **Rules** tab
4. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write to all documents for development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

5. Click **Publish**

### Issue 2: Nested Arrays Error (FIXED)
**Error**: `Nested arrays are not supported`

**Status**: ? **FIXED** - The code now converts arrays to JSON strings before storing in Firebase.

## ?? Test Your Setup

After updating the security rules, try uploading a file again. You should see:

1. **Success messages** in the browser console
2. **File appears** in the left sidebar
3. **Data stored** in your Firebase console

## ?? How to Check Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **essay-460509**
3. Go to **Firestore Database** ? **Data** tab
4. You should see collections:
   - `fileSessions` (your uploaded files)
   - `relationships` (any relationships you create)

## ?? Still Having Issues?

### Check Browser Console
1. Open Developer Tools (F12)
2. Look for detailed error messages
3. Check the **Console** and **Network** tabs

### Common Issues:
- **Wrong project ID**: Verify your `.env.local` has the correct Firebase config
- **Rules not published**: Make sure you clicked "Publish" after updating rules
- **Internet connection**: Ensure stable internet connection

### Current Configuration Status:
- ? Firebase project ID: `essay-460509`
- ? Environment variables: Properly configured
- ?? Firestore rules: **NEEDS UPDATE** (follow Issue 1 solution above)
- ? Code fixes: Applied for nested arrays issue

## ?? Next Steps

1. **Update Firestore rules** (most important!)
2. **Restart your dev server**: `npm run dev`
3. **Try uploading a file**
4. **Check Firebase Console** to see your data

Once you update the security rules, everything should work perfectly! ??