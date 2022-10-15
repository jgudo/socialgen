import { LikeOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { useDidMount } from '~/hooks';
import { updatePostLikes } from '~/redux/slice/newsFeedSlice';
import { updateProfilePostLikes } from '~/redux/slice/profileSlice';
import { useAppDispatch } from '~/redux/store/store2';
import { likePost } from '~/services/api';

interface IProps {
  postID: string;
  isLiked: boolean;
}

const LikeButton: React.FC<IProps> = (props) => {
  const [isLiked, setIsLiked] = useState(props.isLiked);
  const [isLoading, setLoading] = useState(false);
  const didMount = useDidMount();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsLiked(props.isLiked);
  }, [props.isLiked]);

  const dispatchLike = async () => {
    if (isLoading) return;

    try {
      setLoading(true);

      const { state, likesCount } = await likePost(props.postID);
      if (didMount) {
        setLoading(false);
        setIsLiked(state);
      }

      dispatch(updatePostLikes({ postID: props.postID, likesCount, state }));
      dispatch(updateProfilePostLikes({ postID: props.postID, likesCount, state }));
    } catch (e) {
      didMount && setLoading(false);
      console.log(e);
    }
  }

  return (
    <span
      className={` px-1 py-2 rounded-md flex items-center justify-center hover:bg-gray-100 cursor-pointer text-l w-2/4  ${isLiked ? 'text-indigo-700 font-bold dark:text-indigo-400 dark:hover:bg-indigo-1100' : 'text-gray-700 dark:hover:bg-indigo-1100 dark:hover:text-white  dark:bg-indigo-1000 hover:text-gray-800 dark:text-gray-400'} ${isLoading && 'opacity-50'}`}
      onClick={dispatchLike}
    >
      {isLoading ? <AiOutlineLoading className="animate-spin text-gray-800 dark:text-white text-lg" /> : (
        <>
          <LikeOutlined />
          &nbsp;
          {isLiked ? 'Unlike' : 'Like'}
        </>
      )}
    </span>
  );
};

export default LikeButton;
