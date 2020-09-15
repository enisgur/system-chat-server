let users = [];

// Join user to chat
const userJoin = async (id, username, room) => {
  const user = { id, username, room };

  users.push(user);

  return user;
};

// Get Current User
const getCurrentUsser = (id) => {
  return users.find((user) => user.id === id);
};

// User Leaves
const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const userChangeRoom = async (id, usrname, room) => {
  const index = users.findIndex((user) => user.id === id);
  // const orjUser = await users.find((user) => user.id === id);

  let newUser = {
    id: id,
    username: usrname,
    room,
  };

  // if (index !== -1) {
  // newUser = {
  //   id: orjUser.id,
  //   username: orjUser.username,
  //   room,
  // };

  await users.splice(index, 1)[0];
  users.push(newUser);
  console.log("(((((((99999999999 : ", newUser);
  return newUser;
  // }
};
// Get room users
// const getRoomUsers = (room) {
// return users.filter (u)
// }

// Get Users
const getUsers = () => {
  return users;
};

module.exports = {
  userJoin,
  getCurrentUsser,
  userLeave,
  getUsers,
  userChangeRoom,
};
