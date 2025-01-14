import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';

// Find the root element
const rootElement = document.getElementById('root');

// Create the root with React 18's `createRoot` method
const root = ReactDOM.createRoot(rootElement!);

// Render the app
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
