import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { history } from '~/App';
import { LOGIN } from '~/constants/routes';
import { checkSession, login, logout, recoverPassword, register, resetPassword, sendVerificationMail } from '~/services/api';
import socket from '~/socket/socket';
import { IError, IUser } from '~/types/types';
import { AppDispatch } from '../store/store2';
import { clearChat } from './chatSlice';
import { setError } from './errorSlice';
import { setLoading } from './loadingSlice';
import { clearNewsFeed } from './newsFeedSlice';
import { setVerificationMailError, setVerificationMailSentStatus } from './preferenceSlice';

type TAuthState = IUser | null;

const initialState: IUser | null = null as TAuthState;

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateAuthPicture: (state, action: PayloadAction<string>) => {
      if (state) {
        state = {
          ...state,
          profilePicture: action.payload
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(startCheckSession.fulfilled, (state, action: PayloadAction<IUser>) => {
      return action.payload;
    });

    builder.addCase(startLogin.fulfilled, (state, action: PayloadAction<IUser>) => {
      return action.payload;
    });

    builder.addCase(startLogout.fulfilled, (state, action) => {
      socket.emit('userDisconnect', state!.id);

      return null;
    });
  },
});

export const startCheckSession =  createAsyncThunk(
  'CHECK_SESSION',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ field: 'isCheckingSession', value: true }));

      const user = await checkSession();

      socket.on('connect', () => {
        socket.emit('userConnect', user.id);
        console.log('Client connected to socket.');
      });

      // Try to reconnect again
      socket.on('error', function () {
        socket.emit('userConnect', user.id);
      });

      dispatch(setLoading({ field: 'isCheckingSession', value: false }));

      return user;
    } catch (err) {
      dispatch(setLoading({ field: 'isCheckingSession', value: false }));
      dispatch(setError({ field: 'checkSessionError', value: err as IError}));

      return rejectWithValue(err as IError);
    }
  }
);

export const startLogin =  createAsyncThunk<
  IUser,
  { username: string; password: string },
  { rejectValue: IError, dispatch: AppDispatch}
>(
  'LOGIN',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ field: 'isLoggingIn', value: true }));
      dispatch(setError({ field: 'loginError', value: null }));

      const user = await login(payload.username, payload.password);

      socket.emit('userConnect', user.id);
      //           yield put(clearNewsFeed());
      dispatch(setLoading({ field: 'isLoggingIn', value: false }));

      return user;
    } catch (err) {
      dispatch(setLoading({ field: 'isLoggingIn', value: false }));
      dispatch(setError({ field: 'loginError', value: err  as IError}));

      return rejectWithValue(err as IError);
    }
  }
);

export const startRegister =  createAsyncThunk<
  IUser,
  { email: string; username: string; password: string },
  { rejectValue: IError, dispatch: AppDispatch}
>(
  'REGISTER',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ field: 'isRegistering', value: true }));
      dispatch(setError({ field: 'registerError', value: null }));

      const user = await register(payload);

      socket.emit('userConnect', user.id);
      //           yield put(clearNewsFeed());
      dispatch(setLoading({ field: 'isRegistering', value: false }));

      return user;
    } catch (err) {
      dispatch(setLoading({ field: 'isRegistering', value: false }));
      dispatch(setError({ field: 'registerError', value: err as IError }));

      return rejectWithValue(err as IError);
    }
  }
);

export const startLogout =  createAsyncThunk<
  { success: boolean },
  Function,
  { rejectValue: IError, dispatch: AppDispatch}
  >('LOGOUT', async (payload, { rejectWithValue, dispatch }) => {
  try {
    dispatch(setLoading({ field: 'isLoggingOut', value: true }));
    const res = await logout();

    dispatch(setLoading({ field: 'isLoggingOut', value: false }));
    dispatch(clearNewsFeed());
    dispatch(clearChat());

    payload && payload();

    return res;
  } catch (err) {
    dispatch(setLoading({ field: 'isLoggingOut', value: false }));
    dispatch(setError({ field: 'logoutError', value: err as IError }));

    return rejectWithValue(err as IError);
  }
});

export const startSendVerificationEmail =  createAsyncThunk('VERIFY_EMAIL', async (payload, { rejectWithValue, dispatch }) => {
  try {
    dispatch(setLoading({ field: 'isSendingVerificationMail', value: true }));
    dispatch(setError({ field: 'sendVerificationMail', value: null }));
    dispatch(setVerificationMailError(null));
    const res = await sendVerificationMail();

    dispatch(setLoading({ field: 'isSendingVerificationMail', value: false }));

    dispatch(setVerificationMailSentStatus(true));
    toast.success('Successfully sent verification mail. Please check your email!')
    return res;
  } catch (err) {
    dispatch(setLoading({ field: 'isSendingVerificationMail', value: false }));
    dispatch(setError({ field: 'sendVerificationMail', value: err as IError }));
    dispatch(setVerificationMailSentStatus(false));
    dispatch(setVerificationMailError(err));

    return rejectWithValue(err as IError);
  }
});

export const startRecoverPassword =  createAsyncThunk<
  { success: boolean },
  { username: string, successCallback?: () => void},
  { rejectValue: IError, dispatch: AppDispatch}
>('RECOVER_PASSWORD', async (payload, { rejectWithValue, dispatch }) => {
  try {
    dispatch(setLoading({ field: 'isRecoveringPassword', value: true }));
    dispatch(setError({ field: 'recoverPassword', value: null }));

    const res = await recoverPassword(payload.username);

    payload.successCallback && payload.successCallback();
    dispatch(setLoading({ field: 'isRecoveringPassword', value: false }));

    return res;
  } catch (err) {
    dispatch(setLoading({ field: 'isRecoveringPassword', value: false }));
    dispatch(setError({ field: 'recoverPassword', value: err as IError }));

    return rejectWithValue(err as IError);
  }
});

export const startResetPassword =  createAsyncThunk<
  { success: boolean },
  { user_id: string, token: string; password: string},
  { rejectValue: IError, dispatch: AppDispatch}
>('RESET_PASSWORD', async (payload, { rejectWithValue, dispatch }) => {
  try {
    dispatch(setLoading({ field: 'isResettingPassword', value: true }));
    dispatch(setError({ field: 'resetPassword', value: null }));

    const res = await resetPassword(payload.user_id, payload.token, payload.password);

    dispatch(setLoading({ field: 'isResettingPassword', value: false }));

    history.push(LOGIN);
    toast.success('Successfully reset password!');
    return res;
  } catch (err) {
    dispatch(setLoading({ field: 'isResettingPassword', value: false }));
    dispatch(setError({ field: 'resetPassword', value: err as IError }));

    return rejectWithValue(err as IError);
  }
});


// Action creators are generated for each case reducer function
export const { updateAuthPicture } = authSlice.actions

export default authSlice;
