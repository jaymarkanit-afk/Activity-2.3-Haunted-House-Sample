const THREE = require('three')
const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls.js')
const { RectAreaLightHelper } = require('three/examples/jsm/helpers/RectAreaLightHelper.js')
const dat = require('lil-gui')
const { ipcRenderer } = require('electron')

/**
 * 3D Lighting Studio - Integrating Activities 2.1-2.3
 */

let currentScene = 'basic'
let scene, camera, renderer, controls, gui
let lights = {}, objects = {}, animations = []

const canvas = document.querySelector('canvas.webgl')

init()

function init() {
    setupScene()
    setupRenderer()
    setupCamera()
    setupControls()
    setupGUI()
    setupEventListeners()
    loadScene('basic')
    animate()
}

function setupScene() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color('#0f0f1e')
}

function setupRenderer() {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
}

function setupCamera() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(4, 3, 6)
    scene.add(camera)
}

function setupControls() {
    controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
}

function setupGUI() {
    gui = new dat.GUI()
}

function setupEventListeners() {
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
    
    ipcRenderer.on('load-scene', (event, sceneName) => loadScene(sceneName))
    ipcRenderer.on('export-settings', () => exportSettings())
    ipcRenderer.on('load-settings', (event, data) => importSettings(data))
}

function clearScene() {
    while(scene.children.length > 0) {
        const obj = scene.children[0]
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose())
            else obj.material.dispose()
        }
        scene.remove(obj)
    }
    gui.destroy()
    gui = new dat.GUI()
    lights = {}
    objects = {}
    animations = []
    scene.add(camera)
}

function loadScene(sceneName) {
    clearScene()
    currentScene = sceneName
    document.getElementById('scene-name').textContent = getSceneTitle(sceneName)
    
    switch(sceneName) {
        case 'basic': loadBasicLightingScene(); break
        case 'shadows': loadShadowsScene(); break
        case 'haunted': loadHauntedHouseScene(); break
        case 'materials': loadMaterialsScene(); break
        default: loadBasicLightingScene()
    }
}

function getSceneTitle(name) {
    return { basic: 'Basic Lighting Demo', shadows: 'Shadows Showcase', 
             haunted: 'Haunted House', materials: 'Material Explorer' }[name] || 'Unknown'
}

// Helper function to create a crow
function createCrow() {
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
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.08, 4), 
                                 new THREE.MeshStandardMaterial({ color: '#ffaa00' }))
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

// Helper function to create a bat
function createBat() {
    const bat = new THREE.Group()
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.7 })
    
    // Body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), bodyMaterial)
    body.scale.set(1, 1.2, 0.8)
    bat.add(body)
    
    // Head with ears
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
    
    // Wings (larger and more prominent than crow wings)
    const wingGeometry = new THREE.BoxGeometry(0.5, 0.02, 0.25)
    bat.leftWing = new THREE.Mesh(wingGeometry, bodyMaterial)
    bat.leftWing.position.set(-0.3, 0.05, 0)
    bat.add(bat.leftWing)
    
    bat.rightWing = new THREE.Mesh(wingGeometry, bodyMaterial)
    bat.rightWing.position.set(0.3, 0.05, 0)
    bat.add(bat.rightWing)
    
    // Wing membrane effect (triangular extensions)
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

