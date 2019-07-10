window.$ = window.jQuery = require('jquery');

const copy = require( 'copy-to-clipboard' );

const notifier = require('node-notifier');

const Datastore = require('nedb');

var player = require('play-sound')(opts = {})

function escapeHtml(unsafe) {
    return unsafe
         // .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }



const rmt = require('electron').remote;

let userDataDir = rmt.getGlobal('userDataDir');
let appPath = rmt.getGlobal('appPath');

let db = new Datastore({ filename: userDataDir+'/messages.db', autoload: true });

let keychain = new Datastore({ filename: userDataDir+'/keychain.db', autoload: true });

const nacl = require('tweetnacl');
const naclUtil = require('tweetnacl-util');

  const nonceFromTimestamp = (tmstmp) => {

    let nonce = hexToUint(String(tmstmp));

    while ( nonce.length < nacl.box.nonceLength ) {

      tmp_nonce = Array.from(nonce);

      tmp_nonce.push(0);

      nonce = Uint8Array.from(tmp_nonce);

    }

    return nonce;
    }

const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const toHexString = bytes =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

let keyPair;

var remote = require('electron').remote;
var Identicon = require('identicon.js');
const intToRGB = require('int-to-rgb');


const hashAddr = (addr) => {

  hash = nacl.hash(naclUtil.decodeUTF8(addr));

  hash_hex = Buffer.from(hash).toString('hex').substring(0,64);

  return hash_hex;
}

const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return parseInt(Math.abs(hash/10000));
}


var moment = require('moment');

function toHex(str,hex){
  try{
    hex = unescape(encodeURIComponent(str))
    .split('').map(function(v){
      return v.charCodeAt(0).toString(16)
    }).join('')
  }
  catch(e){
    hex = str
    console.log('invalid text input: ' + str)
  }
  return hex
}

function fromHex(hex,str){
  try{
    str = decodeURIComponent(hex.replace(/(..)/g,'%$1'))
  }
  catch(e){
    str = hex
    console.log('invalid hex input: ' + hex)
  }
  return str
}


var rpc_pw = remote.getGlobal('rpc_pw');


var TurtleCoinWalletd = require('turtlecoin-walletd-rpc-js').default

let walletd = new TurtleCoinWalletd(
  'http://127.0.0.1',
  8070,
  rpc_pw,
  false
)


let decrypt_message = (possibleKeys, box, timestamp) => {

  let i = possibleKeys.length;

  let decryptBox = false;

  while (decryptBox == false) {


    try {
    let possibleKey = possibleKeys[i].key;

     decryptBox = nacl.box.open(box, nonceFromTimestamp(timestamp), possibleKey, keyPair.secretKey);
     if (decryptBox) {
       return decryptBox;
     }
   } catch(e) {
     console.log();
   }

     i = i-1;
    }
}

function save_messages(transactions) {

  let address = $('.currentAddrSpan').text();

  // Iterate through transactions
  let txsLength = transactions.length;

  console.log(txsLength + " txs found.");

  let lasttx;

  let newMessages = [];

  for (let i = 0; i < txsLength; i++) {

      let txsInTx = transactions[i].transactions.length;


      for (let j = 0; j < txsInTx; j++) {

        let thisAddr = transactions[i].transactions[j].transfers[0].address;
        let d = new Date(transactions[i].transactions[j].timestamp * 1000);
        let thisAmount = Math.abs(parseFloat(transactions[i].transactions[j].transfers[0].amount) / 100);

        lasttx = transactions[i];
        try {

          payload = fromHex(transactions[i].transactions[j].extra.substring(66));

          payload_json = JSON.parse(payload);

          let decryptBox = false;

          if (payload_json.box) {

            // If message is encrypted with NaCl box

            let box = fromHexString(payload_json.box);
            let nonce = nonceFromTimestamp(payload_json.t);
            try {
            if (!decryptBox && payload_json.key) {

              let senderKey = payload_json.key;
              // Try to decrypt incoming messages
              decryptBox = nacl.box.open(box, nonceFromTimestamp(payload_json.t), hexToUint(payload_json.key), keyPair.secretKey);
            }
          } catch (e) {
            console.log();
          }
            try {
            if (!decryptBox) {

              console.log("Trying to decrypt..");

              let possibleKeys = [];

              keychain.find({}, function (err, docs) {

                possibleKeys = docs;
                try {
                decryptBox = decrypt_message(possibleKeys, box, timestamp);
              } catch (err){

              }
                });
            }

          } catch (e) {
            console.log();
          }

            let message_dec = naclUtil.encodeUTF8(decryptBox);
            payload_json = JSON.parse(message_dec);

          }

          message = payload_json.msg;

          console.log(message);

          if (message.substring(0, 22) == "data:image/jpeg;base64") {
            message = "<img src='" + message + "' />";
          }

          senderAddr = payload_json.from;
          receiverAddr = payload_json.to;
          timestamp = JSON.parse(payload).t;

          if ( message.length > 0 && (senderAddr == address || receiverAddr == address) ) {
            // Transfer contains a message

            if (senderAddr != address) {
              // If message is incoming, i.e. a recieved message

              newMessages.push({"type":"recieved","message":message,"timestamp":timestamp});

            } else {

              newMessages.push({"type":"sent","message":message,"timestamp":timestamp});

            }

          }
      }
        catch(err){

        }

      }



    }

    sortedMessages = sortMessages(newMessages);
    console.log(sortedMessages);

}


