import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import { Button, ButtonGroup } from "@chakra-ui/react";

import Homepage from "./pages/Homepage";
import Chats from "./pages/chats";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Route path="/" component={Homepage} exact />
        <Route path="/chats" component={Chats} />
      </div>
    </BrowserRouter>
  );
}

export default App;
