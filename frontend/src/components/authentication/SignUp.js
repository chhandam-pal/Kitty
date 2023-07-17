import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";

import { createBrowserHistory } from "history";

const SignUp = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [name, setname] = useState();
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [pic, setpic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const history = createBrowserHistory();

  const postDetails = (pics) => {
    setloading(true);

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "kitty01");
      data.append("cloud_name", "duykb6a35");
      fetch("https://api.cloudinary.com/v1_1/duykb6a35/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setpic(data.url.toString());
          console.log(data);
          setloading(false);
        })
        .catch((e) => {
          console.log(e);
          setloading(false);
        });
    } else {
      toast({
        title: "Failed to Upload Pic",
        status: "warning",

        duration: 5000,
        isClosable: true,
      });
      setloading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setloading(true);
    if (!name || !email || !password) {
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
        "/api/user",
        { name, email, password, pic },
        config
      );
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
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Please Enter Your Name"
          onChange={(e) => setname(e.target.value)}
        />
      </FormControl>
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
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button colorScheme={"blue"} onClick={submitHandler} isLoading={loading}>
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
