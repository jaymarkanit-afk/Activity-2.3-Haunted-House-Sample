# 🎨 3D Lighting Studio - Electron.js Application

An interactive desktop application built with **Electron.js** and **Three.js** that demonstrates lighting, shadows, and materials concepts from Activities 2.1, 2.2, and 2.3.

## 📋 Overview

This application integrates the key concepts learned in Activity 2:
- **Activity 2.1**: Six different types of lights (Ambient, Directional, Hemisphere, Point, RectArea, Spot)
- **Activity 2.2**: Real-time shadow mapping with optimization controls
- **Activity 2.3**: Complex scene composition with the haunted house example

## ✨ Features

### 🔦 Four Interactive Scenes

1. **Basic Lighting Demo** - Showcases all 6 light types from Activity 2.1
2. **Shadows Showcase** - Demonstrates real-time shadow casting from Activity 2.2
3. **Haunted House** - Victorian gothic scene with atmospheric lighting, flying crows & bats from Activity 2.3
4. **Material Explorer** - Interactive material properties editor

### 🎛️ Interactive Controls

- **GUI Panel**: Real-time adjustment of light properties, intensities, positions, and colors
- **Orbit Controls**: Left-click to rotate, right-click to pan, scroll to zoom
- **Menu Bar**: Native application menu with scene switching and settings export
- **Material Editor**: Adjust roughness, metalness, and other material properties

### 💾 Scene Management

- Export scene settings to JSON
- Load saved scene configurations
- Switch between scenes via menu bar

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Installation Steps

1. **Navigate to the project directory:**
   ```bash
   cd "c:\Users\kenth\OneDrive\Kento\Activity 2\Activity 2.3 Haunted House Sample"
   ```

2. **Install dependencies using the Electron package.json:**
   ```bash
   npm install --prefix . electron-package.json
   ```
   
   Or manually install:
   ```bash
   npm init -y
   npm install electron@^28.0.0 --save-dev
   npm install three@^0.160.0 lil-gui@^0.19.1
   ```

3. **Run the application:**
   ```bash
   npm start --prefix . electron-package.json
   ```
   
   Or directly with Electron:
   ```bash
   npx electron electron-main.js
   ```

## 📁 File Structure

```
Activity 2.3 Haunted House Sample/
├── electron-package.json       # Electron app dependencies
├── electron-main.js            # Main Electron process
├── electron-index.html         # Application HTML
├── electron-renderer.js        # Three.js renderer & scenes
├── electron-styles.css         # Application styles
├── ELECTRON_README.md          # This file
└── static/                     # Static assets (optional)
```

## 🎮 Usage Guide

### Menu Bar Options

#### File Menu
- **Export Scene Settings** (`Ctrl+S`): Save current scene configuration to JSON
- **Load Scene Settings** (`Ctrl+O`): Load previously saved scene configuration
- **Exit** (`Ctrl+Q`): Close the application

#### View Menu
- **Reload**: Refresh the application
- **Toggle DevTools**: Open developer console for debugging
- **Zoom Controls**: Adjust zoom level
- **Toggle Fullscreen**: Enter/exit fullscreen mode

#### Scenes Menu
- **Basic Lighting Demo**: Switch to light types demonstration
- **Shadows Showcase**: Switch to shadow casting demonstration
- **Haunted House**: Switch to atmospheric scene
- **Material Explorer**: Switch to material properties editor

#### Help Menu
- **About**: View application information
- **Documentation**: Open Three.js documentation

### Camera Controls

- **Left Mouse Button**: Rotate camera around the scene
- **Right Mouse Button**: Pan the camera
- **Mouse Wheel**: Zoom in/out
- **Double Click**: Reset camera position (if implemented)

### GUI Controls Panel

Located on the right side of the screen, the GUI panel provides:
- Light intensity sliders
- Position controls (x, y, z)
- Color pickers for lights
- Material property adjusters (roughness, metalness)
- Scene-specific options