// Scene 1: Basic Lighting (Activity 2.1)
function loadBasicLightingScene() {
    lights.ambient = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(lights.ambient)
    gui.addFolder('Ambient').add(lights.ambient, 'intensity', 0, 1, 0.01)
    
    lights.directional = new THREE.DirectionalLight(0x00fffc, 0.5)
    lights.directional.position.set(3, 3, 2)
    scene.add(lights.directional)
    scene.add(new THREE.DirectionalLightHelper(lights.directional, 0.3))
    const dirFolder = gui.addFolder('Directional')
    dirFolder.add(lights.directional, 'intensity', 0, 2, 0.01)
    dirFolder.add(lights.directional.position, 'x', -5, 5)
    
    lights.hemisphere = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
    scene.add(lights.hemisphere)
    scene.add(new THREE.HemisphereLightHelper(lights.hemisphere, 0.3))
    gui.addFolder('Hemisphere').add(lights.hemisphere, 'intensity', 0, 1, 0.01)
    
    lights.point = new THREE.PointLight(0xff9000, 1, 10)
    lights.point.position.set(2, 1, 2)
    scene.add(lights.point)
    scene.add(new THREE.PointLightHelper(lights.point, 0.2))
    gui.addFolder('Point').add(lights.point, 'intensity', 0, 3, 0.01)
    
    lights.rectArea = new THREE.RectAreaLight(0x4e00ff, 3, 2, 2)
    lights.rectArea.position.set(-3, 1, 0)
    lights.rectArea.lookAt(0, 0, 0)
    scene.add(lights.rectArea)
    scene.add(new RectAreaLightHelper(lights.rectArea))
    gui.addFolder('RectArea').add(lights.rectArea, 'intensity', 0, 10, 0.1)
    
    lights.spot = new THREE.SpotLight(0x78ff00, 1, 10, Math.PI * 0.15, 0.25)
    lights.spot.position.set(0, 3, 0)
    scene.add(lights.spot, lights.spot.target)
    scene.add(new THREE.SpotLightHelper(lights.spot))
    gui.addFolder('Spot').add(lights.spot, 'intensity', 0, 3, 0.01)
    
    const material = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.1 })
    objects.sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
    objects.sphere.position.x = -2
    objects.cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material)
    objects.torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material)
    objects.torus.position.x = 2
    objects.plane = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), material)
    objects.plane.rotation.x = -Math.PI * 0.5
    objects.plane.position.y = -0.65
    scene.add(objects.sphere, objects.cube, objects.torus, objects.plane)
    
    animations.push(() => {
        const t = Date.now() * 0.001
        objects.sphere.rotation.y = objects.cube.rotation.y = objects.torus.rotation.y = t * 0.2
        objects.sphere.rotation.x = objects.cube.rotation.x = objects.torus.rotation.x = t * 0.3
        lights.point.position.x = Math.sin(t) * 3
        lights.point.position.z = Math.cos(t) * 3
    })
}

// Scene 2: Shadows (Activity 2.2)
function loadShadowsScene() {
    lights.ambient = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(lights.ambient)
    gui.add(lights.ambient, 'intensity', 0, 1, 0.01).name('Ambient')
    
    lights.directional = new THREE.DirectionalLight(0xffffff, 0.8)
    lights.directional.position.set(3, 4, 2)
    lights.directional.castShadow = true
    lights.directional.shadow.mapSize.set(2048, 2048)
    lights.directional.shadow.camera.top = lights.directional.shadow.camera.right = 5
    lights.directional.shadow.camera.bottom = lights.directional.shadow.camera.left = -5
    scene.add(lights.directional)
    const shadowHelper = new THREE.CameraHelper(lights.directional.shadow.camera)
    scene.add(shadowHelper)
    gui.add(shadowHelper, 'visible').name('Shadow Camera')
    
    lights.point = new THREE.PointLight(0xff6600, 2, 10)
    lights.point.position.set(2, 2, 2)
    lights.point.castShadow = true
    lights.point.shadow.mapSize.set(1024, 1024)
    scene.add(lights.point)
    
    lights.spot = new THREE.SpotLight(0x00ff88, 2, 15, Math.PI * 0.2, 0.3)
    lights.spot.position.set(-2, 4, -2)
    lights.spot.castShadow = true
    scene.add(lights.spot, lights.spot.target)
    
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.7 })
    objects.sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), mat.clone())
    objects.sphere.position.set(-1.5, 1, 0)
    objects.sphere.castShadow = true
    objects.cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat.clone())
    objects.cube.position.y = 0.5
    objects.cube.castShadow = true
    objects.torus = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.2, 32, 64), mat.clone())
    objects.torus.position.set(1.5, 0.8, 0)
    objects.torus.castShadow = true
    scene.add(objects.sphere, objects.cube, objects.torus)
    
    objects.plane = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), 
                                    new THREE.MeshStandardMaterial({ color: 0x333333 }))
    objects.plane.rotation.x = -Math.PI * 0.5
    objects.plane.receiveShadow = true
    scene.add(objects.plane)
    
    animations.push(() => {
        const t = Date.now() * 0.001
        objects.sphere.position.y = 1 + Math.abs(Math.sin(t * 2)) * 1.5
        objects.cube.rotation.y = t * 0.5
        objects.torus.rotation.x = t * 0.6
        lights.point.position.x = Math.cos(t * 0.5) * 3
        lights.point.position.z = Math.sin(t * 0.5) * 3
    })
}

