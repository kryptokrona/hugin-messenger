window.$ = window.jQuery = require('jquery');

const copy = require( 'copy-to-clipboard' );
const notifier = require('node-notifier');
const { openAlias } = require('openalias');
const { desktopCapturer, shell } = require('electron');
const contextMenu = require('electron-context-menu');
const path = require('path');
const emojione = require('emojione');

const {
    Address,
    AddressPrefix,
    Block,
    BlockTemplate,
    Crypto,
    CryptoNote,
    LevinPacket,
    Transaction
} = require('kryptokrona-utils');
const xkrUtils = new CryptoNote()
const crypto = new Crypto()

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

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


var sdp_parser = require('./sdp');

const welcome_message = require('./welcome_message');

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
let endCall = (peer, stream, contact_address) => {
  peer.destroy();
  stream.getTracks().forEach(function(track) {
    track.stop();
  });
  var myvideo = document.getElementById('myvideo');

  try {
  $('.video-grid .' + contact_address).remove();
} catch (err) {

}
  if (!$('.video-grid video').length) {
    $('.video-grid').hide();
    myvideo.srcObject = stream;
    myvideo.pause();
    myvideo.srcObject = null;
    $('#myvideo').hide();
  }

  $('otherid').empty();
  // $('#caller_menu').css('top','-65px');
  // $('#messages_contacts').removeClass('in-call');
  // $('#settings').removeClass('in-call');
  $('#otherid').unbind('change');
  awaiting_callback = false;

  $('.' + contact_address).removeClass("rgb").removeClass('online').removeClass("in-call-contact").find('.fa').remove();
  $('.' + contact_address + " .lds-ellipsis").remove();

    //
    //
    // $('#video-button').unbind('click').click(function() { startCall(true, true) });
    //
    // $('#call-button').unbind('click').click(function() { startCall(true, false) });
    //
    // $('#screen-button').unbind('click').click(function() { startCall(true, true, true) });
}


const {ipcRenderer} = require('electron');

