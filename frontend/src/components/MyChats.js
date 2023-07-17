import React, { useEffect, useState } from "react";
import { ChatState } from "../context/chatProvider";
import { Box, Stack, Text, Tooltip, useToast } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import axios from "axios";
import { getSender } from "../config/chatLogic";

const MyChats = ({ fetchAgain }) => {
  const [loggeduser, setloggeduser] = useState();
  const { user, selectedChat, setselectedChat, chats, setchats } = ChatState();
  const toast = useToast();
  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      console.log(data);
      setchats(data);
    } catch (e) {
      console.log(e.message.body);
      toast({
        title: "OhNo! Some Error Occured",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  useEffect(() => {
    setloggeduser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir={"column"}
        alignItems={"center"}
        bg="whiteAlpha.500"
        w={{ base: "100%", md: "31%" }}
        borderRadius="20px"
        borderWidth={"3px"}
      >
        <Box
          display="flex"
          pb={4}
          px={4}
          fontFamily={"Caveat"}
          fontSize={{ base: "30px", md: "35px" }}
          justifyContent={"space-between"}
          alignItems={"center"}
          fontWeight={"bold"}
          w={"100%"}
        >
          My Chats
          <Tooltip
            label="My Chats"
            hasArrow
            placement="bottom-end"
            align="center"
          >
            <Button
              alignContent={"center"}
              p={"15px"}
              m={"7px 0 7px 0"}
              bg="whiteAlpha.400"
            >
              <i class="fa-solid fa-message fa-bounce fa-2xl"></i>
            </Button>
          </Tooltip>
        </Box>
        <Box
          display="flex"
          flexDir="column"
          p={3}
          w="100%"
          h={"100%"}
          borderRadius={"10px"}
          overflowY={"hidden"}
        >
          {chats ? (
            <Stack overflowY="scroll">
              {chats.map((chat) => (
                <Box
                  onClick={() => setselectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#333766" : "silver"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={5}
                  borderRadius="lg"
                  fontFamily={"Caveat"}
                  key={chat._id}
                  fontSize={"30px"}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggeduser, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs">
                      <b>{chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
              ))}
            </Stack>
          ) : (
            <span>hemmm</span>
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats;
