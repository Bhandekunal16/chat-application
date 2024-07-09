import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route as RouteV6,
} from "react-router-dom";
import ChatApp from "./component/dashboard";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      <Router>
        <div>
          <Routes>
            <RouteV6 path="" element={<ChatApp />} />
          </Routes>
        </div>
      </Router>
      <Analytics />
    </>
  );
}

export default App;
