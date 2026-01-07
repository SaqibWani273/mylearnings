const EventEmitter = require("events");
class ChatRoom extends EventEmitter {
  constructor() {
    super();
    this.users = new Set();
  }
  join(user) {
    this.users.add(user);
    this.emit("join", user);
  }
  sendMessage(user, msg) {
    if (this.users.has(user)) {
      this.emit("message", msg, user);
    } else {
      //todo
      console.log(`Sorry ${user}, you need to join first`);
    }
  }
  leave(user) {
    if (this.users.has(user)) {
      this.users.delete(user);
      this.emit("leave", user);
    } else {
      //todo
      console.log(`Sorry ${user}, you need to join first`);
    }
  }
}

module.exports = ChatRoom;