let download_messages = (from, to) => {


    // Get all transactions
    walletd.getTransactions(
      to,
      from,
      '',
      [],
      '')
    .then(resp => {

      // Transaction data has been recieved

      let transactions = resp.body.result.items;

        // Append unconfirmed transactions while looking for messages

        walletd.getUnconfirmedTransactionHashes()
        .then(response => {

          // Number of unconfirmed transactions
          txsLength = response.body.result.transactionHashes.length;

          //
          for (let i = 0; i < txsLength; i++) {

          walletd.getTransaction(response.body.result.transactionHashes[i])
          .then(resp => {

            transaction = resp.body.result.transaction;
            transactions.push({"transactions": [transaction]});

            if (txsLength == i) {
              save_messages(transactions);
            }

          });
        }

        if (txsLength == 0) {
          save_messages(transactions);
        }




          });

        });


}

let sendTransaction = (mixin, transfer, fee, sendAddr, payload_hex, payload_json) => {

        walletd.sendTransaction(
          mixin,
          transfer,
          fee,
          [sendAddr],
          0,
          payload_hex,
          '',
          sendAddr)
        .then(resp => {
          // console.log(resp.body)
          if (resp.body.error) {
              if (resp.body.error.message == "Wrong amount") {
                alert("Sorry, you don't have enough XKR to send this message.");
              } else {
                  alert(resp.body.error.message);
                }
            $('#loading_border').animate({width: '100%'},400,function(){
              $('#loading_border').width(0);
            });
            $('#message_form').prop('disabled',false);
            $('#message_form').focus();

            return
          }
          $('#loading_border').animate({width: '80%'},400);

          // Empty message input field, re-activate it and then focus
          $('#message_form').val('');
          $('#message_form').prop('disabled',false);
          $('#message_form').focus();

          db_json = {"conversation": payload_json.to, "type":"sent","message":payload_json.msg,"timestamp":JSON.parse(fromHex(payload_hex)).t}

          // Add message to datastore
          db.insert(db_json);

          // Add new message to conversation
          if (message.substring(0, 22) == "data:image/jpeg;base64") {
            message = "<img src='" + message + "' />";
          }


          // create a base64 encoded SVG
          avatar_base64 = get_avatar(sendAddr);

          $('#welcome_alpha').remove();

          $('#messages').append('<li class="sent_message"><img class="message_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><p>' + payload_json.msg + '</p><span class="time">' + moment(payload_json.t).fromNow() + '</span></li>');

          // Scroll to bottom
          $('#messages_pane').scrollTop($('#messages').height());

          $('#loading_border').animate({width: '100%'},400,function(){
            $('#loading_border').width(0);
          });

          // Add message to contacts list and add class to tell updateMessages
          if ( $('.' + payload_json.to).width() > 0 ){

          $('.'+payload_json.to).find('.listed_message').text(payload_json.msg).parent().detach().prependTo('#messages_contacts');
        } else {
          $('#messages_contacts').prepend('<li class="active_contact ' + payload_json.to + '"><img class="contact_avatar" src="data:image/svg+xml;base64,' + get_avatar(payload_json.to) + '" /><span class="contact_address">' + payload_json.to + '</span><br><span class="listed_message">'+payload_json.msg+'</li>');
        }

        })
        .catch(err => {
          console.log(err)
        })
}

function sendMessage(message) {

  let has_history = false;

    if (message.length == 0) {
      return
    }

    receiver = $('#recipient_form').val();


      keychain.find({ "address": receiver }, function (err, docs) {

        if (docs.length == 0) {

          keychain.insert({key: $('#recipient_pubkey_form').val(), address: receiver});

        }

      });


      $('#loading_border').animate({width: '40%'},600);
      $('#message_form').prop('disabled',true);

      // Transaction details
      amount = 1;
      fee = 10;
      mixin = 5;
      sendAddr = $("#currentAddrSpan").text();
      timestamp = Date.now();

      // Convert message data to json
      payload_json = {"from":sendAddr, "to":receiver, "msg":message};

      payload_json_decoded = naclUtil.decodeUTF8(JSON.stringify(payload_json));

      let box = nacl.box(payload_json_decoded, nonceFromTimestamp(timestamp), hexToUint($('#recipient_pubkey_form').val()), keyPair.secretKey);

      let payload_box;
      let payment_id = '';



          // Check whether this is the first outgoing transaction to the recipient

          db.find({conversation : receiver}, function (err,docs){
              console.log("Found ", docs.length, " previous messages.");
              if (docs.length > 0) {
                has_history = true;
                console.log('has_history is ', has_history);
              }



            // History has been asserted, continue sending message
      if (has_history) {
        payload_box = {"box":Buffer.from(box).toString('hex'), "t":timestamp};
      } else {
        payload_box = {"box":Buffer.from(box).toString('hex'), "t":timestamp, "key":$('#currentPubKey').text()};
        console.log("First message to sender, appending key.");
      }

      // Convert json to hex
      let payload_hex = toHex(JSON.stringify(payload_box));


      transfer = [ { 'amount':amount, 'address':receiver } ];

      sendTransaction(mixin, transfer, fee, sendAddr, payload_hex, payload_json);

      });


}

