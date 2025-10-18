const ChatRoom = require("./chatroom");
const chat = new ChatRoom();
chat.on("join", (user) => console.log(`Mr. ${user} is here`));
chat.on("message", (user, msg) => console.log(`Mr. ${user}  says -> ${msg}`));
chat.on("leave", (user) => console.log(`Mr. ${user} has left`));

chat.join("Alice");
chat.join("boby");
chat.sendMessage("Alice", "Hello Everyone i am Alice");
chat.sendMessage("boby", "Hey i am boby");
chat.leave("Alice");
chat.sendMessage("Alice", "Hi, am i allowed to message");