## 🎓 Educational Concepts

### Activity 2.1 - Lights
Demonstrates six fundamental light types:
- **AmbientLight**: Uniform illumination from all directions
- **DirectionalLight**: Parallel rays like sunlight
- **HemisphereLight**: Sky and ground color lighting
- **PointLight**: Omnidirectional light from a point
- **RectAreaLight**: Rectangular area light source
- **SpotLight**: Cone-shaped directional light

### Activity 2.2 - Shadows
Shows shadow mapping techniques:
- **Shadow Map Optimization**: Configurable shadow map sizes
- **Multiple Shadow Types**: Basic, PCF, PCF Soft
- **Shadow Camera Helpers**: Visualize shadow frustum
- **Performance Considerations**: Balance quality vs. performance

### Activity 2.3 - Complex Scenes
Builds on previous concepts:
- **Scene Composition**: Multiple objects and lights working together
- **Atmospheric Effects**: Fog, emissive materials
- **Animation**: Animated lights and objects
- **Themed Design**: Victorian gothic aesthetic

## 🔧 Customization

### Adding New Scenes

Edit `electron-renderer.js` and add a new scene function:

```javascript
function loadMyCustomScene() {
    // Your scene setup here
    lights.ambient = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(lights.ambient)
    
    // Add objects, lights, etc.
}
```

Then update the menu in `electron-main.js`:

```javascript
{
    label: 'My Custom Scene',
    click: () => {
        mainWindow.webContents.send('load-scene', 'custom')
    }
}
```

### Modifying Light Properties

All light configurations are in the scene loading functions. Adjust parameters like:
- `intensity`: Light brightness
- `color`: Light color (hex format)
- `position`: Light location in 3D space
- `distance`: Light falloff distance (for Point/Spot lights)

## 🐛 Troubleshooting

### Application won't start
- Ensure Node.js is installed: `node --version`
- Verify dependencies are installed: Check `node_modules` folder exists
- Try reinstalling: `npm install`

### Black screen or no render
- Check browser console in DevTools (`Ctrl+Shift+I`)
- Verify GPU acceleration is enabled
- Update graphics drivers

### GUI not showing
- Check if lil-gui is properly installed
- Look for JavaScript errors in console
- Verify `electron-renderer.js` is loading

### Performance issues
- Reduce shadow map sizes in the code
- Disable shadows: Set `renderer.shadowMap.enabled = false`
- Lower the number of objects in complex scenes

## 📚 Learning Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [Electron Documentation](https://www.electronjs.org/docs)
- [Three.js Examples](https://threejs.org/examples/)
- [WebGL Fundamentals](https://webglfundamentals.org/)

## 🎯 Assignment Requirements Met

✅ **Electron.js Application**: Desktop app with native menus and windows  
✅ **Activity 2.1 Integration**: All 6 light types demonstrated  
✅ **Activity 2.2 Integration**: Real-time shadows with controls  
✅ **Activity 2.3 Integration**: Complex haunted house scene included  
✅ **Interactive Controls**: GUI panel and orbit controls  
✅ **Educational Value**: Clear demonstration of lighting concepts  

## 💡 Future Enhancements

Potential additions for extended learning:
- [ ] Texture loading and management
- [ ] Model import (GLTF/GLB)
- [ ] Screenshot/render export
- [ ] Multiple camera presets
- [ ] Animation timeline
- [ ] Post-processing effects
- [ ] Scene graph editor

## 📝 Notes

- This application requires a GPU with WebGL support
- Performance may vary based on hardware capabilities
- Some features require Node integration (enabled in this app)
- The haunted house scene is GPU-intensive due to multiple shadow-casting lights

## 👨‍🎓 Author

Created as part of Activity 2 coursework - Computer Graphics module

## 📄 License

MIT License - Free to use for educational purposes

---

**Enjoy exploring 3D lighting concepts! 🚀**