// Detect valid address input into recipient forms

$('#recipient_form').on('input', function() {

  text = $('#recipient_form').val();

  if (text.substring(0,4) == 'SEKR') {

    if (text.length == 163) {
      // If both addr and pub key is put in
      let addr = text.substring(0,99);
      let pubkey = text.substring(99,163);
      $('#currentchat_pubkey').show();
      $('#recipient_form').val(addr);
      $('#recipient_pubkey_form').val(pubkey);
      $('#recipient_pubkey_span').find('.checkmark').fadeIn();
      $('#recipient_span').find('.checkmark').fadeIn();
      $('#message_form').attr('disabled',false);
    }
    if (text.length == 99) {
      // If only addr is put in
      $('#currentchat_pubkey').show();
      $('#recipient_span').find('.checkmark').fadeIn();
      if ($('#recipient_pubkey_form').val().length != 63) {
        $('#message_form').attr('disabled',true);
        $('#message_form').val('Please enter the recipients message key in the form above. You can still send transactions.');
      } else {
        $('#message_form').attr('disabled',false);
        $('#message_form').val('');
      }

    }
    if (text.length < 99) {
      $('#recipient_span').find('.checkmark').hide();
      $('#message_form').attr('disabled',true);
      $('#message_form').val('Please enter a correct address in the form above.');
    }
  }
});

$('#recipient_pubkey_form').on('input', function() {
  // When public key input is changed

  text = $('#recipient_pubkey_form').val();

  if (text.length == 64) {
    // If correct pub key

    $('#recipient_pubkey_span').find('.checkmark').fadeIn();
    $('#message_form').val('');
    $('#message_form').attr('disabled',false);

  } else {
    $('#recipient_pubkey_span').find('.checkmark').hide();
    $('#message_form').attr('disabled',true);
    $('#message_form').val('Please enter the recipients message key in the form above. You can still send transactions.');
  }

});

$('#message_form').keypress(function (e) {

  if (e.which == 13) {
    message = $('#message_form').val();
    sendMessage(escapeHtml(message));
    return false;    //<---- Add this line
  }
});

const hexToUint = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

var currentAddr = "";
var allAddresses = [];

function sortMessages(arr){
   var len = arr.length;
   for (var i = len-1; i>=0; i--){
     for(var j = 1; j<=i; j++){
       if(arr[j-1].timestamp>arr[j].timestamp){
           var temp = arr[j-1];
           arr[j-1] = arr[j];
           arr[j] = temp;
        }
     }
   }
   return arr;
}

function get_avatar(hash) {

  // Get custom color scheme based on address
  rgb = intToRGB(hashCode(hash));

  // Options for avatar
  var options = {
        foreground: [rgb.red, rgb.green, rgb.blue, 255],               // rgba black
        background: [parseInt(rgb.red/10), parseInt(rgb.green/10), parseInt(rgb.blue/10), 255],         // rgba white
        margin: 0.2,                              // 20% margin
        size: 40,                                // 420px square
        format: 'svg'                             // use SVG instead of PNG
      };

  // create a base64 encoded SVG
  return new Identicon(hash, options).toString();

}


var blockCount = 0;

var messages = [];

