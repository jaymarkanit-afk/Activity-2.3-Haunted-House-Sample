const { app, BrowserWindow, Menu, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: '3D Lighting Studio - Activity 2',
    backgroundColor: '#1a1a1a'
  })

  mainWindow.loadFile('electron-index.html')

  // Open DevTools in development
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

// Create menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Export Scene Settings',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('export-settings')
          }
        },
        {
          label: 'Load Scene Settings',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                { name: 'JSON', extensions: ['json'] }
              ]
            })
            
            if (!result.canceled && result.filePaths.length > 0) {
              const data = fs.readFileSync(result.filePaths[0], 'utf-8')
              mainWindow.webContents.send('load-settings', data)
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Scenes',
      submenu: [
        {
          label: 'Basic Lighting Demo',
          click: () => {
            mainWindow.webContents.send('load-scene', 'basic')
          }
        },
        {
          label: 'Shadows Showcase',
          click: () => {
            mainWindow.webContents.send('load-scene', 'shadows')
          }
        },
        {
          label: 'Haunted House',
          click: () => {
            mainWindow.webContents.send('load-scene', 'haunted')
          }
        },
        {
          label: 'Material Explorer',
          click: () => {
            mainWindow.webContents.send('load-scene', 'materials')
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About 3D Lighting Studio',
              message: '3D Lighting Studio v1.0.0',
              detail: 'An Electron.js application demonstrating Three.js lighting concepts from Activities 2.1-2.3.\n\n' +
                      'Features:\n' +
                      '• Multiple light types (Ambient, Directional, Point, Spot, etc.)\n' +
                      '• Real-time shadow controls\n' +
                      '• Material editor\n' +
                      '• Pre-built scene templates\n\n' +
                      'Created as part of Activity 2 coursework.'
            })
          }
        },
        {
          label: 'Documentation',
          click: () => {
            const { shell } = require('electron')
            shell.openExternal('https://threejs.org/docs/')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
  createWindow()
  createMenu()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
