# Haunted House Implementation Notes

## Overview
This project implements a complete haunted house scene using Three.js primitives, textures, lighting, fog, and shadows.

## Key Features Implemented

### 1. House Structure
- **Walls**: 4x2.5x4 box with brick textures
- **Roof**: Pyramid shape created from a cone geometry with 4 sides
- **Door**: 2.2x2.2 plane with full PBR textures (color, alpha, AO, height, normal, metalness, roughness)
- **Bushes**: 4 spheres of varying sizes positioned around the house entrance

### 2. Graves
- 50 procedurally generated graves positioned randomly in a circle around the house
- Random rotation for natural appearance
- Radius varies between 3-9 units from center

### 3. Textures
All textures loaded from `/static/textures/` folder:
- **Door**: 7 texture maps for realistic PBR rendering
- **Bricks**: Color, AO, normal, and roughness maps
- **Grass**: Color, AO, normal, and roughness maps (repeated 8x8)

### 4. Lighting
- **Ambient Light**: Blue-tinted (#b9d5ff) at low intensity (0.12)
- **Moon Light**: Directional light with same blue tint (0.12)
- **Door Light**: Warm orange point light (#ff7d46) above the door
- **3 Ghost Lights**: Animated point lights in magenta, cyan, and yellow

### 5. Atmosphere
- **Fog**: Color #262837, starts at 1 unit, fully opaque at 15 units
- **Clear Color**: Matches fog color for seamless horizon

### 6. Shadows
- Shadow mapping enabled with PCFSoftShadowMap
- Optimized shadow map sizes (256x256) for performance
- All lights cast shadows
- Walls, bushes, and graves cast shadows
- Floor receives shadows

### 7. Animation
- Ghost lights float around the house using trigonometric functions
- Each ghost has unique movement patterns:
  - Ghost 1: Circular path with vertical sine wave
  - Ghost 2: Slower circular path with complex vertical movement
  - Ghost 3: Variable radius circular path with vertical oscillation

## Unit System
The scene uses 1 unit = 1 meter convention:
- Door height: ~2.2 meters (slightly taller than average person)
- Wall height: 2.5 meters (standard ceiling height)
- House width/depth: 4 meters

## Performance Optimizations
- Shared geometries for bushes and graves
- Reduced shadow map sizes
- Optimized shadow camera far planes
- Single material instances reused across multiple meshes

## Next Steps (Optional Enhancements)
- Add windows to the house
- Create a chimney
- Add low walls or fence
- Create an alley path
- Add rocks or other decorative elements
- Implement sound effects
- Add particle effects for enhanced atmosphere
