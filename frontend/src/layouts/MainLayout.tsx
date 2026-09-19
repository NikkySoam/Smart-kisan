import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot/Chatbot";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <main
        className="
          min-h-screen
          bg-[#f8f9ff]
          flex
          flex-col
        "
        role="main"
      >
        <Navbar />

        <div className="flex-1 overflow-y-auto app-content">
          <Outlet />
        </div>

        <Chatbot />
      </main>
    </div>
  );
};

export default MainLayout;
