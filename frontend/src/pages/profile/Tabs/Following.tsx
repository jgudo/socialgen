import React, { useEffect } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { UserCard } from '~/components/main';
import { Loader, UserLoader } from "~/components/shared";
import { useDidMount, useDocumentTitle } from "~/hooks";
import { startGetFollowing } from "~/redux/slice/profileSlice";
import { useAppDispatch } from "~/redux/store/store2";
import { IRootState } from "~/types/types";

interface IProps {
  username: string;
  isOwnProfile: boolean;
}

const Following: React.FC<IProps> = ({ username, isOwnProfile }) => {
  const st = useSelector((state: IRootState) => ({
    isLoading: state.loading.isFetchingFollowing,
    error: state.error.fetchFollowingError,
    followings: state.profile.following,
    offset: state.profile.followingOffset
  }));
  const dispatch = useAppDispatch();
  const didMount = useDidMount(true);

  useDocumentTitle(`Following - ${username} | Social Gen`);
  useEffect(() => {
    if (!isOwnProfile || st.followings.length === 0 && didMount) {
      dispatch(startGetFollowing({ username, params: { offset: !isOwnProfile ? 0 : st.offset } }));
    }

  }, []);

  const [infiniteRef] = useInfiniteScroll({
    loading: st.isLoading,
    hasNextPage: !st.error && st.followings.length >= 10,
    onLoadMore: () => dispatch(startGetFollowing({ username, params: { offset: st.offset } })),
    disabled: !!st.error,
    rootMargin: '0px 0px 200px 0px',
  });

  return (
    <div className="w-full">
      {(st.isLoading && st.followings.length === 0) && (
        <div className="min-h-10rem px-4">
          <UserLoader includeButton={true} />
          <UserLoader includeButton={true} />
          <UserLoader includeButton={true} />
          <UserLoader includeButton={true} />
        </div>
      )}
      {(!st.isLoading && st.followings.length === 0 && st.error) && (
        <div className="w-full min-h-10rem flex items-center justify-center">
          <h6 className="text-gray-400 italic">
            {st.error?.error?.message || `${username} isn't following anyone.`}
          </h6>
        </div>
      )}
      {st.followings.length !== 0 && (
        <div>
          <h4 className="text-gray-700 dark:text-white mb-4 ml-4 mt-4 laptop:mt-0">Following</h4>
          <TransitionGroup component={null}>
            {st.followings.map(user => (
              <CSSTransition
                timeout={500}
                classNames="fade"
                key={user.id}
              >
                <div ref={infiniteRef} className="bg-white dark:bg-indigo-1000 rounded-md mb-4 shadow-md">
                  <UserCard profile={user} />
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
          {(!st.error && st.isLoading) && (
            <div className="flex justify-center py-6">
              <Loader />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Following;
