import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import MainVisualization from './components/MainVisualization';
import Sidebar from './components/Sidebar';
import UserForm from './components/UserForm';

const App = () => {
    return (
        <Provider store={store}>
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <UserForm />
                    <MainVisualization />
                </div>
            </div>
        </Provider>
    );
};

export default App;
