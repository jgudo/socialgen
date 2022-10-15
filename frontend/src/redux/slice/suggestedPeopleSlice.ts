import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getSuggestedPeople } from '~/services/api';
import { IAPIParams, IError, IProfile, ISuggestedPeopleState } from '~/types/types';
import { AppDispatch } from '../store/store2';
import { setError } from './errorSlice';
import { setLoading } from './loadingSlice';

const initialState: ISuggestedPeopleState = {
  items: [],
  offset: 0,
}

export const suggestedPeopleSlice = createSlice({
  name: 'suggestedPeople',
  initialState,
  reducers: {
    clearSuggestedPeople: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(startGetSuggestedPeople.fulfilled, (state, action: PayloadAction<{ users: IProfile[]; offset: number}>) => {
      const { users, offset } = action.payload;

      return {
        items: offset <= 0 ? users : [ ...state.items, ...users ],
        offset: state.offset + offset
      }
    });
  }
});

export const startGetSuggestedPeople = createAsyncThunk<
  { users: IProfile[]; offset: number},
  IAPIParams,
  { rejectValue: IError, dispatch: AppDispatch}
>('GET_SUGGESTED_PEOPLE', async (payload, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ field: 'isFetchingSuggestedPeople', value: true }));
      dispatch(setError({ field: 'fetchSuggestedPeopleError', value: null }));

      const users = await getSuggestedPeople(payload);

      console.log('ETOOO', users);

      dispatch(setLoading({ field: 'isFetchingSuggestedPeople', value: false }));

      return { users, offset: payload.limit && payload.limit > 0 ? 0 : 1};
    } catch (err) {
      dispatch(setLoading({ field: 'isFetchingSuggestedPeople', value: false }));
      dispatch(setError({ field: 'fetchSuggestedPeopleError', value: err as IError }));

      return rejectWithValue(err as IError);
    }
  }
);

// Action creators are generated for each case reducer function
export const { clearSuggestedPeople } = suggestedPeopleSlice.actions

export default suggestedPeopleSlice
