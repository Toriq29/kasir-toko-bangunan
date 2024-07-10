const electron = require('electron')
const db = require('./config/database/db_config')
const {app, BrowserWindow, ipcMain, screen ,webContents} = electron
const remote = require('@electron/remote/main')
remote.initialize()



let mainWindow
let productWindow

mainWin = () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        height: 600,
        resizable : false,
        title: 'Cashier 1.0',
        autoHideMenuBar: true
    })

    mainWindow.loadFile('index.html')
    db.serialize( () => {
        console.log("success connecting database")
    })
}

app.on('ready', () => {
    mainWin()
})

ipcMain.on('load:product-window', () => {
    productWin()
})


productWin = () => {

    const {width, height} = screen.getPrimaryDisplay().workAreaSize

    productWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        autoHideMenuBar: true,
        width: width,
        height: height,
        title: 'Cashier | Data Produk'
    })

    remote.enable(productWindow.webContents)

    productWindow.loadFile('windows/product.html')
    productWindow.webContents.on('did-finish-load', () => {
        mainWindow.hide()
    })

    productWindow.on('close', () => {
        mainWindow.show()
    })
}

