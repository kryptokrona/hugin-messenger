window.$ = window.jQuery = require('jquery');

const copy = require( 'copy-to-clipboard' );
const notifier = require('node-notifier');
const { openAlias } = require('openalias');
const { desktopCapturer } = require('electron');
const contextMenu = require('electron-context-menu');
const path = require('path');

contextMenu({
	prepend: (defaultActions, params, browserWindow) => [
		{
			label: 'Remove',
			// Only show it when right-clicking images
			visible: document.elementFromPoint(params.x, params.y).className.split(' ').includes('board_icon'),
      click: () => {
        // console.log(document.elementFromPoint(params.x, params.y).id);
        ipcRenderer.send('remove-subwallet', document.elementFromPoint(params.x, params.y).id);

      }
		}
	]
});

function dataURLtoFile(dataurl, filename) {

       var arr = dataurl.split(','),
           mime = arr[0].match(/:(.*?);/)[1],
           bstr = atob(arr[1]),
           n = bstr.length,
           u8arr = new Uint8Array(n);

       while(n--){
           u8arr[n] = bstr.charCodeAt(n);
       }

       return new File([u8arr], filename, {type:mime});
   }


var sdp = require('./sdp');
 let current_board = '';
const Datastore = require('nedb');

var en = require('int-encoder');

var WebTorrent = require('webtorrent');

function containsOnlyEmojis(text) {
  const onlyEmojis = text.replace(new RegExp('[\u0000-\u1eeff]', 'g'), '')
  const visibleChars = text.replace(new RegExp('[\n\r\s]+|( )+', 'g'), '')
  return onlyEmojis.length === visibleChars.length
}

var Peer = require('simple-peer')
let listener = () => {}
let endCall = (peer, stream) => {
  peer.destroy();
  stream.getTracks().forEach(function(track) {
    track.stop();
  });
  $('video').fadeOut();
  var myvideo = document.getElementById('myvideo');
  myvideo.srcObject = stream;
  myvideo.pause();
  var video_elem = document.querySelector('video');
  video_elem.pause();
  video_elem.srcObject = null;
  myvideo.srcObject = null;
  $('otherid').empty();
  $('#caller_menu').css('top','-65px');
  $('#messages_contacts').removeClass('in-call');
  $('#settings').removeClass('in-call');
  $('#otherid').unbind('change');
  awaiting_callback = false;


    $('#video-button').unbind('click').click(function() { startCall(true, true) });

    $('#call-button').unbind('click').click(function() { startCall(true, false) });

    $('#screen-button').unbind('click').click(function() { startCall(true, true, true) });
}

let print_boards = () => {

  $('#boards_picker').empty();

  let boards_addresses = rmt.getGlobal('boards_addresses');
  for (address in boards_addresses) {
    let this_address = boards_addresses[address];
    if (this_address[0] == "SEKReX27SM2jE2KGzVLvVKTniMEBe5GSuJbGPma7FDRWUhXXDTysRXy") {
      continue;
    }

    let board_color = intToRGB(hashCode((this_address[1])));
    if (this_address[0] == "SEKReSxkQgANbzXf4Hc8USCJ8tY9eN9eadYNdbqb5jUG5HEDkb2pZPijE2KGzVLvVKTniMEBe5GSuJbGPma7FDRWUhXXDVSKHWc") {
      $('#boards_picker').append('<div class="board_icon" id="home_board" style="background: rgb(' + board_color.red + ',' +  board_color.green + ',' +  board_color.blue + ')"><i class="fa fa-home"></i></div>');
    } else {
      $('#boards_picker').append('<div class="board_icon" title="' + letter_from_spend_key(this_address[1]) +  '" id="' + this_address[0] + '" style="background: rgb(' + board_color.red + ',' +  board_color.green + ',' +  board_color.blue + ')">' + letter_from_spend_key(this_address[1]).substring(0, 1) + '</div>');
    }

  }


   $('.board_icon').click(function() {


     let this_board = $(this).attr('id');

     if ($(this).hasClass('current')) {
       return;
     }

     current_board = this_board;
     if (this_board == "home_board") {
       this_board = 'SEKReSxkQgANbzXf4Hc8USCJ8tY9eN9eadYNdbqb5jUG5HEDkb2pZPijE2KGzVLvVKTniMEBe5GSuJbGPma7FDRWUhXXDVSKHWc';
     }



     ipcRenderer.send('get-boards', this_board);
     $('.current').removeClass('current');
     $(this).addClass('current');


   });

}

let parse_sdp = (sdp) => {

  // console.log("sdp:",sdp);

  let ice_ufrag = '';
  let ice_pwd = '';
  let fingerprint = '';
  let ips = [];
  let ports = [];
  let ssrcs = [];
  let msid = "";

  let lines = sdp.sdp.split('\n')
      .map(l => l.trim()); // split and remove trailing CR
  lines.forEach(function(line) {

    if (line.includes('a=fingerprint:') && fingerprint == '') {

      let parts = line.substr(14).split(' ');
      let hex = line.substr(22).split(':').map(function (h) {
          return parseInt(h, 16);
      });

      fingerprint = btoa(String.fromCharCode.apply(String, hex));


    } else if (line.includes('a=ice-ufrag:') && ice_ufrag == '') {

      ice_ufrag = line.substr(12);


    } else if (line.includes('a=ice-pwd:') && ice_pwd == '') {

      ice_pwd = line.substr(10);

    } else if (line.includes('a=candidate:')) {

      let candidate = line.substr(12).split(" ");

      ip = candidate[4]
      port = candidate[5]
      type = candidate[7]



      let hexa = ip.split('.').map(function (h) {
          return h.toString(16);
      });

      let ip_hex = btoa(String.fromCharCode.apply(String, hexa));


      if (type == "srflx") {
        ip_hex = "!" + ip_hex
      } else {
        ip_hex = "?" + ip_hex
      }

      if (!ips.includes(ip_hex)) {
        ips = ips.concat(ip_hex)

      }

      let indexedport = port+ips.indexOf(ip_hex).toString();

      ports = ports.concat(en.encode(parseInt(indexedport)));


    } else if (line.includes('a=ssrc:')) {

      let ssrc = en.encode(line.substr(7).split(" ")[0]);

      if (!ssrcs.includes(ssrc)) {

        ssrcs = ssrcs.concat(ssrc)

      }


    } else if (line.includes('a=msid-semantic:')) {

      msid = line.substr(16).split(" ")[2];


    }



    })

  return ice_ufrag + "," + ice_pwd + "," + fingerprint + "," + ips.join('&') + "," + ports.join('&') + "," + ssrcs.join('&') + "," + msid;

}



function handleError (e) {
  console.log(e)
}

