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
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-6">
            {/* User Form */}
            <UserForm />
          </div>
          <div className="flex-1 p-6">
            {/* Visualization */}
            <MainVisualization />
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default App;
