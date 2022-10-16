import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IComment, IPost, IPreferenceState } from '~/types/types';

const initialState: IPreferenceState = {
  theme: 'light',
  targetComment: null,
  targetPost: null,
  hasSentVerificationMail: false,
  isOpenVerificationMessage: true,
  sendVerificationMailError: null,
}

export const preferenceSlice = createSlice({
  name: 'preference',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    setTargetPost: (state, action: PayloadAction<IPost | null>) => {
      state.targetPost = action.payload
    },
    setTargetComment: (state, action: PayloadAction<IComment | null>) => {
      state.targetComment = action.payload
    },
    setVerificationMailSentStatus: (state, action: PayloadAction<boolean>) => {
      state.hasSentVerificationMail = action.payload;
    },
    setVerificationMailError: (state, action: PayloadAction<any>) => {
      state.sendVerificationMailError = action.payload;
    },
    closeVerificationMessage: (state, action: PayloadAction) => {
      state.isOpenVerificationMessage = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTheme, setTargetComment, closeVerificationMessage, setTargetPost, setVerificationMailSentStatus, setVerificationMailError } = preferenceSlice.actions

export default preferenceSlice
