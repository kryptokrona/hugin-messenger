// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
window.$ = window.jQuery = require('jquery');


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

function escapeHtml(unsafe) {
    return unsafe
         // .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;")
         .replace(/Δ/g, "&Delta;")
         .replace(/δ/g, "&delta;")
         .replace(/Λ/g, "&Lambda;")
         .replace(/λ/g, "&lambda;");
 }

var remote = require('electron').remote;
var rpc_pw = remote.getGlobal('rpc_pw');
var moment = require('moment');
// Global variable for storing the currently used address
var currentAddr = "";
var allAddresses = [];

// Global variable for block explorer url
var explorerURL = "http://explorer.kryptokrona.se/?hash=";

const shell = require('electron').shell;
const settings = require('electron-settings');

const {ipcRenderer} = require('electron');

const closeApp = document.getElementById('close-app');
closeApp.addEventListener('click', () => {
    ipcRenderer.send('close-me')
});


// Open links in browser
$(document).on('click', 'a[href^="http"]', function(event) {
    event.preventDefault();
    shell.openExternal(this.href);
});

// SLIDER


  var slider = document.getElementById("myRange");
  var output = document.getElementById("mixinValue");
  output.innerHTML = slider.value; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
      output.innerHTML = this.value;
  }

  var slider2 = document.getElementById("myRange2");
  var output2 = document.getElementById("feeValue");
  output.innerHTML = slider.value; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  slider2.oninput = function() {
      output2.innerHTML = this.value;
  }

// END OF SLIDER


var TurtleCoinWalletd = require('kryptokrona-service-rpc-js').default

let walletd = new TurtleCoinWalletd(
  'http://127.0.0.1',
  8070,
  rpc_pw
)

walletd.logging = false;

const messageWallet = settings.get('messageWallet');

if (!messageWallet) {
  $('overlay').show();
  walletd.createAddress()
  .then(resp => {

    settings.set('messageWallet', resp.body.result.address);
    setTimeout(function(){

      $('overlay').css('background-color','white').animate({
        marginTop: "50vh",
        height: "3px",
        backgroundColor: "white"
      }, 1000, function() {
        // Animation complete.

        $(this).animate({
          width: "0",
          marginLeft: "50vw"
        }, 500, function() {
          // Animation complete.
        });

      });

    }, 3000);


  });
} else {
  $('overlay').hide();
}

function sendTransaction() {

  $("#payment_message").unbind('click');

  receiver = $('#payment_rec_addr').val();
  amount = parseInt( parseFloat( $('#payment_amount').val() ) * 100000 );
  pay_id = $('#payment_id').val();
  fee = parseInt( parseFloat( $('#myRange2').val() ) * 100000 );
  fee = 10;
  mixin = parseInt( $('#myRange').val() );
  sendAddr = $("#currentAddrSpan").text();

  transfer = [ { 'amount':amount, 'address':receiver } ];

  walletd.sendTransaction(
    mixin,
    transfer,
    fee,
    [sendAddr],
    0,
    '',
    pay_id,
    sendAddr)
  .then(resp => {

    if (resp.body.error) {
      alert(resp.body.error.message);
      $("#payment_message").click(function(){

        $("#payment_rec_addr").val($('#recipient_form').val());
        $("#send_payment").toggleClass('hidden');

      });
      return
    }

    txHash = resp.body.result.transactionHash;
    $('#paymentLink').attr('href',explorerURL+txHash+"#blockchain_transaction");
    $('#paymentLink').text(txHash);

    updateBalance(sendAddr);

    // NEW MESSAGE PAYMENT style
    $('#payment_form').toggleClass('hidden');
    $('#payment_sent').toggleClass('hidden');
    $('#payment_message').click(function(){
      $('#payment_form').toggleClass('hidden');
      $('#payment_sent').toggleClass('hidden');
      $("#send_payment").toggleClass('hidden');
      $("#payment_message").unbind('click');
      $("#payment_message").click(function(){

        //load_page(currentPage,$("#wallet_summary"));
        $("#payment_rec_addr").val($('#recipient_form').val());
        $("#send_payment").toggleClass('hidden');

      });
    })

  })
  .catch(err => {
    console.log(err)
  })

}

