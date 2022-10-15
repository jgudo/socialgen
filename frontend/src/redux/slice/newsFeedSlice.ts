import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { createPost, getNewsFeed } from '~/services/api';
import { IAPIParams, IError, INewsFeedState, IPost, IRootState } from '~/types/types';
import { AppDispatch } from '../store/store2';
import { setError } from './errorSlice';
import { setLoading } from './loadingSlice';
import { addPostToProfile } from './profileSlice';

const initialState: INewsFeedState = {
  items: [],
  offset: 0,
  hasNewFeed: false
};

export const newsFeedSlice = createSlice({
  name: 'newsFeed',
  initialState,
  reducers: {
    clearNewsFeed: () => {
      return initialState;
    },
    updateFeedPost: (state, action: PayloadAction<IPost>) => {
      return {
        ...state,
        items: state.items.map((post) => {
            if (post.id === action.payload.id) {
                return {
                    ...post,
                    ...action.payload
                };
            }

            return post;
        })
      }
    },
    updatePostLikes: (state, action: PayloadAction<{ postID: string, state: boolean, likesCount: number }>) => {
      return {
        ...state,
        items: state.items.map((post) => {
            if (post.id === action.payload.postID) {
                return {
                    ...post,
                    isLiked: action.payload.state,
                    likesCount: action.payload.likesCount
                };
            }
            return post;
        })
      }
    },
    deleteFeedPost: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        items: state.items.filter((post) => {
            if (post.id !== action.payload) {
                return post;
            }
        })
      }
    },
    setHintHasNewFeed: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        hasNewFeed: action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(startGetFeed.fulfilled, (state, action) => {
      return { ...state, items: [...state.items, ...action.payload], offset: state.offset + 1};
    });

    builder.addCase(startCreatePost.fulfilled, (state, action) => {
      return { ...state, items: [action.payload, ...state.items]};
    });
  },
});

export const startGetFeed =  createAsyncThunk<
  IPost[],
  IAPIParams,
  { rejectValue: IError, dispatch: AppDispatch}
>('GET_FEED', async (payload, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ field: 'isGettingFeed', value: true }));
      dispatch(setError({ field: 'getNewsFeedError', value: null }));

      const posts = await getNewsFeed(payload);

      dispatch(setLoading({ field: 'isGettingFeed', value: false }));

      return posts;
    } catch (err) {
      dispatch(setLoading({ field: 'isGettingFeed', value: false }));
      dispatch(setError({ field: 'getNewsFeedError', value: err as IError }));

      return rejectWithValue(err as IError);
    }
  }
);

export const startCreatePost =  createAsyncThunk<
  IPost,
  { formData: FormData, appendNewToProfile?: boolean},
  { rejectValue: IError, dispatch: AppDispatch, getState: any}
>('CREATE_POST', async (payload, { dispatch, getState, rejectWithValue }) => {
    try {
      const { auth, profile } = getState() as IRootState;

      toast.dark('Creating post...', { containerId: 'createPost' });

      dispatch(setLoading({ field: 'isCreatingPost', value: true }));
      dispatch(setError({ field: 'createPostError', value: null }));

      const posts = await createPost(payload.formData);

      dispatch(setLoading({ field: 'isCreatingPost', value: false }));

      toast.dismiss();
      toast.success('Successfully posted.');

      if (payload.appendNewToProfile && auth?.username === profile.data?.username) {
        dispatch(addPostToProfile(posts))
      }

      return posts;
    } catch (err) {
      dispatch(setLoading({ field: 'isCreatingPost', value: false }));
      dispatch(setError({ field: 'createPostError', value: err as IError }));

      return rejectWithValue(err as IError);
    }
  }
);

// Action creators are generated for each case reducer function
export const { clearNewsFeed, updateFeedPost, updatePostLikes, deleteFeedPost, setHintHasNewFeed } = newsFeedSlice.actions

export default newsFeedSlice;
