import React from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-responsive-modal';
import { startLogout } from '~/redux/slice/authSlice';
import { useAppDispatch } from '~/redux/store/store2';
import { IRootState } from '~/types/types';

interface IProps {
  isOpen: boolean;
  onAfterOpen?: () => void;
  closeModal: () => void;
  openModal: () => void;
}

const LogoutModal: React.FC<IProps> = (props) => {
  const { error, isLoggingOut } = useSelector((state: IRootState) => ({
    error: state.error.logoutError,
    isLoggingOut: state.loading.isLoggingOut
  }));
  const dispatch = useAppDispatch();

  const onLogout = () => {
    dispatch(startLogout(props.closeModal));
  }


  return (
    <Modal
      open={props.isOpen}
      onClose={props.closeModal}
      closeOnEsc={!isLoggingOut}
      closeOnOverlayClick={!isLoggingOut}
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
        <div className="p-8 laptop:px-8">
          <h2 className="dark:text-white">Confirm Logout</h2>
          <p className="text-gray-600 my-4 dark:text-gray-400">Are you sure you want to logout?</p>
          <br />
          <div className="flex justify-between">
            <button
              className="button--muted !rounded-full dark:bg-indigo-1100 dark:text-white dark:hover:bg-indigo-1100 dark:hover:text-white"
              onClick={props.closeModal}
              disabled={isLoggingOut}
            >
              Cancel
            </button>
            <button
              className="button--danger"
              disabled={isLoggingOut}
              onClick={onLogout}
            >
              {isLoggingOut ? 'Logging Out' : 'Logout'}
            </button>
          </div>
        </div>
      </div>

    </Modal>
  );
};

export default LogoutModal;