// Scene 3: Haunted House (Activity 2.3)
function loadHauntedHouseScene() {
    scene.fog = new THREE.Fog('#1a0f2e', 1, 15)
    scene.background = new THREE.Color('#1a0f2e')
    
    lights.ambient = new THREE.AmbientLight('#4a0e4e', 0.12)
    scene.add(lights.ambient)
    lights.moon = new THREE.DirectionalLight('#9fdfbf', 0.2)
    lights.moon.position.set(4, 8, -3)
    lights.moon.castShadow = true
    scene.add(lights.moon)
    
    const house = new THREE.Group()
    const walls = new THREE.Mesh(new THREE.BoxGeometry(4, 2.5, 4), 
                                  new THREE.MeshStandardMaterial({ color: '#ac8e82' }))
    walls.position.y = 1.25
    walls.castShadow = true
    house.add(walls)
    
    const roof = new THREE.Mesh(new THREE.ConeGeometry(3.5, 1.5, 4), 
                                 new THREE.MeshStandardMaterial({ color: '#885522' }))
    roof.position.y = 3.25
    roof.rotation.y = Math.PI * 0.25
    roof.castShadow = true
    house.add(roof)
    
    const door = new THREE.Mesh(new THREE.PlaneGeometry(2, 2.2), 
                                 new THREE.MeshStandardMaterial({ color: '#aa7b6e', emissive: '#ff6600', emissiveIntensity: 0.3 }))
    door.position.set(0, 1.1, 2.01)
    house.add(door)
    
    lights.door = new THREE.PointLight('#ff7d46', 1.5, 7)
    lights.door.position.set(0, 2.2, 2.7)
    lights.door.castShadow = true
    house.add(lights.door)
    scene.add(house)
    
    const graves = new THREE.Group()
    const graveMat = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })
    for(let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2
        const radius = 4 + Math.random() * 5
        const grave = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.2), graveMat)
        grave.position.set(Math.cos(angle) * radius, 0.3, Math.sin(angle) * radius)
        grave.rotation.y = (Math.random() - 0.5) * 0.4
        grave.castShadow = true
        graves.add(grave)
    }
    scene.add(graves)
    
    objects.floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), 
                                    new THREE.MeshStandardMaterial({ color: '#9acd32' }))
    objects.floor.rotation.x = -Math.PI * 0.5
    objects.floor.receiveShadow = true
    scene.add(objects.floor)
    
    lights.ghost1 = new THREE.PointLight('#00ff88', 2, 3)
    lights.ghost1.castShadow = true
    lights.ghost2 = new THREE.PointLight('#ff00ff', 2, 3)
    lights.ghost2.castShadow = true
    lights.ghost3 = new THREE.PointLight('#ff0044', 2, 3)
    lights.ghost3.castShadow = true
    scene.add(lights.ghost1, lights.ghost2, lights.ghost3)
    
    // Create flying crows
    objects.crows = []
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
        objects.crows.push(crow)
    }
    
    // Create flying bats
    objects.bats = []
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
        objects.bats.push(bat)
    }
    
    animations.push(() => {
        const t = Date.now() * 0.001
        
        // Animate ghosts
        lights.ghost1.position.set(Math.cos(t * 0.5) * 6, Math.sin(t * 3) * 0.5 + 0.5, Math.sin(t * 0.5) * 6)
        lights.ghost2.position.set(Math.cos(-t * 0.32) * 7, Math.sin(t * 4), Math.sin(-t * 0.32) * 7)
        lights.ghost3.position.set(Math.cos(t * 0.18) * 7, Math.sin(t * 5), Math.sin(t * 0.18) * 7)
        
        // Animate crows
        objects.crows.forEach((crow, i) => {
            const data = crow.userData
            data.angle += data.speed * 0.01
            
            crow.position.x = Math.cos(data.angle) * data.radius
            crow.position.z = Math.sin(data.angle) * data.radius
            crow.position.y = data.height + Math.sin(t * data.heightSpeed + i) * 0.5
            
            // Face direction of movement
            crow.rotation.y = data.angle + Math.PI * 0.5
            
            // Wing flapping animation
            const flapAngle = Math.sin(t * 8 + i) * 0.4
            crow.leftWing.rotation.z = flapAngle
            crow.rightWing.rotation.z = -flapAngle
        })
        
        // Animate bats (erratic movement)
        objects.bats.forEach((bat, i) => {
            const data = bat.userData
            data.angle += data.speed * 0.01
            
            // Add some erratic movement
            const wobble = Math.sin(t * 3 + i * 0.5) * 0.5
            bat.position.x = Math.cos(data.angle + wobble) * (data.radius + Math.sin(t + i) * 1)
            bat.position.z = Math.sin(data.angle + wobble) * (data.radius + Math.cos(t + i) * 1)
            bat.position.y = data.height + Math.sin(t * data.heightSpeed + i * 0.7) * 1
            
            // Face direction of movement
            bat.rotation.y = data.angle + wobble + Math.PI * 0.5
            bat.rotation.x = Math.sin(t * 2 + i) * 0.2
            
            // Faster wing flapping for bats
            const flapAngle = Math.sin(t * data.wingSpeed + i) * 0.6
            bat.leftWing.rotation.z = flapAngle
            bat.rightWing.rotation.z = -flapAngle
        })
    })
    
    camera.position.set(6, 3, 8)
}

