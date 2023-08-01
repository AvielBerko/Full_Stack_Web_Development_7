import { BrowserRouter } from "react-router-dom";
import Router from "./components/router/router";
import TopNavbar from "./components/common/top-navbar";

function App() {
  return (
    <BrowserRouter>
      <TopNavbar />
      <Router />
    </BrowserRouter>
  );
}

export default App;
