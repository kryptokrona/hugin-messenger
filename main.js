const electron = require('electron')
// Module to control application life.
const app = electron.app

const { nativeTheme, Tray } = require('electron')
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const xhr = require('xhr')
const fs = require('fs')
const notifier = require('node-notifier');
const { shell } = require('electron');
const {autoUpdater} = require("electron-updater");
const {ipcMain} = require('electron');
const isDev = require('electron-is-dev');

var appRootDir = require('app-root-dir').get().replace('app.asar','');
var appPath=appRootDir+'/bin/';
let userDataDir = app.getPath('userData');

global.userDataDir = userDataDir;

global.appPath = appRootDir;

global.downloadDir = app.getPath('downloads');

var AutoLaunch = require('auto-launch');
var autoLauncher = new AutoLaunch({
    name: "Hugin Messenger",
    isHidden: true
});

// Checking if autoLaunch is enabled, if not then enabling it.
autoLauncher.isEnabled().then(function(isEnabled) {
  if (isEnabled) return;
   autoLauncher.enable();
}).catch(function (err) {
  throw err;
});

function getTrayIcon() {
  let isDark = nativeTheme.shouldUseDarkColors;
  return path.join(__dirname, `static/tray-icon${isDark ? "-dark" : ""}.png`);
}

let tray = null


const fetch = require('electron-fetch').default;

const WB = require('kryptokrona-wallet-backend-js');
const util = require('util');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let js_wallet;

let c = false;

if (fs.existsSync(userDataDir + '/boards.wallet')) {
    // We have found a boards wallet file
    c = 'o';
} else {
    c = 'c';
}

let syncing = true;

