/**
 * Unsets/deletes a user given an object of users and a userId to unset
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
