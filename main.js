const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const xhr = require('xhr')
const fs = require('fs')




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
    //js_wallet.setLogLevel(WB.LogLevel.DEBUG);

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
    //
    // if (unlockedBalance < 11) {
    //     console.log('Not enough funds to send a transaction...');
    // } else {
    //     console.log('Attempting to send a transaction');
    //
    //     const result = await wallet.sendTransactionAdvanced([['SEKReXcwhgX9LVUgnist5JNqSTqwkC7KejZfCULR3sGkcqBSY7bV5PR3QMppFWFSAs5HUdENPKSXXdbkEo6pThSVUub41Nc1CMS', 10]], 5, {fixedFee: 6000, isFixedFee: true}, undefined, undefined, undefined, undefined, undefined, Buffer.from('7b22626f78223a22353162383430333434633537396539393533313233643930376637613963366437303733366135636466633165383938376165646466336630623562393437663735626132353434663537363036356534383336643031656164653938633430666638386235373764643065343264633763306137643162383264623234343735306536323838373737353962303835636162633835383063396435393165623536323561643562373134326430306532356534323265373330393538656266336138643061663732383262393466393137663637313334373962393233386337626561306236326134663863623061306334373864636365386162353535353339343136393037653266383134663361303564303334356538343237636663666162663635323766646630363539383634326335613435616561303031323531306561306636666538313463656335663761663231343438306133633233336339303832646230653238626632616464356164663866393530376632613065633733373235396365323930383733336266366638326537646537336363373131396663393132356462656337343831663039353561386236346165643339373533353831326164316234373032313538373266303935363038663836633162616164396132376263303731222c2274223a313630373930373336323133337d', "hex"));
    //     // console.log("result", result.preparedTransaction);
    //     // result = await wallet.sendPreparedTransaction(result.transactionHash);
    //
    //     console.log(Buffer.from('7b22626f78223a2262323531373035373632643738663330613266326132306338656163346233356235393562363232646235656663333531613239653538633462373834616464303839633338363334623963353437353735623430316530636465663461346331316465343238343862353266363763376165386134353566613834616663373433633566353066373661656562376634636265636533313261373038663866353965636230623266663032656363333435396538343564313331346634666664643538616130653635383165636265656532663861643738663435363031393539383838306232383238643065643565633637656533393438626561343961313364343338656230326663313631393734666132663363643335663136383735313561633939633035346133393737613931393563393933346238383564373135396335383639393164323735323433383638353033636464663463376236633866386631346632333634376566393335376261353931366263373864623066353437363339613937656630326635303038656366383935656664373231323036616263326130653564613531626230303930343034636636636533636137303363326632626465646632353634663435383530616134343061353965666234653861303237333839343437623264343962373436663835636238643061656663643866353538313337333565303262313461653361626266353138376336336364656436316135353461633136633666626339313833373232316230653962653038356366383737316530633330316235633430373534663539656636306339383164643739393764386136333561356562343031616563306436353966653331326439373035343662663937323236643963343466643435323563653666323339303230303062313336386634313337316331613866383462373965373433363934306265366464386361383732636465323366643566373461336334656561656137306134393331346633316639653861303766303939333061616463373662323839656537613736373739623962393935313933383462306130343362343032663463346631663035393862633363383364333131363534386532333562666638373064343935653534643034386534386438303730643964343466373935623262616636343061356539303464653836222c2274223a313630373838343534313139387d', "hex"));
    //
    //     if (result.success) {
    //         console.log(`Sent transaction, hash ${result.transactionHash}, fee ${WB.prettyPrintAmount(result.fee)}`);
    //     } else {
    //         console.log(`Failed to send transaction: ${result.error.toString()}`);
    //     }
    // }


  // await wallet.rewind(588000);

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

   mainWindow.openDevTools();

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
