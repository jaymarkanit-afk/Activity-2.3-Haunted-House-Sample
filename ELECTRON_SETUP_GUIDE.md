# 🚀 Quick Setup Guide - 3D Lighting Studio

## Step-by-Step Installation

### Method 1: Using the Electron Package File (Recommended)

1. **Open Terminal/PowerShell** in this directory:
   ```powershell
   cd "c:\Users\kenth\OneDrive\Kento\Activity 2\Activity 2.3 Haunted House Sample"
   ```

2. **Copy the electron-package.json to package.json:**
   ```powershell
   copy electron-package.json package.json
   ```

3. **Install dependencies:**
   ```powershell
   npm install
   ```

4. **Run the application:**
   ```powershell
   npm start
   ```

### Method 2: Manual Installation

1. **Open Terminal in this directory**

2. **Install Electron:**
   ```powershell
   npm install electron@^28.0.0 --save-dev
   ```

3. **Install Three.js and lil-gui:**
   ```powershell
   npm install three@^0.160.0 lil-gui@^0.19.1
   ```

4. **Run with npx:**
   ```powershell
   npx electron electron-main.js
   ```

### Method 3: Alternative Run Command

If the above methods don't work:

```powershell
node_modules\.bin\electron.cmd electron-main.js
```

## ✅ Verification

After running, you should see:
- A desktop window titled "3D Lighting Studio - Activity 2"
- An info panel on the left with feature descriptions
- A 3D scene with rotating objects and lights
- A control panel (lil-gui) on the right side
- A menu bar at the top (File, View, Scenes, Help)

## 🎮 First Steps

1. **Try the menu bar**: Click "Scenes" → Select different scenes
2. **Use the GUI panel**: Adjust light intensities and colors
3. **Camera controls**: 
   - Left drag to rotate
   - Right drag to pan
   - Scroll to zoom
4. **Export settings**: File → Export Scene Settings

## ⚠️ Common Issues

### "Cannot find module 'electron'"
**Solution**: Run `npm install` in the project directory

### "electron-main.js not found"
**Solution**: Make sure you're in the correct directory with all electron-*.js files

### Black screen
**Solution**: 
- Open DevTools (View → Toggle DevTools)
- Check for errors in console
- Try reloading (View → Reload)

### GUI not showing
**Solution**: Ensure lil-gui is installed: `npm install lil-gui`

## 📦 What Gets Installed

- **electron** (~200MB): Desktop application framework
- **three** (~5MB): 3D graphics library
- **lil-gui** (~100KB): GUI controls library

Total size: ~205MB

## 🔍 File Checklist

Ensure these files exist:
- ✅ electron-main.js (Main Electron process)
- ✅ electron-index.html (HTML interface)
- ✅ electron-renderer.js (Three.js scenes)
- ✅ electron-styles.css (Styling)
- ✅ electron-package.json (Dependencies)

## 💻 System Requirements

- **OS**: Windows 10/11, macOS 10.13+, or Linux
- **Node.js**: v16.0.0 or higher
- **RAM**: Minimum 4GB
- **GPU**: WebGL-capable graphics card
- **Disk Space**: ~250MB for installation

## 📝 Additional Commands

### Development Mode (with auto-reload)
```powershell
npm run dev
```

### Check if Node.js is installed
```powershell
node --version
```

### Check if npm is installed
```powershell
npm --version
```

### View installed packages
```powershell
npm list
```

## 🎯 Ready to Start?

Once installed, run:
```powershell
npm start
```

And start exploring the 3D Lighting Studio!

---

Need help? Check the main ELECTRON_README.md for detailed documentation.
