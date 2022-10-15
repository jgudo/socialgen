import React, { useEffect } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { CreatePostModal, PostItem, PostModals } from "~/components/main";
import { Avatar, Loader } from "~/components/shared";
import { PostLoader } from "~/components/shared/Loaders";
import { useDidMount, useDocumentTitle, useModal } from "~/hooks";
import { startGetPosts } from "~/redux/slice/profileSlice";
import { useAppDispatch } from "~/redux/store/store2";
import { IError, IRootState, IUser } from "~/types/types";

interface IProps {
  username: string;
  auth: IUser;
  isOwnProfile: boolean;
}

const Posts: React.FC<IProps> = (props) => {
  const st = useSelector((state: IRootState) => ({
    isLoading: state.loading.isFetchingUserPosts,
    error: state.error.fetchUserPostsError,
    data: state.profile.data,
    posts: state.profile.posts,
    isCreatingPost: state.loading.isCreatingPost,
    offset: state.profile.postsOffset
  }));
  const { isOpen, openModal, closeModal } = useModal();
  const didMount = useDidMount(true);
  const dispatch = useAppDispatch();

  useDocumentTitle(`Posts - ${props.username} | SocialGen`);
  useEffect(() => {
    if (!props.isOwnProfile || st.posts.length === 0 && didMount) {
      dispatch(startGetPosts({ username: props.username, params: { offset: !props.isOwnProfile ? 0 : st.offset } }));
    }

  }, []);

  const [infiniteRef] = useInfiniteScroll({
    loading: st.isLoading,
    hasNextPage: !st.error && !st.isLoading,
    // hasNextPage: !st.error && st.posts.length >= 10,
    onLoadMore: () => dispatch(startGetPosts({ username: props.username, params: { offset: st.offset } })),
    disabled: !!st.error,
    rootMargin: '0px 0px 200px 0px',
  });

  return (
    <div className="w-full">
      {st.data?.isOwnProfile && (
        <div className="flex items-center justify-start mb-4 px-4 mt-4 laptop:mt-0 laptop:px-0">
          <Avatar url={typeof props.auth.profilePicture === 'string' ? props.auth.profilePicture : props.auth.profilePicture?.url} className="mr-2" />
          <div className="flex-grow">
            <input
              className="dark:bg-indigo-1000 dark:text-white dark:border-gray-800"
              type="text"
              placeholder="Create a post."
              onClick={() => !st.isCreatingPost && openModal()}
              readOnly={st.isCreatingPost}
            />
          </div>
        </div>
      )}
      {/* --- CREATE POST MODAL ----- */}
      {isOpen && (
        <CreatePostModal
          isOpen={isOpen}
          openModal={openModal}
          closeModal={closeModal}
          appendNewToProfile={true}
        />
      )}
      {((st.isLoading && st.posts.length === 0) || st.isCreatingPost) && (
        <div className="mt-4 px-2 overflow-hidden space-y-6 pb-10">
          <PostLoader />
        </div>
      )}
      {!st.isLoading && st.posts.length === 0 && st.error && (
        <div className="w-full min-h-10rem flex items-center justify-center">
          <h6 className="text-gray-400 italic">
            {st.error?.error?.message || 'Something went wrong :('}
          </h6>
        </div>
      )}
      {(st.posts.length !== 0) && (
        <>
          <TransitionGroup component={null}>
            {st.posts.map(post => (
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
          {(st.posts.length !== 0 && !st.error && st.isLoading) && (
            <div className="flex justify-center py-6">
              <Loader />
            </div>
          )}
          {(st.posts.length !== 0 && st.error) && (
            <div className="flex justify-center py-6">
              <p className="text-gray-400 italic">
                {(st.error as IError)?.error?.message || 'No more posts.'}
              </p>
            </div>
          )}
        </>
      )}
      {/* ----- POST MODALS (DELETE/CREATE/) ---- */}
      <PostModals />
    </div>
  );
};

export default Posts;