function printMessages(transactions, address) {



    // Get locally stored outgoing messages

    let local_messages = [];

    db.find({conversation : address}, function (err,docs){

      for (msg in docs) {
        if (docs[msg].msg ) {
          message = docs[msg].msg;
          local_messages.push(message);
        }
      }

    });

    // Get list of wallets
    walletd.getAddresses()
    .then(resp => {
      currentAddr = resp.body.result.addresses[0];
      allAddresses = resp.body.result.addresses;

            // Iterate through transactions
            var txsLength = transactions.length;
            // alert(txsLength);
            let lasttx;

            let newMessages = [];

            for (let i = 0; i < txsLength; i++) {

                let txsInTx = transactions[i].transactions.length;


                for (let j = 0; j < txsInTx; j++) {
                //   if ( i == 0) {
                //   alert(JSON.stringify(transactions[i].transactions[j]));
                // }

                  var thisAddr = transactions[i].transactions[j].transfers[0].address;
                  var d = new Date(transactions[i].transactions[j].timestamp * 1000);
                  var thisAmount = Math.abs(parseFloat(transactions[i].transactions[j].transfers[0].amount) / 100);

                  lasttx = transactions[i];
                  try {

                    payload = fromHex(transactions[i].transactions[j].extra.substring(66));

                    payload_json = JSON.parse(payload);

                    let decryptBox = false;

                    if (payload_json.box) {

                      // If message is encrypted with NaCl box

                      let box = fromHexString(payload_json.box);
                      let nonce = nonceFromTimestamp(payload_json.t);

                      try {
                      decryptBox = nacl.box.open(box, nonceFromTimestamp(timestamp), hexToUint($('#recipient_pubkey_form').val()), keyPair.secretKey);
                      } catch (err) {
                        console.log(err);
                      }

                      if (!decryptBox && payload_json.key) {

                        let senderKey = payload_json.key;
                        // Try to decrypt incoming messages
                        decryptBox = nacl.box.open(box, nonceFromTimestamp(payload_json.t), hexToUint(payload_json.key), keyPair.secretKey);

                      }

                      let message_dec = naclUtil.encodeUTF8(decryptBox);
                      payload_json = JSON.parse(message_dec);
                      //alert(JSON.stringify(payload_json));

                    }

                    message = payload_json.msg;

                    if (message.substring(0, 22) == "data:image/jpeg;base64") {
                      message = "<img src='" + message + "' />";
                    }

                    senderAddr = payload_json.from;
                    receiverAddr = payload_json.to;
                    timestamp = JSON.parse(payload).t;

                    if ( message.length > 0 && (senderAddr == address || receiverAddr == address) ) {

                      if ($.inArray(senderAddr, allAddresses) == -1) {
                        // If message is incoming, i.e. a recieved message

                        newMessages.push({"type":"recieved","message":message,"timestamp":timestamp});

                      } else {

                        // If it's a sent msg
                        if (senderAddr != thisAddr) {
                        }
                        newMessages.push({"type":"sent","message":message,"timestamp":timestamp});
                      }

                    }
                }
                  catch(err){
                    // alert(thisAmount);

                    //console.log(err);
                  }

                }

              }
              //alert(JSON.stringify(local_messages));
              //newMessages = newMessages.concat(local_messages);
              //alert(JSON.stringify(newMessages));
              //newMessages.push(...local_messages);


              sortedMessages = sortMessages(newMessages);

              $('#messages').empty();

              for (let i = 0; i < sortedMessages.length; i++) {
                  let hash = '';
                  if (sortedMessages[i].type == 'sent') {
                    hash = currentAddr;
                  } else {
                    hash = address;
                  }
                  avatar_base64 = get_avatar(hash);

                  $('#messages').append('<li class="' + sortedMessages[i].type + '_message"><img class="message_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><p>' + sortedMessages[i].message + '</p><span class="time">' + moment(sortedMessages[i].timestamp).fromNow() + '</span></li>');

              }


                $('#messages_pane').scrollTop($('#messages').height());
                $('#recipient_form').val(address);

      });


}

function getConversation(address) {

  let conversationPubKey = false;

  keychain.find({ "address": address }, function (err, docs) {

    if (docs.length > 0) {

      conversationPubKey = docs[0].key;

      $('#recipient_pubkey_form').val(conversationPubKey);
      $('#currentchat_pubkey').show();

      $('#recipient_pubkey_span').find('.checkmark').fadeIn();
      $('#recipient_span').find('.checkmark').fadeIn();

    }

  });

    // Get blockcount so as to view the entirety of the transactions
    walletd.getStatus()
    .then(resp => {
      blockCount = parseInt(resp.body.result.blockCount);

      // Get all transactions
      walletd.getTransactions(
        blockCount,
        1,
        '',
        [],
        '')
      .then(resp => {

        // Transaction data has been recieved

        let transactions = resp.body.result.items;

          // Append unconfirmed transactions while looking for messages

          walletd.getUnconfirmedTransactionHashes()
          .then(response => {

          	// alert(JSON.stringify(response.body.result.transactionHashes[0]));

            txsLength = response.body.result.transactionHashes.length;

            if (txsLength == 0) {
              // If no unconfirmed transactions, print the blockchain stored
              // transactions.
              printMessages(transactions, address);
            }

            for (let i = 0; i < txsLength; i++) {

            walletd.getTransaction(response.body.result.transactionHashes[i])
            .then(resp => {
              transaction = resp.body.result.transaction;
              transactions.push({"transactions": [transaction]});

              if ( (txsLength - i) == 1) {
                printMessages(transactions, address);
              }
            });
          }

            });

          });


        });
}

$("#messages_contacts").on("click", "li", function(){
    $('#message_form').focus();
    $('#recipient_form').val($(this).find('.contact_address').text());
    print_conversation($(this).find('.contact_address').text());
});

var lastMessage = 0;

