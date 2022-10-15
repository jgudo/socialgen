import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Avatar from '~/components/shared/Avatar';
import { displayTime } from '~/helpers/utils';
import { IMessage, IUser } from "~/types/types";

interface IProps {
  messages: IMessage[];
  handleReadMessage: (sender: IUser) => void;
  infiniteScrollRef: any
}

const MessagesList: React.FC<IProps> = (props) => {
  const { messages, handleReadMessage, infiniteScrollRef } = props;

  return (
    <div>
      {messages.length === 0 ? (
        <div className="text-center p-4">
          <p className="text-gray-400 italic">No Messages.</p>
        </div>
      ) : (
        <PerfectScrollbar className="max-h-80vh laptop:max-h-70vh overflow-y-scroll divide-y divide-gray-100 relative dark:divide-indigo-950">
          <TransitionGroup component={null}>
              {messages.map(message => (message.from && message.to) && (
                <CSSTransition
                  timeout={500}
                  classNames="fade"
                  key={message.id}
                >
                  <div
                    className={`flex justify-start cursor-pointer hover:bg-gray-100 dark:hover:bg-indigo-1100 border border-transparent dark:hover:border-indigo-700 px-2 py-3 relative ${(!message.seen && !message.isOwnMessage) && 'bg-indigo-100 dark:bg-indigo-1100 hover:bg-indigo-200'}`}
                    key={message.id}
                    onClick={() => handleReadMessage(message.isOwnMessage ? message.to : message.from)}
                    ref={infiniteScrollRef}
                  >
                    {/* --- IMAGE--- */}
                    <Avatar
                      url={!message.isOwnMessage ? (typeof message.from.profilePicture === 'string' ? message.from.profilePicture : message.from.profilePicture?.url) : (typeof message.to.profilePicture === 'string'  ? message.to.profilePicture : message.to.profilePicture?.url)}
                      size="lg"
                      className="flex-shrink-0 mr-4"
                    />
                    <div className="relative flex-grow">
                      {/* --- USERNAME --- */}
                      <h5 className={`${(!message.seen && !message.isOwnMessage) && 'font-bold text-gray-800 dark:text-white'} text-gray-500`}>
                        {!message.isOwnMessage ? message.from.username : message.to.username}
                      </h5>
                      {/* -- MESSAGE--- */}
                      <span className={`block max-w-16rem laptop:max-w-xs whitespace-nowrap overflow-hidden overflow-ellipsis ${(message.seen || message.isOwnMessage) ? 'text-gray-400' : 'text-indigo-600 dark:text-indigo-400 font-medium'} text-sm`}>
                        {message.isOwnMessage && 'You:'} {message.text}
                      </span>
                      {/* --- DATE --- */}
                      <span className="absolute right-4 top-0 text-1xs text-gray-400">
                        {displayTime(message.createdAt)}
                      </span>
                      {/* ---- SEEN ---- */}
                      {(message.isOwnMessage && message.seen) && (
                        <Avatar
                          className="absolute right-4 bottom-0"
                          size="xs"
                          url={typeof message.to.profilePicture === 'string'  ? message.to.profilePicture : message.to.profilePicture?.url}
                        />
                      )}
                      {/* --- BADGE ---- */}
                      {(!message.isOwnMessage && !message.seen) && (
                        <div className="absolute rounded-full  bottom-0 top-0 right-4 my-auto w-2 h-2 bg-red-600" />
                      )}
                    </div>
                  </div>
                </CSSTransition>
              )
              )}
          </TransitionGroup>
        </PerfectScrollbar>
      )}
    </div>
  );
};

export default MessagesList;
