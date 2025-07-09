# 🔥 Firebase Setup Guide

## Step-by-Step Instructions

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project" or "Add project"
3. Enter project name (e.g., "quiz-app")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication
1. In the Firebase Console, click "Authentication" in the left sidebar
2. Click "Get started" button
3. Go to "Sign-in method" tab
4. Click on "Email/Password"
5. Enable the first option (Email/Password)
6. Click "Save"

### 3. Get Firebase Configuration
1. Click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Enter app nickname (e.g., "quiz-web-app")
6. Click "Register app"
7. Copy the firebaseConfig object

### 4. Update Your Code
Replace the content in `lib/firebase.ts` with your actual config:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your-actual-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### 5. Test Authentication
1. Save the file
2. Refresh your app
3. Try creating a new account
4. Check Firebase Console > Authentication > Users to see registered users

## Common Issues & Solutions

### API Key Error
- Make sure you copied the complete config object
- Check that there are no extra spaces or characters
- Ensure the apiKey field is not empty

### Auth Domain Error
- Verify the authDomain matches your project ID
- Format should be: `your-project-id.firebaseapp.com`

### Project Not Found
- Double-check the projectId in your config
- Make sure the project exists in Firebase Console

## Security Notes
- Never commit your Firebase config to public repositories
- Use environment variables for production
- Enable App Check for additional security

## Need Help?
If you're still having issues:
1. Check the browser console for detailed error messages
2. Verify your Firebase project settings
3. Make sure Authentication is enabled in Firebase Console