let startCall = (audio, video, screenshare=false) => {

  console.log('Starting call..');

  $('#video-button').unbind('click');

  $('#call-button').unbind('click');

  $('#screen-button').unbind('click');

if (!screenshare) {
  // get video/voice stream
  navigator.mediaDevices.getUserMedia({
    video: video,
    audio: audio
  }).then(gotMedia).catch(() => {})
} else { desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {

  for (const source of sources) {
    if (source.name === 'Entire Screen') {
      try {

        const screen_stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: source.id,
              minWidth: 1280,
              maxWidth: 1280,
              minHeight: 720,
              maxHeight: 720
            }
          }
        });
        console.log('Got stream..');
        navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true
        }).then( function(stream){gotMedia(stream, screen_stream)}).catch(() => {})

      } catch (e) {
        handleError(e)
      }
      return
    }
  }
}) }


  function gotMedia (stream, screen_stream=false) {
    if ( video ) {
    var myvideo = document.getElementById('myvideo')




    if (screen_stream) {
      myvideo.srcObject = screen_stream;
      screen_stream.addTrack(stream.getAudioTracks()[0]);

      stream = screen_stream;
    } else {
      myvideo.srcObject = stream;
    }
    myvideo.play();
    $('video').fadeIn();
  } else {

  }




    var peer1 = new Peer({ initiator: true, stream: stream, trickle: false,
    offerOptions: {offerToReceiveVideo: true, offerToReceiveAudio: true}
   })
    //var peer2 = new Peer()
    let first = true;

    $('#messages_contacts').addClass('in-call');
    $('#settings').addClass('in-call');
    $('#caller_menu').fadeIn().css('top','0px');
    $('#caller_menu_type').text('Calling..');
    $('#caller_menu_contact').text($('#recipient_form').val());
    let avatar_base64 = get_avatar($('#recipient_form').val());
    $('#caller_menu img').attr('src',"data:image/svg+xml;base64," + avatar_base64);

    $('#caller_menu .fa-phone').click(function(){
      endCall(peer1, stream);
    })

    $('#caller_menu .fa-microphone').click( function() {
      $(this).toggleClass('fa-microphone-slash').toggleClass('fa-microphone');
      stream.getTracks().forEach(track => track.enabled = !track.enabled);
    });

    peer1.on('close', () => {

      console.log('Connection lost..')

      endCall(peer1, stream);

    })

    peer1.on('error', () => {

      console.log('Connection lost..')

      endCall(peer1, stream);

    })

    peer1.on('stream', stream => {
      // got remote video stream, now let's show it in a video tag
      var video_elem = document.querySelector('video')

      if ('srcObject' in video_elem) {
        video_elem.srcObject = stream
      } else {
        video_elem.src = window.URL.createObjectURL(stream) // for older browsers
      }
      video_elem.play()
      // if (audio) {
      //   $('#caller_menu_type').text('Voice connected');
      // } else if (video) {
      //   $('#caller_menu_type').text('Video connected');
      // }

    })

    peer1.on('connect', () => {

      $('#caller_menu_type').text(`${video ? 'Video' : 'Voice'}` + ' connected');
      console.log('Connection established;')

    });

    peer1.on('signal', data => {
      console.log('real data:', data);
      let parsed_data = `${video ? "Δ" : "Λ"}` + parse_sdp(data);
      console.log('parsed data:', parsed_data);
      let recovered_data = sdp.expand_sdp_offer(parsed_data);
      console.log('recovered data:', recovered_data);

      data = recovered_data;

      if (!first) {
        return
      }
      sendMessage(parsed_data, true);

      awaiting_callback = true;

      first = false;

    })


    $('#otherid').change(function(){
      console.log('Got callback');
      peer1.signal( JSON.parse($('#otherid').val()) );
    })


  }

}

let answerCall = (msg) => {

    let video = msg.substring(0,1) == 'Δ';
    $('#messages_contacts').addClass('in-call');
    $('#settings').addClass('in-call');

  // get video/voice stream
  navigator.mediaDevices.getUserMedia({
    video: video,
    audio: true
  }).then(gotMedia).catch(() => {})

  function gotMedia (stream) {

    if (video) {
      var myvideo = document.getElementById('myvideo')
      myvideo.srcObject = stream;

      myvideo.play();
      $('video').fadeIn();

    }

    var peer2 = new Peer({stream: stream, trickle: false})

    $('#caller_menu .fa-phone').click(function(){
      endCall(peer2, stream);
    })


    $('#caller_menu .fa-microphone').click( function() {
      $(this).toggleClass('fa-microphone-slash').toggleClass('fa-microphone');
      stream.getTracks().forEach(track => track.enabled = !track.enabled);
    });

    peer2.on('close', () => {

      console.log('Connection lost..')
      endCall(peer2, stream);

    })

    peer2.on('error', () => {

      console.log('Connection lost..')

      endCall(peer2, stream);

    })

    let first = true;

    peer2.on('signal', data => {
      console.log('initial data:', data);
      let parsed_data = `${video ? 'δ' : 'λ'}` + parse_sdp(data);
      console.log('parsed data really cool sheet:', parsed_data);
      let recovered_data = sdp.expand_sdp_answer(parsed_data);
      data = recovered_data;
      console.log('recovered data:', recovered_data);

      if (!first) {
        return
      }
      console.log('Sending answer ', parsed_data);
      sendMessage(parsed_data, true);
      first = false;

    })
    let signal = sdp.expand_sdp_offer(msg);
    peer2.signal(sdp.expand_sdp_offer(msg));

    peer2.on('track', (track, stream) => {
      $('#caller_menu_type').text('Setting up link..');
    })

    peer2.on('connect', () => {

      $('#caller_menu_type').text(`${video ? 'Video' : 'Voice'}` + ' connected');
      console.log('Connection established;')

    });

    peer2.on('stream', stream => {
      // got remote video stream, now let's show it in a video tag
      var video = document.querySelector('video')



      if ('srcObject' in video) {
        video.srcObject = stream
      } else {
        video.src = window.URL.createObjectURL(stream) // for older browsers
      }

      video.play();

      $('#caller_menu_type').text('Setting up link..');

    })
  }

}

let parseCall = (msg, sender=false, emitCall=true) => {

  switch (msg.substring(0,1)) {
    case "Δ":
      // Fall through
    case "Λ":
      // Call offer


      if (!awaiting_callback && emitCall) {

        // Start ringing sequence
         $('#incomingCall').append('<audio autoplay><source src="static/ringtone.mp3" type="audio/mpeg"></audio>');
         $('#incomingCall').find('h1').text(`Incoming ${msg.substring(0,1) == "Δ" ? "video" : "audio"} call!`);
         $('#incomingCall').show();
         let avatar_base64 = get_avatar(sender);
         $('#incomingCall img').attr('src',"data:image/svg+xml;base64," + avatar_base64);
         $('#incomingCall span').text(sender);

         // Handle answer/decline
         $('#answerCall').click(function() {
           $('#answerCall').unbind('click');
           if ($('#recipient_form').text() != sender) {
              print_conversation(sender);
           }

           answerCall(msg);

           $('#messages_contacts').addClass('in-call');
           $('#settings').addClass('in-call');

           $('#caller_menu').fadeIn().css('top','0px');
           $('#caller_menu_type').text('Connecting..');
           $('#caller_menu_contact').text(sender);
           $('#incomingCall img').attr('src',"data:image/svg+xml;base64," + avatar_base64);

           $('#incomingCall').hide();
           $('#incomingCall audio').remove();
         })
         $('#declineCall').click(function() {
           $('#incomingCall').hide();
           $('#incomingCall audio').remove();
         })

      }
      return `${msg.substring(0,1) == "Δ" ? "Video" : "Audio"} call started`;
      break;
    case "δ":
      // Fall through
    case "λ":
      // Answer
      if (emitCall) {
      $('#otherid').val(JSON.stringify(sdp.expand_sdp_answer(msg)));
      $('#otherid').change();
      }
      return "";

    break;
    default:
      return msg;

  }

}

$('#video-button').click(function() { startCall(true, true); $('#video-button').unbind('click'); });

$('#call-button').click(function() { startCall(true, false); $('#call-button').unbind('click'); });

$('#screen-button').click(function() { startCall(true, true, true); $('#screen-button').unbind('click'); });

