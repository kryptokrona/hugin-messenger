const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const xhr = require('xhr')

const {autoUpdater} = require("electron-updater");

autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info"


var Menu = electron.Menu;
const {ipcMain} = require('electron');
ipcMain.on('close-me', (evt, arg) => {
  app.quit()
})


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    icon: path.join(__dirname, 'icons/png/64x64.png'),
    titleBarStyle: "hidden",
    frame: false,
    transparent: true,
    webPreferences: {nodeIntegration: true, experimentalFeatures: true, experimentalCanvasFeatures: true}
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // Create the Application's main menu
  var template = [{
      label: "Application",
      submenu: [
          { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
          { type: "separator" },
          { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
      ]}, {
      label: "Edit",
      submenu: [
          { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
          { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
          { type: "separator" },
          { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
          { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]}
  ];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)


// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('before-quit', function() {


  wallet.kill('SIGHUP');



})

app.on('ready', function()  {
  autoUpdater.checkForUpdates();
});

autoUpdater.on('update-downloaded', () => {

  autoUpdater.quitAndInstall()

});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// START CHILD PROCESSES
 const { spawn } = require('child_process');

// START NEDB WITH PERSISTANT STORAGE
var Datastore = require('nedb');


let wallet_file = ''
let wallet_pw = ''
let rpc_pw = ''

let wallet;



var appRootDir = require('app-root-dir').get().replace('app.asar','');
var appPath=appRootDir+'/bin/';
userDataDir = app.getPath('userData');

global.userDataDir = userDataDir;

global.appPath = appRootDir;


var db = new Datastore({ filename: userDataDir+'/settings.db', autoload: true });

function startWallet() {

  db.find({setting : 'walletData'}, function (err,docs){

  wallet_file = docs[0].walletFile;
  wallet_pw = docs[0].walletPassword;
  global.rpc_pw = docs[0].rpcPassword;

   wallet = spawn(appPath+'kryptokrona-service', ['-l', userDataDir+"/walletd.log",'-w', userDataDir+'/'+wallet_file, '-p', wallet_pw, '--rpc-password', global.rpc_pw, '--daemon-address', 'pool.kryptokrona.se']); //, '--daemon-address', 'localhost'

   wallet.stdout.on('data', (data) => {


   });

   wallet.stderr.on('data', (data) => {

   });

   wallet.on('close', (code) => {
     console.log(`child process exited with code ${code}`);
   });




});

}

function randomString() {
  return parseInt(Math.random()*100000000000000000).toString(36);
}

// Check if any message data is stored
db.find({}, function (err, docs) {
  datastore_docs = docs;


  // If there are no messages stored, load messages from block 0
  if (!datastore_docs[0]) {

    // Generate wallet name and password

    let new_wallet_name = randomString() + randomString() + randomString();
    let new_wallet_password = randomString() + randomString() + randomString();
    let new_rpc_pw = randomString() + randomString() + randomString();

    // Generate wallet with settings from above

    let gen_wallet = spawn(appPath + 'kryptokrona-service', ['-l', userDataDir+"/walletd.log",'-g','-w', userDataDir+'/'+new_wallet_name, '-p', new_wallet_password, '--rpc-password', new_rpc_pw]);

     gen_wallet.stdout.on('data', (data) => {

     });

     gen_wallet.stderr.on('data', (data) => {

     });

     gen_wallet.on('close', (code) => {

       startWallet();
     });


    let walletData = {
      setting: 'walletData',
      walletFile: new_wallet_name,
      walletPassword: new_wallet_password,
      rpcPassword: new_rpc_pw
    };

    db.insert(walletData);

  } else {
  startWallet();
  }
});
