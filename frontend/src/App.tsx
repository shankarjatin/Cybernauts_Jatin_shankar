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
      <div className="flex h-screen bg-[#1E1E2F]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 bg-[#1E1E2F] z-10 relative">
            {/* User Form */}
            <UserForm compact={true} />
          </div>
          <div className="flex-1 p-4 -mt-4">
            {/* Visualization */}
            <MainVisualization />
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default App;