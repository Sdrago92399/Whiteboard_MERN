import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import PersistentLoginWrapper from '@/components/PersistentLogin';
import './index.css'

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { CookiesProvider } from 'react-cookie';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
   <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <Provider store={store}>
        <PersistentLoginWrapper> 
          <App /> 
        </PersistentLoginWrapper>
      </Provider>
    </CookiesProvider>
  // </React.StrictMode>,
)
