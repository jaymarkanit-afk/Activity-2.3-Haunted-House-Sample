import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Helper Functions
 */
// Create a textured mesh with automatic UV2 setup
const createTexturedMesh = (geometry, textures) => {
    const material = new THREE.MeshStandardMaterial(textures)
    const mesh = new THREE.Mesh(geometry, material)
    if (textures.aoMap) {
        mesh.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(mesh.geometry.attributes.uv.array, 2))
    }
    return mesh
}

// Create a window
const createWindow = (width, height) => {
    const windowGroup = new THREE.Group()
    
    // Window frame
    const frameGeometry = new THREE.BoxGeometry(width, height, 0.1)
    const frameMaterial = new THREE.MeshStandardMaterial({ color: '#2c1810' })
    const frame = new THREE.Mesh(frameGeometry, frameMaterial)
    
    // Window glass (emissive for spooky glow)
    const glassGeometry = new THREE.PlaneGeometry(width * 0.8, height * 0.8)
    const glassMaterial = new THREE.MeshStandardMaterial({ 
        color: '#ff6600',
        emissive: '#ff3300',
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6
    })
    const glass = new THREE.Mesh(glassGeometry, glassMaterial)
    glass.position.z = 0.06
    
    windowGroup.add(frame, glass)
    return windowGroup
}

// Create a chimney
const createChimney = () => {
    const chimneyGroup = new THREE.Group()
    
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 1.5, 0.6),
        new THREE.MeshStandardMaterial({ color: '#8b4513' })
    )
    base.position.y = 0.75
    
    const top = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.2, 0.8),
        new THREE.MeshStandardMaterial({ color: '#654321' })
    )
    top.position.y = 1.6
    
    chimneyGroup.add(base, top)
    return chimneyGroup
}

// Create a crow
const createCrow = () => {
    const crow = new THREE.Group()
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: '#000000', roughness: 0.8 })
    
    // Body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), bodyMaterial)
    body.scale.set(1, 0.8, 1.3)
    crow.add(body)
    
    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), bodyMaterial)
    head.position.set(0, 0.15, 0.15)
    crow.add(head)
    
    // Beak
    const beak = new THREE.Mesh(
        new THREE.ConeGeometry(0.03, 0.08, 4), 
        new THREE.MeshStandardMaterial({ color: '#ffaa00' })
    )
    beak.rotation.x = Math.PI * 0.5
    beak.position.set(0, 0.15, 0.23)
    crow.add(beak)
    
    // Wings
    const wingGeometry = new THREE.BoxGeometry(0.4, 0.05, 0.2)
    crow.leftWing = new THREE.Mesh(wingGeometry, bodyMaterial)
    crow.leftWing.position.set(-0.2, 0, 0)
    crow.add(crow.leftWing)
    
    crow.rightWing = new THREE.Mesh(wingGeometry, bodyMaterial)
    crow.rightWing.position.set(0.2, 0, 0)
    crow.add(crow.rightWing)
    
    // Tail
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.15), bodyMaterial)
    tail.position.set(0, 0, -0.2)
    crow.add(tail)
    
    crow.scale.set(0.8, 0.8, 0.8)
    crow.castShadow = true
    crow.children.forEach(child => child.castShadow = true)
    
    return crow
}

// Create a bat
const createBat = () => {
    const bat = new THREE.Group()
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.7 })
    
    // Body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), bodyMaterial)
    body.scale.set(1, 1.2, 0.8)
    bat.add(body)
    
    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), bodyMaterial)
    head.position.set(0, 0.15, 0)
    bat.add(head)
    
    // Ears
    const earGeometry = new THREE.ConeGeometry(0.04, 0.12, 4)
    const leftEar = new THREE.Mesh(earGeometry, bodyMaterial)
    leftEar.position.set(-0.05, 0.22, 0)
    bat.add(leftEar)
    
    const rightEar = new THREE.Mesh(earGeometry, bodyMaterial)
    rightEar.position.set(0.05, 0.22, 0)
    bat.add(rightEar)
    
    // Wings
    const wingGeometry = new THREE.BoxGeometry(0.5, 0.02, 0.25)
    bat.leftWing = new THREE.Mesh(wingGeometry, bodyMaterial)
    bat.leftWing.position.set(-0.3, 0.05, 0)
    bat.add(bat.leftWing)
    
    bat.rightWing = new THREE.Mesh(wingGeometry, bodyMaterial)
    bat.rightWing.position.set(0.3, 0.05, 0)
    bat.add(bat.rightWing)
    
    // Wing membranes
    const membraneGeometry = new THREE.ConeGeometry(0.15, 0.3, 3)
    const leftMembrane = new THREE.Mesh(membraneGeometry, bodyMaterial)
    leftMembrane.rotation.z = Math.PI * 0.5
    leftMembrane.position.set(-0.5, 0.05, 0)
    bat.add(leftMembrane)
    
    const rightMembrane = new THREE.Mesh(membraneGeometry, bodyMaterial)
    rightMembrane.rotation.z = -Math.PI * 0.5
    rightMembrane.position.set(0.5, 0.05, 0)
    bat.add(rightMembrane)
    
    bat.scale.set(0.6, 0.6, 0.6)
    bat.castShadow = true
    bat.children.forEach(child => child.castShadow = true)
    
    return bat
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Door textures
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// Bricks textures
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

