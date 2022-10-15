import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IError, TErrorField, TErrorState } from '~/types/types';

const initialState: TErrorState = {
  checkSessionError: null,
  loginError: null,
  logoutError: null,
  registerError: null,

  getNewsFeedError: null,
  createPostError: null,
  fetchUserError: null,
  fetchProfileError: null,
  fetchSuggestedPeopleError: null,
  fetchUserPostsError: null,
  fetchFollowersError: null,
  fetchFollowingError: null,
  fetchBookmarksError: null,
  sendVerificationMail: null,
  recoverPassword: null,
  resetPassword: null,

}

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<{ field: TErrorField, value: IError | null}>) => {
      state[action.payload.field] = action.payload.value;
    }
  },
});

export const { setError } = errorSlice.actions

export default errorSlice
