const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const xhr = require('xhr')
const fs = require('fs')

const isDev = require('electron-is-dev');




var appRootDir = require('app-root-dir').get().replace('app.asar','');
var appPath=appRootDir+'/bin/';
userDataDir = app.getPath('userData');

global.userDataDir = userDataDir;

global.appPath = appRootDir;

global.downloadDir = app.getPath('downloads');

const fetch = require('electron-fetch').default;

const WB = require('kryptokrona-wallet-backend-js');
const util = require('util');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let js_wallet;

// fs.access(userDataDir + '/boards.wallet', (err) => {
//   if (err) {
//       console.log('does not exist')
//     } else {
//       console.log('exists')
//     }
// })

let c = false;

if (fs.existsSync(userDataDir + '/boards.wallet')) {
    // Do something
    console.log("Found");
    c = 'o';
} else {
    console.log("No findy");
    c = 'c';
}

(async () => {




    /* Initialise our blockchain cache api. Can use a public node or local node
       with `const daemon = new WB.Daemon('127.0.0.1', 11898);` */
    const daemon = new WB.Daemon('pool.kryptokrona.se', 11898);

    if (c === 'c') {
        const [newWallet, error] = await WB.WalletBackend.importViewWallet(daemon, 580000, '1ee35767b8a247c03423e78c302f7c3c64c5e3c145878e4fbf1cc3bbbb35b10c', 'SEKReSxkQgANbzXf4Hc8USCJ8tY9eN9eadYNdbqb5jUG5HEDkb2pZPijE2KGzVLvVKTniMEBe5GSuJbGPma7FDRWUhXXDVSKHWc');

        js_wallet = newWallet;
    } else if (c === 'o') {
        /* Open wallet, giving our wallet path and password */
        const [openedWallet, error] = await WB.WalletBackend.openWalletFromFile(daemon, userDataDir + '/boards.wallet', 'hunter2');
        if (error) {
            console.log('Failed to open wallet: ' + error.toString());
            return;
        }

        js_wallet = openedWallet;

    } else {
        console.log('Bad input');
        return;
    }

    /* Enable debug logging to the console */


    /* Start wallet sync process */
    await js_wallet.start();
    //
    // let i = 1;
    //
    // for (const address of js_wallet.getAddresses()) {
    //      console.log(`Address [${i}]: ${address}`);
    //      i++;
    // }
    //
    // console.log("Priv view: ", js_wallet.getPrivateViewKey());
    // console.log("Mnemonic: ", await js_wallet.getMnemonicSeed());



    console.log('Started wallet');
    // console.log('Address: ' + js_wallet.getPrimaryAddress());

    const [unlockedBalance, lockedBalance] = await js_wallet.getBalance();

    console.log(lockedBalance);
    console.log(unlockedBalance);

   console.log(lockedBalance);
   console.log(unlockedBalance);

   for (const tx of await js_wallet.getTransactions()) {
    console.log(`Transaction ${tx.hash} - ${WB.prettyPrintAmount(tx.totalAmount())} - ${tx.timestamp}`);
    console.log(tx);
  }

    while(true) {
    await sleep(1000 * 20);

    /* Save the wallet to disk */
    js_wallet.saveWalletToFile(userDataDir + '/boards.wallet', 'hunter2');
    }

    /* Stop the wallet so we can exit */
    // js_wallet.stop();

    console.log('Saved wallet to file');
})()






const {autoUpdater} = require("electron-updater");
const {ipcMain} = require('electron');



ipcMain.on('get-boards', async (event, arg) => {

  console.log('get-boards triggered');

  event.reply('got-boards', await js_wallet.getTransactions());

})

autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info"


let fetchNodes = () => {

  return new Promise((resolve, reject) => {

    fetch('https://kryptokrona.se/nodelist.json')
    .then(res => res.json())
    .then(json => {

      resolve(json);

    })

  })



}



var Menu = electron.Menu;


ipcMain.on('close-me', (evt, arg) => {
  js_wallet.stop();
  app.quit();

})

