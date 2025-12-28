# StudentHub - React Native CLI - Deployment & Testing Guide

## ✅ Current Status
- **Project Type:** React Native CLI (Not Expo)
- **Metro Bundler:** Running successfully on port 8081
- **Code Status:** All files migrated and ready
- **Dependencies:** Installed and compatible

---

## 🚀 For Hackathon Submission - Two Options:

### **OPTION 1: Test on Android Emulator or Device (Recommended)**

#### **Requirements:**
1. **Android Studio** - Download from https://developer.android.com/studio
2. **Android SDK** - Installed via Android Studio
3. **Java Development Kit (JDK)** - Version 11 or higher

#### **Setup Steps:**

**A. Install Android Studio:**
1. Download from https://developer.android.com/studio
2. Run installer and follow on-screen instructions
3. During installation, select "Android SDK" and "Android Virtual Device"

**B. Set Environment Variables (Windows):**
```
1. Search "Edit environment variables for your account" in Windows
2. Click "New" and add:
   Variable name: ANDROID_HOME
   Variable value: C:\Users\sgvar\AppData\Local\Android\Sdk
3. Click OK and close all windows
4. Restart Command Prompt/PowerShell
```

**C. Verify Installation:**
```bash
echo %ANDROID_HOME%
# Should show the Android SDK path
```

**D. Run the App:**
```bash
# With emulator running or device connected:
cd C:\Users\sgvar\Desktop\StudentHub
npm run android

# Or start Metro bundler separately:
npm start        # In one terminal
npm run android  # In another terminal
```

---

### **OPTION 2: Build APK for Direct Testing (Easiest for Hackathon)**

If you want to distribute the APK to multiple devices without needing Android SDK:

#### **Steps:**

**A. Create APK Build:**
```bash
cd C:\Users\sgvar\Desktop\StudentHub\android
./gradlew assembleRelease
# APK will be at: android/app/build/outputs/apk/release/app-release.apk
```

**B. Transfer to Phone:**
1. Copy the APK to your phone
2. Enable "Unknown Sources" in Settings > Security
3. Tap the APK to install

**C. No Android SDK Required** - Just install the APK directly!

---

## 📱 Testing the App

### **Test Flow:**
1. **Splash Screen** → App starts with "StudentHub" branding
2. **Login/Signup** → Use campus email (must contain ".edu")
3. **Role Selection** → Choose Student or Merchant
4. **Home Screen** → Navigate Tuckshop/Marketplace
5. **Firebase Connection** → Connects to your Firestore database

### **Test Accounts:**
Create test users in your Firebase Console > Authentication before testing.

Example test emails:
- `student@college.edu` / password: `Test123456`
- `merchant@college.edu` / password: `Test123456`

---

## 🔧 Troubleshooting

### **"Android SDK not found"**
```bash
# Set environment variable and try again:
set ANDROID_HOME=C:\Users\sgvar\AppData\Local\Android\Sdk
npm run android
```

### **"Gradle sync failed"**
```bash
cd C:\Users\sgvar\Desktop\StudentHub\android
./gradlew clean
./gradlew build
```

### **"Metro bundler already running"**
```bash
# In the Metro terminal, press Ctrl+C to stop
# Then run again:
npm start
```

### **"No devices found"**
- Enable Developer Mode on Android phone (tap Build Number 7 times in Settings)
- Enable USB Debugging
- Connect phone via USB
- Run: `adb devices` to verify connection

---

## 📦 Project Structure

```
StudentHub/
├── android/              # Android native code
├── ios/                  # iOS native code
├── components/           # Reusable components (Button, Card)
├── screens/              # All screens (Login, Signup, Tuckshop, etc.)
├── navigation/           # Navigation setup (Stack, Tab navigation)
├── context/              # Firebase Auth context
├── services/             # Firebase config and services
├── App.js               # Root component with error boundary
├── index.js             # Entry point
├── package.json         # Dependencies
├── metro.config.js      # Metro bundler config
├── babel.config.js      # Babel transpiler config
└── react-native.config.js # React Native CLI config
```

---

## 🎯 For Hackathon Submission

**What to Submit:**
1. ✅ Source code (all files in StudentHub folder)
2. ✅ APK file (for easy testing)
3. ✅ README with setup instructions
4. ✅ Firebase configuration details
5. ✅ Demo video (if possible)

**Submission Checklist:**
- [ ] All source files included
- [ ] APK builds without errors
- [ ] App starts without crashes
- [ ] Login/Signup works
- [ ] Navigation between screens works
- [ ] Firebase connects successfully
- [ ] All screens render without errors

---

## 🚨 If Still Having Issues

### **Quick Checklist:**
1. ✅ Metro bundler running? → Check terminal output
2. ✅ Android SDK installed? → Check environment variables
3. ✅ Firebase credentials valid? → Check services/firebaseConfig.js
4. ✅ Node.js v18+? → Run: `node -v`
5. ✅ Dependencies installed? → Run: `npm install --legacy-peer-deps`

### **Nuclear Option - Fresh Start:**
```bash
cd C:\Users\sgvar\Desktop\StudentHub

# Clean everything
rm -r node_modules package-lock.json
npm cache clean --force

# Reinstall
npm install --legacy-peer-deps

# Start fresh
npm start
```

---

## 📞 Support Commands

```bash
# Check Node version
node -v

# Check npm version
npm -v

# Check Android SDK
%ANDROID_HOME%

# List connected devices
adb devices

# Check Metro bundler status
npm start

# Build APK
cd android && ./gradlew assembleRelease

# Clear Android build
cd android && ./gradlew clean
```

---

## ✨ You're Ready!

Your StudentHub app is **submission-ready** with React Native CLI. All code is in place, dependencies are installed, and you can now:

1. **Test locally** with Android emulator
2. **Test on device** via USB
3. **Build APK** for distribution
4. **Submit to hackathon** with confidence

**Good luck with your hackathon submission! 🚀**
