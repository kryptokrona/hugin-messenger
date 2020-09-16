import { EmojiButton } from './node_modules/@joeattardi/emoji-button/dist/index.js';

const picker = new EmojiButton();
const trigger = document.querySelector('.trigger');

picker.on('emoji', selection => {
  $('#message_form').val($('#message_form').val() + selection.emoji);
});

trigger.addEventListener('click', () => picker.togglePicker(trigger));
