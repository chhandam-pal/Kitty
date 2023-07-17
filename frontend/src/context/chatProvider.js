import { createContext, useContext, useEffect, useState } from "react";
import { createBrowserHistory } from "history";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setuser] = useState();
  const [selectedChat, setselectedChat] = useState();
  const [chats, setchats] = useState([]);
  const history = createBrowserHistory();
  const [notification, setnotification] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setuser(userInfo);

    if (!userInfo) {
      history.push("/");
    }
  }, [history]);
  return (
    <ChatContext.Provider
      value={{
        user,
        setuser,
        selectedChat,
        setselectedChat,
        chats,
        setchats,
        notification,
        setnotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
