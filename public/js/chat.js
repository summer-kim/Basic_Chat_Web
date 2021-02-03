const socket = io();
const form = document.querySelector('#message');
const msgReceiver = document.querySelector('#msgReceiver');
const locationReceiver = document.querySelector('#locationReceiver');
const sendLocation = document.querySelector('#sendLocation');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let input = e.target.elements.msgInput;
  input.setAttribute('disabled', 'disabled');

  socket.emit('sendMessage', input.value, (err) => {
    input.removeAttribute('disabled');
    input.value = '';
    input.focus();
    if (err) {
      return console.log(err);
    }
  });
});

socket.on('message', (msg_received) => {
  msgReceiver.innerHTML = msg_received;
});

sendLocation.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert("Your Browser doesn't support Geolocation");
  }
  sendLocation.setAttribute('disabled', 'disabled');
  navigator.geolocation.getCurrentPosition((position) => {
    const coords = position.coords;
    socket.emit(
      'sendLocation',
      {
        lat: coords.latitude,
        long: coords.longitude,
      },
      () => {
        //Third parameter is acknowledgement
        console.log('geolocation is acknowledged');
        sendLocation.removeAttribute('disabled');
      }
    );
  });
});

socket.on('resendLocation', ({ lat, long }) => {
  locationReceiver.innerHTML = `<div>latitude: ${lat}, longitude: ${long}</div> <a href="https://google.com/maps?q=${lat},${long}">Google Maps Link</a>`;
});

// Send Counter project

// socket.on('countUpdated', (count) => {
//   console.log('The count has been updated!', count);
// });

// document.querySelector('#increment').addEventListener('click', () => {
//   console.log('clicked');
//   socket.emit('increment');
// });
