import React, { useEffect } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { UserCard } from "~/components/main";
import { Loader, UserLoader } from "~/components/shared";
import { useDidMount, useDocumentTitle } from "~/hooks";
import { startGetFollowers } from "~/redux/slice/profileSlice";
import { useAppDispatch } from "~/redux/store/store2";
import { IRootState } from "~/types/types";

interface IProps {
  username: string;
  isOwnProfile: boolean;
}

const Followers: React.FC<IProps> = ({ username, isOwnProfile }) => {
  const st = useSelector((state: IRootState) => ({
    isLoading: state.loading.isFetchingFollowers,
    error: state.error.fetchFollowersError,
    followers: state.profile.followers,
    offset: state.profile.followersOffset
  }));
  const dispatch = useAppDispatch();
  const didMount = useDidMount(true);

  useDocumentTitle(`Followers - ${username} | Social Gen`);
  useEffect(() => {
    if (!isOwnProfile || st.followers.length === 0 && didMount) {
      dispatch(startGetFollowers({ username, params: { offset: !isOwnProfile ? 0 : st.offset } }));
    }

  }, []);

  const [infiniteRef] = useInfiniteScroll({
    loading: st.isLoading,
    hasNextPage: !st.error && st.followers.length >= 10,
    onLoadMore: () => dispatch(startGetFollowers({ username, params: { offset: st.offset } })),
    disabled: !!st.error,
    rootMargin: '0px 0px 200px 0px',
  });

  return (
    <div className="w-full">
      {(st.isLoading && st.followers.length === 0) && (
        <div className="min-h-10rem px-4">
          <UserLoader includeButton={true} />
          <UserLoader includeButton={true} />
          <UserLoader includeButton={true} />
          <UserLoader includeButton={true} />
        </div>
      )}
      {(!st.isLoading && st.followers.length === 0 && st.error) && (
        <div className="w-full min-h-10rem flex items-center justify-center">
          <h6 className="text-gray-400 italic">{st.error?.error?.message || 'Something went wrong.'}</h6>
        </div>
      )}
      {st.followers.length !== 0 && (
        <div>
          <h4 className="text-gray-700 dark:text-white mb-4 ml-4 mt-4 laptop:mt-0">Followers</h4>
          <TransitionGroup component={null}>
            {st.followers.map(user => (
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
          {(st.followers.length !== 0 && !st.error && st.isLoading) && (
            <div className="flex justify-center py-6">
              <Loader />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Followers;
