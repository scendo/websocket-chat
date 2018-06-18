/**
 * remove a user from users
 *
 *  - Uses a combination of descructuring and spread operator to maintain immutability while deleting an objects key
 *  - deconstructing userId as removedUser
 *  - spreading the remaining key/values as remainingUsers
 *
 * @param {*} users
 * @param {*} userId
 */
export const unsetUser = (users, userId) => {
  const { [userId]: removedUser, ...remainingUsers } = users;
  return remainingUsers;
};

/**
 * Checks if a given user is in a room
 */
export const isUserInRoom = (room, userId) => {
  return room.users.includes(userId);
};

/**
 * Reduces rooms by group
 */
export const getRoomsByGroup = (rooms, group) => {
  return rooms[group].reduce((obj, roomId) => {
    return {
      ...obj,
      [roomId]: rooms[roomId]
    };
  }, {});
};

/**
 * Returns a direct message room given an array of rooms and a userId
 */
export const getDirectMessage = (directRooms, userId) => {
  return Object.values(directRooms).find((room, index) => {
    return isUserInRoom(room, userId);
  });
};

/**
 * Updates a direct message room's name b/c dm names dynamically generated
 * The name is = to the user's name the client is directly messaging
 */
export const setDirectMessageName = ({ room, currentUser, users }) => {
  //Get dm user
  const dmUserId = room.users.find(
    (userId, index) => userId !== currentUser.id
  );
  const dmUser = users[dmUserId];
  return { ...room, name: dmUser.name };
};

/**
 * Return the UserMeta key that holds user meta data for a given a room
 *
 * @param {*} roomId
 */
export const getRoomMetaKey = roomId => {
  return `room_${roomId}`;
};
