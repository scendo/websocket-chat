//Default Socket io Events
const ERROR = "error";
const CONNECT = "connect";
const DISCONNECT = "disconnect";
const DISCONNECTING = "disconnecting";
const NEW_LISTENER = "newListener";
const REMOVE_LISTENER = "removeListener";
const PING = "ping";
const PONG = "pong";

//Client Emits
const CHAT_SERVICE_START = "CHAT_SERVICE_START";
const ROOM_CREATE = "ROOM_CREATE";
const ROOM_CREATED = "ROOM_CREATED";
const ROOM_OPEN = "ROOM_OPEN";
const ROOM_USER_LEAVING = "ROOM_USER_LEAVING";
const MESSAGE_ADD = "MESSAGE_ADD";

//Server Emits
const USER_CONNECTED = "USER_CONNECTED";
const USER_DISCONNECTED = "USER_DISCONNECTED";
const ROOM_USER_JOINED = "ROOM_USER_JOINED";
const ROOM_USER_LEFT = "ROOM_USER_LEFT";
const MESSAGE_ADDED = "MESSAGE_ADDED";

module.exports = {
  ERROR,
  CONNECT,
  DISCONNECT,
  DISCONNECTING,
  NEW_LISTENER,
  REMOVE_LISTENER,
  PING,
  PONG,
  CHAT_SERVICE_START,
  ROOM_CREATE,
  ROOM_CREATED,
  ROOM_OPEN,
  ROOM_USER_LEAVING,
  MESSAGE_ADD,
  USER_CONNECTED,
  USER_DISCONNECTED,
  ROOM_USER_JOINED,
  ROOM_USER_LEFT,
  MESSAGE_ADDED
};
