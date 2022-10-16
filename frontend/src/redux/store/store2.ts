import { Action, AnyAction, combineReducers, configureStore, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSlice from '../slice/authSlice';
import chatSlice from '../slice/chatSlice';
import errorSlice from '../slice/errorSlice';
import loadingSlice from '../slice/loadingSlice';
import modalSlice from '../slice/modalSlice';
import newsFeedSlice from '../slice/newsFeedSlice';
import preferenceSlice from '../slice/preferenceSlice';
import profileSlice from '../slice/profileSlice';
import suggestedPeopleSlice from '../slice/suggestedPeopleSlice';

const preferenceConfig = {
  key: 'tracking',
  storage,
  blacklist: ['targetComment', 'targetPost', 'hasSentVerificationMail', 'sendVerificationMailError', 'isOpenVerificationMessage']
};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
  blacklist: ['preference']
};

const combinedReducers = combineReducers({
  auth: authSlice.reducer,
  newsFeed: newsFeedSlice.reducer,
  error: errorSlice.reducer,
  loading: loadingSlice.reducer,
  preference: persistReducer(preferenceConfig, preferenceSlice.reducer),
  chats: chatSlice.reducer,
  modal: modalSlice.reducer,
  profile: profileSlice.reducer,
  suggestedPeople: suggestedPeopleSlice.reducer
});

const persistedReducer = persistReducer(persistConfig, combinedReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: import.meta.env.VITE_NODE_ENV !== "production",
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>;

export type AppDispatch = typeof store.dispatch

export type AppThunk = ThunkAction<void, RootState, unknown, Action>

export const useAppDispatch = () => useDispatch<AppThunkDispatch>()