function getHistory() {

  blockCount = 0;

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
      // When historic data about transactions is recieved
      transactions = resp.body.result.items.reverse();

      $('#history_list').empty();

      // Iterate through transactions
      var txsLength = transactions.length;
      for (var i = 0; i < txsLength; i++) {
          var thisAddr = transactions[i].transactions[0].transfers[0].address;
          var d = new Date(transactions[i].transactions[0].timestamp * 1000);
          var liClass = "unknown";
          var sign = "";
          var thisAmount = Math.abs(parseFloat(transactions[i].transactions[0].transfers[0].amount) / 100);

          if ($.inArray(thisAddr, allAddresses) != -1) {
            // If payment is incoming, i.e. a recieved transaction
            liClass = "received";
            sign = "+";
          } else {
            // If it's a sent tx
            liClass = "sent";
            sign = "-";
          }
          // Print html to app
          $('#history_list').append( "<li class='" + liClass + "'><span class='txAmnt'>" + sign + thisAmount + " KKR</span><span class='txTime'>" + d.toString() +"</span><br><span class='txAddr'><b style='display:none'>To: </b>" + thisAddr + "</span></li>");
      }

    })
    .catch(err => {
      console.log(err)
    })

  })
  .catch(err => {
    console.log(err)
  })


}

function updateBalance(address) {

  walletd.getBalance(address)
  .then(resp => {
    thisBalance = parseFloat(resp.body.result.availableBalance).toFixed(2)/100000;
    thisLockedAmount = parseFloat(resp.body.result.lockedAmount).toFixed(2)/100000;


    $("#balancetext").text(thisBalance);

    if (thisLockedAmount > 0) {
      $("#lockedBalanceText").text(" (+" + thisLockedAmount + ")");
    } else {
      $("#lockedBalanceText").text("");
    }

    })
    .catch(err => {
      console.log(err)
    })

}



function updateStatus() {

  walletd.getStatus()
  .then(resp => {

    var blockCount = resp.body.result.blockCount;
    var knownCount = resp.body.result.knownBlockCount;

    if ( (knownCount - blockCount) < 2 ) {

      $("#network_status").text("Synchronized");
      $("#blockcount").text( "Block height: " + knownCount );
      $('#status_icon').css('background-color','rgba(53,199,72,1)');
      $("#daemon_status").attr('title', 'Synchronized')
    } else {
    $("#network_status").text("Synchronizing..");
    $("#blockcount").text(blockCount +" / " + knownCount );
    $('#status_icon').css('background-color','rgba(253,189,65,1)');
    $("#daemon_status").attr('title', 'Synchronizing: '+blockCount +" / " + knownCount )
    }

    })
    .catch(err => {
      console.log(err)
      $('#status_icon').css('background-color','#FF4743');
      $("#daemon_status").attr('title', "Can't connect to node...")
    })

}

walletd.getAddresses()
.then(resp => {
  currentAddr = resp.body.result.addresses[0];
  allAddresses = resp.body.result.addresses;
  var thisAddr = resp.body.result.addresses[0];
  $("#currentAddrSpan").text(thisAddr);

  updateBalance(thisAddr);

})
.catch(err => {
  console.log(err)
})

function updateAddresses(){
  walletd.getAddresses()
  .then(resp => {
    currentAddr = resp.body.result.addresses[0];
    allAddresses = resp.body.result.addresses;
    var thisAddr = resp.body.result.addresses[0];
    $("#currentAddrSpan").text(thisAddr);

    updateBalance(thisAddr);

    addresses_loaded = true;

  })
  .catch(err => {
    console.log(err)
  })
}

