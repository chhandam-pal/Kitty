import React, { useEffect, useRef, useState } from "react";
import { ChatState } from "../context/chatProvider";
import {
  Box,
  Text,
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Wrap,
  WrapItem,
  Spinner,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/react";
import { fullSender, getSender } from "../config/chatLogic";
import ProfileModal from "./page-components/ProfileModal";
import { ArrowRightIcon } from "@chakra-ui/icons";
import axios from "axios";
import ScrollableChats from "./scrollableChats";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChats = ({ fetchAgain, setfetchAgain }) => {
  const [messages, setmessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [newmessage, setnewmessage] = useState();
  const [socketConnected, setsocketConnected] = useState(false);
  const { user, selectedChat, setselectedChat, notification, setnotification } =
    ChatState();
  const messageEndRef = useRef(null);

  useEffect(() => {
    socket = io(ENDPOINT);
    console.log("bruhg");
    socket.emit("setup", user);
    socket.on("connected", () => setsocketConnected(true));
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setloading(true);
      const { data } = await axios.get(
        `api/message/${selectedChat._id}`,
        config
      );
      setmessages(data);
      setloading(false);
      console.log(data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error.message);
    }
  };
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newmessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setnewmessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newmessage,
            chatId: selectedChat._id,
          },
          config
        );

        console.log(data);
        socket.emit("new message", data);
        setmessages([...messages, data]);
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  const sendMessage1 = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setnewmessage("");
      const { data } = await axios.post(
        "/api/message",
        {
          content: newmessage,
          chatId: selectedChat._id,
        },
        config
      );
      console.log(data);
      socket.emit("new message", data);
      setmessages([...messages, data]);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const typeHandler = (e) => {
    setnewmessage(e.target.value);
  };
  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      console.log("ayya");
      console.log(newMessageReceived);
      if (
        selectedChatCompare &&
        selectedChatCompare._id === newMessageReceived.chat._id
      ) {
        setmessages([...messages, newMessageReceived]);
      }
    });
  });
  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [messages]);

  if (!socketConnected) return;
  //console.log(selectedChatCompare);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "40px", md: "50px" }}
            pb={2}
            px={4}
            w={"100%"}
            fontFamily={"Caveat"}
            d="flex"
            justifyContent="space-between"
            alignItems={"center"}
            fontWeight={"extrabold"}
            color={"white"}
          >
            {!selectedChat.isGroupChat ? (
              <>
                <ProfileModal user={fullSender(user, selectedChat.users)} />
                {getSender(user, selectedChat.users)}
              </>
            ) : (
              <>uhh</>
            )}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            w="100%"
            h="100%"
            overflowY={"auto"}
            borderRadius={"10px"}
            bg="whiteAlpha.600"
          >
            {loading ? (
              <>
                <Spinner
                  size="xl"
                  w={20}
                  h={20}
                  alignSelf={"center"}
                  margin="auto"
                />
              </>
            ) : (
              <div className="messages" style={{ overflowY: "auto" }}>
                <ScrollableChats messages={messages} />
                <div ref={messageEndRef} />
              </div>
            )}
          </Box>
          <Box
            display="flex"
            flexDir={"row"}
            justifyContent={"space-between"}
            alignItems={"bottom"}
            h={"10%"}
            w="100%"
            overflowY={"hidden"}
          >
            <FormControl
              onKeyDown={sendMessage}
              isRequired
              justifyContent={"space-between"}
              alignContent={"center"}
              bg="white"
              borderRadius={"10px"}
              h={"80%"}
            >
              <Input
                variant="filled"
                bg="white"
                placeholder="Enter your message"
                onChange={typeHandler}
                value={newmessage}
                fontSize={"30px"}
              ></Input>
            </FormControl>
            <Button
              d="flex"
              alignContent={"center"}
              p={"3px"}
              m={"0 0 0 20px"}
              bg="#333766"
              rightIcon={<ArrowRightIcon color="white" />}
              onClick={sendMessage1}
            ></Button>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"80px"} fontFamily={"Caveat"}>
            CLick on A User to start Chatting!!
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChats;
