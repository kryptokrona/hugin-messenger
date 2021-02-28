// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
window.$ = window.jQuery = require('jquery');
const rmt = require('electron').remote;
const fetch = require('node-fetch');

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
let walletd;

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


function sendTransaction() {

  // $("#payment_message").unbind('click');

  receiver = $('#payment_rec_addr').val();
  amount = parseInt( parseFloat( $('#payment_amount').val() ) * 100000 );
  pay_id = $('#payment_id').val();
  fee = parseInt( parseFloat( $('#myRange2').val() ) * 100000 );
  fee = 10;
  mixin = 7;
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
    // $('#payment_message').click(function(){
    //   $('#payment_form').toggleClass('hidden');
    //   $('#payment_sent').toggleClass('hidden');
    //   $("#send_payment").toggleClass('hidden');
    //   $("#payment_message").unbind('click');
    //   $("#payment_message").click(function(){
    //
    //     //load_page(currentPage,$("#wallet_summary"));
    //     $("#payment_rec_addr").val($('#recipient_form').val());
    //     $("#send_payment").toggleClass('hidden');
    //
    //   });
    // })

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
    var peers = resp.body.result.peerCount;

    if ( (knownCount - blockCount) < 2 && peers > 0 ) {

      $("#network_status").text("Synchronized");
      $("#blockcount").text( "Block height: " + knownCount );
      $('#status_icon').css('background-color','rgba(53,199,72,1)');
      $("#daemon_status").attr('title', 'Synchronized')
    } else if (peers > 0) {
    $("#network_status").text("Synchronizing..");
    $("#blockcount").text(blockCount +" / " + knownCount );
    $('#status_icon').css('background-color','rgba(253,189,65,1)');
    $("#daemon_status").attr('title', 'Synchronizing: '+blockCount +" / " + knownCount )
    }

    })
    .catch(err => {
      console.log(err)
      $('#status_icon').css('background-color','#FF4743');
      $("#daemon_status").attr('title', "Can't connect to node...");
      ipcRenderer.send('kill-wallet');
    })

}

ipcRenderer.on('got-login-complete', async () => {

  console.log('Wallet started!');

  walletd = new TurtleCoinWalletd(
    'http://127.0.0.1',
    8070,
    remote.getGlobal('rpc_pw')
  )


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

  window.setInterval(function(){

    updateBalance(currentAddr);
    updateStatus();


  },10000);

  window.setInterval(function() {
    walletd.save();
  }, 60000);

 })


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

ipcRenderer.on('missing-service', (event) => {

  let r = confirm('Your kryptkrona-service file is missing! It was probaby removed by your antivirus, you may need to add Hugin Messengers location as an exclusion in Windows Defender, or your antivirus software.');

  if (r) {

    console.log('fix plis');

  } else {
    return;
  }


});



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

ipcRenderer.on('created-account', (event) => {

  console.log('Account has been created successfully..');

  ipcRenderer.send('start-wallet');

  $('#saving').text('Connecting to blockchain');

})


$('#create_account_button').click(function(){
  console.log('Clicked create account..');
  ipcRenderer.send('create-account');
  $('#create_account_button').after('<p class="saving">Creating account<span>.</span><span>.</span><span>.</span></p>');

})

