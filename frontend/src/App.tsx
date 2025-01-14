import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Sidebar from './components/Sidebar';
import VisualizationArea from './components/VisualizationArea';
import UserForm from './components/UserForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <VisualizationArea />
      </div>
      <UserForm />
      <ToastContainer />
    </Provider>
  );
};

export default App;
