const socket = io();

//elements
const form = document.querySelector('#message');
const msgReceiver = document.querySelector('#msgReceiver');
const sendLocation = document.querySelector('#sendLocation');

//Templetes
const msgTemplete = document.querySelector('#msgTemplete').innerHTML;
const locationTemplete = document.querySelector('#locationTemplete').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//Option
const { userName, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//Socket
socket.emit('join', { userName, room }, (err) => {
  if (err) {
    alert(err);
    location.href = '/';
  }
});

socket.on('message', ({ userName, text, createdAt }) => {
  const html = Mustache.render(msgTemplete, {
    userName,
    text,
    createdAt: moment(createdAt).format('hh:mm A'),
  });

  msgReceiver.insertAdjacentHTML('beforeend', html);
});

socket.on('resendLocation', ({ userName, url, createdAt }) => {
  const html = Mustache.render(locationTemplete, {
    userName,
    url,
    createdAt: moment(createdAt).format('hh:mm A'),
  });

  msgReceiver.insertAdjacentHTML('beforeend', html);
  //locationReceiver.innerHTML = `<div>latitude: ${lat}, longitude: ${long}</div> <a href="https://google.com/maps?q=${lat},${long}">Google Maps Link</a>`;
});

socket.on('roomData', ({ room, users }) => {
  console.log(users);
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector('#sidebar').innerHTML = html;
});

//EventListener
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
        sendLocation.removeAttribute('disabled');
      }
    );
  });
});

// Send Counter project

// socket.on('countUpdated', (count) => {
//   console.log('The count has been updated!', count);
// });

// document.querySelector('#increment').addEventListener('click', () => {
//   console.log('clicked');
//   socket.emit('increment');
// });
