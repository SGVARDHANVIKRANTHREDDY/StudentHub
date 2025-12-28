# Debug Guide for StudentHub Expo App

## If you see "something went wrong" in Expo Go:

### Step 1: Check Console Logs
1. Open Expo CLI in your terminal (should already be running)
2. Look for **RED ERROR messages** in the terminal output
3. These logs will tell you exactly what failed

### Step 2: Check Firebase Setup
Run this test in your Firebase Console:
```
1. Go to Firebase Console > Authentication
2. Check if you can sign in with a test account
3. Go to Firestore Database
4. Verify collections exist (or app will show "No items available")
```

### Step 3: Check Phone Connection
```
1. Ensure phone and computer are on SAME Wi-Fi network
2. Both should show similar IP addresses (192.168.x.x)
3. Try connecting phone to computer hotspot if needed
```

### Step 4: Manual Testing Steps
1. **Splash Screen** - Should show "StudentHub" with loading spinner
2. **Login Screen** - Should allow email/password entry
3. **Signup Screen** - Should allow new user registration
4. **Home Screen** - Should show Tuckshop/Marketplace tabs (even if empty)

### Step 5: Error Recovery
If app crashes:
- In Expo CLI, press **r** to reload app
- Check the **terminal logs** for error messages
- Search for **"Error:"** in the logs

---

## Common Issues & Fixes

### Issue: Firebase says "Permission denied"
- **Fix:** Update Firebase Firestore Security Rules
- Go to Firebase Console > Firestore > Rules
- Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Issue: "Cannot find Firebase config"
- **Fix:** Check `services/firebaseConfig.js` has REAL credentials (not placeholders)
- Verify all fields: apiKey, authDomain, projectId, etc.

### Issue: App loads but all screens say "No items available"
- **This is NORMAL** - means no data in Firestore yet
- Add test data in Firebase Console > Firestore > Add documents

### Issue: Authentication fails
- **Check:** Are you using a campus email (.edu)?
- If not, comment out the email validation in SignupScreen.js line ~49

---

## How to Submit Console Logs for Help

1. Copy all terminal output that shows errors
2. Look for timestamps and error messages
3. Share the **full error message** (usually in RED)

---

## If Nothing Works: React Native CLI Migration

If Expo continues to fail, we can migrate to React Native CLI:

```bash
# Stop current Expo server
# Then run:
npx react-native init StudentHub --template typescript
```

This gives more control and better debugging tools.

---

**Made with ❤️ for your hackathon project**
