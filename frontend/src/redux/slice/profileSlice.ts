import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getBookmarks, getFollowers, getFollowing, getPosts, getUser } from '~/services/api';
import { IAPIParams, IBookmark, IError, IPost, IProfile, IUserState } from '~/types/types';
import { AppDispatch } from '../store/store2';
import { setError } from './errorSlice';
import { setLoading } from './loadingSlice';

const initialState: IUserState = {
  data: null,
  posts: [],
  postsOffset: 0,
  followers: [],
  followersOffset: 0,
  following: [],
  followingOffset: 0,
  bookmarks: [],
  bookmarksOffset: 0,
  developer: null
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfileInfo: (state, action: PayloadAction<IProfile>) => {
      const { payload: user } = action;

      return {
        ...state,
        data: {
          ...state.data,
          fullname: user.fullname,
          firstname: user.firstname,
          lastname: user.lastname,
          info: user.info
        }
      } as any
    },
    updateCoverPhoto: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        data: {
          ...state.data,
          coverPhoto: action.payload!
        }
      }
    },
    updateProfilePicture: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        data: {
          ...state.data,
          profilePicture: action.payload
        }
      }
    },
    updateProfilePostLikes: (state, action: PayloadAction<{ postID: string, state: boolean, likesCount: number }>) => {
      return {
        ...state,
        posts: state.posts.map((post) => {
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
    setPosts: (state, action: PayloadAction<IPost[]>) => {
      return {
        ...state,
        posts: action.payload
      }
    },
    addPostToProfile: (state, action: PayloadAction<IPost>) => {
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      }
    },
    deletePostFromProfile: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        posts: state.posts.filter((post) => {
            if (post.id !== action.payload) {
                return post;
            }
        })
      }
    },
    updatePostFromProfile: (state, action: PayloadAction<IPost>) => {
      return {
        ...state,
        posts: state.posts.map((post) => {
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
    setPostsOffset: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        postsOffset: action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(startFetchProfile.fulfilled, (state, action: PayloadAction<IProfile>) => {
      return {
        ...state,
        data: action.payload,
        developer: action.payload.username === 'jgudo' ? action.payload : state.developer
      };
    });
    builder.addCase(startGetPosts.fulfilled, (state, action: PayloadAction<IPost[]>) => {
      return { ...state, posts: [...state.posts, ...action.payload], postsOffset: state.postsOffset + 1};
    });
    builder.addCase(startGetFollowers.fulfilled, (state, action: PayloadAction<IProfile[]>) => {
      return { ...state, followers: [...state.followers, ...action.payload], followersOffset: state.followersOffset + 1};
    });
    builder.addCase(startGetFollowing.fulfilled, (state, action: PayloadAction<IProfile[]>) => {
      return { ...state, following: [...state.following, ...action.payload], followingOffset: state.followingOffset + 1};
    });
    builder.addCase(startGetBookmarks.fulfilled, (state, action: PayloadAction<IBookmark[]>) => {
      return { ...state, bookmarks: [...state.bookmarks, ...action.payload], bookmarksOffset: state.bookmarksOffset + 1};
    });
  }
});

export const startFetchProfile = createAsyncThunk<
  IProfile,
  string,
  { rejectValue: IError, dispatch: AppDispatch }
>(
  'FETCH_MY_PROFILE',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ field: 'isFetchingProfile', value: true }));
      dispatch(setError({ field: 'fetchProfileError', value: null }));

      const user = await getUser(payload);

      dispatch(setLoading({ field: 'isFetchingProfile', value: false }));

      return user;
    } catch (err) {
      dispatch(setLoading({ field: 'isFetchingProfile', value: false }));
      dispatch(setError({ field: 'fetchProfileError', value: err as IError }));

      return rejectWithValue(err as IError);
    }
  }
);

export const startGetPosts =  createAsyncThunk<
  IPost[],
  { username: string; params: IAPIParams},
  { rejectValue: IError, dispatch: AppDispatch}
>('GET_USER_POSTS', async (payload, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ field: 'isFetchingUserPosts', value: true }));
      dispatch(setError({ field: 'fetchUserPostsError', value: null }));

      const posts = await getPosts(payload.username, payload.params);

      dispatch(setLoading({ field: 'isFetchingUserPosts', value: false }));

      return posts;
    } catch (err) {
      dispatch(setLoading({ field: 'isFetchingUserPosts', value: false }));
      dispatch(setError({ field: 'fetchUserPostsError', value: err as IError }));

      return rejectWithValue(err as IError);
    }
  }
);

export const startGetFollowers =  createAsyncThunk<
  IProfile[],
  { username: string; params: IAPIParams},
  { rejectValue: IError, dispatch: AppDispatch}
>('GET_USER_FOLLOWERS', async (payload, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ field: 'isFetchingFollowers', value: true }));
      dispatch(setError({ field: 'fetchFollowersError', value: null }));

      const users = await getFollowers(payload.username, payload.params);

      dispatch(setLoading({ field: 'isFetchingFollowers', value: false }));

      return users;
    } catch (err) {
      dispatch(setLoading({ field: 'isFetchingFollowers', value: false }));
      dispatch(setError({ field: 'fetchFollowersError', value: err as IError }));

      return rejectWithValue(err as IError);
    }
  }
);

export const startGetFollowing =  createAsyncThunk<
  IProfile[],
  { username: string; params: IAPIParams},
  { rejectValue: IError, dispatch: AppDispatch}
>('GET_USER_FOLLOWING', async (payload, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ field: 'isFetchingFollowing', value: true }));
      dispatch(setError({ field: 'fetchFollowingError', value: null }));

      const users = await getFollowing(payload.username, payload.params);

      dispatch(setLoading({ field: 'isFetchingFollowing', value: false }));

      return users;
    } catch (err) {
      dispatch(setLoading({ field: 'isFetchingFollowing', value: false }));
      dispatch(setError({ field: 'fetchFollowingError', value: err as IError }));

      return rejectWithValue(err as IError);
    }
  }
);

export const startGetBookmarks =  createAsyncThunk<
  IBookmark[],
  IAPIParams,
  { rejectValue: IError, dispatch: AppDispatch}
>('GET_USER_BOOKMARKS', async (payload, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ field: 'isFetchingBookmarks', value: true }));
      dispatch(setError({ field: 'fetchBookmarksError', value: null }));

      const bookmarks = await getBookmarks(payload);

      dispatch(setLoading({ field: 'isFetchingBookmarks', value: false }));

      return bookmarks;
    } catch (err) {
      dispatch(setLoading({ field: 'isFetchingBookmarks', value: false }));
      dispatch(setError({ field: 'fetchBookmarksError', value: err as IError }));

      return rejectWithValue(err as IError);
    }
  }
);

export const { updateCoverPhoto, updateProfilePostLikes, updatePostFromProfile,
    addPostToProfile, deletePostFromProfile, updateProfilePicture,
    updateProfileInfo, setPosts, setPostsOffset } = profileSlice.actions

export default profileSlice
