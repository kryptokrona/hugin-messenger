import { EmojiButton } from './node_modules/@joeattardi/emoji-button/dist/index.js';

const picker = new EmojiButton();
const trigger = document.querySelector('.trigger');


picker.on('emoji', selection => {
  $('#message_form').val($('#message_form').val() + selection.emoji);
});

trigger.addEventListener('click', () => picker.togglePicker(trigger));

const boards_picker = new EmojiButton();
const boards_trigger = document.querySelector('.emoji-boards');

boards_picker.on('emoji', selection => {
  $('#boards_message_form').val($('#boards_message_form').val() + selection.emoji);
});

boards_trigger.addEventListener('click', () => boards_picker.togglePicker(boards_trigger));
