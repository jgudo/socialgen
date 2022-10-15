import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IChatItemsState, IChatState, IMessage, PartialBy } from '~/types/types';

const initialState: IChatState = {
  active: '',
  items: []
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    minimizeChat: (state, action: PayloadAction<string>) => {
      return {
          active: '',
          items: state.items.map((chat) => {
              if (chat.username === action.payload) {
                  return {
                      ...chat,
                      minimized: true
                  }
              }
              return chat;
          })
      }
    },
    closeChat: (state, action: PayloadAction<string>) => {
      return {
          active: '',
          items: state.items.filter(chat => chat.username !== action.payload)
      }
    },
    clearChat: () => {
      return initialState;
    },
    appendNewMessage: (state, action: PayloadAction<{ target: string, message: IMessage}>) => {
      return {
          ...state,
          items: state.items.map(chat => chat.username !== action.payload.target ? chat : {
              ...chat,
              chats: [...chat.chats, action.payload.message]
          })
      }
    },
    getMessagesSuccess: (state, action: PayloadAction<{ target: string, messages: IMessage[]}>) => {
      return {
        ...state,
        items: state.items.map(chat => chat.username !== action.payload.target ? chat : {
            ...chat,
            offset: (chat.offset || 0) + 1,
            chats: [...action.payload.messages, ...chat.chats]
        })
      }
    },
    initiateChat: (state, action: PayloadAction<PartialBy<IChatItemsState, 'offset' | 'minimized' | 'chats'>>) => {
      const exists = state.items.some(chat => (chat.id as unknown) === action.payload.id);
      const newChatItem = {
          username: action.payload!.username,
          id: action.payload.id,
          profilePicture: action.payload.profilePicture,
          minimized: false,
          fullname: action.payload.fullname,
          chats: [],
          offset: 0
      };

      const MAX_ACTIVE_CHATS = 4;
      const hasReachedLimitChats = state.items.length === MAX_ACTIVE_CHATS;


      if (!exists) {
          // Delete first and set minimized to true
          const mapped = state.items.map(chat => ({
              ...chat,
              minimized: true
          }));
          const deletedFirstItem = mapped.splice(1);
          // All minimized chats
          const minimizedChats = state.items.map(chat => ({
            ...chat,
            minimized: true
          }))

          return {
              active: action.payload.id,
              items: hasReachedLimitChats
                  ? [...deletedFirstItem, newChatItem]
                  : [...minimizedChats, newChatItem]
          }
      } else {
          return {
              active: action.payload.id,
              items: state.items.map((chat) => {
                  if (chat.id === action.payload.id) {
                      return {
                          ...chat,
                          minimized: false
                      }
                  }

                  return {
                      ...chat,
                      minimized: true
                  };
              })
          };
      }
    }
  },
});

// Action creators are generated for each case reducer function
export const { minimizeChat, closeChat, initiateChat, clearChat, appendNewMessage, getMessagesSuccess } = chatSlice.actions

export default chatSlice
