import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  Toast,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import ProfileModal from "./ProfileModal";
import { ChatState } from "../../context/chatProvider";
import { createBrowserHistory } from "history";
import axios from "axios";
import UserListItem from "./UserAvatar/UserListItem";
import { Spinner } from "@chakra-ui/spinner";
import { getSender } from "../../config/chatLogic";

const SideDrawer = () => {
  const [search, setsearch] = useState();
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingChat, setloadingChat] = useState(false);
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setnotification,
  } = ChatState();
  const history = createBrowserHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
    window.location.reload(false);
  };
  const handleSearch = async () => {
    try {
      setloading(true);
      axios
        .request({
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          method: "GET",
          url: `api/user?search=${search}`,
        })
        .then((res) => {
          setloading(false);
          setsearchResult(res.data);
          console.log(res.data);
        });
    } catch (e) {
      Toast({
        title: "Uhoh! failed to search",
        status: "error",

        duration: 5000,
        isClosable: true,
      });
    }
  };
  const accessChat = async (userId) => {
    try {
      setloadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("api/chat", { userId }, config);
      window.location.reload(false);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      console.log(data);
      console.log("hurray");
      setSelectedChat(data);

      setloadingChat(false);

      onClose();
    } catch (e) {
      Toast({
        title: "Uhoh! failed to fetch chats",
        status: "error",

        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div>
      <Box
        p={"5px"}
        display="flex"
        justifyContent={"space-between"}
        w="100%"
        borderRadius={"5px"}
        bg={"whiteAlpha.500"}
      >
        <Tooltip
          label="Search fellow kitties"
          hasArrow
          placement="bottom-end"
          align="center"
        >
          <Button
            alignContent={"center"}
            p={"10px"}
            m={"5px 0 5px 0"}
            alignSelf={"center"}
            onClick={onOpen}
          >
            <i class="fa-solid fa-cat fa-beat fa-2xl"></i>
            <Text
              display={{ base: "none", md: "flex" }}
              px="4"
              bg="whiteAplha.400"
            >
              Search for Fellow Kitties
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize="5xl"
          fontFamily="Caveat"
          color="black"
          align="center"
          fontWeight={"black"}
        >
          Kitty
        </Text>
        <div>
          <Menu alignSelf={"right"} alignContent={"center"}>
            <MenuButton p={3} m="5px 5px 0 0">
              <i
                class="fa-solid fa-bell fa-bounce fa-xl"
                style={{ color: "#eaeaec" }}
              ></i>
            </MenuButton>
            <MenuList>
              {!notification.length && "No New Messages"}
              {notification.map((not) => {
                <MenuItem key={not._id}>
                  {`New Message from: ${getSender(user, not.chat.user)}`}
                </MenuItem>;
              })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton p={3} m="5px 5px 0 0" onClick={() => {}}>
              <i class="fa-solid fa-user fa-beat fa-xl"></i>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem bg="skyblue">My Profile</MenuItem>
              </ProfileModal>
              {<MenuItem onClick={logoutHandler}>Log out</MenuItem>}
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen} bg="#333766">
        <DrawerOverlay />
        <DrawerContent _dark={"true"}>
          <DrawerHeader borderBottomWidth={"10px"}>
            Search Kiitties
          </DrawerHeader>
          <DrawerBody _dark={"#38B2AC"}>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search here"
                mr={2}
                value={search}
                onChange={(e) => setsearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <Stack>
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </Stack>
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
