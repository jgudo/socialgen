import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IModalState, TModalType } from '~/types/types';

const initialState: IModalState = {
  isOpenDeleteComment: false,
  isOpenDeletePost: false,
  isOpenEditPost: false,
  isOpenPostLikes: false
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: (state, action: PayloadAction<TModalType>) => {
      state[action.payload] = true;
    },
    hideModal: (state, action: PayloadAction<TModalType>) => {
      state[action.payload] = false;
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions

export default modalSlice;
