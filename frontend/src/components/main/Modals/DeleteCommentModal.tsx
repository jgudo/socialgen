import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-responsive-modal';
import { toast } from 'react-toastify';
import { setTargetComment } from '~/redux/slice/preferenceSlice';
import { useAppDispatch } from '~/redux/store/store2';
import { deleteComment } from '~/services/api';
import { IComment, IError, IRootState } from '~/types/types';

interface IProps {
  onAfterOpen?: () => void;
  isOpen: boolean;
  closeModal: () => void;
  deleteSuccessCallback: (comment: IComment) => void;
}

const DeleteCommentModal: React.FC<IProps> = (props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<IError | null>(null);
  const dispatch = useAppDispatch();
  const targetComment = useSelector((state: IRootState) => state.preference.targetComment);

  const handleDeleteComment = async () => {
    try {
      setIsDeleting(true);
      targetComment && await deleteComment(targetComment.id);

      closeModal();
      targetComment && props.deleteSuccessCallback(targetComment);
      toast.dark('Comment successfully deleted.', {
        progressStyle: { backgroundColor: '#4caf50' },
        autoClose: 2000
      });
    } catch (e: any) {
      setIsDeleting(false);
      setError(e);
    }
  };

  const closeModal = () => {
    if (props.isOpen) {
      props.closeModal();
      dispatch(setTargetComment(null));
    }
  }

  return (
    <Modal
      open={props.isOpen}
      onClose={props.closeModal}
      closeOnEsc={true}
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
          <span className="block p-4 bg-red-100 text-red-500 w-full">
            {error?.error?.message || 'Unable process request. Please try again.'}
          </span>
        )}
        <div className="p-4 laptop:px-8">
          <h2 className="dark:text-white">
            <ExclamationCircleOutlined className="text-red-500 mr-2 pt-2" />
            Delete Comment
          </h2>
          <p className="text-gray-600 my-4 dark:text-white">Are you sure you want to delete this comment?</p>
          <div className="flex justify-between">
            <button
              className="button--muted !rounded-full dark:bg-indigo-1100 dark:text-white dark:hover:bg-indigo-1100"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="button--danger"
              disabled={isDeleting}
              onClick={handleDeleteComment}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

    </Modal>
  );
};

export default DeleteCommentModal;