// Grass textures
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * House - Victorian Gothic Style
 */
// House container
const house = new THREE.Group()
scene.add(house)

// Main building - Taller and narrower
const mainWalls = createTexturedMesh(
    new THREE.BoxGeometry(5, 3.5, 4),
    {
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
    }
)
mainWalls.position.y = 1.75
mainWalls.castShadow = true
house.add(mainWalls)

// Tower on the side
const tower = createTexturedMesh(
    new THREE.CylinderGeometry(1, 1.2, 4, 8),
    {
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
    }
)
tower.position.set(3, 2, 0)
tower.castShadow = true
house.add(tower)

// Tower roof (cone)
const towerRoof = new THREE.Mesh(
    new THREE.ConeGeometry(1.3, 1.5, 8),
    new THREE.MeshStandardMaterial({ color: '#1a1a2e' })
)
towerRoof.position.set(3, 4.75, 0)
towerRoof.castShadow = true
house.add(towerRoof)

// Main roof - Steeper gothic style
const roofLeft = new THREE.Mesh(
    new THREE.BoxGeometry(3, 2, 4.2),
    new THREE.MeshStandardMaterial({ color: '#2d1b3d' })
)
roofLeft.rotation.z = Math.PI * 0.25
roofLeft.position.set(-0.8, 4.3, 0)
roofLeft.castShadow = true
house.add(roofLeft)

const roofRight = new THREE.Mesh(
    new THREE.BoxGeometry(3, 2, 4.2),
    new THREE.MeshStandardMaterial({ color: '#2d1b3d' })
)
roofRight.rotation.z = -Math.PI * 0.25
roofRight.position.set(0.8, 4.3, 0)
roofRight.castShadow = true
house.add(roofRight)

// Entrance porch
const porch = new THREE.Mesh(
    new THREE.BoxGeometry(3, 2.5, 1.5),
    new THREE.MeshStandardMaterial({ color: '#4a3428' })
)
porch.position.set(0, 1.25, 2.75)
porch.castShadow = true
house.add(porch)

// Porch roof
const porchRoof = new THREE.Mesh(
    new THREE.BoxGeometry(3.5, 0.2, 2),
    new THREE.MeshStandardMaterial({ color: '#2d1b3d' })
)
porchRoof.position.set(0, 2.6, 2.75)
porchRoof.castShadow = true
house.add(porchRoof)

// Door with full textures
const door = createTexturedMesh(
    new THREE.PlaneGeometry(1.8, 2.2, 100, 100),
    {
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.08,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    }
)
door.position.set(0, 1.1, 3.51)
house.add(door)

// Windows - Multiple windows for Victorian look
const window1 = createWindow(0.8, 1.2)
window1.position.set(-1.5, 2, 2.01)
house.add(window1)

const window2 = createWindow(0.8, 1.2)
window2.position.set(1.5, 2, 2.01)
house.add(window2)

const window3 = createWindow(0.6, 0.8)
window3.position.set(0, 2.8, 2.01)
house.add(window3)

// Tower window
const towerWindow = createWindow(0.5, 0.7)
towerWindow.position.set(3, 2.5, 1.21)
towerWindow.rotation.y = Math.PI * 0.5
house.add(towerWindow)

// Chimney
const chimney = createChimney()
chimney.position.set(-1.5, 3.5, -1)
chimney.children.forEach(child => child.castShadow = true)
house.add(chimney)

