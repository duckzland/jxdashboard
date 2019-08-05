// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron');

process.env.JX_ENV = 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let development = process.env.JX_ENV === 'development';

if (development) {
    require('electron-reload')(__dirname + '/dist/', {
        // Note that the path to electron may vary according to the main file
        electron: require(`${__dirname}/node_modules/electron`)
    });
}

function createWindow() {

	// Create the browser window.

    let option = {
        fullscreen: false,
        fullcreenable: false,
        kiosk: false,
        frame: true,
        titleBarStyle: "hidden",
        //type: "desktop",
        width: 1024,
        height: 768,
        backgroundColor: '#000000',
        show: false
    };

    if (development) {
        option = {
            //type: "desktop",
            fullscreen: false,
            width: 1024,
            height: 768
        }
    }

    mainWindow = new BrowserWindow(option);

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');

    // Open the DevTools.
    if (development) {
        mainWindow.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    // Prevent screen white flickering on startup
    mainWindow.once('ready-to-show', function() {
        mainWindow.show();
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
