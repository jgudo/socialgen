import React from 'react';
import { createRoot } from 'react-dom/client';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Provider } from 'react-redux';
import 'react-responsive-modal/styles.css';
import { PersistGate } from 'redux-persist/integration/react';
import '~/styles/app.css';
import App from './App';
import { Preloader } from './components/shared';
import { persistor, store } from './redux/store/store2';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <Provider store={store}>
      <PersistGate loading={<Preloader />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>,

);

// registerSW({
//   onNeedRefresh() { },
//   onOfflineReady() { },
// });
