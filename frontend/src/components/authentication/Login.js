import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Button,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { createBrowserHistory } from "history";
import axios from "axios";

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const history = createBrowserHistory();
  const submitHandler = async () => {
    setloading(true);
    if (!email || !password) {
      toast({
        title: "Please fill up all the fields",
        status: "warning",

        duration: 5000,
        isClosable: true,
      });
      setloading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      if (data) {
        toast({
          title: "Meowww! Welcome",
          status: "success",

          duration: 5000,
          isClosable: true,
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        setloading(false);
        history.push("/chats");
        window.location.reload(false);
      } else {
        toast({
          title: "Oops! Email Address or Password not found",
          status: "error",

          duration: 5000,
          isClosable: true,
        });
        setloading(false);
      }
    } catch (e) {
      toast({
        title: "Oops! Some Error Occured",
        status: "error",
        description: e.res.data.m,

        duration: 5000,
        isClosable: true,
      });
      setloading(false);
    }
  };
  return (
    <VStack spacing="5px" color={"blackAlpha.600"} fontSize={"3xl"}>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Please Enter Email Address"
          onChange={(e) => setemail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Please Enter password"
            onChange={(e) => setpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button colorScheme={"blue"} onClick={submitHandler} isLoading={loading}>
        Log In
      </Button>
    </VStack>
  );
};

export default Login;
