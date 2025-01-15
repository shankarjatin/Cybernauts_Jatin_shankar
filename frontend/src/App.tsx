import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import MainVisualization from "./components/MainVisualization";
import Sidebar from "./components/Sidebar";
import UserForm from "./components/UserForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { Menu } from "lucide-react";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Provider store={store}>
      <div className="flex h-screen bg-[#1E1E2F]">
        {/* Hamburger Menu */}
        <div className="lg:hidden p-4">
          <button
            onClick={toggleSidebar}
            className="text-[#FFFFFF] bg-[#2A2A40] p-2 rounded-md focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Sidebar */}
        {isSidebarOpen && (
          <Sidebar className="h-full sticky top-0 lg:h-screen flex-shrink-0 lg:w-1/4 w-full" />
        )}

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          {/* User Form */}
          <div className="p-4 bg-[#1E1E2F] z-10 relative">
            <UserForm compact={true} />
          </div>

          {/* Visualization */}
          <div className="flex-1 p-4 overflow-auto">
            <MainVisualization />
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Provider>
  );
};

export default App;