let start_js_wallet = async () => {

    /* Initialise our blockchain cache api. Can use a public node or local node
       with `const daemon = new WB.Daemon('127.0.0.1', 11898);` */

   let node = global.node.split(':')[0];
   let port = parseInt(global.node.split(':')[1]);
    const daemon = new WB.Daemon(node, port);

    if (c === 'c') {

        let height = 600000;

        try {
        let re = await fetch('http://' + node + ':' + port + '/getinfo');

        height = await re.json();

      } catch (err) {

      }

        const [newWallet, error] = await WB.WalletBackend.importViewWallet(daemon, parseInt(height.height)-1000, '1ee35767b8a247c03423e78c302f7c3c64c5e3c145878e4fbf1cc3bbbb35b10c', 'SEKReSxkQgANbzXf4Hc8USCJ8tY9eN9eadYNdbqb5jUG5HEDkb2pZPijE2KGzVLvVKTniMEBe5GSuJbGPma7FDRWUhXXDVSKHWc');

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

    js_wallet.enableAutoOptimization(false);

    /* Enable debug logging to the console */


    /* Start wallet sync process */
    await js_wallet.start();

    js_wallet.on('incomingtx', (transaction) => {

        console.log(`Incoming transaction of ${transaction.totalAmount()} received!`);

        if (!syncing) {
          mainWindow.webContents.send('new-message', transaction.toJSON());
        }

    });

    let i = 1;

    for (const address of js_wallet.getAddresses()) {
         console.log(`Address [${i}]: ${address}`);
         i++;
    }

    i = 1;

    let boards_addresses = [];

    for (const address of js_wallet.getAddresses()) {
         const [publicSpendKey, privateSpendKey, err] = await js_wallet.getSpendKeys(address);
         boards_addresses[boards_addresses.length] = [address, publicSpendKey];
         console.log(`Address [${i}]: ${address}`);
         i++;
    }

    global.boards_addresses = boards_addresses;

    console.log('Started wallet');


    while(true) {
    await sleep(1000 * 20);
    /* Save the wallet to disk */
    js_wallet.saveWalletToFile(userDataDir + '/boards.wallet', 'hunter2');
    const [walletBlockCount, localDaemonBlockCount, networkBlockCount] =
     await js_wallet.getSyncStatus();
     if((localDaemonBlockCount - walletBlockCount) < 2  ) {
       // Diff between wallet height and node height is 1 or 0, we are synced
       console.log('walletBlockCount',walletBlockCount);
       console.log('localDaemonBlockCount', localDaemonBlockCount);
       console.log('networkBlockCount', networkBlockCount);
       syncing = false;
     }
    }

    console.log('Saved wallet to file');
}


ipcMain.on('login-complete', async (event, arg) => {

  mainWindow.webContents.send('got-login-complete');

});

ipcMain.on('create-account', async (event) => {

      console.log('Creating new account');

      let new_wallet_name = randomString() + randomString() + randomString();
      let new_wallet_password = randomString() + randomString() + randomString();
      let new_rpc_pw = randomString() + randomString() + randomString();

      global.rpc_pw = new_rpc_pw;

      // Generate wallet with settings from above

      let gen_wallet = spawn(appPath + 'kryptokrona-service', ['-l', userDataDir+"/walletd.log",'-g','-w', userDataDir+'/'+new_wallet_name, '-p', new_wallet_password, '--rpc-password', new_rpc_pw]);

       gen_wallet.stdout.on('data', (data) => { });

       gen_wallet.stderr.on('data', (data) => { });

       gen_wallet.on('close', (code) => {

         event.reply('created-account');

       });


      let walletData = {
        setting: 'walletData',
        walletFile: new_wallet_name,
        walletPassword: new_wallet_password,
        rpcPassword: new_rpc_pw,
        node: global.node
      };

      db.insert(walletData);




})

ipcMain.on('get-profile', async (event, arg) => {

  console.log('getting profile..');

  event.reply('got-profile', await js_wallet.getTransactions(undefined, 5, true, arg));

})

ipcMain.on('get-boards', async (event, arg) => {

  console.log('get-boards triggered');

  const daemonInfo = js_wallet.getDaemonConnectionInfo();
  console.log(`Connected to ${daemonInfo.ssl ? 'https://' : 'http://'}${daemonInfo.host}:${daemonInfo.port}`);

  event.reply('got-boards', await js_wallet.getTransactions(undefined, 25, true, arg));

})

ipcMain.on('start-wallet', async(event, addr) => {
  console.log('Starting wallet..');
  await startWallet();
  event.reply('wallet-started');

})

ipcMain.on('remove-subwallet', async(event, addr) => {

  const error = await js_wallet.deleteSubWallet(addr);


  let boards_addresses = [];

  let i = 0;

  for (const address of js_wallet.getAddresses()) {
       const [publicSpendKey, privateSpendKey, err] = await js_wallet.getSpendKeys(address);
       boards_addresses[boards_addresses.length] = [address, publicSpendKey];
       console.log(`Address [${i}]: ${address}`);
       i++;
  }

  global.boards_addresses = boards_addresses;

  event.reply('removed-subwallet', addr);

  js_wallet.saveWalletToFile(userDataDir + '/boards.wallet', 'hunter2');

});

ipcMain.on('import-view-subwallet', async(event, arg) => {


  const [walletBlockCount, localDaemonBlockCount, networkBlockCount] =
 js_wallet.getSyncStatus();

      const [baddress, error] = await js_wallet.importViewSubWallet(arg, networkBlockCount - 1000);

      console.log(networkBlockCount - 1000);

      await js_wallet.rewind(networkBlockCount - 1000);


      syncing = true;

      if (!error) {
           console.log(`Imported view subwallet with address of ${baddress}`);
           event.reply('imported-view-subwallet', baddress);
           js_wallet.saveWalletToFile(userDataDir + '/boards.wallet', 'hunter2');
           let boards_addresses = [];

           let i = 1;

           for (const address of await js_wallet.getAddresses()) {
              console.log(`Address [${i}]: ${address}`);
                const [publicSpendKey, privateSpendKey, err] = await js_wallet.getSpendKeys(address);
                boards_addresses[boards_addresses.length] = [address, publicSpendKey];

                i++;
           }

           global.boards_addresses = boards_addresses;

           js_wallet.saveWalletToFile(userDataDir + '/boards.wallet', 'hunter2');


      } else {
           console.log(`Failed to import view subwallet: ${error.toString()}`);
           event.reply('imported-view-subwallet', error.toString());
      }


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
  console.log('hello');
  if(!app.isQuiting){
      mainWindow.hide();
  }

})

ipcMain.on('get-nodes', async (event, arg) => {
  console.log(arg) // prints "ping"
  let json = await fetchNodes();
  event.reply('got-nodes', json)
})

ipcMain.on('kill-wallet', async (event) => {

  try {
    wallet.kill('SIGINT');
  } catch (err) {

  }

})

ipcMain.on('change-node', async (event, node, kill=true) => {
  console.log(node) // prints "ping"

  global.node = node;
  const daemon = new WB.Daemon(node.split(':')[0], parseInt(node.split(':')[1]));
  js_wallet.swapNode(daemon);

  db.update({setting : 'walletData'}, { $set: {node : node} } , {} , function (err, numReplaced){

    console.log(numReplaced);
    if (kill) {
      try {
      wallet.kill('SIGINT');
    } catch (err) {}
      wallet.on('close', () => {
        console.log('Wallet is closed..');
        startWallet();


      } );

    } else {
    }

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
    webPreferences: {nodeIntegration: true, experimentalFeatures: true, experimentalCanvasFeatures: true, spellcheck: true}
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
    // mainWindow = null
  })

  mainWindow.on('close', function (e) {

    e.preventDefault();
    mainWindow.hide();
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // mainWindow = null
  })


      ipcMain.on('show-window', async (event) => {


        mainWindow.show();

      })




      let isDark = nativeTheme.shouldUseDarkColors;
      if (process.platform == 'darwin') {
      tray = new Tray(path.join(__dirname, 'static/tray-iconTemplate.png'));
    } else {
      tray = new Tray(path.join(__dirname, `static/tray-icon${isDark ? "-dark" : ""}.png`));
    }
      const contextMenu = Menu.buildFromTemplate([
        { label: 'Show App', click:  function(){
           mainWindow.show();
       } },
       { label: 'Hide App', click:  function(){
          mainWindow.hide();
      } },
       { label: 'Quit', click:  function(){
           js_wallet.stop();
           wallet.kill('SIGINT');
           app.exit(0);
       } }
      ])
      tray.setToolTip('Hugin Messenger')
      tray.setContextMenu(contextMenu)
      nativeTheme.on("updated", () => {
        if (process.platform != 'darwin') {
        tray.setImage(getTrayIcon());
      }
      });


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

  try{
    wallet.kill('SIGINT');
  } catch (err) {

  }


})

ipcMain.on('import_wallet', (evt, arg) => {

  wallet.kill('SIGINT');

      let new_wallet_name = randomString() + randomString() + randomString();
      let new_wallet_password = randomString() + randomString() + randomString();
      let new_rpc_pw = global.rpc_pw;

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

let startWallet = async () => {

  await db.find({setting : 'walletData'}, function (err,docs){

  wallet_file = docs[0].walletFile;
  wallet_pw = docs[0].walletPassword;
  global.rpc_pw = docs[0].rpcPassword;




  let node = global.node.split(':')[0];
  let port = global.node.split(':')[1];

  if (docs[0].node) {

    node = docs[0].node.split(':');
    port = node[1];
    node = node[0]
  }

  const daemon = new WB.Daemon(node, parseInt(port));

  start_js_wallet();

  global.node = node+':'+port;



    if (fs.existsSync(appPath+'kryptokrona-service') || fs.existsSync(appPath+'kryptokrona-service.exe' )) {
      console.log('File exists!');
    } else {
      console.log('File does not exist!');
      mainWindow.webContents.send('missing-service');
      return;
    }

     wallet = spawn(appPath+'kryptokrona-service', ['-l', userDataDir+"/walletd.log",'-w', userDataDir+'/'+wallet_file, '-p', wallet_pw, '--rpc-password', global.rpc_pw, '--daemon-address', global.node.split(':')[0], '--daemon-port', global.node.split(':')[1]]); //, '--daemon-address', 'localhost'

     wallet.stdout.on('data', (data) => {


     });

     wallet.stderr.on('data', (data) => {

     });

     wallet.on('close', (code) => {
       console.log(`child process exited with code ${code}`);
     });



})




}




 app.on('ready', function()  {

   if (isDev) {
     console.log('Running in development');
      mainWindow.openDevTools();
   } else {
     console.log('Running in production');
     autoUpdater.checkForUpdates();
   }
 });

if (process.platform !== 'darwin') {
 autoUpdater.on('update-downloaded', () => {

   notifier.notify({
     title: "Hugin Messenger",
     message: "A new update is available, would you like to install it now?",
     wait: true, // Wait with callback, until user action is taken against notification,
     actions: ['Yes', 'Later']
   },function (err, response, metadata) {
     // Response is response from notification
     // Metadata contains activationType, activationAt, deliveredAt
     console.log(response, metadata.activationValue, err);

     if(metadata.activationValue != "Later" || metadata.button != "Later" ) {
           autoUpdater.quitAndInstall();
           app.exit();
       }
     });

   });

 } else {

   autoUpdater.on('update-available', () => {
     notifier.notify({
       title: "Hugin Messenger",
       message: "A new update is available, would you like to install it now?",
       wait: true, // Wait with callback, until user action is taken against notification,
       actions: ['Yes', 'Later']
     },function (err, response, metadata) {
       // Response is response from notification
       // Metadata contains activationType, activationAt, deliveredAt
       console.log(response, metadata.activationValue, err);

       if(metadata.activationValue == "Yes" || metadata.button == "Yes" ) {


        shell.openExternal('https://github.com/kryptokrona/hugin-messenger/releases/latest');


         }
       });

 });

}


function randomString() {
  return parseInt(Math.random()*100000000000000000).toString(36);
}

// Check if any message data is stored
db.find({}, async function (err, docs) {
  datastore_docs = docs;


  // If there are no messages stored, load messages from block 0
  if (!datastore_docs[0]) {
    global.node = "pool.kryptokrona.se:11898";
    global.first_start = true;
    return;
    // Generate wallet name and password

  } else {


      await db.find({setting : 'walletData'}, function (err,docs){

      let node = 'pool.kryptokrona.se';
      let port = '11898'

      if (docs[0].node) {

        node = docs[0].node.split(':');
        port = node[1];
        node = node[0]
      }

      global.node = node + ":" + port;
    });
  }

});