function updateMessages() {


  // This function gets all conversations and prints them to the contacts list


        // Get locally stored outgoing messages

        let local_messages = [];

        db.find({}, function (err,docs){

          for (msg in docs) {
            if (docs[msg].msg ) {
              message = docs[msg];
              local_messages.push(message);
            }
          }

          });




  // Get blockcount so as to view the entirety of the transactions
  walletd.getStatus()
  .then(resp => {

    // Set blockCount value to current block count
    blockCount = parseInt(resp.body.result.blockCount);

    // Code below retrievs all addresses in current wallet container
    var allAddresses = [];

    walletd.getAddresses()
    .then(resp => {

      currentAddr = resp.body.result.addresses[0];
      allAddresses = resp.body.result.addresses;
      var thisAddr = resp.body.result.addresses[0];


    // Get all transactions for all wallets

      walletd.getTransactions(
        blockCount,
        1,
        '',
        [],
        '')
      .then(resp => {

      transactions = resp.body.result.items;


      // Iterate through transactions
      var txsLength = transactions.length;

      let last_messages = [];

      for (var i = 0; i < (txsLength + local_messages.length); i++) {
          try {
          if (i < txsLength) {

          var thisAddr = transactions[i].transactions[0].transfers[0].address;
          var d = new Date(transactions[i].transactions[0].timestamp * 1000);
          var thisAmount = Math.abs(parseFloat(transactions[i].transactions[0].transfers[0].amount) / 100);

          // Try to read messages from transaction, txs without messages are ignored

          payload = fromHex(transactions[i].transactions[0].extra.substring(66));
          payload_json = JSON.parse(payload);

          if (payload_json.box) {

            let box = fromHexString(payload_json.box);

            let timestamp = payload_json.t;

            if (payload_json.key) {

              let senderKey = payload_json.key;

              let decryptBox = nacl.box.open(box, nonceFromTimestamp(timestamp), hexToUint(senderKey), keyPair.secretKey);

              let message_dec = naclUtil.encodeUTF8(decryptBox);

              payload_json = JSON.parse(message_dec);

              payload_keychain = {"key": senderKey, "address": payload_json.from};

              keychain.find({ "key": senderKey }, function (err, docs) {

                if (docs.length == 0) {

                  keychain.insert(payload_keychain);

                }

              });


            } else {
              // If message is encrypted with NaCl box, but public key is not provided
              let box = fromHexString(payload_json.box);
              let timestamp = payload_json.t;

              let possibleKeys = [];

              keychain.find({}, function (err, docs) {

                possibleKeys = docs;

                });

              let i = possibleKeys.length;

              let decryptBox = false;

              while (decryptBox == false) {

                let possibleKey = possibleKeys[i].key;

                 decryptBox = nacl.box.open(box, nonceFromTimestamp(timestamp), possibleKey, keyPair.secretKey);

                 i = i+1;

                }
                alert(decryptBox);
                let message_dec = naclUtil.encodeUTF8(decryptBox);
                payload_json = JSON.parse(message_dec);


             }

            message = payload_json.msg;
            senderAddr = payload_json.from;
            timestamp = payload_json.t;
          }


        } else {
          message = local_messages[i-txsLength].msg.message;
          //alert(message);
          senderAddr = $("#currentAddrSpan").text();
          timestamp = local_messages[i-txsLength].msg.timestamp;
          thisAddr = local_messages[i-txsLength].conversation;

        }

          if ( message.length > 0 && senderAddr != thisAddr) {
            // If there is a message to show. The other statement is wtf
            if ($.inArray(senderAddr, allAddresses) == -1) {
              // If message is incoming, i.e. a recieved message

              if ( $.inArray(senderAddr, messages) == -1 ) {
              // If conversation doesn't exist

                  avatar_base64 = get_avatar(senderAddr);

                  $('#messages_contacts').prepend('<li class="active_contact ' + senderAddr + '"><img class="contact_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '" /><span class="contact_address">' + senderAddr + '</span><br><span class="listed_message">'+message+'</li>');
                  messages.push(senderAddr);
                }

                // Add message to conversations list
                $('.'+senderAddr).find('.listed_message').text(message);

                last_messages[senderAddr] = timestamp;

                if (timestamp > lastMessage) {

                  lastMessage = timestamp;


                  if ($('#recipient_form').val() != senderAddr) {

                    notifier.notify({
                      title: 'New message:',
                      message: message,
                      sound: appPath + '/static/newmessage.mp3'
                    });

                  }


                }



            } else {

              // If it's a sent msg

              if ( $.inArray(thisAddr, messages) == -1 ) {
              // If conversation doesn't exist

                avatar_base64 = get_avatar(thisAddr);

                $('#messages_contacts').prepend('<li class="active_contact ' + thisAddr + '"><img class="contact_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '" /><span class="contact_address">' + thisAddr + '</span><br><span class="listed_message">'+message+'</li>');
                messages.push(thisAddr);


              }

              if (timestamp > last_messages[thisAddr]) {
              last_messages[senderAddr] = timestamp;
              // Add message to conversations list
              $('.'+thisAddr).find('.listed_message').text(message);
            }


            }

          }
        }
          catch(err) {

          }

  }

    })
    .catch(err => {
      console.log(err)
    })

        })
        .catch(err => {
          console.log(err)
        })

  })
  .catch(err => {
    console.log(err)
  })




}


function save_message(message_json) {

  let conversation = '';
  let type = '';

  if ( message_json.from == $("#currentAddrSpan").text() ) {

      conversation = message_json.to;
      type = "sent";

    } else {
      conversation = message_json.from;
      type = "received";
    }

  db.find({timestamp : message_json.t}, function (err,docs){

      if (docs.length == 0) {

      message_db = {"conversation": conversation, "type":type, "message":message_json.msg, "timestamp": message_json.t};-

      db.insert(message_db);

      }

});

}

//
// bugtest_json = {msg: 'Use this chat to send feedback and bug reports', from: 'SEKReXvQXDxUqfCZXiiYBk6CvBNajxchSKgHP4KwN3AphesPvmahuTTXozwcQ19uSHjbTGThRMrPbRe48jKhod4jVyRsJS7BKA7', to: $('#currentAddrSpan').text(), t:1562773076786};
//
// save_message(bugtest_json);

keychain.find({ "key": "3fc9c579e66ec2cec023566be3e59a96926130b94498d4b2707a9405baa03807" }, function (err, docs) {

  if (docs.length == 0) {
    let payload_keychain = {"key": "3fc9c579e66ec2cec023566be3e59a96926130b94498d4b2707a9405baa03807", "address": "SEKReXvQXDxUqfCZXiiYBk6CvBNajxchSKgHP4KwN3AphesPvmahuTTXozwcQ19uSHjbTGThRMrPbRe48jKhod4jVyRsJS7BKA7"};
    keychain.insert(payload_keychain);

  }
});

function find(db, opt) {
  return new Promise(function(resolve, reject) {
    db.find(opt, function(err, doc) {
      if (err) {
        reject(err)
      } else {
        resolve(doc)
      }
    })
  })
}

function find_messages(opt, skip, limit, sort=-
  1) {
  return new Promise(function(resolve, reject) {
    db.find(opt).sort({timestamp: sort}).skip(skip).limit(limit).exec(function(err, doc) {
      if (err) {
        reject(err)
      } else {
        resolve(doc.reverse())
      }
    })
  })
}

// PROTOTYPE FOR AUTO READING OLD MESSAGES WHEN SCROLLING
// $('#messages_pane').on('scroll', async function() {
//
//         let timestamp = $('#messages').find('li').first().attr('timestamp');
//
//         let conversation = $('#recipient_form').val();
//
//         if ( $('.message_avatar').first().offset().top > 0 ) {
//
//
//           messages = await find_messages( {conversation: conversation }, 10*paginator);
//           paginator++;
//
//           for (n in messages) {
//
//             let hash = '';
//
//             if (messages[n].type == 'sent') {
//               hash = messages[n].conversation;
//             } else {
//               hash = $('#currentAddrSpan').text();
//             }
//             avatar_base64 = get_avatar(hash);
//
//             $('#messages').prepend('<li timestamp="' + messages[n].timestamp + '" class="' + messages[n].type + '_message"><img class="message_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><p>' + messages[n].message + '</p><span class="time">' + moment(messages[n].timestamp).fromNow() + '</span></li>');
//
//
//           }
//
//
//         }
//
// });


function get_confirmed_messages(from, to) {
  return new Promise(function(resolve, reject) {



    walletd.getTransactions(
      to,
      from,
      '',
      [],
      '').then(resp => {

      let transactions = resp.body.result.items;

      let txsLength = transactions.length;

      let arr = [];

      for (let i = 0; i < txsLength; i++) {

          let txsInTx = transactions[i].transactions.length;

          for (let j = 0; j < txsInTx; j++) {

            try{

            let extra = transactions[i].transactions[j].extra.substring(66);
            arr.push(extra);

          } catch (e) {

          }

          }
        }

          resolve(arr);

        }).catch(err => {
          reject(err)
        });
      });

  }

function get_block_height() {
  return new Promise(function(resolve, reject){

    // Get blockcount
    walletd.getStatus()
    .then(resp => {

      // Set blockCount value to current block count
      blockCount = parseInt(resp.body.result.blockCount);
      resolve(blockCount);

  }).catch(err => {
    reject(err);
  });
});
}

function get_unconfirmed_messages() {

  return new Promise(function(resolve, reject){

    let transactions = [];

    walletd.getUnconfirmedTransactionHashes()
    .then(response => {

      txsLength = response.body.result.transactionHashes.length;

      if (txsLength == 0) {
        // If no unconfirmed transactions, print the blockchain stored
        // transactions.
        resolve([]);
      }

      for (let i = 0; i < txsLength; i++) {
      walletd.getTransaction(response.body.result.transactionHashes[i])
      .then(resp => {
        transaction = resp.body.result.transaction;

        transactions[i] = transaction.extra.substring(66);
        if ( (txsLength - i) == 1) {
          resolve(transactions);
        }
      }).catch(err => {
        reject(err);
      });
    }

  }).catch(err => {
    reject(err);
  });

    });
}

async function print_conversations() {

  messages = await find_messages({},0,0,1);

  conversations = [];

  for (m in messages) {

      conversation = messages[m].conversation;

      if (!conversations.includes(conversation)) {
        conversations.push(conversation);
        $('#messages_contacts').append('<li class="active_contact ' + conversation + '"><img class="contact_avatar" src="data:image/svg+xml;base64,' + get_avatar(conversation) + '" /><span class="contact_address">' + conversation + '</span><br><span class="listed_message">'+messages[m].message+'</li>');
      }

  }




  // Now we have all conversations in the database

}

print_conversations();

async function get_new_conversations() {


  known_keys = await find(keychain, {});

  block_height = await get_block_height();

  confirmed_transactions = await get_confirmed_messages(1,block_height);

  unconfirmed_transactions = await get_unconfirmed_messages();


  all_transactions = confirmed_transactions.concat(unconfirmed_transactions);

  latest_transaction = await find_messages({}, 0, 1);
  let latest_transaction_time = 0;

    try {
  latest_transaction_time = latest_transaction[0].timestamp;
} catch (e) {}





  for (n in all_transactions) {
    // console.log(fromHex(all_transactions[n]));
    try {
      tx = JSON.parse(fromHex(all_transactions[n]));
    } catch (err) {
      //console.log(err);
      continue;
    }

    if (tx.key) {

        let senderKey = tx.key;

        let box = tx.box;

        let timestamp = tx.t;

        let decryptBox = nacl.box.open(hexToUint(box), nonceFromTimestamp(timestamp), hexToUint(senderKey), keyPair.secretKey);

        if (!decryptBox) {
          continue;
        }

        let message_dec = naclUtil.encodeUTF8(decryptBox);

        payload_json = JSON.parse(message_dec);



        payload_json.t = timestamp;

        payload_keychain = {"key": senderKey, "address": payload_json.from};

        keychain.find({ "key": senderKey }, function (err, docs) {

          if (docs.length == 0) {

            keychain.insert(payload_keychain);

          }
        });

        save_message(payload_json);

    } else {

        // If no key is appended to message we need to try the keys in our payload_keychain
        let box = tx.box;

        let timestamp = tx.t;

        let i = 0;

        let decryptBox = false;

        while (i < known_keys.length && !decryptBox) {
          let possibleKey = known_keys[i].key;

           decryptBox = nacl.box.open(hexToUint(box), nonceFromTimestamp(timestamp), hexToUint(possibleKey), keyPair.secretKey);

           i = i+1;

          }

          if (!decryptBox) {
            continue;
          }


          let message_dec = naclUtil.encodeUTF8(decryptBox);

          payload_json = JSON.parse(message_dec);
          payload_json.t = timestamp;
          save_message(payload_json);

    }

      if (payload_json.t > latest_transaction_time) {

        if ($('#recipient_form').val() == payload_json.from){
          // If a new message is received, and it's from the active contacts
          // NOTE: Sent messages will be automatically printed by the send
          // message function, not this one.
          avatar_base64 = get_avatar(payload_json.from);
          $('#messages').append('<li class="received_message"><img class="message_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><p>' + payload_json.msg + '</p><span class="time">' + moment(payload_json.t).fromNow() + '</span></li>');
          // Scroll to bottom
          $('#messages_pane').scrollTop($('#messages').height());

        }

        let conversation_address = '';

        if ($('#currentAddrSpan').text() == payload_json.from) {
          // Sent message
          conversation_address = payload_json.to;

        } else {
          // Received message
          conversation_address = payload_json.from;
        }




        if ( $('.' + conversation_address).width() > 0 ){

        $('.' + conversation_address).find('.listed_message').text(payload_json.msg).parent().detach().prependTo("#messages_contacts");
      } else {
        $('#messages_contacts').prepend('<li class="active_contact ' + conversation_address + '"><img class="contact_avatar" src="data:image/svg+xml;base64,' + get_avatar(conversation_address) + '" /><span class="contact_address">' + conversation_address + '</span><br><span class="listed_message">'+payload_json.msg+'</li>');
      }
        //alert("New message: " + payload_json.msg);
      }





  }


}

async function send_message(message) {


    let has_history = false;

      if (message.length == 0) {
        return
      }

      receiver = $('#recipient_form').val();


        keychain.find({ "address": receiver }, function (err, docs) {

          if (docs.length == 0) {

            keychain.insert({key: $('#recipient_pubkey_form').val(), address: receiver});

          }

        });


        // Check whether this is the first outgoing transaction to the recipient

        db.find({conversation : receiver}, function (err,docs){
            console.log("Found ", docs.length, " previous messages.");
            if (docs.length > 0) {
              has_history = true;
              console.log('has_history is ', has_history);
            }



        $('#loading_border').animate({width: '40%'},600);
        $('#message_form').prop('disabled',true);

        // Transaction details
        amount = 1;
        fee = 10;
        mixin = 5;
        sendAddr = $("#currentAddrSpan").text();
        timestamp = Date.now();

        // Convert message data to json
        payload_json = {"from":sendAddr, "to":receiver, "msg":message};

        payload_json_decoded = naclUtil.decodeUTF8(JSON.stringify(payload_json));

        let box = nacl.box(payload_json_decoded, nonceFromTimestamp(timestamp), hexToUint($('#recipient_pubkey_form').val()), keyPair.secretKey);

        let payload_box;
        let payment_id = '';





              // History has been asserted, continue sending message
        if (has_history) {
          payload_box = {"box":Buffer.from(box).toString('hex'), "t":timestamp};
        } else {
          payload_box = {"box":Buffer.from(box).toString('hex'), "t":timestamp, "key":$('#currentPubKey').text()};
          console.log("First message to sender, appending key.");
        }

        // Convert json to hex
        let payload_hex = toHex(JSON.stringify(payload_box));


        transfer = [ { 'amount':amount, 'address':receiver } ];

        sendTransaction(mixin, transfer, fee, sendAddr, payload_hex, payload_json);

});
}

async function print_conversation(conversation) {


    keychain.find({ "address": conversation }, function (err, docs) {

      if (docs.length > 0) {

        conversationPubKey = docs[0].key;

        $('#recipient_pubkey_form').val(conversationPubKey);
        $('#currentchat_pubkey').show();

        $('#recipient_pubkey_span').find('.checkmark').fadeIn();
        $('#recipient_span').find('.checkmark').fadeIn();

      }

    });

  $('#recipient_form').val(conversation);

  $("#messages").empty();

  let messages = await find_messages({conversation: conversation}, 0, 100);

  for (n in messages) {
    let hash = '';

    if (messages[n].type == 'received') {
      hash = messages[n].conversation;
    } else {
      hash = $('#currentAddrSpan').text();
    }
    avatar_base64 = get_avatar(hash);

    $('#messages').append('<li timestamp="' + messages[n].timestamp + '" class="' + messages[n].type + '_message"><img class="message_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><p>' + messages[n].message + '</p><span class="time">' + moment(messages[n].timestamp).fromNow() + '</span></li>');


  }


  // Scroll to bottom
  $('#messages_pane').scrollTop($('#messages').height());

}

$("document").ready(function(){


  walletd.getAddresses()
  .then(resp => {
    currentAddr = resp.body.result.addresses[0];
    allAddresses = resp.body.result.addresses;
    var thisAddr = resp.body.result.addresses[0];

    walletd.getSpendKeys(thisAddr).then(resp => {

      let secretKey = naclUtil.decodeUTF8(resp.body.result.spendSecretKey.substring(1, 33));

      keyPair = nacl.box.keyPair.fromSecretKey(secretKey);

      let hex = Buffer.from(keyPair.publicKey).toString('hex');

      $('#currentPubKey').text(hex);

      avatar_base64 = get_avatar(currentAddr);
      $('#avatar').attr('src','data:image/svg+xml;base64,' + avatar_base64);
      $('#avatar').css('border-radius','50%');


    })

  })
  .catch(err => {
    console.log(err)
  })


  $('#copyBoth').click(function(){
    copy($('#currentAddrSpan').text() + $('#currentPubKey').text() );
  });

  lastMessage =  Date.now();

  $("#amount_plus").mousedown(function(){

    let i = 0;

    timeout = setInterval(function(){
        // Do something continuously

        value = $('#payment_amount').val();
        new_value = parseInt(value) + (i * 100);
        $('#payment_amount').val( new_value );
        i++;

    }, 100);

    return false;
});

$("#amount_minus").mousedown(function(){

  let i = 0;

  timeout = setInterval(function(){
      // Do something continuously

      value = $('#payment_amount').val();
      new_value = parseInt(value) - (i * 100);
      if ( new_value > 0 ) {
        $('#payment_amount').val(new_value);
      }
      i++;

  }, 100);

  return false;
});

  $('#amount_plus').click(function(){
    value = $('#payment_amount').val();
    $('#payment_amount').val(parseInt(value)+1);
  });

  $('#amount_minus').click(function(){

    value = $('#payment_amount').val();
    new_value = parseInt(value) - 1;

    if ( new_value > 0 ) {
      $('#payment_amount').val(new_value);
    }

  });

  $('#new_chat').click(function(){
    $('#recipient_form').val('');
    $('#currentchat_pubkey').hide();
    $('.checkmark').hide();
    $('#messages').empty();
  })
});

let locked = $('#lockedBalanceText').text();

window.setInterval(function(){

  if ( locked != $('#lockedBalanceText').text()) {

    locked = $('#lockedBalanceText').text();

    player.play(appPath + '/static/newmessage.mp3', function(err){
      if (err) throw err
    })

  }

  get_new_conversations();


},3000);
