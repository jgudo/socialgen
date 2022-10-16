import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TLoadingField, TLoadingState } from '~/types/types';

const initialState: TLoadingState = {
  isCheckingSession: true,
  isLoggingIn: false,
  isLoggingOut: false,
  isRegistering: false,

  isGettingFeed: false,
  isCreatingPost: false,
  isFetchingUser: false,
  isFetchingProfile: false,

  isFetchingSuggestedPeople: false,
  isFetchingUserPosts: false,
  isFetchingFollowers: false,
  isFetchingFollowing: false,
  isFetchingBookmarks: false,
  isSendingVerificationMail: false,
  isRecoveringPassword: false,
  isResettingPassword: false,

  isFetchingDev: false

}

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ field: TLoadingField, value: boolean}>) => {
      state[action.payload.field] = action.payload.value;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setLoading } = loadingSlice.actions

export default loadingSlice
