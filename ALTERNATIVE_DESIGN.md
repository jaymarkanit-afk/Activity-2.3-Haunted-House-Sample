# Alternative Haunted House Design

## Overview
This is a completely reimagined haunted house with a **Victorian Gothic** architectural style, featuring a modular code structure and unique visual effects.

## Key Differences from Original

### 1. **Architecture - Victorian Gothic Style**
- **Main Building**: Taller (3.5m) and wider (5m) structure
- **Tower**: Cylindrical tower with conical roof on the side
- **Dual-Slope Roof**: Gothic-style steep roof made from two angled boxes
- **Entrance Porch**: Covered entrance with separate roof
- **Chimney**: Functional-looking brick chimney with cap
- **Multiple Windows**: 4 glowing windows with emissive glass (orange glow)

### 2. **Modular Helper Functions**
```javascript
createTexturedMesh() - Automatic UV2 setup for AO maps
createWindow() - Generates window with frame and glowing glass
createChimney() - Creates multi-part chimney structure
createDeadTree() - Procedural dead trees with twisted branches
createTombstone() - Three types: cross, rounded, and standard
```

### 3. **Vegetation - Dead Trees Instead of Bushes**
- 3 dead trees with twisted branches
- Procedurally generated branch positions
- Dark, ominous appearance
- Various heights and thicknesses

### 4. **Graveyard Enhancements**
- **50 tombstones** with 3 different styles:
  - Cross-shaped tombstones
  - Rounded-top tombstones
  - Standard rectangular tombstones
- **10 fallen/broken tombstones** for realism
- Larger spread radius (5-13 units from center)
- Random rotations for natural appearance

### 5. **Lighting System - Purple/Green Horror Theme**
- **Ambient**: Deep purple (#4a0e4e) at 0.08 intensity
- **Moonlight**: Eerie green (#9fdfbf) at 0.15 intensity
- **Window Lights**: 2 orange interior lights (#ff4400)
- **Tower Light**: Purple light (#8800ff) with pulsing effect
- **Porch Light**: Flickering yellow light (#ffaa00)
- **4 Ghosts** instead of 3:
  - Green ghost (#00ff88) - ground level spiral
  - Purple ghost (#aa00ff) - high floating figure-eight
  - Red ghost (#ff0044) - erratic darting
  - Blue ghost (#0088ff) - slow ominous circle

### 6. **Fog & Atmosphere**
- **Darker fog color**: #1a0f2e (deep purple-black)
- **Thicker fog**: Starts at 2 units, fully opaque at 18 units
- **Matching clear color** for seamless horizon

### 7. **Advanced Animations**
- **Ghost 1**: Spiral pattern with variable radius and pulsating intensity
- **Ghost 2**: Figure-eight pattern at high altitude
- **Ghost 3**: Fast erratic movements with rapid intensity changes
- **Ghost 4**: Slow wide circle (10-unit radius)
- **Porch Light**: Random flickering with occasional dramatic drops
- **Window Lights**: Subtle sine-wave flickering
- **Tower Light**: Smooth pulsing effect
- All ghost lights have dynamic intensity changes

### 8. **Enhanced Shadows**
- Higher resolution moonlight shadows (512x512)
- All house components cast shadows
- All lights cast shadows (8 light sources total)
- Optimized shadow camera ranges

## Visual Style Comparison

| Feature | Original | Alternative |
|---------|----------|-------------|
| Architecture | Simple cottage | Victorian Gothic mansion |
| Height | 2.5m walls | 3.5m walls + 4m tower |
| Roof | Pyramid | Dual-slope Gothic |
| Vegetation | Round bushes | Dead twisted trees |
| Windows | None | 4 glowing windows |
| Tombstones | 50 identical | 50 varied + 10 fallen |
| Ghosts | 3 simple paths | 4 complex patterns |
| Color Theme | Blue/Orange | Purple/Green |
| Lighting | 3 lights | 8 lights with effects |
| Atmosphere | Misty | Dark and ominous |

## Code Structure Improvements
1. **Helper functions** for reusable components
2. **Procedural generation** for trees and tombstones
3. **Dynamic animations** with intensity modulation
4. **Modular design** for easy modifications
5. **Better organization** with clear sections

## Performance Considerations
- Shared geometries for tombstones (3 types)
- Optimized shadow map sizes
- Efficient light placement
- Minimal draw calls through grouping

## Customization Ideas
- Uncomment line 623 to add subtle house rotation
- Adjust ghost speeds by changing multipliers
- Modify fog density and color
- Add more window variations
- Create additional architectural details
- Add particle effects for enhanced atmosphere

## Technical Features
- **Antialias enabled** for smoother edges
- **PCFSoftShadowMap** for better shadow quality
- **Dynamic light intensity** for all animated lights
- **UV2 attributes** automatically set for AO maps
- **Emissive materials** for glowing windows
