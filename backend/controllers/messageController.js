const expressAsyncHandler = require("express-async-handler");
const Messages = require("../model/messageModel");
const User = require("../model/userModel");
const Chat = require("../model/chatModel");

const sendMessage = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Error occured");
    return res.status(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Messages.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat-user",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
});
const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Messages.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
  } catch (e) {
    res.json(400);
    throw new Error(e.message);
  }
});

module.exports = { sendMessage, allMessages };
