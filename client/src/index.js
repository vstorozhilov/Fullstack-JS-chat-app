import React from 'react';
import ReactDOM from 'react-dom/client';
import { MainContainer } from './Routes';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Theme from './contexts/Theme';
import { Provider } from 'react-redux';
import { store } from './reducers';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={Theme}>
        <MainContainer />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
