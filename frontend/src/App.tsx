import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import MainVisualization from "./components/MainVisualization";
import Sidebar from "./components/Sidebar";
import UserForm from "./components/UserForm";
import "./index.css";

const App = () => {
  return (
    <Provider store={store}>
      <div className="flex flex-col lg:flex-row h-screen overflow-auto bg-[#1E1E2F]">
        {/* Sidebar */}
        <Sidebar className="h-full sticky top-0 lg:h-screen flex-shrink-0 lg:w-1/4 w-full" />

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
    </Provider>
  );
};

export default App;
