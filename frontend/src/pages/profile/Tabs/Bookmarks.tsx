import { LoadingOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect } from "react";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useSelector } from 'react-redux';
import { Link, Redirect } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { BookmarkButton } from "~/components/main";
import { Loader } from '~/components/shared';
import { useDidMount, useDocumentTitle } from '~/hooks';
import { startGetBookmarks } from '~/redux/slice/profileSlice';
import { useAppDispatch } from '~/redux/store/store2';
import { IRootState } from "~/types/types";

dayjs.extend(relativeTime);

interface IProps {
  username: string;
  isOwnProfile: boolean;
}

const Bookmarks: React.FC<IProps> = ({ username, isOwnProfile }) => {
  const st = useSelector((state: IRootState) => ({
    isLoading: state.loading.isFetchingBookmarks,
    error: state.error.fetchBookmarksError,
    bookmarks: state.profile.bookmarks,
    offset: state.profile.bookmarksOffset
  }));
  const dispatch = useAppDispatch();
  const didMount = useDidMount(true);

  useDocumentTitle(`Bookmarks - ${username} | Social Gen`);
  useEffect(() => {
    if (st.bookmarks.length === 0 && didMount) {
      dispatch(startGetBookmarks({ offset: st.offset }));
    }
  }, []);

  const [infiniteRef] = useInfiniteScroll({
    loading: st.isLoading,
    hasNextPage: !st.error && st.bookmarks.length >= 10,
    onLoadMore: () => dispatch(startGetBookmarks({ offset: st.offset })),
    disabled: !!st.error,
    rootMargin: '0px 0px 200px 0px',
  });

  return (!isOwnProfile && username) ? <Redirect to={`/user/${username}`} /> : (
    <div className="flex flex-col items-start justify-start w-full min-h-10rem">
      {(st.isLoading && st.bookmarks.length === 0) && (
        <div className="flex w-full items-center justify-center min-h-10rem">
          <Loader />
        </div>
      )}
      {(st.bookmarks.length === 0 && st.error && !st.isLoading) && (
        <div className="w-full p-4 flex min-h-10rem items-center justify-center">
          <span className="text-gray-400 text-lg italic">
            {st.error?.error?.message || "Something went wrong :("}
          </span>
        </div>
      )}
      {(st.bookmarks.length !== 0 && !st.error) && (
        <div className="w-full space-y-4">
          <h4 className="text-gray-700 dark:text-white mb-4 ml-4 mt-4 laptop:mt-0">Bookmarks</h4>
          <TransitionGroup component={null}>
            {st.bookmarks.map(item => (
              <CSSTransition
                timeout={500}
                classNames="fade"
                key={item.id}
              >
                <div ref={infiniteRef} key={item.id} className="h-24 flex justify-between bg-white dark:bg-indigo-1000 rounded-md shadow-lg overflow-hidden">
                  <div className="flex justify-center items-center">
                    <BookmarkButton postID={item.post.id} initBookmarkState={item.isBookmarked}>
                      {({ dispatchBookmark, isBookmarked, isLoading }) => (
                        <h4
                          className="p-4 flex items-center cursor-pointer"
                          onClick={dispatchBookmark}
                        >
                          {isLoading
                            ? <LoadingOutlined className="text-gray-600 text-2xl p-2 dark:text-white" />
                            : isBookmarked ? (
                              <StarFilled className="text-red-600 text-2xl p-2 rounded-full hover:bg-red-100" />
                            ) : (
                              <StarOutlined className="text-red-600 text-2xl p-2 rounded-full hover:bg-red-100" />
                            )}
                        </h4>
                      )}
                    </BookmarkButton>
                  </div>
                  <Link
                    className="flex flex-grow justify-between hover:bg-indigo-100 border border-transparent dark:hover:bg-indigo-1000 dark:hover:border-gray-800"
                    key={item.id}
                    to={`/post/${item.post.id}`}
                  >
                    <div className="flex-grow p-2 pb-4 max-w-sm">
                      <h4 className="break-all overflow-hidden overflow-ellipsis h-8 laptop:h-12 dark:text-indigo-400">
                        {item.post.description}
                      </h4>
                      <span className="text-xs text-gray-400 self-end">Bookmarked {dayjs(item.createdAt).fromNow()}</span>
                    </div>
                    <div
                      className="w-32 h-full shrink-0 !bg-cover !bg-no-repeat !bg-center"
                      style={{
                        background: `#f7f7f7 url(${item.post.photos[0]?.url || '/assets/thumbnail.jpg'})`
                      }}
                    />
                  </Link>
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
          {(st.bookmarks.length !== 0 && !st.error && st.isLoading) && (
            <div className="flex justify-center py-6">
              <Loader />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
