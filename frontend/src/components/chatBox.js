import React from "react";
import { ChatState } from "../context/chatProvider";
import { Box } from "@chakra-ui/react";
import SingleChats from "./singleChats";
const ChatBox = ({ fetchAgain, setfetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems={"center"}
      flexDir={"column"}
      p={3}
      w={{ base: "100%", md: "68%" }}
      bg="whiteAlpha.300"
      borderRadius={"10px"}
      borderWidth={"2px"}
      fontFamily={"Caveat"}
    >
      <SingleChats fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />
    </Box>
  );
};

export default ChatBox;