$("document").ready(async function(){

            $('#send_payment .fa-plus').click(function(){
              $('#send_payment').addClass('hidden');
              $('#payment_sent').addClass('hidden');
              $('#payment_form').removeClass('hidden');
              $('#payment_id').val('');
              $('#payment_rec_addr').val('');
              $('#replyto_exit').click();
            })


            if (rmt.getGlobal('first_start')) {
              console.log('First start!');
              $('#login-screen').hide();
              $('#create-account').css({
                position: "absolute",
                width: 500,
                top: "40%",
                right: 75
              })
            } else {
              console.log('Not! first start!');
              $('#create-account').remove();
              $('body hr').remove();
              $('#login-screen').css({
                position: "absolute",
                width: 500,
                top: "28%",
                right: 75
              })

            }


            while (rmt.getGlobal('node') == undefined) {
              await sleep(1000);
              console.log('no node :()');
            }


            $('#login_status span').text(rmt.getGlobal('node'));


            fetch('http://' + rmt.getGlobal('node') + '/json_rpc', {
                 method: 'POST',
                 timeout: 5000,
                 body: JSON.stringify({
                   jsonrpc: '2.0',
                   method: 'getblockcount',
                   params: {}
                 })
               }).then(json => {


                 $('#login_status span').text(rmt.getGlobal('node') + ' ✅');

               }).catch(err => {
                 console.log(err);
                 $('#login_swap_node').show();
                 $('#login_status span').text(rmt.getGlobal('node') + ' ❌');





                 }).finally(function() {

                   $('#login_swap_node').show().click(function() {
                       $('#login_swap_node_modal').empty();
                       $('#connection_settings_page').clone().appendTo('#login_swap_node_modal').find('h1, h3').unwrap().remove();
                     ipcRenderer.on('got-nodes', (event, json) => {



                      $('#login_swap_node_modal .dropdown-content').empty();
                       for (node in json.nodes) {

                         let node_addr = json.nodes[node].url + ":" +json.nodes[node].port;

                         $('#login_swap_node_modal .dropdown-content').append('<a href="#" id="node' + node + '">' + json.nodes[node].name + '</a>');

                         $('#login_swap_node_modal #node' + node).click(function() {
                           $('#login_swap_node_modal #nodeInput').val(node_addr).focus().blur();
                         })

                       }
                     })
                     ipcRenderer.send('get-nodes');

                     $('#login_swap_node_modal').show();

                     $("#login_swap_node_modal #nodeConnect").click(function(){
                       let node = $('#login_swap_node_modal #nodeInput').val();
                       ipcRenderer.send('change-node', node, false);
                       $('#login_status span').text(node);
                       $('#login_swap_node_modal').hide();


                       fetch('http://' + node + '/json_rpc', {
                            method: 'POST',
                            body: JSON.stringify({
                              jsonrpc: '2.0',
                              method: 'getblockcount',
                              params: {}
                            })
                          }).then(json => {


                            $('#login_status span').text(node + ' ✅');
                            $('#login_swap_node_modal').hide();

                          }).catch(err => {
                            console.log(err);

                            $('#login_status span').text(node + ' ❌');

                          });

                     });

                     $('#login_swap_node_modal #nodeInput').blur(function(){

                         $('#login_swap_node_modal #nodeInputStatus').text('');
                         $('#login_swap_node_modal #nodeInputLoading').show();


                           fetch('http://' + $('#login_swap_node_modal #nodeInput').val() + '/json_rpc', {
                                method: 'POST',
                                body: JSON.stringify({
                                  jsonrpc: '2.0',
                                  method: 'getblockcount',
                                  params: {}
                                })
                              }).then(json => {
                                console.log(json);
                                $('#login_swap_node_modal #nodeInputLoading').hide();
                                $('#login_swap_node_modal #nodeInputStatus').text('✅');

                              }).catch(err => {
                                console.log(err);
                                $('#login_swap_node_modal #nodeInputLoading').hide();
                                $('#login_swap_node_modal #nodeInputStatus').text('❌');
                              })




                 });
               })


               });

             });


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
    $('#payment_sent').addClass('hidden');
    $('#payment_form').removeClass('hidden');


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


  $('#connection_settings_page #nodeInput').blur(function(){

      $('#connection_settings_page #nodeInputStatus').text('');
      $('#connection_settings_page #nodeInputLoading').show();


        fetch('http://' + $('#connection_settings_page #nodeInput').val() + '/json_rpc', {
             method: 'POST',
             body: JSON.stringify({
               jsonrpc: '2.0',
               method: 'getblockcount',
               params: {}
             })
           }).then(json => {
             console.log(json);
             $('#connection_settings_page #nodeInputLoading').hide();
             $('#connection_settings_page #nodeInputStatus').text('✅');

           }).catch(err => {
             console.log(err);
             $('#connection_settings_page #nodeInputLoading').hide();
             $('#connection_settings_page #nodeInputStatus').text('❌');
           })



  })

  $("#connectionSettings").click(function(){
    $('#connection_settings_page #nodeInputStatus').text('');
    $('.setting_page').hide();
    $('#settings_page').fadeIn();
    $('#connection_settings_page').fadeIn();

    $('#nodeInput').val(rmt.getGlobal('node'));
    ipcRenderer.on('got-nodes', (event, json) => {

      $('.dropdown-content').empty();
      for (node in json.nodes) {

        let node_addr = json.nodes[node].url + ":" +json.nodes[node].port;

        $('#connection_settings_page .dropdown-content').append('<a href="#" id="node' + node + '">' + json.nodes[node].name + '</a>');

        $('#node' + node).click(function() {
          $('#connection_settings_page #nodeInput').val(node_addr).focus().blur();
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

function myFunction() {
  document.getElementById("flip-box-inner").classList.toggle("flip");

};

$('#message_icon').click(function(){
  $("#new_board").addClass('hidden');
$("#boards_picker").empty().addClass('hidden');
$("#settings_page").fadeOut();
$(".setting_page").fadeOut();
if (!$('#boards').hasClass('hidden') || $('#flip-box-inner').hasClass('flip')) {
myFunction();
}

$('#boards').addClass('hidden');
$("#messages_page").removeClass('hidden');
});

$('#settings_icon').click(function(){
myFunction(); $('#settings_page').fadeIn();
$('#boards').addClass('hidden');
$("#messages_page").removeClass('hidden');
$("#new_board").addClass('hidden');
$("#boards_picker").empty().addClass('hidden');
});

$('.close').click(function(){
  $(".settings_page").fadeOut(); $("#settings_page").fadeOut(); myFunction();
});
$("#modal > i").click(function(){
$("#modal").toggleClass("hidden");
});

$("#status_icon").click(function(){
  myFunction(); $('#settings_page').fadeIn();
  $('#boards').addClass('hidden');
  $("#messages_page").removeClass('hidden');
  $("#new_board").addClass('hidden');
  $("#boards_picker").empty().addClass('hidden');
  $('#connection_settings_page #nodeInputStatus').text('');
  $('.setting_page').hide();
  $('#settings_page').fadeIn();
  $('#connection_settings_page').fadeIn();
  });
