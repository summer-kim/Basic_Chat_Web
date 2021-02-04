const users = [];

const addUser = ({ id, userName, room }) => {
  //cleaning data
  userName = userName.trim().toLowerCase();
  userName = userName.replace(
    userName.charAt(0),
    userName.charAt(0).toUpperCase()
  );
  room = room.trim().toLowerCase();

  //Check if userName and room are null
  if (!userName || !room) {
    return { err: 'UserName and Room are required' };
  }

  //Check if userName is already used in same room
  const userExist = users.find(
    (user) => user.room === room && user.userName === userName
  );
  if (userExist) {
    return { err: 'UserName has already been used' };
  }

  //Store User
  const user = { id, userName, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
  // splice is more efficient than filter methods.
  //filter doesn't stop even though matching value has found
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const getUsersinRoom = (room) => {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersinRoom,
};