// Dead trees instead of bushes
const createDeadTree = (height, thickness) => {
    const treeGroup = new THREE.Group()
    
    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(thickness, thickness * 1.2, height, 6),
        new THREE.MeshStandardMaterial({ color: '#2c1810' })
    )
    trunk.position.y = height / 2
    trunk.castShadow = true
    
    // Twisted branches
    for (let i = 0; i < 3; i++) {
        const branch = new THREE.Mesh(
            new THREE.CylinderGeometry(thickness * 0.3, thickness * 0.2, height * 0.4, 4),
            new THREE.MeshStandardMaterial({ color: '#1a0f08' })
        )
        const angle = (Math.PI * 2 / 3) * i
        branch.position.set(
            Math.cos(angle) * thickness * 2,
            height * 0.7,
            Math.sin(angle) * thickness * 2
        )
        branch.rotation.z = Math.PI * 0.3
        branch.rotation.y = angle
        branch.castShadow = true
        treeGroup.add(branch)
    }
    
    treeGroup.add(trunk)
    return treeGroup
}

const tree1 = createDeadTree(2.5, 0.15)
tree1.position.set(-3, 0, 3)
house.add(tree1)

const tree2 = createDeadTree(2, 0.12)
tree2.position.set(5, 0, 2)
house.add(tree2)

const tree3 = createDeadTree(1.8, 0.1)
tree3.position.set(-2.5, 0, -2)
house.add(tree3)

// Graveyard with varied tombstones
const graves = new THREE.Group()
scene.add(graves)

// Create different tombstone types
const createTombstone = (type) => {
    const tombGroup = new THREE.Group()
    const stoneMaterial = new THREE.MeshStandardMaterial({ 
        color: '#8a8a8a',
        roughness: 0.8 
    })
    
    if (type === 'cross') {
        // Cross-shaped tombstone
        const vertical = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 1, 0.15),
            stoneMaterial
        )
        vertical.position.y = 0.5
        
        const horizontal = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.15, 0.15),
            stoneMaterial
        )
        horizontal.position.y = 0.7
        
        tombGroup.add(vertical, horizontal)
    } else if (type === 'rounded') {
        // Rounded top tombstone
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.7, 0.15),
            stoneMaterial
        )
        base.position.y = 0.35
        
        const top = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 0.15, 16),
            stoneMaterial
        )
        top.rotation.z = Math.PI * 0.5
        top.position.y = 0.7
        
        tombGroup.add(base, top)
    } else {
        // Standard rectangular
        const stone = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.9, 0.2),
            stoneMaterial
        )
        stone.position.y = 0.45
        tombGroup.add(stone)
    }
    
    tombGroup.children.forEach(child => child.castShadow = true)
    return tombGroup
}

// Place tombstones in clusters
for(let i = 0; i < 40; i++)
{
    const angle = Math.random() * Math.PI * 2
    const radius = 5 + Math.random() * 8
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    // Random tombstone type
    const types = ['cross', 'rounded', 'standard']
    const randomType = types[Math.floor(Math.random() * types.length)]
    const grave = createTombstone(randomType)

    // Position
    grave.position.set(x, 0, z)

    // Rotation for natural look
    grave.rotation.z = (Math.random() - 0.5) * 0.3
    grave.rotation.y = (Math.random() - 0.5) * 0.5

    graves.add(grave)
}

