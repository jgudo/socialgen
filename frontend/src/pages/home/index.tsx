import { CoffeeOutlined, UndoOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { shallowEqual, useSelector } from "react-redux";
import { Link, RouteComponentProps } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { withAuth } from "~/components/hoc";
import { CreatePostModal, PostItem, PostModals, SuggestedPeople } from "~/components/main";
import { Avatar, Loader, PostLoader } from "~/components/shared";
import { SUGGESTED_PEOPLE } from "~/constants/routes";
import { useDocumentTitle, useModal } from "~/hooks";
import { clearNewsFeed, setHintHasNewFeed, startGetFeed } from "~/redux/slice/newsFeedSlice";
import { useAppDispatch } from "~/redux/store/store2";
import socket from "~/socket/socket";
import { IPost, IRootState } from "~/types/types";
import DevCard from "./DevCard";
import SideMenu from "./SideMenu";

interface ILocation {
  from: string;
}

interface IProps extends RouteComponentProps<any, any, ILocation> {
  isAuth: boolean;
}

const Home: React.FC<IProps> = (props) => {
  const state = useSelector((state: IRootState) => ({
    newsFeed: state.newsFeed,
    auth: state.auth,
    error: state.error.getNewsFeedError,
    isLoadingFeed: state.loading.isGettingFeed,
    isCreatingPost: state.loading.isCreatingPost
  }), shallowEqual);
  const dispatch = useAppDispatch();
  const { isOpen, openModal, closeModal } = useModal();
  const from = props.location.state?.from || null;

  useDocumentTitle('Social Gen | Social Network');
  useEffect(() => {
    console.log('TRIGGER', from)
    if (state.newsFeed.items.length === 0 || from === '/') {
      dispatch(clearNewsFeed());
      dispatch(startGetFeed({ offset: 0 }));
    }

    socket.on('newFeed', () => {
      dispatch(setHintHasNewFeed(true));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.auth]);

  const fetchNewsFeed = () => {
    if (!state.isLoadingFeed) {
      dispatch(startGetFeed({ offset: state.newsFeed.offset }));
    }
  };

  const onClickNewFeed = () => {
    dispatch(clearNewsFeed());
    dispatch(startGetFeed({ offset: 0 }));
    dispatch(setHintHasNewFeed(false));
  }

  const [infiniteRef, { rootRef }] = useInfiniteScroll({
    loading: state.isLoadingFeed,
    hasNextPage: !state.error && state.newsFeed.offset > 0,
    onLoadMore: fetchNewsFeed,
    disabled: !!state.error,
    rootMargin: '0px 0px 100px 0px',
  });

  return (
    <div className={`laptop:px-6% pt-20 flex items-start ${!props.isAuth && 'justify-center'}`}>
      {/*  --- SIDE MENU --- */}
      {props.isAuth && (
        <div className="hidden laptop:block laptop:w-1/4 laptop:sticky laptop:top-20 mr-4 space-y-4">
          <SideMenu />
          <DevCard />
        </div>
      )}
      <div className="w-full laptop:w-2/4 relative">
        {/* --- CREATE POST INPUT ---- */}
        {props.isAuth && (
          <div className="flex items-center justify-start mb-4 p-4 rounded-md bg-white shadow-sm dark:bg-indigo-1000">
            <Avatar url={typeof state.auth?.profilePicture === 'string' ? state.auth?.profilePicture : state.auth?.profilePicture?.url} className="mr-2" />
            <div className="flex-grow">
              <input
                className="dark:bg-indigo-950 dark:!border-gray-700 dark:text-white  dark:placeholder-gray-400"
                type="text"
                placeholder="Create a post."
                onClick={() => (!state.isCreatingPost && !state.isLoadingFeed) && openModal()}
                readOnly={state.isLoadingFeed || state.isCreatingPost}
              />
            </div>
          </div>
        )}
        {/*  --- HAS NEW FEED NOTIF --- */}
        {state.newsFeed.hasNewFeed && (
          <button
            className="sticky mt-2 top-16 left-0 right-0 mx-auto z-20 flex items-center"
            onClick={onClickNewFeed}
          >
            <UndoOutlined className="flex items-center justify-center text-xl mr-4" />
            New Feed Available
          </button>
        )}
        {/* --- CREATE POST MODAL ----- */}
        {(props.isAuth) && (
          <CreatePostModal
            isOpen={isOpen}
            openModal={openModal}
            closeModal={closeModal}
          />
        )}
        {(state.error && state.newsFeed.items.length === 0 && !state.isCreatingPost) && (
          <div className="flex flex-col w-full min-h-24rem px-8 items-center justify-center text-center">
            {state.error.status_code === 404 ? (
              <>
                <CoffeeOutlined className="text-8xl text-gray-300 mb-4 dark:text-gray-800" />
                <h5 className="text-gray-500">News feed is empty</h5>
                <p className="text-gray-400">Start following people or create your first post.</p>
                <br />
                <Link className="underline dark:text-indigo-400" to={SUGGESTED_PEOPLE}>
                  See Suggested People
                </Link>
              </>
            ) : (
              <h5 className="text-gray-500 italic">
                {state.error?.error?.message || 'Something went wrong :('}
              </h5>
            )}
          </div>
        )}
        {/* ---- LOADING INDICATOR ----- */}
        {(state.isLoadingFeed && state.newsFeed.items.length === 0) && (
          <div className="mt-4 px-2 overflow-hidden space-y-6 pb-10">
            <PostLoader />
            <PostLoader />
          </div>
        )}
        {state.isCreatingPost && (
          <div className="mt-4 px-2 overflow-hidden pb-10">
            <PostLoader />
          </div>
        )}
        {(!props.isAuth && !state.isLoadingFeed) && (
          <div className="px-4 laptop:px-0 py-4 mb-4">
            <h2 className="dark:text-white text-gray-700">Public posts that might interest you.</h2>
          </div>
        )}
        {/* ---- NEWS FEED ---- */}
        {(state.newsFeed.items.length !== 0) && (
          <>
            <TransitionGroup component={null}>
              {state.newsFeed.items.map((post: IPost) => post.author && ( // avoid render posts with null author
                <CSSTransition
                  timeout={500}
                  classNames="fade"
                  key={post.id}
                >
                  <div ref={infiniteRef}>
                    <PostItem
                      key={post.id}
                      post={post}
                    />
                  </div>
                </CSSTransition>
              ))}
            </TransitionGroup>
            {state.isLoadingFeed && (
              <div className="flex justify-center py-10">
                <Loader />
              </div>
            )}
            {state.error && (
              <div className="flex justify-center py-6">
                <p className="text-gray-400 italic">
                  {state.error.error?.message || 'Something went wrong.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
      {/* --- SUGGESTED PEOPLE --- */}
      {props.isAuth && (
        <div className="hidden laptop:block laptop:w-1/4 laptop:sticky laptop:top-20 ml-4">
          <SuggestedPeople />
        </div>
      )}
      {/*  --- ALL POST MODALS (DELETE/EDIT/LIKES) --- */}
      <PostModals />
    </div>
  );
};

export default withAuth(Home);
