import React from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Avatar from "~/components/shared/Avatar";
import { closeChat, initiateChat } from "~/redux/slice/chatSlice";
import { useAppDispatch } from "~/redux/store/store2";
import { IRootState } from "~/types/types";


const MinimizedChats = () => {
  const dispatch = useAppDispatch();
  const chats = useSelector((state: IRootState) => state.chats.items);

  const onClickClose = (username: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(closeChat(username))
  }

  return (
    <div className="p-4 absolute bottom-0 right-0">
      <TransitionGroup component={null}>
        {chats.map(chat => chat.minimized && (
          <CSSTransition
            timeout={500}
            classNames="fade"
            key={chat.username}
          >
            <div
              key={chat.username}
              onClick={() => dispatch(initiateChat(chat))}
              title={chat.username}
              className="relative group"
            >
              <div className="absolute h-[70px] w-[250px] p-4 rounded-md right-10 top-0 bottom-0 my-auto hidden group-hover:flex flex-col bg-white dark:bg-indigo-950 group-hover:z-0 shadow-md">
                {chat.fullname && <p className="text-xs text-gray-600 dark:text-gray-500">{chat.fullname}</p>}
                <h6 className=" dark:text-indigo-400">@{chat.username}</h6>
              </div>
              <div
                className="w-4 h-4 rounded-full cursor-pointer absolute top-0 right-0 hidden group-hover:opacity-80 group-hover:flex items-center justify-center bg-red-600 z-10"
                onClick={onClickClose(chat.username)}
                title="Close"
              >
                <IoMdClose className="text-white text-xs" />
              </div>
              <Avatar
                url={typeof chat.profilePicture === 'string' ? chat.profilePicture : chat.profilePicture?.url}
                size="lg"
                className="cursor-pointer shadow-md hover:border-2 hover:border-indigo-500 hover:opacity-90  mr-2 my-4 border border-indigo-700 relative z-10"
              />
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};

export default MinimizedChats;