// Add some broken/fallen tombstones
for(let i = 0; i < 10; i++)
{
    const angle = Math.random() * Math.PI * 2
    const radius = 5 + Math.random() * 8
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    const grave = createTombstone('standard')
    grave.position.set(x, 0.2, z)
    grave.rotation.z = Math.PI * 0.4 // Fallen over
    grave.rotation.y = Math.random() * Math.PI * 2

    graves.add(grave)
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights - Purple/Green Horror Theme
 */
// Ambient light - Very dim purple
const ambientLight = new THREE.AmbientLight('#4a0e4e', 0.08)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Moonlight - Eerie green tint
const moonLight = new THREE.DirectionalLight('#9fdfbf', 0.15)
moonLight.position.set(4, 8, - 3)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Window lights from inside
const windowLight1 = new THREE.PointLight('#ff4400', 0.8, 5)
windowLight1.position.set(-1.5, 2, 2.5)
house.add(windowLight1)

const windowLight2 = new THREE.PointLight('#ff4400', 0.8, 5)
windowLight2.position.set(1.5, 2, 2.5)
house.add(windowLight2)

// Tower light
const towerLight = new THREE.PointLight('#8800ff', 1.2, 6)
towerLight.position.set(3, 3, 0)
house.add(towerLight)

// Porch light - flickering effect will be added in animation
const porchLight = new THREE.PointLight('#ffaa00', 0.6, 4)
porchLight.position.set(0, 2.5, 3.2)
house.add(porchLight)

/**
 * Ghosts - Spectral Entities
 */
// Green ghost - ground level
const ghost1 = new THREE.PointLight('#00ff88', 3, 4)
scene.add(ghost1)

// Purple ghost - floating high
const ghost2 = new THREE.PointLight('#aa00ff', 2.5, 3.5)
scene.add(ghost2)

// Red ghost - erratic movement
const ghost3 = new THREE.PointLight('#ff0044', 2, 3)
scene.add(ghost3)

// Blue ghost - slow and ominous
const ghost4 = new THREE.PointLight('#0088ff', 2.2, 3.2)
scene.add(ghost4)

/**
 * Flying Creatures - Crows and Bats
 */
// Create flying crows
const crows = []
for(let i = 0; i < 5; i++) {
    const crow = createCrow()
    const angle = Math.random() * Math.PI * 2
    const radius = 6 + Math.random() * 4
    crow.position.set(
        Math.cos(angle) * radius,
        3 + Math.random() * 3,
        Math.sin(angle) * radius
    )
    crow.userData = {
        speed: 0.3 + Math.random() * 0.4,
        radius: radius,
        angle: angle,
        height: crow.position.y,
        heightSpeed: 0.5 + Math.random() * 0.5
    }
    scene.add(crow)
    crows.push(crow)
}

// Create flying bats
const bats = []
for(let i = 0; i < 8; i++) {
    const bat = createBat()
    const angle = Math.random() * Math.PI * 2
    const radius = 5 + Math.random() * 5
    bat.position.set(
        Math.cos(angle) * radius,
        2 + Math.random() * 4,
        Math.sin(angle) * radius
    )
    bat.userData = {
        speed: 0.5 + Math.random() * 0.6,
        radius: radius,
        angle: angle,
        height: bat.position.y,
        heightSpeed: 0.8 + Math.random() * 0.7,
        wingSpeed: 5 + Math.random() * 3
    }
    scene.add(bat)
    bats.push(bat)
}

/**
 * Fog - Thick and mysterious
 */
const fog = new THREE.Fog('#1a0f2e', 2, 18)
scene.fog = fog

/**
 * Shadows
 */
// Enable shadows on lights
moonLight.castShadow = true
windowLight1.castShadow = true
windowLight2.castShadow = true
towerLight.castShadow = true
porchLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
ghost4.castShadow = true

// Enable shadows on house parts
mainWalls.castShadow = true
tower.castShadow = true
towerRoof.castShadow = true
roofLeft.castShadow = true
roofRight.castShadow = true
porch.castShadow = true
porchRoof.castShadow = true

// Floor receives shadows
floor.receiveShadow = true

// Shadow optimizations
moonLight.shadow.mapSize.width = 512
moonLight.shadow.mapSize.height = 512
moonLight.shadow.camera.far = 20

windowLight1.shadow.mapSize.width = 256
windowLight1.shadow.mapSize.height = 256
windowLight1.shadow.camera.far = 6

windowLight2.shadow.mapSize.width = 256
windowLight2.shadow.mapSize.height = 256
windowLight2.shadow.camera.far = 6

towerLight.shadow.mapSize.width = 256
towerLight.shadow.mapSize.height = 256
towerLight.shadow.camera.far = 7

porchLight.shadow.mapSize.width = 256
porchLight.shadow.mapSize.height = 256
porchLight.shadow.camera.far = 5

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 5

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 5

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 5

ghost4.shadow.mapSize.width = 256
ghost4.shadow.mapSize.height = 256
ghost4.shadow.camera.far = 5

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#1a0f2e')
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Ghost 1 - Ground level spiral pattern
    const ghost1Angle = elapsedTime * 0.6
    const ghost1Radius = 6 + Math.sin(elapsedTime * 0.4) * 2
    ghost1.position.x = Math.cos(ghost1Angle) * ghost1Radius
    ghost1.position.z = Math.sin(ghost1Angle) * ghost1Radius
    ghost1.position.y = 0.5 + Math.abs(Math.sin(elapsedTime * 2)) * 0.5
    // Pulsating intensity
    ghost1.intensity = 3 + Math.sin(elapsedTime * 4) * 0.5

    // Ghost 2 - High floating figure-eight pattern
    const ghost2Angle = elapsedTime * 0.4
    ghost2.position.x = Math.sin(ghost2Angle) * 8
    ghost2.position.z = Math.sin(ghost2Angle * 2) * 6
    ghost2.position.y = 3 + Math.sin(elapsedTime * 1.5) * 1.5
    ghost2.intensity = 2.5 + Math.cos(elapsedTime * 3) * 0.8

    // Ghost 3 - Erratic darting movements
    const ghost3Speed = elapsedTime * 1.2
    ghost3.position.x = Math.cos(ghost3Speed) * 5 + Math.sin(ghost3Speed * 3) * 2
    ghost3.position.z = Math.sin(ghost3Speed) * 5 + Math.cos(ghost3Speed * 2.5) * 2
    ghost3.position.y = 1 + Math.abs(Math.sin(elapsedTime * 5)) * 1.5
    ghost3.intensity = 2 + Math.sin(elapsedTime * 8) * 1

    // Ghost 4 - Slow ominous circle around house
    const ghost4Angle = elapsedTime * 0.25
    ghost4.position.x = Math.cos(ghost4Angle) * 10
    ghost4.position.z = Math.sin(ghost4Angle) * 10
    ghost4.position.y = 2 + Math.sin(elapsedTime * 0.8) * 0.8
    ghost4.intensity = 2.2 + Math.sin(elapsedTime * 2) * 0.5

    // Flickering porch light effect
    porchLight.intensity = 0.6 + Math.random() * 0.3
    if (Math.random() > 0.95) {
        porchLight.intensity = 0.1 // Occasional flicker
    }

    // Window lights subtle flicker
    windowLight1.intensity = 0.8 + Math.sin(elapsedTime * 3) * 0.2
    windowLight2.intensity = 0.8 + Math.cos(elapsedTime * 2.5) * 0.2

    // Tower light pulsing
    towerLight.intensity = 1.2 + Math.sin(elapsedTime * 1.5) * 0.4

    // Animate crows
    crows.forEach((crow, i) => {
        const data = crow.userData
        data.angle += data.speed * 0.01
        
        crow.position.x = Math.cos(data.angle) * data.radius
        crow.position.z = Math.sin(data.angle) * data.radius
        crow.position.y = data.height + Math.sin(elapsedTime * data.heightSpeed + i) * 0.5
        
        // Face direction of movement
        crow.rotation.y = data.angle + Math.PI * 0.5
        
        // Wing flapping animation
        const flapAngle = Math.sin(elapsedTime * 8 + i) * 0.4
        crow.leftWing.rotation.z = flapAngle
        crow.rightWing.rotation.z = -flapAngle
    })
    
    // Animate bats (erratic movement)
    bats.forEach((bat, i) => {
        const data = bat.userData
        data.angle += data.speed * 0.01
        
        // Add some erratic movement
        const wobble = Math.sin(elapsedTime * 3 + i * 0.5) * 0.5
        bat.position.x = Math.cos(data.angle + wobble) * (data.radius + Math.sin(elapsedTime + i) * 1)
        bat.position.z = Math.sin(data.angle + wobble) * (data.radius + Math.cos(elapsedTime + i) * 1)
        bat.position.y = data.height + Math.sin(elapsedTime * data.heightSpeed + i * 0.7) * 1
        
        // Face direction of movement
        bat.rotation.y = data.angle + wobble + Math.PI * 0.5
        bat.rotation.x = Math.sin(elapsedTime * 2 + i) * 0.2
        
        // Faster wing flapping for bats
        const flapAngle = Math.sin(elapsedTime * data.wingSpeed + i) * 0.6
        bat.leftWing.rotation.z = flapAngle
        bat.rightWing.rotation.z = -flapAngle
    })

    // Rotate house slightly for dramatic effect (optional)
    // house.rotation.y = Math.sin(elapsedTime * 0.1) * 0.02

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()