let addresses_loaded = false;

window.setInterval(function(){

  updateBalance(currentAddr);
  updateStatus();
  //getHistory();
  if (!addresses_loaded) {
  updateAddresses();
  }


},10000);

window.setInterval(function() {
  walletd.save();
}, 60000);

function load_page(prev,next) {

  $('#container_next').html(next.html());
  $('#container_next').animate({
    left: "20px"
  }, 1000, function() {
    // Animation complete.
    next.show();
    $('#container_next').css("left","100%");
    $('#container_next').empty();
    $('.fadeIn').fadeIn("slow");

  });

  prev.animate({
    left: "-100%",
    opacity: "0"
  }, 1000, function() {
    // Animation complete.
    prev.css("left","0");
    prev.css("opacity","1");
    prev.css('display','none');
  });

}



var currentPage = $("#send_payment");

$("document").ready(function(){

    $("video").dblclick(function() {
    if (this.requestFullscreen) {
      this.requestFullscreen();
    }
    else if (this.mozRequestFullScreen) {
      this.mozRequestFullScreen();
    }
    else if (this.webkitRequestFullscreen) {
      this.webkitRequestFullscreen();
    }
    else if (this.msRequestFullscreen) {
      this.msRequestFullscreen();
    }
  });

  $('.emoji-picker__emoji').click(function() {

    $('#message_form').focus();

  });

  $("#payment_message").click(function(){

    $("#payment_rec_addr").val($('#recipient_form').val());
    $("#send_payment").toggleClass('hidden');


  });


  // WHEN 'SEND PAYMENT' IS CLICKED
  $("#sendbutton_sendpage").click(function(){

    sendTransaction();

  });

  $("#select_history").click(function(){
    load_page(currentPage,$("#history_page"));
    currentPage = $("#history_page");
    getHistory();
  });

  $("#select_messages").click(function(){
    load_page(currentPage,$("#messages_page"));
    currentPage = $("#messages_page");
  });

  $("#select_settings").click(function(){
    load_page(currentPage,$("#settings_page"));
    currentPage = $("#settings_page");
  });

  $("#sendbutton").click(function(){
    load_page(currentPage,$("#send_payment"));
    currentPage = $("#send_payment");
  });

  $("#walletSettings").click(function(){
    $('.setting_page').hide();
    $('#settings_page').fadeIn();
    $('#wallet_settings_page').fadeIn();
  });

  $("#nodeConnect").click(function(){
    let node = $('#nodeInput').val();
    ipcRenderer.send('change-node', node);
    updateStatus();

  });

  $("#connectionSettings").click(function(){
    $('.setting_page').hide();
    $('#settings_page').fadeIn();
    $('#connection_settings_page').fadeIn();
    // ipcRenderer.send('get-nodes','ping');

    // console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

    ipcRenderer.on('got-nodes', (event, json) => {
      console.log(json);
      $('.dropdown-content').empty();
      for (node in json.nodes) {

        let node_addr = json.nodes[node].url + ":" +json.nodes[node].port;

        $('.dropdown-content').append('<a href="#" id="node' + node + '">' + json.nodes[node].name + '</a>');

        $('#node' + node).click(function() {
          $('#nodeInput').val(node_addr);
        })

      }
    })
    ipcRenderer.send('get-nodes');

  });

  $('#avatar').click(function(){

  $('header').toggleClass('toggled');

  ipcRenderer.on('got-nodes', (event, json) => {
    console.log(json) // prints "pong"
  })

});

$('#avatar_contact').click(function(){

$('#currentchat_header_wrapper').toggleClass('toggled_addr');

});

});

$('#message_icon').click(function(){
$("#settings_page").fadeOut();
$(".setting_page").fadeOut();
if (!$('#boards').hasClass('hidden') || $('#flip-box-inner').hasClass('flip')) {
myFunction();
}

$('#boards').addClass('hidden');
$("#messages_page").removeClass('hidden');
})