// ipcMain.on('get-nodes', (evt, arg) => {
//   // evt.reply('got-nodes', {nodies: 1});
// })

ipcMain.on('get-nodes', async (event, arg) => {
  console.log(arg) // prints "ping"
  let json = await fetchNodes();
  event.reply('got-nodes', json)
})


ipcMain.on('change-node', async (event, node) => {
  console.log(node) // prints "ping"

  db.update({setting : 'walletData'}, { $set: {node : node} } , {} , function (err, numReplaced){

    console.log(numReplaced);
    wallet.kill('SIGINT');
    wallet.on('close', () => {
      console.log('Wallet is closed..');
      startWallet();


    } );

  })




})



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1250,
    height: 800,
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


  wallet.kill('SIGINT');



})

ipcMain.on('import_wallet', (evt, arg) => {

  wallet.kill('SIGINT');

  console.log(arg);

      let new_wallet_name = randomString() + randomString() + randomString();
      let new_wallet_password = randomString() + randomString() + randomString();
      let new_rpc_pw = global.rpc_pw;

      // console.log('kryptokrona-service --SYNC_FROM_ZERO -l ' + userDataDir+'/walletd.log -g --mnemonic-seed ' + arg + ' -w ' + userDataDir+'/'+new_wallet_name + ' -p ' + new_wallet_password + ' --rpc-password ' + new_rpc_pw)

    let gen_wallet = spawn(appPath + 'kryptokrona-service', ['-l', userDataDir+"/walletd.log",'-g','--mnemonic-seed', arg,'-w', userDataDir+'/'+new_wallet_name, '-p', new_wallet_password, '--rpc-password', new_rpc_pw]);

     gen_wallet.stdout.on('data', (data) => {

     });

     gen_wallet.stderr.on('data', (data) => {

     });

     gen_wallet.on('close', (code) => {


       db.remove({}, { multi: true }, function (err, numRemoved) {


               let walletData = {
                 setting: 'walletData',
                 walletFile: new_wallet_name,
                 walletPassword: new_wallet_password,
                 rpcPassword: new_rpc_pw
               };
               db.insert(walletData, function () {
                 startWallet();

                 var TurtleCoinWalletd = require('kryptokrona-service-rpc-js').default

                 let walletd = new TurtleCoinWalletd(
                   'http://127.0.0.1',
                   8070,
                   rpc_pw,
                   false
                 )

                 walletd.reset();
               });



       });



     });

})



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



var db = new Datastore({ filename: userDataDir+'/settings.db', autoload: true });

function startWallet() {

  console.log('Starting wallet..');

  db.find({setting : 'walletData'}, function (err,docs){

  wallet_file = docs[0].walletFile;
  wallet_pw = docs[0].walletPassword;
  global.rpc_pw = docs[0].rpcPassword;

  let node = 'pool.kryptokrona.se';
  let port = '11898'
  if (docs[0].node) {

    node = docs[0].node.split(':');
    port = node[1];
    node = node[0]
  }

  console.log(node);

   wallet = spawn(appPath+'kryptokrona-service', ['-l', userDataDir+"/walletd.log",'-w', userDataDir+'/'+wallet_file, '-p', wallet_pw, '--rpc-password', global.rpc_pw, '--daemon-address', node, '--daemon-port', port]); //, '--daemon-address', 'localhost'

   wallet.stdout.on('data', (data) => {


   });

   wallet.stderr.on('data', (data) => {

   });

   wallet.on('close', (code) => {
     console.log(`child process exited with code ${code}`);
   });

   if (isDev) {
   	console.log('Running in development');
      mainWindow.openDevTools();
      js_wallet.setLogLevel(WB.LogLevel.DEBUG);
   } else {
   	console.log('Running in production');
     app.on('ready', function()  {
       autoUpdater.checkForUpdates();
     });

     autoUpdater.on('update-downloaded', () => {

       autoUpdater.quitAndInstall()

     });

   }



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