let reply_to_board_message = (hash) => {

  current_reply_to = hash;
  $('.board_message').removeClass('rgb');
  let nickname = false;

  try {
      nickname = $('#boards .' + hash + ' .boards_nickname').text();
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

  $('#boards_message_form').css('width','calc(80% - ' + ( amount + 300 ) + 'px)');

}

$('#board-menu .trending').click(function() {
   print_trending('#');

});
let trendingTags = [];
let print_trending = (tag) => {
console.log(tag);
  let board_title = 'Trending';
  let this_board = 'Trends';
  $('.current').removeClass('current');
  $('#board_title').text(tag);
  if (tag == '#') {
    $('#board_title').text('Trending');
  }
  board_posters = [];
  $('.active_user').remove();
  $('.box_header').find('h3').text('Hashtags');
  $('#boards_messages').show();
  $('#boards .board_message').remove();
  let hashtag = new RegExp(tag);
   boards_db.find({message : hashtag }).sort({ timestamp: -1 }).limit(50).exec(async function (err,docs){
  for (doc in docs.reverse()) {
    $('.active_user').remove();
    board_posters = [];
    let hash = docs[doc].hash;
    let pubkey = docs[doc].sender;
    let message = docs[doc].message;
    let timestamp = docs[doc].timestamp;
    let nickname = docs[doc].nickname;
    let this_reply = docs[doc].reply;
    let board = docs[doc].board;
    let words = message.split(' ');
    for (word in words) {
      try {
      if (words[word].substring(0,1) == '#') {
        let thisHashtag = words[word];
      await  print_hashtag(thisHashtag);
    await print_board_message(hash, pubkey, message, timestamp, board, nickname, this_reply, '#boards_messages');
  }
    } catch (err ){
    console.log(err);
    return;
    }
}
}
});
}

let print_board = (board) => {

  console.log('Printing board', board);
  $('#boards .board_message').remove();
  board_posters = [];
  $('.active_user').remove();
  trendingTags = [];
  $('#active_hugins .tag').remove();
  $('.box_header').find('h3').text('Active users');
  boards_db.find({board : board}).sort({ timestamp: -1 }).limit(100).exec(async function (err,docs){



    for (doc in docs.reverse()) {

      // continue;
      let hash = docs[doc].hash;
      let pubkey = docs[doc].sender;
      let message = docs[doc].message;
      let timestamp = docs[doc].timestamp;
      let fetching_board = $('.current').attr('invitekey');
      let nickname = docs[doc].nickname;
      let this_reply = docs[doc].reply;
      await print_board_message(hash, pubkey, message, timestamp, fetching_board, nickname, this_reply, '#boards_messages');
      // let print_board_message = async (hash, address, message, timestamp, fetching_board, nickname=false, reply=false, selector) => {

    }



  })

}
let board_posters = [];

let print_boards = async () => {


  let boards_addresses = rmt.getGlobal('boards_addresses');
  for (address in boards_addresses) {
    let this_address = boards_addresses[address];
    if (this_address[0] == "SEKReX27SM2jE2KGzVLvVKTniMEBe5GSuJbGPma7FDRWUhXXDTysRXy") {
      continue;
    }

    let board_color = intToRGB(hashCode((this_address[1])));
    if (this_address[0] == "SEKReSxkQgANbzXf4Hc8USCJ8tY9eN9eadYNdbqb5jUG5HEDkb2pZPijE2KGzVLvVKTniMEBe5GSuJbGPma7FDRWUhXXDVSKHWc") {
      $('#boards_picker').append('<div class="board_icon rgb" id="home_board" title="Home" invitekey="0b66b223812861ad15e5310b4387f475c414cd7bda76be80be6d3a55199652fc" style=""><i class="fa fa-home"></i></div>');
    } else {
			await dictionary.find({ original: this_address[1] }, function (err,docs){


					if (!docs.length == 0) {

						let translation  = docs[0].translation;
					$('#boards_picker').append('<div class="board_icon" inviteKey="' + this_address[1] + '" title="' + translation +  '" id="' + this_address[0] + '" style="background: rgb(' + board_color.red + ',' +  board_color.green + ',' +  board_color.blue + ')">' + docs[0].translation.substring(0, 1) + '</div>');

				} else {
      $('#boards_picker').append('<div class="board_icon" inviteKey="' + this_address[1] + '" title="' + letter_from_spend_key(this_address[1]) +  '" id="' + this_address[0] + '" style="background: rgb(' + board_color.red + ',' +  board_color.green + ',' +  board_color.blue + ')">' + letter_from_spend_key(this_address[1]).substring(0, 1) + '</div>');
		}


		if (this_address[1].substring(59,64) != '00000') {

			$('#' + this_address[0]).append('<i class="fa fa-lock"></i>').addClass('private');
		}


		   $('.board_icon').click(function() {

         let board_title = $(this).attr('title');
		     let this_board = $(this).attr('id');
		     if ($(this).hasClass('current')) {
		       return;
		     }
         reactions = {};
         board_posters = [];
        $('.active_user').remove();
		     current_board = this_board;
		     if (this_board == "home_board") {
		       this_board = 'SEKReSxkQgANbzXf4Hc8USCJ8tY9eN9eadYNdbqb5jUG5HEDkb2pZPijE2KGzVLvVKTniMEBe5GSuJbGPma7FDRWUhXXDVSKHWc';
           $('#board_title').text('Home');
		     }
         $('#boards_messages').show();
         $(this).removeClass('unread_board');
         $('#board_title').text(board_title);
		     // ipcRenderer.send('get-boards', this_board);
		     $('.current').removeClass('current');
		     $(this).addClass('current');
         $('#replyto_exit').click();
         $('#send_payment').addClass('hidden');
         let this_invite_key = $(this).attr('invitekey');

         if (this_invite_key) {
           print_board(this_invite_key);
         } else {
           print_board("0b66b223812861ad15e5310b4387f475c414cd7bda76be80be6d3a55199652fc");
         }




		   });

	});
}


  }
  return;


}

let parse_sdp = (sdp) => {

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

function fromHex(hex,str){
  try{
    str = decodeURIComponent(hex.replace(/(..)/g,'%$1'))
  }
  catch(e){
    str = hex
    // console.log('invalid hex input: ' + hex)
  }
  return str
}

function trimExtra (extra) {

try {
  let payload = fromHex(extra.substring(66));

  let payload_json = JSON.parse(payload);
  return fromHex(extra.substring(66))
}catch (e) {
  return fromHex(Buffer.from(extra.substring(78)).toString())
}
}

function handleError (e) {
  console.log(e)
}

let startCall = (audio, video, screenshare=false) => {

  let contact_address = $('#recipient_form').val();

  console.log('Starting call..');

  $('#messages_pane').find('audio').remove();
  $('#messages_pane').append('<audio autoplay><source src="static/startcall.mp3" type="audio/mpeg"></audio>');
  $('.active_contact').removeClass('border-rgb');

  // $('#video-button').unbind('click');
  //
  // $('#call-button').unbind('click');
  //
  // $('#screen-button').unbind('click');

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


  async function gotMedia (stream, screen_stream=false) {
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

    let peer1 = new Peer({
      initiator: true,
      stream: stream,
      trickle: false,
      offerOptions: {offerToReceiveVideo: true, offerToReceiveAudio: true},
      sdpTransform: (sdp) => {
        return sdp;
          // console.log('lol, lmao', sdp);
          //
          // let sdp_object = {'sdp': sdp};
          //
          // let parsed_data = `${video ? "Δ" : "Λ"}` + parse_sdp(sdp_object);
          // console.log(parsed_data);
          // let recovered_data = sdp_parser.expand_sdp_offer(parsed_data);
          // console.log(recovered_data);
          // return recovered_data.sdp;
         }
  })

  let video_codecs = window.RTCRtpSender.getCapabilities('video');

  let custom_codecs = [];

  for (codec in video_codecs.codecs) {
    let this_codec = video_codecs.codecs[codec];
    if (this_codec.mimeType == "video/H264" && this_codec.sdpFmtpLine.substring(0,5) == "level") {
      custom_codecs.push(this_codec);
    }

  }



  let transceivers = peer1._pc.getTransceivers()

  // select the desired transceiver
  if (video) {
   transceivers[1].setCodecPreferences(custom_codecs)
   }

    let first = true;

    $('.' + contact_address).addClass("rgb").addClass("in-call-contact").append('<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>');
    // $('#messages_contacts').addClass('in-call');
    // $('#settings').addClass('in-call');
    // $('#caller_menu').fadeIn().css('top','0px');
    // $('#caller_menu_type').text('Calling..');
		let conversation_display = await get_translation($('#recipient_form').val());
    // $('#caller_menu_contact').text(conversation_display);
    // let avatar_base64 = get_avatar($('#recipient_form').val());
    // $('#caller_menu img').attr('src',"data:image/svg+xml;base64," + avatar_base64);
    $('#caller_menu .fa-phone').clone().appendTo('.' + contact_address).click(function(){
      endCall(peer1, stream, contact_address);
    })

    $('#caller_menu .fa-microphone').clone().appendTo('.' + contact_address).click( function() {
      $(this).toggleClass('fa-microphone-slash').toggleClass('fa-microphone');
      stream.getTracks().forEach(track => track.enabled = !track.enabled);
    });

    peer1.on('close', () => {

      console.log('Connection lost..')

      endCall(peer1, stream, contact_address);

      $('#messages_pane').find('audio').remove();
      $('#messages_pane').append('<audio autoplay><source src="static/endcall.mp3" type="audio/mpeg"></audio>');

    })

    peer1.on('error', () => {

      console.log('Connection lost..')

      endCall(peer1, stream, contact_address);
      $('#messages_pane').find('audio').remove();
      $('#messages_pane').append('<audio autoplay><source src="static/endcall.mp3" type="audio/mpeg"></audio>');

    })

    peer1.on('stream', stream => {
      // got remote video stream, now let's show it in a video tag
      let extra_class = "";
      if (video) {
        extra_class = " video"
      }
      $('.video-grid').append('<video class="' + contact_address  + extra_class + '"></video>').show();
      let video_element = document.querySelector('.'+contact_address);


      if ('srcObject' in video_element) {
        video_element.srcObject = stream
      } else {
        video_element.src = window.URL.createObjectURL(stream) // for older browsers
      }
      video_element.play()

    })

    peer1.on('connect', () => {

      $('#caller_menu_type').text(`${video ? 'Video' : 'Voice'}` + ' connected');
      $('.' + contact_address + ' .lds-ellipsis').fadeOut().remove();
      $('.' + contact_address).addClass('online');
      console.log('Connection established;')

    });


    peer1.on('signal', data => {
      console.log('real data:', data);
      let parsed_data = `${video ? "Δ" : "Λ"}` + parse_sdp(data);
      console.log('parsed data:', parsed_data);
      let recovered_data = sdp_parser.expand_sdp_offer(parsed_data);
      console.log('recovered data:', recovered_data);
      console.log('some other data:', {'type': 'offer', 'sdp':recovered_data});
      // peer1._pc.setLocalDescription(recovered_data);
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
      $('#otherid').unbind('change');
      peer1.signal( JSON.parse($('#otherid').val()) );
    })


  }

}

let answerCall = (msg, contact_address) => {

    let video = msg.substring(0,1) == 'Δ';
    // $('#messages_contacts').addClass('in-call');
    // $('#settings').addClass('in-call');

  // get video/voice stream
  navigator.mediaDevices.getUserMedia({
    video: video,
    audio: true
  }).then(gotMedia).catch(() => {})

  function gotMedia (stream) {
    let extra_class = '';
    if (video) {
      extra_class = ' video'
      var myvideo = document.getElementById('myvideo')
      myvideo.srcObject = stream;

      myvideo.play();
      $('video').fadeIn();

    }

    let peer2 = new Peer({stream: stream, trickle: false})


      let video_codecs = window.RTCRtpSender.getCapabilities('video');

      let custom_codecs = [];

      for (codec in video_codecs.codecs) {
        let this_codec = video_codecs.codecs[codec];
        if (this_codec.mimeType == "video/H264" && this_codec.sdpFmtpLine.substring(0,5) == "level") {
          custom_codecs.push(this_codec);
        }

      }


      let transceivers = peer2._pc.getTransceivers();

      // select the desired transceiver
    if (video) {
       transceivers[1].setCodecPreferences(custom_codecs);
    }


    // $('#caller_menu .fa-phone').click(function(){
    //   endCall(peer2, stream);
    // })
    //
    //
    // $('#caller_menu .fa-microphone').click( function() {
    //   $(this).toggleClass('fa-microphone-slash').toggleClass('fa-microphone');
    //   stream.getTracks().forEach(track => track.enabled = !track.enabled);
    // });

    $('.' + contact_address).addClass("rgb").addClass("in-call-contact").append('<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>');
    $('#caller_menu .fa-phone').clone().appendTo('.' + contact_address).click(function(){
      endCall(peer2, stream, contact_address);
    })

    $('#caller_menu .fa-microphone').clone().appendTo('.' + contact_address).click( function() {
      $(this).toggleClass('fa-microphone-slash').toggleClass('fa-microphone');
      stream.getTracks().forEach(track => track.enabled = !track.enabled);
    });

    peer2.on('close', () => {

      console.log('Connection lost..')
      endCall(peer2, stream, contact_address);
      $('#messages_pane').find('audio').remove();
      $('#messages_pane').append('<audio autoplay><source src="static/endcall.mp3" type="audio/mpeg"></audio>');

    })

    peer2.on('error', () => {

      console.log('Connection lost..')

      endCall(peer2, stream, contact_address);
      $('#messages_pane').find('audio').remove();
      $('#messages_pane').append('<audio autoplay><source src="static/endcall.mp3" type="audio/mpeg"></audio>');

    })

    let first = true;



    peer2.on('signal', data => {
      console.log('initial data:', data);
      let parsed_data = `${video ? 'δ' : 'λ'}` + parse_sdp(data);
      console.log('parsed data really cool sheet:', parsed_data);
      let recovered_data = sdp_parser.expand_sdp_answer(parsed_data);
      data = recovered_data;
      console.log('recovered data:', recovered_data);
      // peer2._pc.setLocalDescription(recovered_data);
      if (!first) {
        return
      }
      console.log('Sending answer ', parsed_data);
      sendMessage(parsed_data, true);
      first = false;

    })
    let signal = sdp_parser.expand_sdp_offer(msg);
    peer2.signal(sdp_parser.expand_sdp_offer(msg));

    peer2.on('track', (track, stream) => {
      $('#caller_menu_type').text('Setting up link..');
    })

    peer2.on('connect', () => {

      $('#messages_pane').find('audio').remove();
      $('#messages_pane').append('<audio autoplay><source src="static/startcall.mp3" type="audio/mpeg"></audio>');
      $('#caller_menu_type').text(`${video ? 'Video' : 'Voice'}` + ' connected');
      $('.' + contact_address + ' .lds-ellipsis').fadeOut().remove();
      $('.' + contact_address).addClass('online');
      console.log('Connection established;')

    });

    peer2.on('stream', stream => {
      // got remote video stream, now let's show it in a video tag
      console.log('x-class:', extra_class);
      $('.video-grid').append('<video class="' + contact_address  + extra_class + '"></video>').show();
      let video = document.querySelector('.video-grid .'+contact_address);



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


      if (emitCall) {

        // Start ringing sequence

         $('#incomingCall').append('<audio autoplay><source src="static/ringtone.mp3" type="audio/mpeg"></audio>');
         $('#incomingCall').find('h1').text(`Incoming ${msg.substring(0,1) == "Δ" ? "video" : "audio"} call!`);
         $('#incomingCall').show();
         let avatar_base64 = get_big_avatar(sender);
         $('#incomingCall img').attr('src',"data:image/svg+xml;base64," + avatar_base64);

				 dictionary.find({ original: sender }, function (err,docs){

						 if (docs.length == 0) {

						 $('#incomingCall span').text(sender);

					 } else {

						 $('#incomingCall span').text(docs[0].translation);
					 }

				 });


         // Handle answer/decline
         $('#answerCall').unbind('click').click(async function() {
           $('#answerCall').unbind('click');
					 $('#boards').addClass('hidden');
					 $('#messages_page').removeClass('hidden');
           $('.active_contact').removeClass('border-rgb');
					 $('#new_board').addClass('hidden');
					 $('#boards_picker').addClass('hidden');
           if ($('#recipient_form').text() != sender) {
              print_conversation(sender);
              $('#currentchat_footer').show();
           }

           answerCall(msg, sender);

           // $('#messages_contacts').addClass('in-call');
           // $('#settings').addClass('in-call');

           // $('#caller_menu').fadeIn().css('top','0px');
           $('#caller_menu_type').text('Connecting..');
					 let conversation_display = await get_translation($('#recipient_form').val());
			     $('#caller_menu_contact').text(conversation_display);
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
      $('#otherid').val(JSON.stringify(sdp_parser.expand_sdp_answer(msg)));
      $('#otherid').change();
      }
      return "";

    break;
    default:
      return msg;

  }

}

$('#video-button').click(function() { startCall(true, true)});

$('#call-button').click(function() { startCall(true, false)});

$('#screen-button').click(function() { startCall(true, true, true)});

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
                sendMessage(torrent.magnetURI.split('&tr')[0]);
                  torrent.on('wire', function (wire) {
                  $('.' + torrent.magnetURI.split('&')[0].split(":")[3]).find('p').append('&nbsp;<i class="fa fa-circle-o-notch"></i>');
                  console.log(torrent.magnetURI);
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

   console.log('Starting torrent!');
   let torrentId = magnetLink+'&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.fastcast.nz';

   $('#'+element).find('.download-button').html('  <div class="progress"></div>');


   client.add(torrentId, {path: downloadDir}, function (torrent) {

     torrent.on('download', function (bytes) {
        $('#'+element).find('.progress').css('width',parseInt(torrent.progress * 88) + "px");



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

  if (message.substring(0,1) == "Δ" || message.substring(0,1) == "Λ") {

    return "Call started";
  } else if ( message.substring(0,1) == "δ" || message.substring(0,1) == "λ"  ){
    return "Call answered";
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

        $('#' + element).find('p').addClass('rgb').addClass('magnet').text($('#' + element).find('p').text().replace(magnetLinks[0], magnetLinks[0].split('=')[2]));
        let magnet_class = magnetLinks[0].split("&")[0].split(":")[3];
        $('#' + element).addClass(magnet_class);
        $('#' + element).find('p').append('<button class="download-button">Download</button>').click(function(){ downloadMagnet(magnetLinks[0], element); $(this).unbind('click');  $(':focus').blur(); });
}

const rmt = require('electron').remote;

let userDataDir = rmt.getGlobal('userDataDir');
let appPath = rmt.getGlobal('appPath');

let db = new Datastore({ filename: userDataDir+'/messages.db', autoload: true });
let boards_db = new Datastore({ filename: userDataDir+'/boards.db', autoload: true });

let misc = new Datastore({ filename: userDataDir+'/misc.db', autoload: true });

let keychain = new Datastore({ filename: userDataDir+'/keychain.db', autoload: true });

let dictionary = new Datastore({ filename: userDataDir+'/dict.db', autoload: true });

const prompt = require('electron-prompt');

contextMenu({
	prepend: (defaultActions, params, browserWindow) => [
		{
			label: 'Rename',
			// Only show it when right-clicking images
			visible: document.elementFromPoint(params.x, params.y).className.split(' ').includes('board_icon')  && document.elementFromPoint(params.x, params.y).className.split(' ').includes('private'),
      click: () => {

							console.log('Renaming');
							let e = document.elementFromPoint(params.x, params.y);
							let board = e.getAttribute('invitekey');

							prompt({
							    title: 'Rename board',
							    label: 'New name:',
							    value: 'Type here..',
							    inputAttrs: {
							        type: 'text',
											required: true
							    },
							    type: 'input'
							})
							.then((r) => {
							    if(r === null) {
							        console.log('user cancelled');
											return;
							    } else {
							        console.log('result', r);

											dictionary.find({ original: board }, function (err,docs){

													if (docs.length == 0) {

													dictionary.insert({"original": board, "translation": r});

												} else {

													dictionary.update({original : board}, { $set: {translation : r} } , {} , function (err, numReplaced){
														console.log(err);
													});
												}

                        e.innerHTML = r.substring(0, 1) + '<i class="fa fa-lock"></i>';
												e.setAttribute('title', r);
                        $('#board_title').text(r);

											});
							    }
							})
							.catch(console.error);




      }
		},
		{
			label: 'Delete',
			// Only show it when right-clicking images
			visible: document.elementFromPoint(params.x, params.y).className.split(' ').includes('board_icon'),
      click: () => {

        ipcRenderer.send('remove-subwallet', document.elementFromPoint(params.x, params.y).id);

      }
		},{
			label: 'Copy invite link',
			// Only show it when right-clicking images
			visible: document.elementFromPoint(params.x, params.y).className.split(' ').includes('board_icon')  && document.elementFromPoint(params.x, params.y).className.split(' ').includes('private'),
      click: () => {

        copy(document.elementFromPoint(params.x, params.y).getAttribute('inviteKey'));

      }
		},	{
				label: 'Rename',
				// Only show it when right-clicking images
				visible: document.elementFromPoint(params.x, params.y).className.split(' ').includes('contact_address'),
	      click: () => {

								console.log('Renaming');
								let e = document.elementFromPoint(params.x, params.y);
								let contact = e.parentNode.classList[1];
                let hashy = nacl.hash(naclUtil.decodeUTF8(contact));

                let hashy_hex = Buffer.from(hashy).toString('hex');

								prompt({
								    title: 'Rename contact',
								    label: 'New name:',
								    value: 'Type here..',
								    inputAttrs: {
								        type: 'text',
												required: true
								    },
								    type: 'input'
								})
								.then((r) => {
								    if(r === null) {
								        console.log('user cancelled');
												return;
								    } else {
								        console.log('result', r);

												dictionary.find({ original: contact }, function (err,docs){

														if (docs.length == 0) {

														dictionary.insert({"original": contact, "translation": r});

													} else {

														dictionary.update({original : contact}, { $set: {translation : r} } , {} , function (err, numReplaced){
															console.log(err);
															console.log(numReplaced);
														});
													}

													$('.' + contact + ' .contact_address').text(r);
                          console.log('Whos dat fokin contact:', contact, hashy_hex);
                          print_conversation(contact);
												});
								    }
								})
								.catch(console.error);




	      }
			}
	]
});



let last_block_checked = 1;
let last_block_checked_boards = 1;



$('#import').click(function(){

  if ($('#importMnemonic').val().split(" ").length == 25) {

  let r = confirm("Are you sure? If you have not backed up your mnemonic seed, you will lose all your data. Hugin will restart and then synchronize your account. This process may take a while, please be patient.");
  if (r == true) {
    console.log('Importing: ' + $('#importMnemonic').val());

    db.remove({}, { multi: true }, function (err, numRemoved) {
    });
    misc.remove({}, { multi: true }, function (err, numRemoved) {
    });
    keychain.remove({}, { multi: true }, function (err, numRemoved) {
    });
    ipcRenderer.send('import_wallet',$('#importMnemonic').val().toLocaleLowerCase());

    setTimeout(function(){ console.log('resetting..');walletd.reset() }, 330000);

  } else {

  return;



  }} else {

   alert("Incorrect Mnemonic Seed");
  }

});

const nacl = require('tweetnacl');
const naclUtil = require('tweetnacl-util');
const naclSealed = require('tweetnacl-sealed-box');
const ed2curve = require('ed2curve');

const generatePrivateBoard = () => {
	return  Buffer.from(nacl.randomBytes(32)).toString('hex');
}

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

String.prototype.hashCode = function() {
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

const hashCode = (str) => {
		let hash = Math.abs(str.hashCode())*0.007812499538;
    return Math.floor(hash);

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


var rpc_pw;

let downloadDir = remote.getGlobal('downloadDir');


var TurtleCoinWalletd = require('kryptokrona-service-rpc-js').default

let walletd;

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




ipcRenderer.on('gotNodes', (evt, json) => {
  console.log(json);
})


ipcRenderer.on('removed-subwallet', async (evt, addr) => {
 $('#' + addr).addClass('remove');
 await sleep(500);
 $('#' + addr).addClass('removed');

 if ($('#' + addr).hasClass('current')) {
   $('#home_board').click();
 }
})


let sendTransaction = (mixin, transfer, fee, sendAddr, payload_hex, payload_json, silent=false, temp_hash, to_board) => {

        let global_mixin = `${blockCount > 799999 ? 3 : 3}`;

        console.log(global_mixin);

        walletd.sendTransaction(
          parseInt(global_mixin),
          transfer,
          fee,
          [sendAddr],
          0,
          payload_hex,
          '',
          sendAddr)
        .then(resp => {
          console.log(resp);
          console.log(payload_json);
          if (payload_json.from || payload_json.k == currentAddr) {
            let thisHash = resp.body.result.transactionHash;
            known_pool_txs.push(thisHash);
            console.log('keep pushin');
          }
          if (payload_json.brd) {
          let time = escape(parseInt(temp_hash / 1000));
          let thisHash = resp.body.result.transactionHash;
          $('#boards .' + temp_hash).addClass(thisHash);
          console.log(to_board);
          save_boards_message(payload_json, time, thisHash, to_board);

          }
          if (resp.body.error) {
              if (resp.body.error.message == "Wrong amount") {
                alert("Sorry, you don't have enough XKR to send this message.");
                $('#message_form').attr('disabled',false);
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

				} else if (payload_json.m.length) {
					return;

				}
          db_json = {"conversation": transfer[0].address, "type":"sent","message":payload_json.msg,"timestamp":JSON.parse(fromHex(payload_hex)).t}

          // Add message to datastore
          db.insert(db_json);

          // Add new message to conversation
          if (payload_json.msg.substring(0, 22) == "data:image/jpeg;base64") {
            payload_json.msg = "<img src='" + payload_json.msg + "' />";
          }




          // create a base64 encoded SVG
          avatar_base64 = get_avatar(sendAddr);

          $('#welcome_alpha').addClass('hidden');

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

          if ( $('.' + transfer[0].address).width() > 0 && transfer[0].address != currentAddr){
          let listed_msg = handleMagnetListed(payload_json.msg);
					//
					// if (listed_msg.length < 1) {
					// 	return;
					// }

	          	$('.' + transfer[0].address).find('.listed_message').text(listed_msg).parent().detach().prependTo('#messages_contacts');
        } else {
					if (handleMagnetListed(payload_json.msg).length && transfer[0].address != currentAddr) {
            console.log('Prepending new contact..');
          $('#messages_contacts .active_contact').removeClass('border-rgb');

          $('#messages_contacts').prepend('<li class="active_contact border-rgb ' + transfer[0].address + '" address="' + transfer[0].address + '"><img class="contact_avatar" src="data:image/png;base64,' + get_avatar(transfer[0].address) + '" /><span class="contact_address">' + transfer[0].address + '</span><br><span class="listed_message">'+handleMagnetListed(payload_json.msg)+'</li>');
          }
        }
        }
        return JSON.parse(fromHex(payload_hex)).t;
        })
        .catch(err => {
          console.log(err)
        })
}

const save_private_board = (address, key) => {
	keychain.find({ "address": address }, function (err, docs) {

		if (docs.length == 0) {

			keychain.insert({key: key, address: address});
			return true

		} else {
			return false
		}

	});
}

function sendMessage(message, silent=false) {

	console.log('Sending messages..');

  let has_history = false;

    if (message.length == 0) {
      return
    }
    receiver = $('#recipient_form').val();
    keychain.find({ "address": receiver }, async function (err, docs) {

      if (docs.length == 0) {

        keychain.insert({key: $('#recipient_pubkey_form').val(), address: receiver});

      } else {
        has_history = true;
      }



    console.log('has_histry ? ', has_history);

    avatar_base64 = get_avatar(currentAddr);
    let magnetLinks = /(magnet:\?[^\s\"]*)/gmi.exec(message);
    if (!silent) {
      let id_elem = Date.now();

             let links = handle_links(message);
             let display_message = links[0];

    $('#messages').append('<li class="sent_message" id="' + id_elem +  '"><img class="message_avatar" src="data:image/png;base64,' + avatar_base64 + '"><p>' + display_message + links[1] + links[2] + '</p><span class="time" timestamp="' + Date.now() + '">right now</span></li>');
      console.log('debagg2', id_elem);
      $('#' + id_elem).click(function(){
        shell.openExternal($(this).attr('href'));
      })

    if (magnetLinks) {
      handleMagnetLink(magnetLinks, id_elem);
    }
    }

    // Scroll to bottom
    $('#messages_pane').scrollTop($('#messages').height());

    $('#message_form').val('');
    $('#message_form').focus();
    $('#currentchat_header_wrapper').removeClass('toggled_addr');
    $('.' + receiver ).removeClass('unread_message');




        if (!silent) {
        // $('#loading_border').animate({width: '40%'},600);
        // $('#message_form').prop('disabled',true);
        }

        // Transaction details
        amount = 1;
        fee = 10;
        mixin = 3;
        sendAddr = $("#currentAddrSpan").text();
        console.log(sendAddr);
        timestamp = Date.now();

        // Convert message data to json


        let box;

        if (has_history) {
          payload_json = {"from":sendAddr, "k": $('#currentPubKey').text(), "msg":message};

          payload_json_decoded = naclUtil.decodeUTF8(JSON.stringify(payload_json));
          box = nacl.box(payload_json_decoded, nonceFromTimestamp(timestamp), hexToUint($('#recipient_pubkey_form').val()), keyPair.secretKey);
        } else {

          console.log("First message to sender, sending sealed box.");
          const addr = await Address.fromAddress(currentAddr);
          // console.log(addr.spend.publicKey);
          let xkr_private_key = await walletd.getSpendKeys($('#currentAddrSpan').text());
          console.log(xkr_private_key);
          let signature = await xkrUtils.signMessage(message, xkr_private_key.body.result.spendSecretKey);

          payload_json = {"from":sendAddr, "k": $('#currentPubKey').text(), "msg":message, "s": signature};

          payload_json_decoded = naclUtil.decodeUTF8(JSON.stringify(payload_json));
          box = naclSealed.sealedbox(payload_json_decoded, nonceFromTimestamp(timestamp), hexToUint($('#recipient_pubkey_form').val()));
        }


        let payload_box;
        let payment_id = '';


        payload_box = {"box":Buffer.from(box).toString('hex'), "t":timestamp};
        // History has been asserted, continue sending message

        // Convert json to hex
        let payload_hex = toHex(JSON.stringify(payload_box));


        transfer = [ { 'amount':amount, 'address':receiver } ];

        return sendTransaction(mixin, transfer, fee, sendAddr, payload_hex, payload_json, silent);



      });

}


async function sendBoardMessage(message) {

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



    let receiver = $('.current').attr('id');

    if (receiver == 'home_board' ) {
      receiver = 'SEKReSxkQgANbzXf4Hc8USCJ8tY9eN9eadYNdbqb5jUG5HEDkb2pZPijE2KGzVLvVKTniMEBe5GSuJbGPma7FDRWUhXXDVSKHWc';
      current_board = 'Home';
    } else {
      receiver = $('.current').attr('id');
      current_board = letter_from_spend_key($('.current').attr('invitekey'));
    }

      // Transaction details
      amount = 1;
      fee = 10;
      mixin = 3;
      timestamp = parseInt(Date.now()/1000);
      //
      //let signature = nacl.sign.detached(naclUtil.decodeUTF8(message_to_send), signingKeyPair.secretKey);
      // console.log('getting private key for ', currentAddr);
      let private_key = await walletd.getSpendKeys(currentAddr);
      private_key = private_key.body.result;
      // console.log(private_key);
      const addr = await Address.fromAddress(currentAddr);
      // console.log(addr.spend.publicKey);
      let signature = await xkrUtils.signMessage(message_to_send, private_key.spendSecretKey)
      // console.log(signature);
      // console.log('signature', signature);
      // let verified = nacl.sign.detached.verify(naclUtil.decodeUTF8(message), signature, signingKeyPair.publicKey);
      // console.log('verified', verified);
      // return;

      // Convert message data to json
      if ($('.board_icon.current').hasClass('private')) {
        current_board = $('.current').attr('invitekey');
        payload_json = {"m":message_to_send, "k":currentAddr, "s": signature, "brd": current_board};
      } else {
      payload_json = {"m":message_to_send, "k":currentAddr, "s": signature, "brd": current_board, "t": timestamp};
      }


      if ($('.boards_nickname_form').val().length) {
        payload_json.n = $('.boards_nickname_form').val();

        // misc.update({}, {nickname: payload_json.n});

        misc.update({}, { $set: {nickname : payload_json.n} } , {} , function (err, numReplaced){
          console.log(err);
        });

      }

      if (current_reply_to.length > 0) {
        payload_json.r = current_reply_to;
        $('#replyto_exit').click();
      }
      address = $('.current').attr('id');
      console.log(address);
      console.log('Printing sent message..');
      let temp_hash = Date.now();
      let time = parseInt(Date.now()/1000);
      print_board_message(temp_hash, payload_json.k, payload_json.m, Date.now()/1000, address, payload_json.n, payload_json.r, '#boards_messages');


      //payload_json_decoded = naclUtil.decodeUTF8(JSON.stringify(payload_json));

      // let box = nacl.box(payload_json_decoded, nonceFromTimestamp(timestamp), hexToUint($('#recipient_pubkey_form').val()), keyPair.secretKey);
      //
      // let payload_box;

      let payment_id = '';

      // Convert json to hex
      let payload_hex = toHex(JSON.stringify(payload_json));

			// insert encryption
			if ($('.board_icon.current').hasClass('private')) {
				// console.log('private innit');
				let key = $('.board_icon.current').attr('inviteKey');
				let secretKey = naclUtil.decodeUTF8(key.substring(1, 33));

				let this_keyPair = nacl.box.keyPair.fromSecretKey(secretKey);

				let timestamp = parseInt(Date.now()/1000);
				payload_json_decoded = naclUtil.decodeUTF8(JSON.stringify(payload_json));

				let box = nacl.box(payload_json_decoded, nonceFromTimestamp(timestamp), this_keyPair.publicKey, this_keyPair.secretKey);

				let payload_box;
				let payment_id = '';

				let this_payload_box = {"b":Buffer.from(box).toString('hex'), "t":timestamp};


				// console.log(this_payload_box);

				// Convert json to hex
				payload_hex = toHex(JSON.stringify(this_payload_box));

			}


      sendAddr = $("#currentAddrSpan").text();
      transfer = [ { 'amount':amount, 'address':receiver } ];
      let to_board = current_board
      console.log('temp_hash', temp_hash);
      $('.' + temp_hash).addClass('loading_message');
      if (!$('.board_icon.current').hasClass('private') && current_board != "Home") {
        to_board = invite_code_from_ascii(payload_json.brd)
        console.log(to_board);
      }
      return sendTransaction(mixin, transfer, fee, sendAddr, payload_hex, payload_json, true, temp_hash, to_board);

      }

$('#contact_copy_address').click(function(){
  copy($('#recipient_form').val() + $('#recipient_pubkey_form').val());
});

$('#recipient_form').click(function(){
  copy($('#recipient_form').val());
});

$('#recipient_pubkey_form').click(function(){
  copy($('#recipient_pubkey_form').val());
});
// Detect valid address input into recipient forms

$('#recipient_form').on('input', function() {

  text = $('#recipient_form').val();

  if(text.substr(text.length - 7) == '.xkr.se') {

    let oaname = '';
      try {
      openAlias(text).then(wallets => {

          // console.log(wallets);

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
            avatar = get_big_avatar(addr);
            $('#avatar_contact').attr('src','data:image/svg+xml;base64,' + avatar).fadeIn();
            $('#context_menu').fadeIn();
            $('#contact_copy_address').fadeIn();
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
      avatar = get_big_avatar(addr);
      $('#avatar_contact').attr('src','data:image/svg+xml;base64,' + avatar).fadeIn();
      $('#context_menu').fadeIn();
      $('#contact_copy_address').fadeIn();
      $('#message_form').attr('disabled',false);
      $('#message_form').val('');
      // $('#message_form').attr('disabled',false);
    }
    if (text.length == 99) {
      // If only addr is put in
      $('#currentchat_pubkey').show();
      addr = $('#recipient_form').val();
      avatar = get_avatar(addr);
      $('#avatar_contact').attr('src','data:image/svg+xml;base64,' + avatar).fadeIn();
      $('#context_menu').fadeIn();
      $('#contact_copy_address').fadeIn();
      $('#recipient_span').find('.checkmark').fadeIn();
      if ($('#recipient_pubkey_form').val().length <= 63) {
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

  if (e.which == 13  && !e.shiftKey) {
    message = $('#message_form').val();
    sendMessage(escapeHtml(message));
    return false;    //<---- Add this line
  }
});


$('#boards_message_form').keypress(function (e) {

  if (e.which == 13 && !e.shiftKey) {
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
function get_big_avatar(hash, format='svg') {

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

function get_avatar(hash, format='png') {

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

    let message = handleMagnetListed(message_json.msg);

  db.find({timestamp : message_json.t}, function (err,docs){

      if (docs.length == 0) {

      message_db = {"conversation": conversation, "type":type, "message":message, "timestamp": message_json.t};-

      db.insert(message_db);

      }

});

}

async function save_boards_message(message_json, time, thisHash, to_board) {

  let hash =  thisHash;
  let board = to_board;
  let sender = message_json.k;
  let message = message_json.m;
  let timestamp = time;
  let nickname = message_json.n;
  let this_reply = message_json.r;
  if (!message_json.m) {
    return;
  }
  if (board == "Home") {
  board = "0b66b223812861ad15e5310b4387f475c414cd7bda76be80be6d3a55199652fc";
} else {
  board = board;
}

  console.log(board);
  let message_was_unknown = true;

    await boards_db.find({hash : hash}, function (err,docs){

        if (docs.length == 0 && message) {

        let message_db = {"hash": hash, "board": board, "sender": sender, "message": message, "timestamp": timestamp, "nickname": nickname, "reply": this_reply};-
        console.log('SAVING DIZ S');
        boards_db.insert(message_db);

      } else {
        message_was_unknown = false;
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
//
// let get_translation = async (conversation) => {
// 	dictionary.find({ original: conversation }, function (err,docs){
//
// 	 conversation_display = '';
//
// 		 if (!docs.length == 0) {
//
// 			 conversation_display = docs[0].translation;
//
// 		 } else {
// 			 conversation_display = conversation;
// 		 }
//
// 		 return conversation_display;
//
// 	 })
// }

function get_translation(conversation) {
  return new Promise(function(resolve, reject) {
    dictionary.find({ original: conversation}).exec(function(err, doc) {
      if (err) {
        reject(err)
      } else {
				let conversation_display = '';

		 		 if (!doc.length == 0) {

		 			 conversation_display = doc[0].translation;

		 		 } else {
		 			 conversation_display = conversation;
		 		 }
        resolve(conversation_display);
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


async function get_confirmed_messages(from, to) {
  // if (!from || !to && from != 0) {
	// 	console.log('Cancelling get_confirmed_messages');
  //   return;
  // }
  return new Promise(function(resolve, reject) {
    let these_transactions;

    if (from == to) {
      console.log('No new blocks, returning..');
      resolve([]);
      return;
    }

    walletd.getTransactions(
      to - from,
      from,
      '',
      [currentAddr],
      '').then(resp => {

        let arr = [];
				// console.log('confirmred:', resp);

        if (resp.code == 'ETOOLARGE') {

          reject('ETOOLARGE');


        }

      if (resp.body) {
        try {
      these_transactions = resp.body.result.items;
      console.log('Found ', these_transactions.length, ' new confirmed transactions.');
    } catch (err) {
      console.log(resp);
      console.log(err);
      resolve([]);
      return;
    }

      let txsLength = these_transactions.length;

      if (txsLength) {
        // New last checked block in db if we found new txs
        console.log('Updating last checked block to ' + to);
        // misc.update({}, {height: to});
        misc.update({}, { $set: {height : to} } , {} , function (err, numReplaced){
          console.log(err);
        });
        last_block_checked = to;
      }


      for (let i = 0; i < txsLength; i++) {
        console.log('i = ', i);
          let txsInTx = these_transactions[i].transactions.length;
          console.log('txsInTx = ', txsInTx);
          for (let j = 0; j < txsInTx; j++) {
            console.log('j = ', j);
            try{
              console.log();
              let extra = trimExtra(these_transactions[i].transactions[j].extra);
              console.log('found extra', extra);
            if (!arr.includes(extra)) {
                arr.push(extra);
            }



          } catch (e) {
            console.log(e);

          }

          }
        }
        }
          resolve(arr);

        }).catch(err => {
          // console.log(err);
          reject(err)
        });
      });

  }

function get_block_height() {
  return new Promise(function(resolve, reject){

    // Get blockcount
    walletd.getStatus()
    .then(resp => {
      console.log(resp);
      // Set blockCount value to current block count
			// console.log('bcc', resp.body.result);
      blockCount = parseInt(resp.body.result.blockCount);
      resolve(blockCount);

  }).catch(err => {
    reject(err);
    console.log(err);
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
				try {

							 let conversation_display = await get_translation(conversation);
							 // console.log(handleMagnetListed(messages[m].message));

               if (handleMagnetListed(messages[m].message).length && !$('.active_contact .' + conversation).width() ){
                 console.log('Printing new contact..');
						  	$('#messages_contacts').append('<li class="active_contact ' + conversation + '" address="' + conversation +  '"><img class="contact_avatar" src="data:image/png;base64,' + get_avatar(conversation) + '" /><span class="contact_address">' + conversation_display + '</span><br><span class="listed_message">'+handleMagnetListed(messages[m].message)+'</li>');
              }
      } catch (error) {

			}

  }




  // Now we have all conversations in the database

}

}


print_conversations();

let known_txs = [];


  $("#messages_contacts").unbind('click').on("click", "li", async function(){
    console.log('clickkkk');
      $('#message_form').focus();
      $('#messages_pane').hide();
      $('.border-rgb').removeClass('border-rgb');
      if (!$(this).hasClass('rgb')) {
        $(this).addClass('border-rgb');
      }
      $('#recipient_form').val($(this).find('.contact_address').text());
      $(this).removeClass('unread_message');
     await print_conversation($(this).attr('address'));
      $('#settings_page').fadeOut();
      $('#message_form').prop('placeholder','Message');
      $('#currentchat_footer').removeClass('hidden');
      $('#send_payment').addClass('hidden');

  });


let check_counter = 0;

let sleepAmount = 1000;

async function print_conversation(conversation) {
	avatar_base64 = get_big_avatar(conversation);
  avatar_sender = get_avatar(conversation);
  $('#messages .sent_message').remove();
  $('#messages .recieved_message').remove();
  $('#avatar_contact').attr('src','data:image/svg+xml;base64,' + avatar_base64).fadeIn();
  $('#context_menu').fadeIn();
  $('#currentchat_header_wrapper').removeClass('toggled_addr');


    keychain.find({ address: conversation }, function (err, docs) {

			// console.log('found docs initial', docs);

      if (docs.length > 0) {

        conversationPubKey = docs[0].key;

        $('#recipient_pubkey_form').val(conversationPubKey);
        $('#currentchat_pubkey').show();

        $('#recipient_pubkey_span').find('.checkmark').fadeIn();
        $('#recipient_span').find('.checkmark').fadeIn();

      } else {
      	console.log('Key not found for ', conversation);
      }

    });

  $('#recipient_form').val(conversation);

  $('#messages .received_message, #messages .sent_message').remove();
  $('#welcome_alpha').addClass('hidden');

  let messages = await find_messages({conversation: conversation}, 0, 100);

  for (n in messages) {
		// console.log(messages[n]);
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
    // console.log( parseCall(messages[n].message, false, false) );


       let links = handle_links(messages[n].message);
       messages[n].message = links[0];
       let youtube_links = links[1];
       let image_attached = links[2];
       let nickname = await get_translation(conversation);
       let nickname_element = '';

       if (nickname != conversation && messages[n].type == 'received') {
         nickname_element = '<span class="contact_address">' + nickname + '</span>';
       }

    $('#messages').append('<li id="' + messages[n].timestamp + '" timestamp="' + messages[n].timestamp + '" class="' + messages[n].type + '_message"><img class="message_avatar" src="data:image/png;base64,' + avatar_sender + '">' + nickname_element + '<p>' + parseCall(messages[n].message, false, false) +'</p>'+ links[1] + links[2] + '<span class="time" timestamp="' + messages[n].timestamp + '">' + moment(messages[n].timestamp).fromNow() + '</span></li>');


      let magnetLinks = /(magnet:\?[^\s\"]*)/gmi.exec(messages[n].message);
      if (magnetLinks) {
        handleMagnetLink(magnetLinks, messages[n].timestamp);
      }
      // console.log('debagg4', messages[n].timestamp);
      $('#'+ messages[n].timestamp).click(function(){
        shell.openExternal($(this).attr('href'));
      })

      // insert link shiz


  }


  // Scroll to bottom
  $('#messages_pane').fadeIn();
  $('#messages_pane').scrollTop($('#messages').height());

  for (message in $('#messages').find('p')) {
    let magnetLinks = /(magnet:\?[^\s\"]*)/gmi.exec(message.innerHTML);
    if (magnetLinks) {
      handleMagnetLink(magnetLinks, $(message).parent().attr('id'));
    }
  }


}

let start_attempts = 0;

let loadWallets = async () => {
  let boards_addresses = rmt.getGlobal('boards_addresses');

  return walletd.getAddresses()
  .then(resp => {

    currentAddr = resp.body.result.addresses[0];
    console.log(currentAddr);
    allAddresses = resp.body.result.addresses;
    var thisAddr = resp.body.result.addresses[0];

    return walletd.getSpendKeys(thisAddr).then(resp => {


      let secretKey = naclUtil.decodeUTF8(resp.body.result.spendSecretKey.substring(1, 33));

      let signingSecretKey = naclUtil.decodeUTF8(resp.body.result.spendSecretKey.substring(1, 33));

      keyPair = nacl.box.keyPair.fromSecretKey(secretKey);

      signingKeyPair = nacl.sign.keyPair.fromSeed(signingSecretKey);

      signingPublicKey = Buffer.from(signingKeyPair.publicKey).toString('hex');

      signingPrivateKey = Buffer.from(signingKeyPair.secretKey).toString('hex');

      let hex = Buffer.from(keyPair.publicKey).toString('hex');

      $('#currentPubKey').text(hex);
      $('#profile_message_key').text(hex);
      $('#profile_address').text(thisAddr);

      avatar_base64 = get_big_avatar(thisAddr);
      my_avatar = get_avatar(thisAddr);
      $('#avatar').attr('src','data:image/svg+xml;base64,' + avatar_base64);
      $('#profile_avatar').attr('src','data:image/png;base64,' + my_avatar);
      $('#avatar').css('border-radius','50%');
			return avatar_base64;


    })

  })
  .catch(err => {

		return false;

  })
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let changing_faces = async (element) => {

	let faces = [];

	for (let i = 0; i < 10; i++) {
		faces.push(get_big_avatar(Buffer.from(nacl.randomBytes(32)).toString('hex')));
	}

	let i = 0;

	int = self.setInterval(function(){i = avatarLoop(i, element, faces)},500);

}

let int;

function avatarLoop(i, element, faces) {

		$(element).attr('src','data:image/svg+xml;base64,' + faces[i]);
		if (i < 9) {
			return i+1;
		} else {
			return 0;
		}

}

$("document").ready(function(){

	changing_faces('#login_avatar');
  misc.find({}, function (err,docs){
    if (docs[0]) {
      $('.boards_nickname_form').val(docs[0].nickname);
    }
    $('.boards_nickname_form').change(function(){
      let nickname = $(this).val();
      // misc.update({}, {nickname: nickname});
      misc.update({}, { $set: {nickname : nickname} } , {} , function (err, numReplaced){
        console.log(err);
      });


    });
  });


	$('#login_button').click(function(){

					ipcRenderer.send('start-wallet');

					$('#login_avatar').after('<p class="saving">Connecting to blockchain<span>.</span><span>.</span><span>.</span></p>');

	});

  $('#profile_copy_address').click(function(){
    copy($('#currentAddrSpan').text() + $('#currentPubKey').text() );
  });

  $('#currentAddrSpan').click(function(){
    copy($('#currentAddrSpan').text());
  });

  $('#currentPubKey').click(function(){
    copy($('#currentPubKey').text());
  });

  function flip() {
    document.getElementById("flip-box-inner").classList.toggle("flip");

  };

  lastMessage =  Date.now();

  $('#new_chat').click(function(){
    $('#currentchat_header_wrapper').addClass('toggled_addr');
    $('#currentchat_pubkey').hide();
    $('.checkmark').hide();
    $("#new_board").addClass('hidden');
    $('#boards_messages').removeClass('recent');
    $('#modal').addClass('hidden');
    $("#boards_picker").addClass('hidden');
    $('#messages .received_message, #messages .sent_message').fadeOut();
    $('#messages > li').fadeOut();
    $('#welcome_alpha').addClass('hidden');
    $('#boards').addClass('hidden');
    $('#currentchat_footer').removeClass('hidden');
    $('#messages_page').removeClass('hidden');
    $('#recipient_form').val('').focus();
    $('#settings_page').hide();
    $('#contact_copy_address').hide();
    $('#avatar_contact').fadeOut();
    $('#context_menu').fadeOut();
    $('#send_payment').addClass('hidden');
    $('.board_icon').removeClass('current');
    $('#board_box').removeClass('show');
    $('#board_box').addClass('hidden');
    if ($('#flip-box-inner').hasClass('flip')) {
    flip();
    }
  })
});

let locked = $('#lockedBalanceText').text();

$('#new_board').click(function(){
  $('#board_box').addClass('hidden');
  $('#board_box').removeClass('show');
  $('#modal').toggleClass('hidden');
  $('#modal div').addClass('hidden');
  $('#new_board_modal').removeClass('hidden');
  $('#recent_messages').removeClass('show');
  $('#replyto_exit').click();
  if (!$('#boards_messages').hasClass('menu')) {
    $('#boards_messages').addClass('menu');
  }

  		     if (!$('#send_payment').hasClass('hidden')) {
             $('#send_payment').addClass('hidden');
             $('#payment_sent').addClass('hidden');
             $('#payment_form').removeClass('hidden');
             $('#payment_id').val('');
             $('#payment_rec_addr').val('');
             $('#replyto_exit').click();
             $('#boards_messages').addClass('menu');
  		     }
})

$('#create_pub_board_button').click(async function(){

  let invite_code = invite_code_from_ascii($('#create_pub_board_input').val());
  if(await crypto.checkKey(invite_code)) {
    $('#create_pub_board_input').val('');
    $('#boards_messages').removeClass('menu');
    $('#modal').addClass('hidden');
    $('#board_title').empty();
    $('#boards_messages').fadeOut();
    $('#board_title').after('<p class="saving">Loading public board...<span>.</span><span>.</span><span>.</span></p>');
    ipcRenderer.send('import-view-subwallet', invite_code);
      print_board(invite_code);


  } else {

        $('#create_pub_board_input').val('');
          $('.pub_board_error').removeClass('hidden').addClass('error').text('Invalid board name!');
          $('#boards_messages').addClass('menu');
  }

});

$('#join_priv_board_button').click(async function(){
  $('#boards_messages').toggleClass('menu');
	let invite_code = $('#join_priv_board_input').val();
  if(await crypto.checkKey(invite_code)) {
    $('#boards_messages').removeClass('menu');
    $('#modal').addClass('hidden')
    $('#join_priv_board_input').val('');
    $('#board_title').empty();
    $('#boards_messages').fadeOut();
    $('#board_title').after('<p class="saving">Joining board...<span>.</span><span>.</span><span>.</span></p>');
    ipcRenderer.send('import-view-subwallet', invite_code);
      print_board(invite_code);

  } else {
    $('.priv_board_error').removeClass('hidden').addClass('error').text('Invalid board address!');
    $('#join_priv_board_input').val('');
    $('#boards_messages').addClass('menu');

  }
});

$('#create_priv_board_button').click(async function(){

	let invite_code = generatePrivateBoard();
  if(await crypto.checkKey(invite_code)) {
    $('.priv_board_error').removeClass('error');
    $('#join_priv_board_input').val('');
    $('#boards .saving').text('').fadeIn();
    $('#boards_messages').removeClass('menu');
    $('#modal').addClass('hidden');
    $('#board_title').empty();
    $('#boards_messages').fadeOut();
    $('#board_title').after('<p class="saving">Creating new board...<span>.</span><span>.</span><span>.</span></p>');
    ipcRenderer.send('import-view-subwallet', invite_code);

  } else {
    $('#create_priv_board_button').click();
  }

});

ipcRenderer.on('blurred', async (event) => {
  // console.log('blur');
  sleepAmount = 10000;
})

let last_checked_counter = 0;
let last_checked_warnings = 0;

let check_protection = async () => {

  try {
    console.log('last_checked_counter', last_checked_counter);
    console.log('check_counter', check_counter);
    console.log('last_checked_warnings', last_checked_warnings);
    if (last_checked_warnings > 0 && last_checked_counter == check_counter) {
      console.log('No checks for 120s, restarting service.');

      last_checked_warnings = 0;
    } else if (last_checked_counter == check_counter && last_checked_warnings == 0) {
      last_checked_warnings += 1;
      console.log('No checks for 20s, syncing.');
      backgroundSyncMessages();
    }  else {
      console.log('No issues with checking messages.');
      last_checked_warnings = 0;
    }

  } catch (err) {
    console.log(err);
  }
  last_checked_counter = check_counter;
  await sleep(sleepAmount);
  check_protection();
  $('.time').each(function() {

    let this_timestamp = parseInt(jQuery(this).attr('timestamp'));
    // console.log(this_timestamp);
    let this_printed_time = moment(this_timestamp).fromNow();
    // console.log(this_printed_time);
    jQuery(this).text(this_printed_time);

  });

}

ipcRenderer.on('focused', async (event) => {
  // console.log('focus');
  sleepAmount = 1000;


})

ipcRenderer.on('imported-view-subwallet', async (event, address) => {

      if (address == "SEKReX27SM2jE2KGzVLvVKTniMEBe5GSuJbGPma7FDRWUhXXDTysRXy") {
        alert('Invalid board address, please try again!');
        return;
      } else {
        $('#boards_picker').empty();
        $('#boards_picker').fadeIn();
        await print_boards();
        await sleep(1000);
         current_board = $('#' + address).attr('invitekey');

         console.log(current_board);
         console.log(address);

         $('#boards_messages').fadeIn();
         $('#board_title').text(letter_from_spend_key(current_board));
         // ipcRenderer.send('get-boards', this_board);
         $('.current').removeClass('current');
         $('#' + address).addClass('current');
         $('#replyto_exit').click();
         $('#send_payment').addClass('hidden');

        print_board(current_board);
        $('#boards .saving').fadeOut();
      }

});

ipcRenderer.on('changed-node', function() {

  walletd = new TurtleCoinWalletd(
    'http://127.0.0.1',
    rmt.getGlobal('port'),
    remote.getGlobal('rpc_pw'),
    0
  );

})

ipcRenderer.on('wallet-started', async () => {

						console.log('started-wallet');

						walletd = new TurtleCoinWalletd(
							'http://127.0.0.1',
							rmt.getGlobal('port'),
							remote.getGlobal('rpc_pw'),
							0
						);

            misc.find({}, async function (err,docs){

                if (docs.length == 0) {

                misc.insert({"height": 1, "nickname": undefined, "boardsHeight": 1});

              } else {
                last_block_checked = docs[0].height;
                last_block_checked_boards = docs[0].boardsHeight;
                if (last_block_checked == undefined) {
                  let block_height = await get_block_height();
                  last_block_checked = block_height - 1000;
                  // misc.update({}, {height: last_block_checked});
                  misc.update({}, { $set: {height : last_block_checked} } , {} , function (err, numReplaced){
                    console.log(err);
                  });
                }
              }

            });


            try {
            if (rmt.getGlobal('first_start')) {

              db_json = {"conversation": "Hugin the Raven", "type":"recieved","message": welcome_message.welcome_message(),"timestamp":(Date.now())};

              // Add message to datastore
              db.insert(db_json);

              print_conversations();

            }} catch (err){

            }


              // let messages = await find_messages({'type': 'received'}, 0, 5);
              //
              // for (n in messages.reverse()) {
            	// 	console.log(messages[n]);
              //   let hash = '';
              //
              //   if (messages[n].type == 'received') {
              //     hash = messages[n].conversation;
              //   } else {
              //     continue;
              //   }
              //   let avatar_msg = get_avatar(hash);
              //
              //   if (parseCall(messages[n].message, false, false).length == 0) {
              //     continue;
              //   }
              //   console.log( parseCall(messages[n].message, false, false) );
              //   $('#recent_private_messages .inner').append('<li id="' + messages[n].timestamp + '" timestamp="' + messages[n].timestamp + '" class="' + messages[n].type + '_message"><img class="message_avatar" src="data:image/svg+xml;base64,' + avatar_msg + '"><p>' + parseCall(messages[n].message, false, false) + '</p><span class="time">' + moment(messages[n].timestamp).fromNow() + '</span></li>');
              //   $('#recent_private_messages  .default').remove();
              //
              //     let magnetLinks = /(magnet:\?[^\s\"]*)/gmi.exec(messages[n].message);
              //     if (magnetLinks) {
              //       handleMagnetLink(magnetLinks, messages[n].timestamp);
              //     }
              //
              //
              // }

              ipcRenderer.send('get-profile');

						// window.setInterval(function(){
            //
						// },1000);
            //
						// let getting_new_conversations = false;
            //
            //
						// window.setInterval(function(){
            //
						//   if (!getting_new_conversations) {
						//     get_new_conversations(false);
						//   }
            //
						// },10333);




						let avatar_base64 = false;
						start_attempts = 0;
						while ((avatar_base64 == false || avatar_base64 == undefined) && start_attempts < 20) {
							start_attempts++;
							avatar_base64 = await loadWallets();
							await sleep(1000);

              // start of signing with sekr-addr
              // console.log('getting private key for ', currentAddr);
              // let private_key = await walletd.getSpendKeys(currentAddr);
              // private_key = private_key.body.result;
              // console.log(private_key);
              // const addr = await Address.fromAddress(currentAddr);
              // console.log(addr.spend.publicKey);
              // let sig = await xkrUtils.signMessage('hello', private_key.spendSecretKey)
              // console.log(sig);
              //
              // let re = await xkrUtils.verifyMessageSignature('hello', addr.spend.publicKey, sig);
              // console.log(re);
              // end of signing with sekr-address


						}

						if (!avatar_base64) {
							alert('Cant connect to node');
							$('#login-screen .saving').remove();
							ipcRenderer.send('kill-wallet');
							if (rmt.getGlobal('first_start')) {
								$('#create-account').hide();
								$('#login-screen').show();
							}
							return;
						}

						ipcRenderer.send('login-complete');

						window.clearInterval(int);

						$('#login_avatar').attr('src','data:image/svg+xml;base64,' + avatar_base64).addClass('shiny');

						await sleep(1000);


						$('overlay > *').fadeOut();

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


});


$('#board-menu .recent').click(function(){
    // $('#recent_messages').toggleClass('show');
    // $('#active_hugins').toggleClass('hidden');
    // $('.close_recent').toggleClass('show');
    // $('.box_header').text('Recent Messages');

    $('#board_title').text('Recent messages');
    $('.current').removeClass('current');

    if (!$('#recent_messages').hasClass('show') && $('#active_hugins').hasClass('hidden')) {
      $('#active_hugins').removeClass('hidden');
        $('#recent_messages').toggleClass('show');
    }
  $('#replyto_exit').click();
  $('#boards_messages').toggleClass('menu');
  if (!$('#modal').hasClass('hidden') || !$('#send_payment').hasClass('hidden')) {
    $('#boards_messages').addClass('menu');
  }
  trendingTags = [];
  current_board = '';
  board_posters = [];
  $('.box_header').find('h3').text('Active users');
  $('#active_hugins .tag').remove();
  $('#send_payment').addClass('hidden');
  $('#modal').addClass('hidden');
  let recent_msgs = $('#recent_messages').html();
  $('#boards_messages').empty().append(recent_msgs);
  $('.active_user').remove();
  $('#boards .board_message').each(function(index){
    let nickname = $(this).find('.boards_nickname').text();
    let address =  $(this).find('.board_message_pubkey').text();
    print_active_hugin(address, nickname);
    $('#boards_messages').scrollTop('#boards_messages').height();
    $(this).delay(index*100).animate({
      opacity: 1
    }, 150, function() {
      // Animation complete.
    });

  })
  $('#boards .in_board').click(function(){
    $('.current').removeClass('current');
    let recent_board = $(this).prop("classList")[1];
    $('#board_title').text($(this).text());
    current_board = '';
    let board_icon = $('.board_icon[invitekey='+ recent_board + ']');
    board_title = board_icon.attr('title');
    this_board = board_icon.attr('id');
    $('.board_icon[invitekey='+ recent_board + ']').addClass('current');
    print_board(recent_board);
  });
});


$('#join_board_button').click(function(){});

$('#boards_icon').click(function(){
  let reactions = {};
  misc.find({}, function (err,docs){
    if (docs[0]) {
      $('.boards_nickname_form').val(docs[0].nickname);
    }

  });
  if (!$('#boards').hasClass('hidden')) {

  return;
  } else {
    $('.active_user').remove();
    board_posters = [];
     print_board('0b66b223812861ad15e5310b4387f475c414cd7bda76be80be6d3a55199652fc');
     $('#board_title').text('Home');
 $("#boards-menu").fadeIn();
 $("#boards").removeClass('hidden');
 $("#messages_page").addClass('hidden');
 $("#new_board").removeClass('hidden');
 $("#avatar_contact").hide();
 $("#context_menu").hide();
 $("#boards_picker").removeClass('hidden');
 $('#boards .board_message').remove();
 $('#boards_messages').removeClass('menu');

 $('#modal').addClass('hidden');
 $('#replyto_exit').click();
 $('#send_payment').addClass('hidden');
 $('#home_board').addClass('current');

}

})

let current_reply_to = '';

let print_single_board_message = async (hash, selector) => {

  if (!hash) {
    return;
  }

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
     result = trimExtra(resp.result.tx.extra);
     // console.log(result);
     let hex_json = JSON.parse(fromHex(result));
     if (hex_json.b) {
       let key = $('.current').attr('inviteKey');
       let secretKey = naclUtil.decodeUTF8(key.substring(1, 33));

       let this_keyPair = nacl.box.keyPair.fromSecretKey(secretKey);
       // console.log(this_keyPair);
        hex_json = JSON.parse(naclUtil.encodeUTF8(nacl.box.open(fromHexString(hex_json.b), nonceFromTimestamp(hex_json.t), this_keyPair.publicKey, this_keyPair.secretKey)));
     }
     // console.log(hex_json);
     let this_addr = await Address.fromAddress(hex_json.k);
     let tips = 0;

     // console.log(this_addr);
     let verified = await xkrUtils.verifyMessageSignature(hex_json.m, this_addr.spend.publicKey, hex_json.s);
     // console.log(verified);
     //let verified = nacl.sign.detached.verify(naclUtil.decodeUTF8(hex_json.m), fromHexString(hex_json.s), fromHexString(hex_json.k));

     if (!verified) {
       return;
     }
     let avatar_base64 = get_avatar(hex_json.k);

      let addClasses = '';
      if (containsOnlyEmojis(hex_json.m)) {
        addClasses = 'emoji-message';
      }

      let message = escapeHtml(hex_json.m);

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
        $(selector).prepend('<li class="board_message ' + hash + '" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/png;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + hex_json.k + '</span></div>'+ image_attached + youtube_links +'<span class="time" timestamp="'+ timestamp*1000 +'">' + moment(timestamp*1000).fromNow() + '</span></li>');

      } else if (image_attached > 0 && youtube_links.length > 0) {

        $(selector).prepend('<li class="board_message ' + hash + '" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/png;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + hex_json.k + '</span></div><p class="' + addClasses + '">' + message + image_attached + youtube_links +'</p><span class="time" timestamp="'+ timestamp*1000 +'">' + moment(timestamp*1000).fromNow() + '</span></li>');


      } else  {
        $(selector).prepend('<li class="board_message ' + hash + '" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/png;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + hex_json.k + '</span></div><p class="' + addClasses + '">' + message + image_attached + youtube_links +'</p><span class="time" timestamp="'+ timestamp*1000 +'">' + moment(timestamp*1000).fromNow() + '</span></li>');
     }

     if (hex_json.n) {
       $(selector + ' .' + hash + ' .board_message_pubkey').before('<span class="boards_nickname">' + escapeHtml(hex_json.n) + '</span>');
       $(selector + ' .' + hash + ' .board_message_pubkey').css('display','none');
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
          let result_reply = trimExtra(resp_reply.result.tx.extra);
          let hex_json_reply = JSON.parse(fromHex(result_reply));

          // console.log(hex_json_reply);

          if (hex_json_reply.b) {

           let key = $('.board_icon.current').attr('invitekey');
           let secretKey = naclUtil.decodeUTF8(key.substring(1, 33));

           let this_keyPair = nacl.box.keyPair.fromSecretKey(secretKey);
           hex_json_reply = JSON.parse(naclUtil.encodeUTF8(nacl.box.open(fromHexString(hex_json_reply.b), nonceFromTimestamp(hex_json_reply.t), this_keyPair.publicKey, this_keyPair.secretKey)));

         }
           let this_addr = await Address.fromAddress(hex_json_reply.k);
           // console.log(this_addr);
           let verified_reply = await xkrUtils.verifyMessageSignature(hex_json_reply.m, this_addr.spend.publicKey, hex_json_reply.s);
           // console.log(verified);
          // let verified_reply = nacl.sign.detached.verify(naclUtil.decodeUTF8(hex_json_reply.m), fromHexString(hex_json_reply.s), fromHexString(hex_json_reply.k));

          if (!verified_reply) {
            return;
          }
          let avatar_base64_reply = get_avatar(hex_json_reply.k);
          let message_reply = hex_json_reply.m;

          $('#boards .' + hash + ' img').before('<div class="board_message_reply"><img class="board_avatar_reply" src="data:image/png;base64,' + avatar_base64_reply + '"><p>' + message_reply.substring(0,50)  +'..</p></div>');
          $(selector + ' .' + hash + ' .boards_nickname').css('top','58px');
          $(selector + ' .' + hash + ' .board_message_pubkey').css('top','58px');


     }

        if (tips) {
            $('#boards .' + hash).append('<span class="tips">' + parseFloat(tips/100000).toFixed(5) + '</span>');
        }


      $('#boards .' + hash + ' .board_message_pubkey').click(function(e){
        $('#boards_messages').addClass('menu');
        $('#board_box').removeClass('show');
        $('#board_box').addClass('hidden');
        e.preventDefault();
        let address = $(this).text();
        $('#payment_rec_addr').val(address);
        $('#payment_id').val(hash);
        $('#send_payment').removeClass('hidden');
        if (!$('#modal').hasClass('hidden')) {
          $('#modal').addClass('hidden');
          $('#boards_messages').addClass('menu');
        }


      })

     $('#boards .' + hash).click(function(){
       reply(hash);
       $(this).addClass('rgb');
       $('#boards').scrollTop('0');
       $('#board_box').removeClass('show');
       $('#board_box').addClass('hidden');
     });

     $('#boards .' + hash).delay(100).animate({
       opacity: 1
     }, 150, function() {
       // Animation complete.
     });



   } catch (err) {
     console.log('Error:', err)
     return;
   }

}

$('#replyto_exit').click(function(){

    $('#replyto').hide();
    $('#replyto_exit').hide();
    current_reply_to = '';
    $('#boards_message_form').attr('style','');
    $('.board_message').removeClass('rgb');

})




let handle_links = (message) => {
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
  return [message, youtube_links, image_attached];
} else {
  return [message,'',''];
}


}

let get_tips = async (hash) => {

  let tips = 0;

   let status = await walletd.getStatus();

   let blockCount = status.body.result.blockCount;

   let tx_data_reply = await fetch('http://' + rmt.getGlobal('node') + '/json_rpc', {
        method: 'POST',
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'f_transaction_json',
          params: {hash: hash}
        })
      });

      let block_height = await tx_data_reply.json();
      block_height = block_height.result.block.height;

  let transactions = await walletd.getTransactions(
    blockCount - block_height,
    block_height,
    '',
    [],
    hash);

    console.log('transactions', transactions);

   let blocks = transactions.body.result.items;


     for (block in blocks) {
       let block_txs = blocks[block].transactions;
       for (tx in block_txs) {
         let this_tx = block_txs[tx].amount;
            tips += this_tx;

       }
     }

     console.log('FOund tips:', tips);

      if (tips) {
          $('#boards .' + hash + '').append('<span class="tips">' + parseFloat(tips/100000).toFixed(5) + '</span>');
      }
}
let print_active_hugin = (address, nickname) => {

if (board_posters.indexOf(address) === -1) {
   board_posters.push(address);
   $('#active_hugins').append('<li class="active_user ' + address + '" id=""><div class="board_message_user"><span class="board_message_pubkey">' + address + '</span></div><img class="board_avatar" src="data:image/png;base64,' + get_avatar(address) + '"><span class="boards_nickname">' + escapeHtml(nickname) + '</span></li>');

 } else {
   let known_nickname = $('#active_hugins .' + address + ' .boards_nickname').text();
   if (nickname != known_nickname) {
     $('#active_hugins .' + address + ' .boards_nickname').text(nickname);
   }
 }
}

let print_hashtag = async (hashtag) => {
if (trendingTags.indexOf(hashtag) === -1) {
   trendingTags.push(hashtag);
   $('#active_hugins').prepend('<li class="tag"><span class="hashtag">' + hashtag + '</span></li>');
   $('#active_hugins .hashtag').click(function() {
     print_trending($(this).text());

   });

 } else {
   let tag = $('#active_hugins .hashtag').text();
   if (tag = hashtag) {
     return;
   }
 }
}

let reactions = {};

let print_board_message = async (hash, address, message, timestamp, fetching_board, nickname=false, reply=false, selector) => {
  let hashtag = true;
  try {


        if ($(selector + ' .' + hash).length) {
          return;
        }


  let tips = 0;

   // get_tips(hash);

  let avatar_base64 = get_avatar(address);

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
     $(selector).prepend('<li class="board_message ' + hash + '" id=""><div class="board_message_user"><span class="board_message_pubkey">' + address + '</span></div><img class="board_avatar" src="data:image/png;base64,' + avatar_base64 + '">'+ image_attached + youtube_links +'<span class="time" timestamp="'+ timestamp*1000 +'">' + moment(timestamp*1000).fromNow() + '</span></li>');

   } else if (image_attached > 0 && youtube_links.length > 0) {

     $(selector).prepend('<li class="board_message ' + hash + '" id=""><div class="board_message_user"><span class="board_message_pubkey">' + address + '</span></div><img class="board_avatar" src="data:image/png;base64,' + avatar_base64 + '"><p class="' + addClasses + '">' + message + youtube_links +'</p>'+ image_attached +'<span class="time" timestamp="'+ timestamp*1000 +'">' + moment(timestamp*1000).fromNow() + '</span></li>');


   } else  {

     if (hashtag) {
       let words = message.split(' ');
       try {
       for (word in words) {

         if (words[word].substring(0,1) == '#') {
           let hashtag = '<a class="hashtag">' + words[word] + '</a>';
           message = message.replace(words[word], hashtag);
         }
       }
       $(selector).prepend('<li class="board_message ' + hash + '" id=""><div class="board_message_user"><span class="board_message_pubkey">' + address + '</span></div><img class="board_avatar" src="data:image/png;base64,' + avatar_base64 + '"><p class="test">' + message + '</p>'+ image_attached +'<span class="time" timestamp="'+ timestamp*1000 +'">' + moment(timestamp*1000).fromNow() + '</span></li>');
     } catch (err) {
       console.log(err);
     }

   } else {
     $(selector).prepend('<li class="board_message ' + hash + '" id=""><div class="board_message_user"><span class="board_message_pubkey">' + address + '</span></div><img class="board_avatar" src="data:image/png;base64,' + avatar_base64 + '"><p class="' + addClasses + '">' + message + youtube_links +'</p>'+ image_attached +'<span class="time" timestamp="'+ timestamp*1000 +'">' + moment(timestamp*1000).fromNow() + '</span></li>');
  }
}

if (!nickname) {
  nickname = "Anonymous";
}
if ($('.board_icon[invitekey='+ fetching_board + ']').hasClass('current')) {

print_active_hugin(address, nickname);
}
  $(selector + ' .' + hash + ' .board_message_pubkey').before('<span class="boards_nickname">' + escapeHtml(nickname) + '</span>');
  $(selector + ' .' + hash).append('<div class="react_menu main"><i class="fa fa-smile-o"></div><div class="reactions"></div>');
  $(selector + ' .' + hash + ' .react_menu i').click(function(e){
    $(selector + ' .' + hash).click();
    $('.emoji-boards').click();
    e.preventDefault();
    e.stopPropagation();
  })
  if (reply) {

    if(containsOnlyEmojis(message) && message.length < 8) {
      let text_emoji = emojione.toShort(message).replaceAll(':','');
      let element = $('#boards .' + reply +' .'+text_emoji);
      let thisEmoji = text_emoji;
      let someTXhash = reply;
      let someAddr = address;
      let post_reactions = reactions[someTXhash];
      $(selector + ' .'+hash).remove();
          try {
            // Try to check if this address is in the list of reactors for this specific post and emoji
            if (element.height()) {
              let has_reacted = post_reactions[thisEmoji].indexOf(someAddr);
              if (has_reacted > -1) {
                  // Do nothing, user already made this reaction
                  return;
              } else {
                      // Somebody has reacted to this post before
                      reactions[someTXhash][thisEmoji] = [someAddr];
                      element.find('.counter').text(parseInt(element.find('.counter').text()) + 1);

              }
            } else {
                // Nobody has reacted with this emoji or to this post before
                if (reactions[someTXhash] === undefined ) {
                reactions = {[someTXhash]: [thisEmoji]};
                }
                reactions[someTXhash][thisEmoji] = [someAddr];
                $('#boards .' + reply +' .reactions').append('<i class="' + text_emoji +'">' + message + '<span class="counter">1</span></i>');
                $('#boards .' + reply +' .reactions .' + text_emoji).click(function(){
                  current_reply_to = reply;
                  sendBoardMessage(message);
                })
            }
          } catch (err) {
          console.log(err);

          }

    }





    boards_db.find({hash : reply}, async function (err,docs){

      let hex_json_reply;

        if (docs.length) {

           $(selector + ' .' + hash + ' .board_avatar').before('<div class="board_message_reply"><img class="board_avatar_reply" src="data:image/png;base64,' + get_avatar(docs[0].sender) + '"><p>' + docs[0].message.substring(0,50)  +'..</p></div>');

           $(selector + ' .' + hash + ' .boards_nickname').css('top','59px');


        } else {


          let tx_data_reply = await fetch('http://' + rmt.getGlobal('node') + '/json_rpc', {
               method: 'POST',
               body: JSON.stringify({
                 jsonrpc: '2.0',
                 method: 'f_transaction_json',
                 params: {hash: reply}
               })
             })

             const resp_reply = await tx_data_reply.json();

             console.log('resp_reply',resp_reply);

             let result_reply = trimExtra(resp_reply.result.tx.extra);
             hex_json_reply = JSON.parse(fromHex(result_reply));

              if (hex_json_reply.b) {

               let key = $('.board_icon.current').attr('invitekey');
               let secretKey = naclUtil.decodeUTF8(key.substring(1, 33));

               let this_keyPair = nacl.box.keyPair.fromSecretKey(secretKey);
               hex_json_reply = JSON.parse(naclUtil.encodeUTF8(nacl.box.open(fromHexString(hex_json_reply.b), nonceFromTimestamp(hex_json_reply.t), this_keyPair.publicKey, this_keyPair.secretKey)));
               console.log('Decrypted:', hex_json_reply);
             }
               let this_addr = await Address.fromAddress(hex_json_reply.k);
               // console.log(this_addr);
               let verified_reply = await xkrUtils.verifyMessageSignature(hex_json_reply.m, this_addr.spend.publicKey, hex_json_reply.s);
               // console.log(verified);
              // let verified_reply = nacl.sign.detached.verify(naclUtil.decodeUTF8(hex_json_reply.m), fromHexString(hex_json_reply.s), fromHexString(hex_json_reply.k));

              if (!verified_reply) {
                return;
              }


             let avatar_base64_reply = escapeHtml(get_avatar(hex_json_reply.k));
             let message_reply = escapeHtml(hex_json_reply.m);

             $(selector + ' .' + hash + ' .board_avatar').before('<div class="board_message_reply"><img class="board_avatar_reply" src="data:image/png;base64,' + avatar_base64_reply + '"><p>' + escapeHtml(message_reply.substring(0,50))  +'</p></div>');

             $(selector + ' .' + hash + ' .boards_nickname').css('top','59px');


        }

      })




  } else {
  }

  if (selector == '#recent_messages') {

    let to_board = '';

    if (fetching_board.substring(59,64) == '00000') {
      //public
      to_board = letter_from_spend_key(fetching_board);
      $('#recent_messages .' + hash + " .board_message_user" ).before('<span class="in_board ' + fetching_board + '">' + to_board.substring(0,22) + ' </span>');

    } else if (fetching_board == '0b66b223812861ad15e5310b4387f475c414cd7bda76be80be6d3a55199652fc') {
      to_board = 'Home';
      $('#recent_messages .' + hash + " .board_message_user" ).before('<span class="in_board ' + fetching_board + '">' + to_board.substring(0,22) + ' </span>');
    } else {


            await dictionary.find({ original: fetching_board }, async function (err,docs){

       			 console.log(docs)

       				 if (!docs.length == 0) {

       					 to_board = docs[0].translation;
               } else {
                 to_board = fetching_board;
               }
               $('#recent_messages .' + hash + " .board_message_user").before('<span class="in_board ' + fetching_board + '">' + to_board.substring(0,22) + ' </span>');


    })


    }


  }
  let this_hashtag = $(selector + ' .' + hash + ' .hashtag').text();
  console.log(this_hashtag);
  $(selector + ' .' + hash + ' .hashtag').click(function() {
    print_trending(this_hashtag);

  });

   $('#boards .' + hash + ' .boards_nickname').click(function(){
     $('#boards .' + hash + ' .board_message_pubkey').click();
   })

   $('#boards .' + hash + ' .board_message_pubkey').click(function(e){
     $('#boards_messages').addClass('menu');
     $('#board_box').removeClass('show');
     $('#board_box').addClass('hidden');
     e.preventDefault();
     let address = $(this).text();
     $('#payment_rec_addr').val(address);
     $('#payment_id').val(hash);
     $('#send_payment').removeClass('hidden');
     if (!$('#modal').hasClass('hidden')) {
       $('#modal').addClass('hidden');
       $('#boards_messages').addClass('menu');
     }


   })

   $('.board_message').hover(
     function () {
       $(this).find('.react_menu').show();
     },
     function () {
       $(this).find('.react_menu').hide();
     }
     );

  $('#boards .' + hash).click(function(){
    if ($(this).hasClass('loading_message')) {
    hash = $(this).prop("classList")[3];
    }
    reply_to_board_message(hash);
    if ($('#board_box').hasClass('show')) {
      $('#send_payment').addClass('hidden');
      $('#modal').addClass('hidden');
      $('#boards_messages').removeClass('menu');
    }
    $('#board_box').removeClass('show');
    $('#board_box').addClass('hidden');
    $(this).addClass('rgb');
    $('#boards').scrollTop('0');
  });


  $('#boards .' + hash).delay(100).animate({
    opacity: 1
  }, 150, function() {
    // Animation complete.
  });



} catch (err) {
  console.log('Error:', err)
  return;
}

//   let avatar_base64 = get_avatar(pubkey);
//
//    if (current_board != fetching_board) {
//      return;
//    }
//    let addClasses = '';
//    if (containsOnlyEmojis(message)) {
//      addClasses = 'emoji-message';
//    }
//
//    if (message.length < 1) {
//      return;
//    }
//
//
//    let links = handle_links(message);
//    message = links[0];
//    let youtube_links = links[1];
//    let image_attached = links[2];
//
//
//    if (append) {
//    if (message.length < 1 && youtube_links.length > 0) {
//      $('#boards_messages').append('<li class="board_message ' + timestamp*1000 + '" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + pubkey  + '</span></div>'+ image_attached + youtube_links +'<span class="time" timestamp="'+ timestamp*1000 +'">' + moment(timestamp*1000).fromNow() + '</span></li>');
//
//    } else if (image_attached > 0 && youtube_links.length > 0) {
//
//      $('#boards_messages').append('<li class="board_message ' + timestamp*1000 + '" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + pubkey  + '</span></div><p class="' + addClasses + '">' + message + image_attached + youtube_links +'</p><span class="time" timestamp="'+ timestamp*1000 +'">' + moment(timestamp*1000).fromNow() + '</span></li>');
//
//
//    } else  {
//      $('#boards_messages').append('<li class="board_message ' + timestamp*1000 + '" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + pubkey  + '</span></div><p class="' + addClasses + '">' + message + image_attached + youtube_links +'</p><span class="time" timestamp="'+ timestamp*1000 +'">' + moment(timestamp*1000).fromNow() + '</span></li>');
//   }
//
// } else {
//   if (message.length < 1 && youtube_links.length > 0) {
//     $('#boards_messages').prepend('<li class="board_message ' + timestamp*1000 + '" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + pubkey  + '</span></div>'+ image_attached + youtube_links +'<span class="time" timestamp="'+ timestamp*1000 +'">' + moment(timestamp*1000).fromNow() + '</span></li>');
//
//   } else if (image_attached > 0 && youtube_links.length > 0) {
//
//     $('#boards_messages').prepend('<li class="board_message ' + timestamp*1000 + '" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + pubkey  + '</span></div><p class="' + addClasses + '">' + message + image_attached + youtube_links +'</p><span class="time" timestamp="'+ timestamp*1000 +'">' + moment(timestamp*1000).fromNow() + '</span></li>');
//
//
//   } else  {
//     $('#boards_messages').prepend('<li class="board_message ' + timestamp*1000 + '" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + pubkey  + '</span></div><p class="' + addClasses + '">' + message + image_attached + youtube_links +'</p><span class="time" timestamp="'+ timestamp*1000 +'">' + moment(timestamp*1000).fromNow() + '</span></li>');
//  }
//   console.log('debagg', timestamp*1000);
//    $('.' + timestamp*1000).click(function(){
//      shell.openExternal($(this).attr('href'));
//    })
// }
//
//   if (nickname) {
//     $('.' + timestamp*1000 + ' .board_message_pubkey').before('<span class="boards_nickname">' + nickname + '</span>')
//   }
//
//   if (reply) {
//     // $('.' + hash + ' .board_message_pubkey').before('<span class="boards_nickname">' + hex_json.n + '</span>')
//     let tx_data_reply = await fetch('http://' + rmt.getGlobal('node') + '/json_rpc', {
//          method: 'POST',
//          body: JSON.stringify({
//            jsonrpc: '2.0',
//            method: 'f_transaction_json',
//            params: {hash: reply}
//          })
//        })
//
//        const resp_reply = await tx_data_reply.json();
//        let hex_json_reply = trimExtra(resp_reply.result.tx.extra);
//        // const addr = await Address.fromAddress(currentAddr);
//        let this_addr = await Address.fromAddress(hex_json_reply.k);
//        console.log(this_addr);
//        let verified_reply = await xkrUtils.verifyMessageSignature(hex_json_reply.m, this_addr.spend.publicKey, hex_json_reply.s);
//        console.log(verified);
//
//        if (!verified_reply) {
//          return;
//        }
//        let avatar_base64_reply = get_avatar(hex_json_reply.k);
//        let message_reply = hex_json_reply.m;
//
//        $('.' + toString(timestamp*1000) + ' img').before('<div class="board_message_reply"><img class="board_avatar_reply" src="data:image/svg+xml;base64,' + avatar_base64_reply + '"><p>' + message_reply.substring(0,55)  +'..</p></div>');
//
//
//   }
}

let last_board_message = '';

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
     result = trimExtra(resp.result.tx.extra);
		 let hex_json = JSON.parse(fromHex(result));
     console.log(hex_json);

		 if (hex_json.b) {

			 let key = transaction.transfers[0].publicKey;
			 let secretKey = naclUtil.decodeUTF8(key.substring(1, 33));

			 let this_keyPair = nacl.box.keyPair.fromSecretKey(secretKey);
			 hex_json = JSON.parse(naclUtil.encodeUTF8(nacl.box.open(fromHexString(hex_json.b), nonceFromTimestamp(hex_json.t), this_keyPair.publicKey, this_keyPair.secretKey)));

		 }

		 console.log('Debug me', hex_json);
     let thisHash = transaction.hash;
     hex_json.brd = transaction.transfers[0].publicKey;
     let time = escape(timestamp);

     // Save board message in db, returns false if message already existed in db
     let message_was_unknown = true;

     // console.log(hex_json);
     let this_addr = await Address.fromAddress(hex_json.k);
     // console.log(this_addr);
     let verified = await xkrUtils.verifyMessageSignature(hex_json.m, this_addr.spend.publicKey, hex_json.s);
     // console.log(verified);
		 // let verified = nacl.sign.detached.verify(naclUtil.decodeUTF8(hex_json.m), fromHexString(hex_json.s), fromHexString(hex_json.k));

		 if (!verified) {
			 return;
		 }

		 let to_board = hex_json.brd;
     await boards_db.find({hash : thisHash}, function (err,docs){

         if (docs.length == 0 && message) {

         save_boards_message(hex_json, time, thisHash, to_board);
         known_pool_txs.push(thisHash);

       } else {
         message_was_unknown = false;
         console.log('iknow');
         known_pool_txs.push(thisHash);
         return;
       }
     });



				      let message = escapeHtml(hex_json.m);

				      if (message.length < 1) {
				        return;
				      }

				 		 let name;

				     if (hex_json.n) {
				       name = escape(hex_json.n);
				     } else {
				 			name = 'Anonymous';
				 		}

				 		if (hex_json.k != currentAddr && message_was_unknown) {

              last_block_checked = thisHash;

				    //   notifier.notify({
				    //     title: name + " in " + to_board,
				    //     message: message,
				    //     icon: userDataDir + "/" +hex_json.k + ".png",
				    //     wait: true // Wait with callback, until user action is taken against notification
				    //   },function (err, response, metadata) {
				 		// 	 console.log(err, response, metadata);
				 		//  });
            //
				    // notifier.on('click', function(notifierObject, options) {
				    //   // Triggers if `wait: true` and user clicks notification
				 		// 	ipcRenderer.send('show-window');
            //
            //
				    // });

            if ($('.board_icon.current').attr('invitekey') == transaction.transfers[0].publicKey) {


              print_board_message(thisHash, hex_json.k, message, time, to_board, name, hex_json.r, '#boards_messages');

            }
            $('.board_icon[invitekey='+ hex_json.brd + ']').addClass('unread_board');
            $('#board_box .default').remove();
            print_board_message(thisHash, hex_json.k, message, time, to_board, name, hex_json.r, '#recent_messages');
				 }


			 })




let known_pool_txs = [];

async function backgroundSyncMessages() {

console.log('Background syncing...');

      let json = await fetch('http://' + rmt.getGlobal('node') + '/get_pool_changes_lite', {
           method: 'POST',
           body: JSON.stringify({
               knownTxsIds: known_pool_txs
           })
         })

         json = await json.json();
         console.log(json);

        // console.log(json);

        json = JSON.stringify(json).replaceAll('.txPrefix','').replaceAll('transactionPrefixInfo.txHash','transactionPrefixInfotxHash');

        // console.log('doc', json);

        json = JSON.parse(json);

        known_pool_txs = $(known_pool_txs).not(json.deletedTxsIds).get();

        let transactions = json.addedTxs;
        for (transaction in transactions) {

          try {

          let thisExtra = transactions[transaction].transactionPrefixInfo.extra;
          let thisHash = transactions[transaction].transactionPrefixInfotxHash;
          if (known_pool_txs.indexOf(thisHash) === -1) {
             known_pool_txs.push(thisHash);

           } else {
             console.log("This transaction is already known", thisHash);
             continue;
           }
            if (thisHash.length == 64) {
              boards_db.find({ hash: thisHash }, function (err, docs) {
                console.log(docs);
                  message_was_unknown = false;
                  if (docs.length == 0) {
                      message_was_unknown = true;
                      return;
                  } else {
                    known_pool_txs.push(thisHash);
                  }
             })

           } else {
                console.log('err', err);
               message_was_unknown = false;
               console.log('not a hash');
                return;
              }


           all_transactions = transactions;

           latest_transaction = await find_messages({}, 0, 1);
           let latest_transaction_time = 0;

             try {
           latest_transaction_time = latest_transaction[0].timestamp;
         } catch (e) {console.log(e);}

         all_transactions = all_transactions.filter(function (el) {
           return el != null;
         });

           console.log('THIS EXTRA', thisExtra);

          if (thisExtra.length > 200 && message_was_unknown) {

            let extra = trimExtra(thisExtra);
            let tx = JSON.parse(extra);
            known_keys = await find(keychain, {});


             if (tx.key && tx.t && tx.key != Buffer.from(keyPair.publicKey).toString('hex')) {

                 let senderKey = tx.key;

                 let box = tx.box;

                 let timestamp = tx.t;

                  let decryptBox = nacl.box.open(hexToUint(box), nonceFromTimestamp(timestamp), hexToUint(senderKey), keyPair.secretKey);

                 if (!decryptBox) {
                  console.log('Cant decrypt new conversation');
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

                 if (tx.box) {


                 // If no key is appended to message we need to try the keys in our payload_keychain

                 let box = tx.box
                 console.log('box', box);

                 let timestamp = tx.t;

                 let i = 0;

                 let decryptBox = false;


                 try {
                  decryptBox = await naclSealed.sealedbox.open(hexToUint(box),
                  nonceFromTimestamp(timestamp),
                  keyPair.secretKey);
                  } catch (err) {
                    console.log('timestamp', timestamp);
                    console.log(err);
                  }

                 while (i < known_keys.length && !decryptBox) {
                   console.log('Decrypting..');

                   let possibleKey = known_keys[i].key;
                   console.log('Trying key:', possibleKey);
                   i = i+1;
                   try {
                    decryptBox = nacl.box.open(hexToUint(box),
                    nonceFromTimestamp(timestamp),
                    hexToUint(possibleKey),
                    keyPair.secretKey);
                  } catch (err) {
                    // console.log('timestamp', timestamp);
                    console.log(err);
                    continue;
                  }
                  console.log('Decrypted:', decryptBox);


                   }

                   if (!decryptBox) {
                     console.log('Cannot decrypt..');
                     continue;
                   }


                   let message_dec = naclUtil.encodeUTF8(decryptBox);

                   payload_json = JSON.parse(message_dec);
                   payload_json.t = timestamp;
                   // console.log(payload_json);
                   if (payload_json.s) {

                     let this_addr = await Address.fromAddress(payload_json.from);

                     let verified = await xkrUtils.verifyMessageSignature(payload_json.msg, this_addr.spend.publicKey, payload_json.s);

                     if (!verified) {
                       continue;
                     }

                   }
                   if (payload_json.k) {
                     console.log('Found key!', payload_json);
                     keychain.find({ "key": payload_json.k }, function (err, docs) {

                       if (docs.length == 0) {

                         keychain.insert({ "key": payload_json.k, "address": payload_json.from });

                         }
                     });
                   } else {
                     console.log('No key :( ', payload_json);
                   }

                   console.log('saving this', payload_json);

                   save_message(payload_json);


                if (payload_json.t > latest_transaction_time) {


                 if ($('#recipient_form').val() == payload_json.from  && payload_json.from != $('#currentAddrSpan').text() ){

                   // If a new message is received, and it's from the active contacts
                   // this function will print the new message in the messages field.

                   // NOTE: Sent messages will be automatically printed by the send
                   // message function, not this one.

                   avatar_base64 = get_avatar(payload_json.from);
                   payload_json.msg = parseCall(payload_json.msg, payload_json.from);
                   let links = handle_links(payload_json.msg);
                   let display_message = links[0];
                   let youtube_links = links[1];
                   let image_attached = links[2];

                   if (payload_json.msg.length && $('#welcome_alpha').hasClass('hidden')) {
                     $('#messages').append('<li class="received_message" id=' + payload_json.t + '><img class="message_avatar" src="data:image/png;base64,' + avatar_base64 + '"><p>' + display_message +'</p>' + image_attached + youtube_links +' <span class="time" timestamp="' + payload_json.t + '">' + moment(payload_json.t).fromNow() + '</span></li>');
                     $('#messages_pane').scrollTop($('#messages').height());
                   }
                   console.log('debagg3', payload_json.t);
                   $('#'+ payload_json.t).click(function(){
                     shell.openExternal($(this).attr('href'));
                   })
                   let magnetLinks = /(magnet:\?[^\s\"]*)/gmi.exec(payload_json.msg);

                   if (magnetLinks) {
                     handleMagnetLink(magnetLinks, payload_json.t, true, payload_json.from);
                   }

                   // Scroll to bottom
                   $('#messages_pane').find('audio').remove();

                 } else if (payload_json.from != $('#currentAddrSpan').text() ) {
                   $('#messages_pane').find('audio').remove();
                   $('#messages_pane').append('<audio autoplay><source src="static/message.mp3" type="audio/mpeg"></audio>');


                   let magnetLinks = /(magnet:\?[^\s\"]*)/gmi.exec(payload_json.msg);

                   if (magnetLinks) {
                     handleMagnetLink(magnetLinks, payload_json.t, true, payload_json.from);
                   }
                   if (handleMagnetListed(payload_json.msg)) {
                     // console.log('my-addr:', $('.currentAddr').text());
                     // console.log('their-addr:', payload_json.from);
                     //
                     // console.log( 'waddafakk', payload_json.from != $('.currentAddr').text() );

                     await require("fs").writeFile(userDataDir + "/" +payload_json.from + ".png", get_avatar(payload_json.from, 'png'), 'base64', function(err) {
                       // console.log(err);
                     });
                    let actions = [];
                    if (payload_json.msg.substring(0,1) == "Δ" || payload_json.msg.substring(0,1) == "Λ") {
                      actions = ["Answer", "Decline"];
                    }
                     notifier.notify({
                       title: await get_translation(payload_json.from),
                       message: handleMagnetListed(parseCall(payload_json.msg, payload_json.from)),
                       icon: userDataDir + "/" +payload_json.from + ".png",
                       wait: true, // Wait with callback, until user action is taken against notification,
                      actions: actions
                     },function (err, response, metadata) {
                      // Response is response from notification
                      // Metadata contains activationType, activationAt, deliveredAt
                      console.log(response, metadata.activationValue, err);

                      if (response == 'activate') {
                        ipcRenderer.send('show-window');
                        print_conversation(payload_json.from);
                         $('#message_icon').click();
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
                   conversation_address = $('#currentAddrSpan').text();

                 } else {
                   // Received message
                   conversation_address = payload_json.from;
                 }




                 if ( $('.' + conversation_address).attr("address") == conversation_address ) {
                   // If there is a contact in the sidebar,
                   // then we update it, and move it to the top.

                   let listed_msg = handleMagnetListed(payload_json.msg);

                 if (listed_msg && payload_json.from != currentAddr) {
                 $('.' + conversation_address).find('.listed_message').text(listed_msg).parent().detach().prependTo("#messages_contacts");
                 if (payload_json.from != currentAddr) {
                   $('.' + conversation_address).addClass('unread_message');
                 }
                 }
               } else if (conversation_address != currentAddr) {
                 // If there isn't one, create one

                 if (!$('.' + conversation_address).width() && !$('.active_contact .' + conversation_address).width()) {
                   console.log('conversation_address', conversation_address);
                   $('#messages_contacts').prepend('<li class="active_contact unread_message ' + conversation_address + '" address="' + conversation_address + '"><img class="contact_avatar" src="data:image/png;base64,' + get_avatar(conversation_address) + '" /><span class="contact_address">' + conversation_address + '</span><br><span class="listed_message">'+handleMagnetListed(payload_json.msg)+'</li>');
               }}

             }
           } else {

             if (tx.b || tx.brd) {
              let hex_json;
             if (tx.b) {

             let known_keys = rmt.getGlobal('boards_addresses');

             for (board in known_keys) {

          			 let key = known_keys[board][1];
                 console.log('Trying key ', key);
                 try {
          			 let secretKey = naclUtil.decodeUTF8(key.substring(1, 33));


          			 let this_keyPair = nacl.box.keyPair.fromSecretKey(secretKey);
          			 hex_json = JSON.parse(naclUtil.encodeUTF8(nacl.box.open(fromHexString(tx.b), nonceFromTimestamp(tx.t), this_keyPair.publicKey, this_keyPair.secretKey)));
                 console.log('Decrypted:', hex_json);
                 let time = escape(tx.t);
                 let message = escapeHtml(hex_json.m);
                 to_board = escapeHtml(hex_json.brd);
                 save_boards_message(hex_json, time, thisHash, to_board);
               } catch (err) {
                 console.log('Couldnt encrypt..', err);
               }
             }

       		  } else {
             hex_json = tx;
             if (hex_json.brd == 'Home') {
               to_board =  '0b66b223812861ad15e5310b4387f475c414cd7bda76be80be6d3a55199652fc';
             } else {
             to_board = invite_code_from_ascii(hex_json.brd);
            }

       		 // console.log('Debug me', hex_json);
            // Save board message in db, returns false if message already existed in db
            let message_was_unknown = true;
            hex_json.h = thisHash;



            console.log('message_was_unknown', message_was_unknown);
            console.log(hex_json);
            let this_addr = await Address.fromAddress(hex_json.k);
            let verified = await xkrUtils.verifyMessageSignature(hex_json.m, this_addr.spend.publicKey, hex_json.s);
            if (!verified) {
                console.log('not verified');
              return;
            }
            // console.log(verified);
       		 // let verified = nacl.sign.detached.verify(naclUtil.decodeUTF8(hex_json.m), fromHexString(hex_json.s), fromHexString(hex_json.k));
         }

         let time = escape(parseInt(Date.now() / 1000));
         if (tx.b) {
          time = escape(parseInt(tx.t));
        }
            let senderKey = escape(hex_json.k);
            let message = escapeHtml(hex_json.m);



                    await require("fs").writeFile(userDataDir + "/" + senderKey + ".png", get_avatar(senderKey, 'png'), 'base64', function(err) {
       				        console.log(err);

       				      });

       				      if (message.length < 1) {
                      console.log('Empty message, skipping');
       				        return;
       				      }

       				 		 let name;

       				     if (hex_json.n) {
       				       name = escapeHtml(hex_json.n);
       				     } else {
       				 			name = 'Anonymous';
       				 		}

                  if ($('#recent_messages .board_message').length > 4) {
                    $('#recent_messages .board_message')[$('#recent_messages .board_message').length -1].remove();
                  }


                        let boards_addresses = rmt.getGlobal('boards_addresses');
                        let boards_keys = [];

                        for (address in boards_addresses) {
                          boards_keys.push(boards_addresses[address][1]);
                        }

                        if (boards_keys.indexOf(to_board) != -1) {
                        save_boards_message(hex_json, time, thisHash, to_board);
                        }

       				 		if (senderKey != currentAddr && message_was_unknown && to_board != $('.current').attr('invitekey') && boards_keys.indexOf(to_board) != -1) {
                    print_board_message(thisHash, senderKey, message, time, to_board, name, hex_json.r, '#recent_messages');
                     last_block_checked = transaction.hash;
                     $('#messages_pane').find('audio').remove();
                     $('#messages_pane').append('<audio autoplay><source src="static/boardmessage.mp3" type="audio/mpeg"></audio>');
                     $('.board_icon[invitekey='+ to_board + ']').addClass('unread_board');
       				      notifier.notify({
       				        title: name + " in " + to_board,
       				        message: message,
       				        icon: userDataDir + "/" + senderKey + ".png",
       				        wait: true // Wait with callback, until user action is taken against notification
       				      },function (err, response, metadata) {
       				 			 console.log(err, response, metadata);
       				 		 });

       				    notifier.on('click', function(notifierObject, options) {
       				      // Triggers if `wait: true` and user clicks notification
       				 			ipcRenderer.send('show-window');


       				    });

                   // if ($('.board_icon.current').attr('invitekey') == transaction.transfers[0].publicKey || $('.board_icon.current').attr('id') == "home_board") {
                   //
                   //   print_single_board_message(thisHash, '#boards_messages');
                   //
                   // }

                   // print_single_board_message(thisHash, '#board_box .inner');

       				 } if (senderKey != currentAddr && message_was_unknown && to_board == $('.current').attr('invitekey')) {
                 print_board_message(thisHash, senderKey, message, time, to_board, name, hex_json.r, '#boards_messages');
                 $('#boards .board_message').each(function(index){
                   console.log( index + ": " + $( this ).text() );
                   $(this).delay(index*100).animate({
                     opacity: 1
                   }, 150, function() {
                     // Animation complete.
                   });

                 })

               } else {
                 console.log('Already know about this message, skipping..');
               }



           } else {
             await sleep(200);
             console.log("Not a board nor box");
           }

      }
      }
          } else {
            console.log("Not a board or box");
          return;
          }
          } catch (err) {
          await sleep(sleepAmount);
          console.log(err);
          }
}
}


let global_nonce;

ipcRenderer.on('got-login-complete', async () => {

  walletd.getAddresses()
  .then(resp => {

    let thisAddr = resp.body.result.addresses[0];

  console.log($('#currentAddrSpan').text());
    boards_db.find({sender: { $ne: $('#currentAddrSpan').text()}}).sort({ timestamp: -1 }).limit(30).exec(function (err,docs){


      let boards_addresses = rmt.getGlobal('boards_addresses');
      let boards_keys = [];

      for (address in boards_addresses) {
        boards_keys.push(boards_addresses[address][1]);
      }

      console.log(boards_keys);
      let i = 0;
      let j = 0;

      for (doc in docs.reverse()) {
        // continue;
        console.log(docs[doc]);
        let hash = docs[doc].hash;
        let pubkey = docs[doc].sender;
        let message = docs[doc].message;
        let timestamp = docs[doc].timestamp;
        let fetching_board = $('.current').attr('id');
        let nickname = docs[doc].nickname;
        let this_reply = docs[doc].reply;

        if(!docs[doc].board || !message) {
          continue;
        }
        $('#board_box .default').remove();
        print_board_message(hash, pubkey, message, timestamp, docs[doc].board, nickname, this_reply, '#recent_messages');
        // i += 1;
        //
        // if (boards_keys.indexOf(docs[doc].board) === -1 && i < 55 && docs[doc].board) {
        //
        //   // if discovery channel
        //
        //
        //
        // } else if (j < 5) {
        //     print_board_message(hash, pubkey, message, timestamp, docs[doc].board, nickname, this_reply, '#board_box .inner');
        //     j += 1;
        // }



      }
      sleep(1000);
      check_protection();

    })

})

});

ipcRenderer.on('got-profile', async (event, json) => {
  $('#boards_picker').empty();
  await print_boards();




  // for (tx in json) {
  //   console.log(json[tx]);
  //   $('#board_box .default').remove();
  //   let hash = json[tx].hash;
  //   console.log();
  //   let this_json_tx = json[tx];
  //   if (!hash) {
  //     continue;
  //   }
  //
  //   let tx_data = await fetch('http://' + rmt.getGlobal('node') + '/json_rpc', {
  //        method: 'POST',
  //        body: JSON.stringify({
  //          jsonrpc: '2.0',
  //          method: 'f_transaction_json',
  //          params: {hash: hash}
  //        })
  //      })
  //
  //      const resp = await tx_data.json();
  //      let timestamp = resp.result.block.timestamp;
  //      try {
  //      result = trimExtra(resp.result.tx.extra);
	// 		 // console.log(result);
  //      let hex_json = JSON.parse(fromHex(result));
	// 		 if (hex_json.b) {
  //        continue;
  //        // GET THIS TO SUPPORT PRIVATE BOARDS SOON!
	// 			 // let key = $('.current').attr('inviteKey');
	// 			 // let secretKey = naclUtil.decodeUTF8(key.substring(1, 33));
  //        //
	// 			 // let this_keyPair = nacl.box.keyPair.fromSecretKey(secretKey);
	// 			 // // console.log(this_keyPair);
	// 			 //  hex_json = JSON.parse(naclUtil.encodeUTF8(nacl.box.open(fromHexString(hex_json.b), nonceFromTimestamp(hex_json.t), this_keyPair.publicKey, this_keyPair.secretKey)));
	// 		 }
	// 		 // console.log(hex_json);
  //      let this_addr = await Address.fromAddress(hex_json.k);
  //      let tips = 0;
  //
  //      // console.log(this_addr);
  //      let verified = await xkrUtils.verifyMessageSignature(hex_json.m, this_addr.spend.publicKey, hex_json.s);
  //      // console.log(verified);
  //      //let verified = nacl.sign.detached.verify(naclUtil.decodeUTF8(hex_json.m), fromHexString(hex_json.s), fromHexString(hex_json.k));
  //
  //      if (!verified) {
  //        continue;
  //      }
  //      let avatar_base64 = get_avatar(hex_json.k);
  //
  //       let addClasses = '';
  //       if (containsOnlyEmojis(hex_json.m)) {
  //         addClasses = 'emoji-message';
  //       }
  //
  //       let message = escapeHtml(hex_json.m);
  //
  //       if (message.length < 1) {
  //         continue;
  //       }
  //
  //         geturl = new RegExp(
  //                 "(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){3,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))"
  //                ,"g"
  //              );
  //
  //       // Instantiate attachments
  //       // let youtube_links = '';
  //       // let image_attached = '';
  //
  //       // Find links
  //       // let links_in_message = message.match(geturl);
  //
  //       // Supported image attachment filetypes
  //       // let imagetypes = ['.png','.jpg','.gif', '.webm', '.jpeg', '.webp'];
  //
  //       // Find magnet links
  //       //let magnetLinks = /(magnet:\?[^\s\"]*)/gmi.exec(message);
  //
  //       //message = message.replace(magnetLinks[0], "");
  //
  //       // if (links_in_message) {
  //       //
  //       //   for (let j = 0; j < links_in_message.length; j++) {
  //       //
  //       //     if (links_in_message[j].match(/youtu/) || links_in_message[j].match(/y2u.be/)) { // Embeds YouTube links
  //       //       message = message.replace(links_in_message[j],'');
  //       //       embed_code = links_in_message[j].split('/').slice(-1)[0].split('=').slice(-1)[0];
  //       //       youtube_links += '<div style="position:relative;height:0;padding-bottom:42.42%"><iframe src="https://www.youtube.com/embed/' + embed_code + '?modestbranding=1" style="position:absolute;width:80%;height:100%;left:10%" width="849" height="360" frameborder="0" allow="autoplay; encrypted-media"></iframe></div>';
  //       //     } else if (imagetypes.indexOf(links_in_message[j].substr(-4)) > -1 ) { // Embeds image links
  //       //       message = message.replace(links_in_message[j],'');
  //       //       image_attached_url = links_in_message[j];
  //       //       image_attached = '<img class="attachment" src="' + image_attached_url + '" />';
  //       //     } else { // Embeds other links
  //       //       message = message.replace(links_in_message[j],'<a target="_new" href="' + links_in_message[j] + '">' + links_in_message[j] + '</a>');
  //       //     }
  //       //   }
  //       // }
  //
  //
  //
  //       // if (message.length < 1 && youtube_links.length > 0) {
  //       //   $('#board_box .inner').append('<li class="board_message ' + hash + '" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + hex_json.k + '</span></div>'+ image_attached + youtube_links +'<span class="time">' + moment(timestamp*1000).fromNow() + '</span></li>');
  //       //
  //       // } else if (image_attached > 0 && youtube_links.length > 0) {
  //       //
  //       //   $('#board_box .inner').append('<li class="board_message ' + hash + '" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + hex_json.k + '</span></div><p class="' + addClasses + '">' + message + image_attached + youtube_links +'</p><span class="time">' + moment(timestamp*1000).fromNow() + '</span></li>');
  //       //
  //       //
  //       // } else  {
  //       // console.log('bef', json[tx].transfers.get(0));
  //       // console.log();
  //       let to_board = '';
  //       for (let [key, value] of json[tx].transfers.entries()) {
  //         to_board = letter_from_spend_key(key);
  //       }
  //
  //
  //
  //       await dictionary.find({ original: to_board }, async function (err,docs){
  //
  //  			 console.log(docs)
  //
  //  				 if (!docs.length == 0) {
  //
  //  					 to_board = docs[0].translation;
  //          }
  //
  //
  //       $('#board_box .inner').append('<li class="board_message ' + hash + '" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/svg+xml;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + hex_json.k + '</span><span class="in_board"> in ' + to_board + ' </span></div><p class="' + addClasses + '">' + message +'</p><span class="time" timestamp="'+ timestamp*1000 +'">' + moment(timestamp*1000).fromNow() + '</span></li>');
  //      // }
  //
  //      if (hex_json.n) {
  //        $('#board_box .' + hash + ' .board_message_pubkey').before('<span class="boards_nickname">' + escapeHtml(hex_json.n) + '</span>')
  //      }
  //
  //      if (hex_json.r) {
  //        // $('.' + hash + ' .board_message_pubkey').before('<span class="boards_nickname">' + hex_json.n + '</span>')
  //        let tx_data_reply = await fetch('http://' + rmt.getGlobal('node') + '/json_rpc', {
  //             method: 'POST',
  //             body: JSON.stringify({
  //               jsonrpc: '2.0',
  //               method: 'f_transaction_json',
  //               params: {hash: hex_json.r}
  //             })
  //           })
  //
  //           const resp_reply = await tx_data_reply.json();
  //           let result_reply = trimExtra(resp_reply.result.tx.extra);
  //           let hex_json_reply = JSON.parse(fromHex(result_reply));
  //
	// 					// console.log(hex_json_reply);
  //
	// 					if (hex_json_reply.b) {
  //
	// 		 			 let key = $('.board_icon.current').attr('invitekey');
	// 		 			 let secretKey = naclUtil.decodeUTF8(key.substring(1, 33));
  //
	// 		 			 let this_keyPair = nacl.box.keyPair.fromSecretKey(secretKey);
	// 		 			 hex_json_reply = JSON.parse(naclUtil.encodeUTF8(nacl.box.open(fromHexString(hex_json_reply.b), nonceFromTimestamp(hex_json_reply.t), this_keyPair.publicKey, this_keyPair.secretKey)));
  //
	// 		 		 }
  //            let this_addr = await Address.fromAddress(hex_json_reply.k);
  //            // console.log(this_addr);
  //            let verified_reply = await xkrUtils.verifyMessageSignature(hex_json_reply.m, this_addr.spend.publicKey, hex_json_reply.s);
  //            // console.log(verified);
  //           // let verified_reply = nacl.sign.detached.verify(naclUtil.decodeUTF8(hex_json_reply.m), fromHexString(hex_json_reply.s), fromHexString(hex_json_reply.k));
  //
  //           if (verified_reply) {
  //
  //             let avatar_base64_reply = get_avatar(hex_json_reply.k);
  //             let message_reply = hex_json_reply.m;
  //
  //             $('#board_box .' + hash + ' img').before('<div class="board_message_reply"><img class="board_avatar_reply" src="data:image/svg+xml;base64,' + avatar_base64_reply + '"><p>' + message_reply.substring(0,55)  +'..</p></div>');
  //
  //           }
  //
  //
  //
  //      }
  //
  //         if (tips) {
  //             $('#board_box .' + hash + '').append('<span class="tips">' + parseFloat(tips/100000).toFixed(2) + '</span>');
  //         }
  //
  //
  //       $('#board_box .' + hash + ' .board_message_pubkey').click(function(e){
  //         // e.preventDefault();
  //         //
  //         // let address = $(this).text();
  //         // $('#payment_rec_addr').val(address);
  //         // $('#payment_id').val(hash);
  //         // $('#send_payment').removeClass('hidden');
  //
  //       })
  //
  //      $('#board_box .' + hash + '').click(function(){
  //        // reply(hash);
  //        // $(this).addClass('rgb');
  //        // $('#boards').scrollTop('0');
  //      });
  //
  //
  //    });
  //    } catch (err) {
  //      console.log('Error:', err)
  //      continue;
  //    }
  //
  // }

});

ipcRenderer.on('got-boards', async (event, json) => {

  console.log('got-boards triggerd');

  let fetching_board = current_board;

	let printing_nonce = Date.now();

	global_nonce = printing_nonce;

  $('#boards .board_message').remove();

  let thisBlockCount = 0;
  if (thisBlockCount == 0) {

    let status = await walletd.getStatus();
    thisBlockCount = status.body.result.blockCount;
  }
  for (tx in json) {
    let hash = json[tx].hash;
    console.log();
    let this_json_tx = json[tx];
    if (!hash) {
      continue;
    }

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
       result = trimExtra(resp.result.tx.extra);
			 // console.log(result);
       let hex_json = JSON.parse(fromHex(result));
			 if (hex_json.b) {
				 let key = $('.current').attr('inviteKey');
				 let secretKey = naclUtil.decodeUTF8(key.substring(1, 33));

				 let this_keyPair = nacl.box.keyPair.fromSecretKey(secretKey);
				 // console.log(this_keyPair);
				  hex_json = JSON.parse(naclUtil.encodeUTF8(nacl.box.open(fromHexString(hex_json.b), nonceFromTimestamp(hex_json.t), this_keyPair.publicKey, this_keyPair.secretKey)));
			 }
			 // console.log(hex_json);
       let this_addr = await Address.fromAddress(hex_json.k);
       let tips = 0;




         // console.log(thisBlockCount);
         // console.log(this_json_tx);
         // console.log(hash);

        let transactions = await walletd.getTransactions(
          thisBlockCount - this_json_tx.blockHeight,
          this_json_tx.blockHeight,
          '',
          [],
          hash);


         let blocks = transactions.body.result.items;

         // console.log('transactions', transactions);

           for (block in blocks) {
             let block_txs = blocks[block].transactions;
             for (tx in block_txs) {
               let this_tx = block_txs[tx].amount;
                  tips += this_tx;

             }
           }



       // console.log(this_addr);
       let verified = await xkrUtils.verifyMessageSignature(hex_json.m, this_addr.spend.publicKey, hex_json.s);
       // console.log(verified);
       //let verified = nacl.sign.detached.verify(naclUtil.decodeUTF8(hex_json.m), fromHexString(hex_json.s), fromHexString(hex_json.k));

       if (!verified) {
         continue;
       }
       let avatar_base64 = get_avatar(hex_json.k);

        if (printing_nonce != global_nonce) {
          return;
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
          $('#boards_messages').append('<li class="board_message ' + hash + '" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/png;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + hex_json.k + '</span></div>'+ image_attached + youtube_links +'<span class="time" timestamp="'+ timestamp*1000 +'">' + moment(timestamp*1000).fromNow() + '</span></li>');

        } else if (image_attached > 0 && youtube_links.length > 0) {

          $('#boards_messages').append('<li class="board_message ' + hash + '" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/png;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + hex_json.k + '</span></div><p class="' + addClasses + '">' + message + image_attached + youtube_links +'</p><span class="time" timestamp="'+ timestamp*1000 +'">' + moment(timestamp*1000).fromNow() + '</span></li>');


        } else  {
          $('#boards_messages').append('<li class="board_message ' + hash + '" id=""><div class="board_message_user"><img class="board_avatar" src="data:image/png;base64,' + avatar_base64 + '"><span class="board_message_pubkey">' + hex_json.k + '</span></div><p class="' + addClasses + '">' + message + image_attached + youtube_links +'</p><span class="time" timestamp="'+ timestamp*1000 +'">' + moment(timestamp*1000).fromNow() + '</span></li>');
       }

       if (hex_json.n) {
         $('#boards .' + hash + ' .board_message_pubkey').before('<span class="boards_nickname">' + escapeHtml(hex_json.n) + '</span>');
       }

       if (hex_json.r) {
          $('#boards .' + hash + ' .boards_nickname').css('top','50px');
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
            let result_reply = trimExtra(resp_reply.result.tx.extra);
            let hex_json_reply = JSON.parse(fromHex(result_reply));

						// console.log(hex_json_reply);

						if (hex_json_reply.b) {

			 			 let key = $('.board_icon.current').attr('invitekey');
			 			 let secretKey = naclUtil.decodeUTF8(key.substring(1, 33));

			 			 let this_keyPair = nacl.box.keyPair.fromSecretKey(secretKey);
			 			 hex_json_reply = JSON.parse(naclUtil.encodeUTF8(nacl.box.open(fromHexString(hex_json_reply.b), nonceFromTimestamp(hex_json_reply.t), this_keyPair.publicKey, this_keyPair.secretKey)));

			 		 }
             let this_addr = await Address.fromAddress(hex_json_reply.k);
             // console.log(this_addr);
             let verified_reply = await xkrUtils.verifyMessageSignature(hex_json_reply.m, this_addr.spend.publicKey, hex_json_reply.s);
             // console.log(verified);
            // let verified_reply = nacl.sign.detached.verify(naclUtil.decodeUTF8(hex_json_reply.m), fromHexString(hex_json_reply.s), fromHexString(hex_json_reply.k));

            if (!verified_reply) {
              continue;
            }
            let avatar_base64_reply = get_avatar(hex_json_reply.k);
            let message_reply = hex_json_reply.m;

            $('#boards .' + hash + ' img').before('<div class="board_message_reply"><img class="board_avatar_reply" src="data:image/png;base64,' + avatar_base64_reply + '"><p>' + escapeHtml(message_reply.substring(0,50))  +'..</p></div>');

            $('#boards .' + hash + ' .board_message_pubkey').css('top','78px');




       }

          if (tips) {
              $('#boards .' + hash + '').append('<span class="tips">' + parseFloat(tips/100000).toFixed(5) + '</span>');
          }


        $('#boards .' + hash + ' .board_message_pubkey').click(function(e){
          $('#boards_messages').addClass('menu');
          e.preventDefault();
          let address = $(this).text();
          $('#payment_rec_addr').val(address);
          $('#payment_id').val(hash);
          $('#send_payment').removeClass('hidden');
          $('#board_box').removeClass('show');
          $('#board_box').addClass('hidden');
          if (!$('#modal').hasClass('hidden')) {
            $('#modal').addClass('hidden');
            $('#boards_messages').addClass('menu');
          }


        })

       $('#boards .' + hash).click(function(){
         reply(hash);
         $(this).addClass('rgb');
         $('#boards').scrollTop('0');
       });



     } catch (err) {
       console.log('Error:', err)
       return;
     }
   }
 })
