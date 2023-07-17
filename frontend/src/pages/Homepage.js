import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../components/authentication/Login";
import SignUp from "../components/authentication/SignUp";
import { createBrowserHistory } from "history";

const Homepage = () => {
  const history = createBrowserHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
      history.push("/chats");
    }
  }, [history]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        w="100%"
        m="20px 0 10px 0"
        borderRadius="2xl"
        borderWidth="4px"
      >
        <Text fontSize="8xl" fontFamily="Caveat" color="white" align="center">
          Kitty
        </Text>
      </Box>
      <Box
        bg="whiteAlpha.600"
        w="100%"
        p={4}
        borderRadius="2xl"
        borderWidth={"4px"}
        borderBlockEndColor={"white"}
      >
        <Tabs variant="soft-rounded" colorScheme="green" color="white">
          <TabList mb="1em">
            <Tab color="white" w="50%" h="30%">
              Login
            </Tab>
            <Tab color="black" w="50%" h="30%">
              SignUp
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
