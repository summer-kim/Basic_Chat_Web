const socket = io();
const form = document.querySelector('#message');
const display = document.querySelector('#display');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let input = e.target.elements.msgInput;
  socket.emit('message', input.value);
  input.value = '';
});

socket.on('message', (msg_received) => {
  display.innerHTML = msg_received;
});

// Send Counter project

// socket.on('countUpdated', (count) => {
//   console.log('The count has been updated!', count);
// });

// document.querySelector('#increment').addEventListener('click', () => {
//   console.log('clicked');
//   socket.emit('increment');
// });
