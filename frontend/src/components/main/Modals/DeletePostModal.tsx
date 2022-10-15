import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-responsive-modal';
import { toast } from 'react-toastify';
import { useDidMount } from '~/hooks';
import { hideModal } from '~/redux/slice/modalSlice';
import { deleteFeedPost } from '~/redux/slice/newsFeedSlice';
import { setTargetPost } from '~/redux/slice/preferenceSlice';
import { deletePostFromProfile } from '~/redux/slice/profileSlice';
import { useAppDispatch } from '~/redux/store/store2';
import { deletePost } from '~/services/api';
import { IError, IRootState } from '~/types/types';

interface IProps {
  onAfterOpen?: () => void;
}

const DeletePostModal: React.FC<IProps> = (props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<IError | null>(null);
  const didMount = useDidMount();
  const dispatch = useAppDispatch();
  const { targetPost, isOpen } = useSelector((state: IRootState) => ({
    targetPost: state.preference.targetPost,
    isOpen: state.modal.isOpenDeletePost
  }))

  const handleDeletePost = async () => {
    if (!targetPost) return;

    try {
      setIsDeleting(true);
      await deletePost(targetPost?.id as string);

      didMount && setIsDeleting(false);

      closeModal();

      dispatch(deleteFeedPost(targetPost.id));
      // TODO delete only profile if state in profile is owner
      dispatch(deletePostFromProfile(targetPost.id));
      dispatch(setTargetPost(null));
      toast.success('Post successfully deleted.');
    } catch (e: any) {
      if (didMount) {
        setIsDeleting(false);
        setError(e);
      }
    }
  };

  const closeModal = () => {
    if (isOpen && !isDeleting) {
      dispatch(setTargetPost(null));
      dispatch(hideModal('isOpenDeletePost'));
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      closeOnEsc={!isDeleting}
      closeOnOverlayClick={!isDeleting}
      // showCloseIcon={false}
      classNames={{
        overlay: 'ModalOverlay',
        modal: 'Modal',
        modalContainer: 'ModalContainer',
        closeButton: 'ModalCloseButton',
        closeIcon: 'ModalCloseIcon',
      }}
    >
      <div className="relative">
        {error && (
          <span className="p-4 bg-red-100 text-red-500 block">
            {error?.error?.message || 'Unable to process your request.'}
          </span>
        )}
        <div className="p-4 laptop:px-8">
          <h2 className="dark:text-white">
            <ExclamationCircleOutlined className="text-red-500 mr-2 pt-2" />
            Delete Post
          </h2>
          <p className="text-gray-600 my-4 dark:text-gray-400">Are you sure you want to delete this post?</p>
          <div className="flex justify-between">
            <button
              className="button--muted !rounded-full dark:bg-indigo-1100 dark:text-white dark:hover:bg-indigo-1100"
              onClick={closeModal}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              className="button--danger"
              disabled={isDeleting}
              onClick={handleDeletePost}
            >
              {isDeleting ? "Deleting..." : 'Delete'}
            </button>
          </div>
        </div>
      </div>

    </Modal>
  );
};

export default DeletePostModal;
