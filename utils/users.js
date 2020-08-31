const users = [];

// Join user to chat
const userJoin = (id, username, room) => {
  const user = { id, username, room };

  users.push(user);
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
};