var holder = document.getElementById('messages_pane');

        holder.ondragover = () => {
          $('#drop-overlay').stop().fadeIn(1);
            return false;
        };

        holder.ondragleave = () => {
            $('#drop-overlay').stop().fadeOut();
            return false;
        };

        holder.ondragend = () => {
          //$('#drop-overlay').hide();
            return false;
        };

        holder.ondrop = (e) => {
            e.preventDefault();
            $('#drop-overlay').stop().fadeOut();
            if (!$('#recipient_form').val()) { return false; } else {
            var client = new WebTorrent();
            for (let f of e.dataTransfer.files) {
              client.seed(f, function (torrent) {
                sendMessage(torrent.magnetURI.replace('&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.fastcast.nz',''));
                torrent.on('wire', function (wire) {
                  $('.' + torrent.magnetURI.split('&')[0].split(":")[3]).find('p').append('&nbsp;<i class="fa fa-circle-o-notch"></i>');

                })

                torrent.on('upload', function (uploaded) {

                  if ( torrent.uploaded == torrent.length ) {
                    $('.fa-circle-o-notch').removeClass('fa-circle-o-notch').addClass('fa-check-circle-o');
                    setTimeout(function() {

                      client.destroy();

                    }, 60000);
                  } else {

                  }

                })


              })
            }

            return false;
        };
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

let downloadMagnet = (magnetLink, element) => {
  // MOVE CODE BELOW

  var client = new WebTorrent();

   // $('#'+element).find('.download-button').remove();

   console.log('Starting torrent!');
   let torrentId = magnetLink+'&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.fastcast.nz';

   $('#'+element).find('.download-button').html('  <div class="progress"></div>');


   client.add(torrentId, {path: downloadDir}, function (torrent) {

     torrent.on('download', function (bytes) {
        $('#'+element).find('.progress').css('width',parseInt(torrent.progress * 88) + "px");
        // $('.progress').text(parseInt(torrent.progress * 88) + "%");



      })

     torrent.on('done', function (bytes) {

           torrent.removeListener('done', listener);

           $('.progress').parent().fadeOut();

           $('#messages_pane').scrollTop($('#messages').height());

           setTimeout(function() {

             client.destroy();

           }, 60000);

         })

     let file = torrent.files.find(function (file) {
       file.appendTo(document.getElementById(element).getElementsByTagName('p')[0]);
     });
     $('#messages_pane').scrollTop($('#messages').height());

     if (!file) {
       return;
     }


     return;


      torrent.on('done', function () {

 });

});
}


let handleMagnetListed = (message) => {

  if (message.substring(0,1) == "Δ" || message.substring(0,1) == "Λ" || message.substring(0,1) == "δ" || message.substring(0,1) == "λ"  ) {

    return "Call started";
  } else {

  }

  let magnetLinks = /(magnet:\?[^\s\"]*)/gmi.exec(message);
  if (magnetLinks) {

    if ( magnetLinks[0].split('=')[2].includes('callback') ) {
      return "Call started"
    } else if (magnetLinks[0].split('=')[2].includes('callrequest')) {
      return "Call started"
    } else {
      return magnetLinks[0].split('=')[2];
    }





  } else {
    return message
  }

}

var awaiting_callback = false;

 let handleMagnetLink = (magnetLinks, element, calls=false, sender=false) => {

        $('#' + element).find('p').addClass('gradient').text($('#' + element).find('p').text().replace(magnetLinks[0], magnetLinks[0].split('=')[2]));
        let magnet_class = magnetLinks[0].split("&")[0].split(":")[3];
        $('#' + element).addClass(magnet_class);
        $('#' + element).find('p').append('<button class="download-button">Download</button>').click(function(){ downloadMagnet(magnetLinks[0], element); $(this).unbind('click');  $(':focus').blur(); });
}

const rmt = require('electron').remote;

let userDataDir = rmt.getGlobal('userDataDir');
let appPath = rmt.getGlobal('appPath');

let db = new Datastore({ filename: userDataDir+'/messages.db', autoload: true });

let misc = new Datastore({ filename: userDataDir+'/misc.db', autoload: true });

let keychain = new Datastore({ filename: userDataDir+'/keychain.db', autoload: true });

let last_block_checked = 1;

misc.find({}, function (err,docs){

    if (docs.length == 0) {

    misc.insert({"height": 1, "nickname": undefined});

  } else {
    last_block_checked = docs[0].height;
  }

});


$('#import').click(function(){
console.log('Importing: ' + $('#importMnemonic').val())

db.remove({}, { multi: true }, function (err, numRemoved) {
});
misc.remove({}, { multi: true }, function (err, numRemoved) {
});
keychain.remove({}, { multi: true }, function (err, numRemoved) {
});


ipcRenderer.send('import_wallet',$('#importMnemonic').val());

setTimeout(function(){ console.log('resetting..');walletd.reset() }, 330000);




})


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

let invite_code_from_ascii = (invite_code) => {
  let hex = toHex(invite_code);
  while(hex.length < 64) {
    hex = hex + '0';
  }
  return hex;
}

let letter_from_spend_key = (spend_key) => {

	if (spend_key == '0b66b223812861ad15e5310b4387f475c414cd7bda76be80be6d3a55199652fc') {
		return 'Home';
	}

  while(spend_key.substr(spend_key.length - 1) == "0") {
    spend_key = spend_key.substr(0, spend_key.length - 1);
  }
  return fromHex(spend_key);
}

let keyPair;
let signingKeyPair;
let signingPublicKey;
let signingPrivateKey;

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

let downloadDir = remote.getGlobal('downloadDir');


var TurtleCoinWalletd = require('kryptokrona-service-rpc-js').default

let walletd = new TurtleCoinWalletd(
  'http://127.0.0.1',
  8070,
  rpc_pw,
  false
)

$('#getMnemonic').click(function(){
  walletd.getMnemonicSeed($('#currentAddrSpan').text()).then(resp => {
    $('#mnemonic').text(resp.body.result.mnemonicSeed);
  })
})

$('#getPrivatekey').click(function(){
  walletd.getSpendKeys($('#currentAddrSpan').text()).then(resp => {
    $('#privatekey').text(resp.body.result.spendSecretKey);
  })
})


const {ipcRenderer} = require('electron');


ipcRenderer.on('gotNodes', (evt, json) => {
  console.log(json);
})


ipcRenderer.on('removed-subwallet', (evt, addr) => {
 $('#' + addr).addClass('removed');

 if ($('#' + addr).hasClass('current')) {
   $('#home_board').click();
 }
})




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
        let thisAmount = Math.abs(parseFloat(transactions[i].transactions[j].transfers[0].amount) / 100000);

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

          }

            let message_dec = naclUtil.encodeUTF8(decryptBox);
            payload_json = JSON.parse(message_dec);

          }

          message = payload_json.msg;



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

let sendTransaction = (mixin, transfer, fee, sendAddr, payload_hex, payload_json, silent=false) => {


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

          if (resp.body.error) {
              if (resp.body.error.message == "Wrong amount") {
                alert("Sorry, you don't have enough XKR to send this message.");
              } else {
                  alert(resp.body.error.message);
                }
            if (!silent) {
            // $('#loading_border').animate({width: '100%'},400,function(){
            //   $('#loading_border').width(0);
            // });
            // $('#message_form').prop('disabled',false);
            $('#message_form').focus();
            }

            return
          }
          if (!silent) {
          // $('#loading_border').animate({width: '80%'},400);

          // Empty message input field, re-activate it and then focus

          // $('#message_form').prop('disabled',false);

          }
          db_json = {"conversation": payload_json.to, "type":"sent","message":payload_json.msg,"timestamp":JSON.parse(fromHex(payload_hex)).t}

          // Add message to datastore
          db.insert(db_json);

          // Add new message to conversation
          if (payload_json.msg.substring(0, 22) == "data:image/jpeg;base64") {
            payload_json.msg = "<img src='" + payload_json.msg + "' />";
          }




          // create a base64 encoded SVG
          avatar_base64 = get_avatar(sendAddr);

          $('#welcome_alpha').remove();

          payload_json.msg = parseCall(payload_json.msg);
          // if (!silent) {
          // $('#messages').append('<li class="sent_message" id="' + JSON.parse(fromHex(payload_hex)).t + '"><img class="message_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><p>' + payload_json.msg + '</p><span class="time">' + moment(payload_json.t).fromNow() + '</span></li>');
          // }
          let magnetLinks = /(magnet:\?[^\s\"]*)/gmi.exec(payload_json.msg);
          if (magnetLinks) {
            handleMagnetLink(magnetLinks, JSON.parse(fromHex(payload_hex)).t);
          }

          if (!silent) {
          // $('#loading_border').animate({width: '100%'},400,function(){
          //   $('#loading_border').width(0);
          // });

          // Add message to contacts list and add class to tell updateMessages
          if ( $('.' + payload_json.to).width() > 0 ){
          let listed_msg = handleMagnetListed(payload_json.msg);


          $('.' + payload_json.to).find('.listed_message').text(listed_msg).parent().detach().prependTo('#messages_contacts');
        } else {

          $('#messages_contacts').prepend('<li class="active_contact ' + payload_json.to + '"><img class="contact_avatar" src="data:image/svg+xml;base64,' + get_avatar(payload_json.to) + '" /><span class="contact_address">' + payload_json.to + '</span><br><span class="listed_message">'+handleMagnetListed(payload_json.msg)+'</li>');

        }
        }
        return JSON.parse(fromHex(payload_hex)).t;
        })
        .catch(err => {
          console.log(err)
        })
}

function sendMessage(message, silent=false) {

	console.log('Sending messages..');

  let has_history = false;

    if (message.length == 0) {
      return
    }

    avatar_base64 = get_avatar(currentAddr);
    let magnetLinks = /(magnet:\?[^\s\"]*)/gmi.exec(message);
    if (!silent) {
      let id_elem = Date.now();
    $('#messages').append('<li class="sent_message" id="' + id_elem +  '"><img class="message_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><p>' + message + '</p><span class="time">right now</span></li>');
    if (magnetLinks) {
      handleMagnetLink(magnetLinks, id_elem);
    }
    }

    // Scroll to bottom
    $('#messages_pane').scrollTop($('#messages').height());

    $('#message_form').val('');
    $('#message_form').focus();

    receiver = $('#recipient_form').val();


      keychain.find({ "address": receiver }, function (err, docs) {

        if (docs.length == 0) {

          keychain.insert({key: $('#recipient_pubkey_form').val(), address: receiver});

        }

      });

      if (!silent) {
      // $('#loading_border').animate({width: '40%'},600);
      // $('#message_form').prop('disabled',true);
      }

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

      return sendTransaction(mixin, transfer, fee, sendAddr, payload_hex, payload_json, silent);

      });


}


function sendBoardMessage(message) {

    if (message.length == 0) {
      return
    }

    avatar_base64 = get_avatar(currentAddr);

    let magnetLinks = /(magnet:\?[^\s\"]*)/gmi.exec(message);
    let message_to_send = message;

      geturl = new RegExp(
              "(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){3,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))"
             ,"g"
           );

    // Instantiate attachments
    let youtube_links = '';
    let image_attached = '';

    // Find links
    let links_in_message = message.match(geturl);

    // Supported image attachment filetypes
    let imagetypes = ['.png','.jpg','.gif', '.webm', '.jpeg', '.webp'];

    // Find magnet links
    //let magnetLinks = /(magnet:\?[^\s\"]*)/gmi.exec(message);

    //message = message.replace(magnetLinks[0], "");

    if (links_in_message) {

      for (let j = 0; j < links_in_message.length; j++) {

        if (links_in_message[j].match(/youtu/) || links_in_message[j].match(/y2u.be/)) { // Embeds YouTube links
          message = message.replace(links_in_message[j],'');
          embed_code = links_in_message[j].split('/').slice(-1)[0].split('=').slice(-1)[0];
          youtube_links += '<div id ="ytv" style="position:relative;height:0;padding-bottom:42.42%"><iframe src="https://www.youtube.com/embed/' + embed_code + '?modestbranding=1" style="position:absolute;width:80%;height:100%;left:10%" width="849" height="360" frameborder="0" allow="autoplay; encrypted-media"></iframe></div>';
        } else if (imagetypes.indexOf(links_in_message[j].substr(-4)) > -1 ) { // Embeds image links
          message = message.replace(links_in_message[j],'');
          image_attached_url = links_in_message[j];
          image_attached = '<img class="attachment" src="' + image_attached_url + '" />';
        } else { // Embeds other links
          message = message.replace(links_in_message[j],'<a target="_new" href="' + links_in_message[j] + '">' + links_in_message[j] + '</a>');
        }
      }
    }



    let id_elem = Date.now();


    // $('#boards_message_form').after('<li class="board_message" id=""><div class="board_message_user"><img class="board_avatar" src="' +$ ('#avatar').attr('src') + '"><span class="board_message_pubkey">' + signingPublicKey + '</span></div><p>' + message + image_attached + youtube_links + '</p><span class="time">just now</span></li>');
    if (magnetLinks) {
      handleMagnetLink(magnetLinks, id_elem);
    }


    // Scroll to bottom
    //$('#messages_pane').scrollTop($('#messages').height());

    $('#boards_message_form').val('');
    //$('#message_form').focus();



    current_board = $('.current').attr('id');

    if (current_board == 'home_board' ) {
      receiver = 'SEKReSxkQgANbzXf4Hc8USCJ8tY9eN9eadYNdbqb5jUG5HEDkb2pZPijE2KGzVLvVKTniMEBe5GSuJbGPma7FDRWUhXXDVSKHWc';
    } else {
      receiver = current_board;
    }

      // Transaction details
      amount = 1;
      fee = 10;
      mixin = 5;
      timestamp = Date.now();
      //
      let signature = nacl.sign.detached(naclUtil.decodeUTF8(message_to_send), signingKeyPair.secretKey);
      // console.log('signature', signature);
      // let verified = nacl.sign.detached.verify(naclUtil.decodeUTF8(message), signature, signingKeyPair.publicKey);
      // console.log('verified', verified);
      // return;

      // Convert message data to json
      payload_json = {"m":message_to_send, "k":signingPublicKey, "s": Buffer.from(signature).toString('hex')};

      if ($('#boards_nickname_form').val().length) {
        payload_json.n = $('#boards_nickname_form').val();

        misc.update({}, {nickname: payload_json.n});

      }

      if (current_reply_to.length > 0) {
        payload_json.r = current_reply_to;
        $('#replyto_exit').click();
      }

      print_board_message(payload_json.k, payload_json.m, Date.now()/1000, $('.current').attr('id'), payload_json.n, payload_json.r);


      //payload_json_decoded = naclUtil.decodeUTF8(JSON.stringify(payload_json));

      // let box = nacl.box(payload_json_decoded, nonceFromTimestamp(timestamp), hexToUint($('#recipient_pubkey_form').val()), keyPair.secretKey);
      //
      // let payload_box;

      let payment_id = '';

      // Convert json to hex
      let payload_hex = toHex(JSON.stringify(payload_json));

      sendAddr = $("#currentAddrSpan").text();
      transfer = [ { 'amount':amount, 'address':receiver } ];

      return sendTransaction(mixin, transfer, fee, sendAddr, payload_hex, payload_json, true);

      }

// Detect valid address input into recipient forms

$('#recipient_form').on('input', function() {

  text = $('#recipient_form').val();

  if(text.substr(text.length - 7) == '.xkr.se') {

    let oaname = '';
      try {
      openAlias(text).then(wallets => {

          console.log(wallets);

        if (wallets) {

          let open_alias_address = wallets[0].address;
          text = open_alias_address;
          if (text.length == 163) {
            // If both addr and pub key is put in
            let addr = text.substring(0,99);
            let pubkey = text.substring(99,163);
            $('#currentchat_pubkey').show();
            $('#recipient_form').val(addr);
            $('#recipient_pubkey_form').val(pubkey);
            $('#recipient_pubkey_span').find('.checkmark').fadeIn();
            $('#recipient_span').find('.checkmark').fadeIn();
            // $('#message_form').attr('disabled',false);
          } else {
            $('#recipient_form').val(open_alias_address);
          }
          $('#message_form').prop('placeholder','Write to ' +  wallets[0].name);
        }


      });
    } catch {

    }
  }

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
      // $('#message_form').attr('disabled',false);
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


$('#boards_message_form').keypress(function (e) {

  if (e.which == 13) {
    message = $('#boards_message_form').val();
    sendBoardMessage(escapeHtml(message));
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

function get_avatar(hash, format='svg') {

  // Get custom color scheme based on address
  rgb = intToRGB(hashCode(hash));

  // Options for avatar
  var options = {
        foreground: [rgb.red, rgb.green, rgb.blue, 255],               // rgba black
        background: [parseInt(rgb.red/10), parseInt(rgb.green/10), parseInt(rgb.blue/10), 0],         // rgba white
        margin: 0.2,                              // 20% margin
        size: 40,                                // 420px square
        format: format                             // use SVG instead of PNG
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
                  var thisAmount = Math.abs(parseFloat(transactions[i].transactions[j].transfers[0].amount) / 100000);

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
                  }

                }

              }

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
                  let magnetLinks = /(magnet:\?[^\s\"]*)/gmi.exec(sortedMessages[i].message);
                  if (magnetLinks) {
                    handleMagnetLink(magnetLinks, sortedMessages[i].timestamp);

                  }



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
    $(this).removeClass('unread_message');
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
          var thisAmount = Math.abs(parseFloat(transactions[i].transactions[0].transfers[0].amount) / 100000);

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
                  let listed_msg = handleMagnetListed(message);
                  console.log(listed_msg);
                  $('#messages_contacts').prepend('<li class="active_contact ' + senderAddr + '"><img class="contact_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '" /><span class="contact_address">' + senderAddr + '</span><br><span class="listed_message">'+listed_msg+'</li>');
                  messages.push(senderAddr);
                }

                // Add message to conversations list
                let listed_msg = handleMagnetListed(message);
                $('.'+senderAddr).find('.listed_message').text(listed_msg);

                last_messages[senderAddr] = timestamp;

                if (timestamp > lastMessage) {

                  lastMessage = timestamp;


                  if ($('#recipient_form').val() != senderAddr) {

                  }


                }



            } else {

              // If it's a sent msg

              if ( $.inArray(thisAddr, messages) == -1 ) {
              // If conversation doesn't exist

                avatar_base64 = get_avatar(thisAddr);
                let listed_msg = handleMagnetListed(message);
                $('#messages_contacts').prepend('<li class="active_contact ' + thisAddr + '"><img class="contact_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '" /><span class="contact_address">' + thisAddr + '</span><br><span class="listed_message">'+listed_msg+'</li>');
                messages.push(thisAddr);


              }

              if (timestamp > last_messages[thisAddr]) {
              last_messages[senderAddr] = timestamp;
              // Add message to conversations list
              let listed_msg = handleMagnetListed(message);
              console.log(listed_msg);
              $('.'+thisAddr).find('.listed_message').text(listed_message);
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


async function get_confirmed_messages(from, to) {
  if (!from || !to) {
    return;
  }
  return new Promise(function(resolve, reject) {

    walletd.getTransactions(
      to,
      from,
      '',
      [],
      '').then(resp => {

        let arr = [];

        if (resp.code == 'ETOOLARGE') {

          reject('ETOOLARGE');


        }

      if (resp.body) {
      let transactions = resp.body.result.items;

      let txsLength = transactions.length;



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
        }
          resolve(arr);

        }).catch(err => {
          console.log(err);
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
        try {
        transaction = resp.body.result.transaction;

        transactions[i] = transaction.extra.substring(66);
        if ( (txsLength - i) == 1) {
          resolve(transactions);
        }
      } catch (err) {
        console.log(err);
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
        $('#messages_contacts').append('<li class="active_contact ' + conversation + '"><img class="contact_avatar" src="data:image/svg+xml;base64,' + get_avatar(conversation) + '" /><span class="contact_address">' + conversation + '</span><br><span class="listed_message">'+handleMagnetListed(messages[m].message)+'</li>');
      }

  }




  // Now we have all conversations in the database

}

print_conversations();

let known_txs = [];


async function get_new_conversations(unconfirmed) {

  known_keys = await find(keychain, {});

  let unconfirmed_transactions = [];

  block_height = await get_block_height();
  let check_block = last_block_checked;

  if (!unconfirmed) {
      getting_new_conversations = true;


      if ( last_block_checked == block_height ) {
        return;
      }

      try {
      confirmed_transactions = await get_confirmed_messages(last_block_checked, block_height-last_block_checked);
      check_block = block_height;
    } catch (err) {

      if (err == 'ETOOLARGE') {

        confirmed_transactions = [];
        while (check_block+10000 < block_height) {
          new_transactions = await get_confirmed_messages(check_block, 10000);

          confirmed_transactions = confirmed_transactions.concat(new_transactions);

          check_block = check_block + 10000;
        }
      }



    }
      unconfirmed_transactions = await get_unconfirmed_messages();

      for (tx in unconfirmed_transactions) {

        console.log(unconfirmed_transactions[tx]);

        if (!known_txs.includes(unconfirmed_transactions[tx])) {
          known_txs.push(unconfirmed_transactions[tx]);
        } else {
          unconfirmed_transactions.splice(tx, 1);
        }


      }




      all_transactions = unconfirmed_transactions;
      misc.update({}, { $set: {height: check_block} });
      last_block_checked = check_block;


} else {

    unconfirmed_transactions = await get_unconfirmed_messages();


    for (tx in unconfirmed_transactions) {

      if (!known_txs.includes(unconfirmed_transactions[tx])) {
        known_txs.push(unconfirmed_transactions[tx]);
      } else {
        unconfirmed_transactions.splice(tx, 1);
      }

    }



  all_transactions = unconfirmed_transactions;
}
  latest_transaction = await find_messages({}, 0, 1);
  let latest_transaction_time = 0;

    try {
  latest_transaction_time = latest_transaction[0].timestamp;
} catch (e) {}

all_transactions = all_transactions.filter(function (el) {
  return el != null;
});


  for (n in all_transactions) {

    try {
      tx = JSON.parse(fromHex(all_transactions[n]));
    } catch (err) {

      continue;
    }

    if (tx.key && tx.t) {

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

        if (tx.m) {
          continue;
        }

        // If no key is appended to message we need to try the keys in our payload_keychain
        let box = tx.box;

        let timestamp = tx.t;

        let i = 0;

        let decryptBox = false;

        while (i < known_keys.length && !decryptBox) {

          let possibleKey = known_keys[i].key;
          i = i+1;
          try {
           decryptBox = nacl.box.open(hexToUint(box),
           nonceFromTimestamp(timestamp),
           hexToUint(possibleKey),
           keyPair.secretKey);
         } catch (err) {
           console.log('timestamp', timestamp);
           console.log(err);
           continue;
         }


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
          // this function will print the new message in the messages field.

          // NOTE: Sent messages will be automatically printed by the send
          // message function, not this one.

          avatar_base64 = get_avatar(payload_json.from);

          payload_json.msg = parseCall(payload_json.msg, payload_json.from);

          if (payload_json.msg.length) {
            $('#messages').append('<li class="received_message" id=' + payload_json.t + '><img class="message_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><p>' + payload_json.msg + '</p><span class="time">' + moment(payload_json.t).fromNow() + '</span></li>');
          }
          let magnetLinks = /(magnet:\?[^\s\"]*)/gmi.exec(payload_json.msg);

          if (magnetLinks) {
            handleMagnetLink(magnetLinks, payload_json.t, true, payload_json.from);
          }

          // Scroll to bottom
          $('#messages_pane').scrollTop($('#messages').height());
          $('#messages_pane').find('audio').remove();
          $('#messages_pane').append('<audio autoplay><source src="static/message.mp3" type="audio/mpeg"></audio>');

        } else {
          $('#messages_pane').find('audio').remove();
          $('#messages_pane').append('<audio autoplay><source src="static/message.mp3" type="audio/mpeg"></audio>');


          let magnetLinks = /(magnet:\?[^\s\"]*)/gmi.exec(payload_json.msg);

          if (magnetLinks) {
            handleMagnetLink(magnetLinks, payload_json.t, true, payload_json.from);
          }
          if (handleMagnetListed(payload_json.msg) && payload_json.from != $('.currentAddr').text()) {

            await require("fs").writeFile(userDataDir + "/" +payload_json.from + ".png", get_avatar(payload_json.from, 'png'), 'base64', function(err) {
              console.log(err);
            });
						let actions = [];
						if (payload_json.msg.substring(0,1) == "Δ" || payload_json.msg.substring(0,1) == "Λ") {
							actions = ["Answer", "Decline"];
						}
            notifier.notify({
              title: payload_json.from,
              message: handleMagnetListed(parseCall(payload_json.msg, payload_json.from)),
              icon: userDataDir + "/" +payload_json.from + ".png",
              wait: true, // Wait with callback, until user action is taken against notification,
							actions: actions
            },function (err, response, metadata) {
					    // Response is response from notification
					    // Metadata contains activationType, activationAt, deliveredAt
							console.log(response, metadata.activationValue, err);
							if (response != 'timeout') {
								ipcRenderer.send('show-window');
		            print_conversation(payload_json.from);
							}
							if(metadata.activationValue == "Answer" || metadata.button == "Answer" ) {

								$('#answerCall').click();

							}
					  });
          }
          //
          //
          // let myNotification = new Notification(payload_json.from, {
          //   body: payload_json.msg
          // })
          //
          // myNotification.onclick = () => {
          //   print_conversation(payload_json.from);
          // }


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
          // If there is a contact in the sidebar,
          // then we update it, and move it to the top.

          let listed_msg = handleMagnetListed(payload_json.msg);

        $('.' + conversation_address).find('.listed_message').text(listed_msg).parent().detach().prependTo("#messages_contacts").addClass('unread_message');

      } else {
        // If there isn't one, create one

        $('#messages_contacts').prepend('<li class="active_contact unread_message ' + conversation_address + '"><img class="contact_avatar" src="data:image/svg+xml;base64,' + get_avatar(conversation_address) + '" /><span class="contact_address">' + conversation_address + '</span><br><span class="listed_message">'+handleMagnetListed(payload_json.msg)+'</li>');
      }

      }

  }
  getting_new_conversations = false;
}

async function send_message(message, silent=false) {


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


        if (!silent) {
        // $('#loading_border').animate({width: '40%'},600);
        // $('#message_form').prop('disabled',true);
        }
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

        sendTransaction(mixin, transfer, fee, sendAddr, payload_hex, payload_json, silent);

});
}

async function print_conversation(conversation) {
avatar_base64 = get_avatar(conversation);
  $('#avatar_contact').attr('src','data:image/svg+xml;base64,' + avatar_base64).fadeIn();
  $('#context_menu').fadeIn();
  $('#currentchat_header_wrapper').removeClass('toggled_addr');


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

    if (parseCall(messages[n].message, false, false).length == 0) {
      continue;
    }
    console.log( parseCall(messages[n].message, false, false) );
    $('#messages').append('<li id="' + messages[n].timestamp + '" timestamp="' + messages[n].timestamp + '" class="' + messages[n].type + '_message"><img class="message_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><p>' + parseCall(messages[n].message, false, false) + '</p><span class="time">' + moment(messages[n].timestamp).fromNow() + '</span></li>');


      let magnetLinks = /(magnet:\?[^\s\"]*)/gmi.exec(messages[n].message);
      if (magnetLinks) {
        handleMagnetLink(magnetLinks, messages[n].timestamp);
      }


  }


  // Scroll to bottom
  $('#messages_pane').scrollTop($('#messages').height());

  for (message in $('#messages').find('p')) {
    let magnetLinks = /(magnet:\?[^\s\"]*)/gmi.exec(message.innerHTML);
    if (magnetLinks) {
      handleMagnetLink(magnetLinks, $(message).parent().attr('id'));
    }
  }


}

function loadWallets() {
  let boards_addresses = rmt.getGlobal('boards_addresses');

  console.log(boards_addresses);

  walletd.getAddresses()
  .then(resp => {
    currentAddr = resp.body.result.addresses[0];
    allAddresses = resp.body.result.addresses;
    var thisAddr = resp.body.result.addresses[0];

    walletd.getSpendKeys(thisAddr).then(resp => {

      let secretKey = naclUtil.decodeUTF8(resp.body.result.spendSecretKey.substring(1, 33));
      console.log(resp.body.result.spendSecretKey);

      let signingSecretKey = naclUtil.decodeUTF8(resp.body.result.spendSecretKey.substring(1, 33));

      keyPair = nacl.box.keyPair.fromSecretKey(secretKey);

      signingKeyPair = nacl.sign.keyPair.fromSeed(signingSecretKey);

      signingPublicKey = Buffer.from(signingKeyPair.publicKey).toString('hex');

      signingPrivateKey = Buffer.from(signingKeyPair.secretKey).toString('hex');

      let hex = Buffer.from(keyPair.publicKey).toString('hex');

      $('#currentPubKey').text(hex);

      avatar_base64 = get_avatar(currentAddr);
      $('#avatar').attr('src','data:image/svg+xml;base64,' + avatar_base64);
      $('#avatar').css('border-radius','50%');


    })

  })
  .catch(err => {

    console.log(err);
    loadWallets();


  })
}

$("document").ready(function(){


  loadWallets();
  //
  // setTimeout(function() {
  //
  //   get_new_conversations(false);
  //
  // }, 15000);


  $('#copyBoth').click(function(){
    copy($('#currentAddrSpan').text() + $('#currentPubKey').text() );
  });

  lastMessage =  Date.now();

  $('#new_chat').click(function(){
    $('#currentchat_header_wrapper').addClass('toggled_addr');
    $('#currentchat_pubkey').hide();
    $('.checkmark').hide();
    $('#messages').empty();
    $('#boards').addClass('hidden');
    $('#messages_page').removeClass('hidden');
    $('#recipient_form').val('').focus();
    if (!$('#boards').hasClass('hidden') || $('#flip-box-inner').hasClass('flip')) {
    myFunction();
    }
  })
});

let locked = $('#lockedBalanceText').text();

window.setInterval(function(){

  get_new_conversations(true);


},1000);

let getting_new_conversations = false;


window.setInterval(function(){

  if (!getting_new_conversations) {
    get_new_conversations(false);
  }

},10333);

$('#new_board').click(function(){

  $('#modal').toggleClass('hidden');
  $('#modal div').addClass('hidden');
  $('#create_pub_board_modal').removeClass('hidden');

})

$('#create_pub_board_button').click(function(){

  let invite_code = invite_code_from_ascii($('#create_pub_board_input').val());
  ipcRenderer.send('import-view-subwallet', invite_code);
});


ipcRenderer.on('imported-view-subwallet', async (event, address) => {

      if (address == "SEKReX27SM2jE2KGzVLvVKTniMEBe5GSuJbGPma7FDRWUhXXDTysRXy") {
        alert('Invalid board address, please try again!');
        return;
      } else {
        $('#new_board').click();
        print_boards();
      }

});



$('#join_board_button').click(function(){});

$('#boards_icon').click(function(){
  misc.find({}, function (err,docs){
    if (docs[0]) {
      $('#boards_nickname_form').val(docs[0].nickname);
    }

  });

 $("#boards").toggleClass('hidden');
 $("#messages_page").toggleClass('hidden');
 $("#new_board").toggleClass('hidden');
 $("#avatar_contact").hide();
 $("#context_menu").hide();
 $("#boards_picker").empty().toggleClass('hidden');
 $('.board_message').remove();

 print_boards();

 $('#home_board').addClass('current');


 if ($('#boards').hasClass('hidden')) {
   $('#avatar').attr('src', 'data:image/svg+xml;base64,' + get_avatar(currentAddr));

 } else {
   $('#avatar').attr('src', 'data:image/svg+xml;base64,' + get_avatar(signingPublicKey));
    ipcRenderer.send('get-boards', 'SEKReSxkQgANbzXf4Hc8USCJ8tY9eN9eadYNdbqb5jUG5HEDkb2pZPijE2KGzVLvVKTniMEBe5GSuJbGPma7FDRWUhXXDVSKHWc');
 }




})

let current_reply_to = '';

$('#replyto_exit').click(function(){

    $('#replyto').fadeOut();
    $('#replyto_exit').fadeOut();
    current_reply_to = '';
    $('#boards_message_form').attr('style','');
    $('.board_message p.rgb').removeClass('rgb');

})


let reply = (hash) => {

  current_reply_to = hash;
  $('.board_message p.rgb').removeClass('rgb');
  let nickname = false;

  try {
      nickname = $('.' + hash + ' .boards_nickname').text();
  } catch (err) {

  }

  let replyto;

  if (nickname) {

    replyto = nickname;

  } else {
    replyto = "anonymous"
  }

  $('#replyto').text('Replying to ' + replyto).fadeIn();
  $('#replyto_exit').fadeIn();

  let amount = parseInt($('#replyto').width()) + 70;

  $('#boards_message_form').css('padding-left',amount);

  $('#boards_message_form').css('width','calc(83% - ' + amount + 'px)');

}

let print_board_message = async (pubkey, message, timestamp, fetching_board, nickname=false, reply=false) => {

  let avatar_base64 = get_avatar(pubkey);

   if (current_board != fetching_board) {
     return;
   }
   let addClasses = '';
   if (containsOnlyEmojis(message)) {
     addClasses = 'emoji-message';
   }

   if (message.length < 1) {
     return;
   }

     geturl = new RegExp(
             "(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){3,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))"
            ,"g"
          );

   // Instantiate attachments
   let youtube_links = '';
   let image_attached = '';

   // Find links
   let links_in_message = message.match(geturl);

   // Supported image attachment filetypes
   let imagetypes = ['.png','.jpg','.gif', '.webm', '.jpeg', '.webp'];

   // Find magnet links
   //let magnetLinks = /(magnet:\?[^\s\"]*)/gmi.exec(message);

   //message = message.replace(magnetLinks[0], "");

   if (links_in_message) {

     for (let j = 0; j < links_in_message.length; j++) {

       if (links_in_message[j].match(/youtu/) || links_in_message[j].match(/y2u.be/)) { // Embeds YouTube links
         message = message.replace(links_in_message[j],'');
         embed_code = links_in_message[j].split('/').slice(-1)[0].split('=').slice(-1)[0];
         youtube_links += '<div style="position:relative;height:0;padding-bottom:42.42%"><iframe src="https://www.youtube.com/embed/' + embed_code + '?modestbranding=1" style="position:absolute;width:80%;height:100%;left:10%" width="849" height="360" frameborder="0" allow="autoplay; encrypted-media"></iframe></div>';
       } else if (imagetypes.indexOf(links_in_message[j].substr(-4)) > -1 ) { // Embeds image links
         message = message.replace(links_in_message[j],'');
         image_attached_url = links_in_message[j];
         image_attached = '<img class="attachment" src="' + image_attached_url + '" />';
       } else { // Embeds other links
         message = message.replace(links_in_message[j],'<a target="_new" href="' + links_in_message[j] + '">' + links_in_message[j] + '</a>');
       }
     }
   }




   if (message.length < 1 && youtube_links.length > 0) {
     $('.emoji-boards').after('<li class="board_message ' + timestamp*1000 + '" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + pubkey  + '</span></div>'+ image_attached + youtube_links +'<span class="time">' + moment(timestamp*1000).fromNow() + '</span></li>');

   } else if (image_attached > 0 && youtube_links.length > 0) {

     $('.emoji-boards').after('<li class="board_message ' + timestamp*1000 + '" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + pubkey  + '</span></div><p class="' + addClasses + '">' + message + image_attached + youtube_links +'</p><span class="time">' + moment(timestamp*1000).fromNow() + '</span></li>');


   } else  {
     $('.emoji-boards').after('<li class="board_message ' + timestamp*1000 + '" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + pubkey  + '</span></div><p class="' + addClasses + '">' + message + image_attached + youtube_links +'</p><span class="time">' + moment(timestamp*1000).fromNow() + '</span></li>');
  }

  if (nickname) {
    $('.' + timestamp*1000 + ' .board_message_pubkey').before('<span class="boards_nickname">' + nickname + '</span>')
  }

  if (reply) {
    // $('.this_board_message .board_message_pubkey').before('<span class="boards_nickname">' + hex_json.n + '</span>')
    let tx_data_reply = await fetch('http://' + rmt.getGlobal('node') + '/json_rpc', {
         method: 'POST',
         body: JSON.stringify({
           jsonrpc: '2.0',
           method: 'f_transaction_json',
           params: {hash: reply}
         })
       })

       const resp_reply = await tx_data_reply.json();

       let result_reply = resp_reply.result.tx.extra.substring(66);
       let hex_json_reply = JSON.parse(fromHex(result_reply));
       let verified_reply = nacl.sign.detached.verify(naclUtil.decodeUTF8(hex_json_reply.m), fromHexString(hex_json_reply.s), fromHexString(hex_json_reply.k));

       if (!verified_reply) {
         return;
       }
       let avatar_base64_reply = get_avatar(hex_json_reply.k);
       let message_reply = hex_json_reply.m;

       $('.' + toString(timestamp*1000) + ' img').before('<div class="board_message_reply"><img class="board_avatar_reply" src="data:image/svg+xml;base64,' + avatar_base64_reply + '"><p>' + message_reply.substring(0,25)  +'..</p></div>');


  }

}

ipcRenderer.on('new-message', async (event, transaction) => {

	console.log('new message triggered');

  let tx_data = await fetch('http://' + rmt.getGlobal('node') + '/json_rpc', {
       method: 'POST',
       body: JSON.stringify({
         jsonrpc: '2.0',
         method: 'f_transaction_json',
         params: {hash: transaction.hash}
       })
     })

		 const resp = await tx_data.json();
		 let timestamp = resp.result.block.timestamp;

		 result = resp.result.tx.extra.substring(66);
		 let hex_json = JSON.parse(fromHex(result));
		 let verified = nacl.sign.detached.verify(naclUtil.decodeUTF8(hex_json.m), fromHexString(hex_json.s), fromHexString(hex_json.k));

		 if (!verified) {
			 return;
		 }
		 let to_board = letter_from_spend_key(transaction.transfers[0].publicKey);
     await require("fs").writeFile(userDataDir + "/" +hex_json.k + ".png", get_avatar(hex_json.k, 'png'), 'base64', function(err) {
       console.log(err);
     });

     let message = escapeHtml(hex_json.m);

     if (message.length < 1) {
       return;
     }

		 let name;

    if (hex_json.n) {
      name = hex_json.n;
    } else {
			name = 'Anonymous';
		}

		if (hex_json.k != Buffer.from(signingKeyPair.publicKey).toString('hex')) {
     notifier.notify({
       title: name + " in " + to_board,
       message: message,
       icon: userDataDir + "/" +hex_json.k + ".png",
       wait: true // Wait with callback, until user action is taken against notification
     },function (err, response, metadata) {
			 console.log(err, response, metadata);
		 });

   notifier.on('click', function(notifierObject, options) {
     // Triggers if `wait: true` and user clicks notification
			ipcRenderer.send('show-window');
			//
			//
			//      let this_board = $(this).attr('id');
			//
			//      if ($(this).hasClass('current')) {
			//        return;
			//      }
			//
			//      current_board = this_board;
			//      if (this_board == "home_board") {
			//        this_board = 'SEKReSxkQgANbzXf4Hc8USCJ8tY9eN9eadYNdbqb5jUG5HEDkb2pZPijE2KGzVLvVKTniMEBe5GSuJbGPma7FDRWUhXXDVSKHWc';
			//      }
			//
			//
			//
			//      ipcRenderer.send('get-boards', this_board);
			//      $('.current').removeClass('current');
			//      $(this).addClass('current');
     	// open_board(payload_json.from);

   });

}


})

ipcRenderer.on('got-boards', async (event, json) => {

  let fetching_board = current_board;

  $('#boards .board_message').remove();

  for (tx in json) {
    let hash = json[tx].hash;


    let tx_data = await fetch('http://' + rmt.getGlobal('node') + '/json_rpc', {
         method: 'POST',
         body: JSON.stringify({
           jsonrpc: '2.0',
           method: 'f_transaction_json',
           params: {hash: hash}
         })
       })

       const resp = await tx_data.json();
       let timestamp = resp.result.block.timestamp;
       try {
       result = resp.result.tx.extra.substring(66);
       let hex_json = JSON.parse(fromHex(result));
       let verified = nacl.sign.detached.verify(naclUtil.decodeUTF8(hex_json.m), fromHexString(hex_json.s), fromHexString(hex_json.k));

       if (!verified) {
         continue;
       }
       let avatar_base64 = get_avatar(hex_json.k);

        if (current_board != fetching_board) {
          continue;
        }
        let addClasses = '';
        if (containsOnlyEmojis(hex_json.m)) {
          addClasses = 'emoji-message';
        }

        let message = escapeHtml(hex_json.m);

        if (message.length < 1) {
          continue;
        }

          geturl = new RegExp(
                  "(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){3,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))"
                 ,"g"
               );

        // Instantiate attachments
        let youtube_links = '';
        let image_attached = '';

        // Find links
        let links_in_message = message.match(geturl);

        // Supported image attachment filetypes
        let imagetypes = ['.png','.jpg','.gif', '.webm', '.jpeg', '.webp'];

        // Find magnet links
        //let magnetLinks = /(magnet:\?[^\s\"]*)/gmi.exec(message);

        //message = message.replace(magnetLinks[0], "");

        if (links_in_message) {

          for (let j = 0; j < links_in_message.length; j++) {

            if (links_in_message[j].match(/youtu/) || links_in_message[j].match(/y2u.be/)) { // Embeds YouTube links
              message = message.replace(links_in_message[j],'');
              embed_code = links_in_message[j].split('/').slice(-1)[0].split('=').slice(-1)[0];
              youtube_links += '<div style="position:relative;height:0;padding-bottom:42.42%"><iframe src="https://www.youtube.com/embed/' + embed_code + '?modestbranding=1" style="position:absolute;width:80%;height:100%;left:10%" width="849" height="360" frameborder="0" allow="autoplay; encrypted-media"></iframe></div>';
            } else if (imagetypes.indexOf(links_in_message[j].substr(-4)) > -1 ) { // Embeds image links
              message = message.replace(links_in_message[j],'');
              image_attached_url = links_in_message[j];
              image_attached = '<img class="attachment" src="' + image_attached_url + '" />';
            } else { // Embeds other links
              message = message.replace(links_in_message[j],'<a target="_new" href="' + links_in_message[j] + '">' + links_in_message[j] + '</a>');
            }
          }
        }



        if (message.length < 1 && youtube_links.length > 0) {
          $('#boards').append('<li class="board_message this_board_message" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + hex_json.k + '</span></div>'+ image_attached + youtube_links +'<span class="time">' + moment(timestamp*1000).fromNow() + '</span></li>');

        } else if (image_attached > 0 && youtube_links.length > 0) {

          $('#boards').append('<li class="board_message this_board_message" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + hex_json.k + '</span></div><p class="' + addClasses + '">' + message + image_attached + youtube_links +'</p><span class="time">' + moment(timestamp*1000).fromNow() + '</span></li>');


        } else  {
          $('#boards').append('<li class="board_message this_board_message" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + hex_json.k + '</span></div><p class="' + addClasses + '">' + message + image_attached + youtube_links +'</p><span class="time">' + moment(timestamp*1000).fromNow() + '</span></li>');
       }

       if (hex_json.n) {
         $('.this_board_message .board_message_pubkey').before('<span class="boards_nickname">' + escapeHtml(hex_json.n) + '</span>')
       }

       if (hex_json.r) {
         // $('.this_board_message .board_message_pubkey').before('<span class="boards_nickname">' + hex_json.n + '</span>')
         let tx_data_reply = await fetch('http://' + rmt.getGlobal('node') + '/json_rpc', {
              method: 'POST',
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'f_transaction_json',
                params: {hash: hex_json.r}
              })
            })

            const resp_reply = await tx_data_reply.json();

            let result_reply = resp_reply.result.tx.extra.substring(66);
            let hex_json_reply = JSON.parse(fromHex(result_reply));
            let verified_reply = nacl.sign.detached.verify(naclUtil.decodeUTF8(hex_json_reply.m), fromHexString(hex_json_reply.s), fromHexString(hex_json_reply.k));

            if (!verified_reply) {
              continue;
            }
            let avatar_base64_reply = get_avatar(hex_json_reply.k);
            let message_reply = hex_json_reply.m;

            $('.this_board_message img').before('<div class="board_message_reply"><img class="board_avatar_reply" src="data:image/svg+xml;base64,' + avatar_base64_reply + '"><p>' + message_reply.substring(0,25)  +'..</p></div>');




       }

       $('.this_board_message').addClass(hash).removeClass('this_board_message').click(function(){
         reply(hash);
         $(this).find('p').addClass('rgb');
         $('#boards').scrollTop('0');
       });

     } catch (err) {
       console.log('Error:', err)
       continue;
     }

  }


})
