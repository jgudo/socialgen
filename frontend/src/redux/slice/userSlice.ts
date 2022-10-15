import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUser } from '~/services/api';
import { IError, IProfile, IUserState } from '~/types/types';
import { AppDispatch } from '../store/store2';
import { setError } from './errorSlice';
import { setLoading } from './loadingSlice';

const initialState: IUserState = {
  data: null,
  posts: []
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(startFetchUser.fulfilled, (state, action: PayloadAction<IProfile>) => {
      return {
        ...state,
        data: action.payload
      };
    });
  }
});

export const startFetchUser = createAsyncThunk<
  IProfile,
  string,
  { rejectValue: IError, dispatch: AppDispatch }
>(
  'FETCH_USER_PROFILE',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ field: 'isFetchingUser', value: true }));
      dispatch(setError({ field: 'fetchUserError', value: null }));

      const user = await getUser(payload);

      dispatch(setLoading({ field: 'isFetchingUser', value: false }));

      return user;
    } catch (err) {
      dispatch(setLoading({ field: 'isFetchingUser', value: false }));
      dispatch(setError({ field: 'fetchUserError', value: err as IError }));

      return rejectWithValue(err as IError);
    }
  }
);

export default userSlice