// Scene 4: Materials
function loadMaterialsScene() {
    lights.ambient = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(lights.ambient)
    lights.directional = new THREE.DirectionalLight(0xffffff, 0.8)
    lights.directional.position.set(5, 5, 5)
    lights.directional.castShadow = true
    scene.add(lights.directional)
    
    const materials = [
        new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.1, metalness: 0.9 }),
        new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.5, metalness: 0.5 }),
        new THREE.MeshStandardMaterial({ color: 0x0000ff, roughness: 0.9, metalness: 0.1 })
    ]
    
    for(let i = 0; i < 3; i++) {
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), materials[i])
        sphere.position.set((i - 1) * 2.5, 0.7, 0)
        sphere.castShadow = true
        scene.add(sphere)
        const folder = gui.addFolder(`Sphere ${i + 1}`)
        folder.add(materials[i], 'roughness', 0, 1, 0.01)
        folder.add(materials[i], 'metalness', 0, 1, 0.01)
    }
    
    objects.floor = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), 
                                    new THREE.MeshStandardMaterial({ color: 0x333333 }))
    objects.floor.rotation.x = -Math.PI * 0.5
    objects.floor.receiveShadow = true
    scene.add(objects.floor)
}

function exportSettings() {
    const settings = { scene: currentScene, camera: camera.position }
    console.log('Export:', JSON.stringify(settings, null, 2))
}

function importSettings(data) {
    const settings = JSON.parse(data)
    if (settings.scene) loadScene(settings.scene)
}

function animate() {
    requestAnimationFrame(animate)
    animations.forEach(fn => fn())
    controls.update()
    renderer.render(scene, camera)
}
