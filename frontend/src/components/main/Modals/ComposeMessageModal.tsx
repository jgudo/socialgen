import { FormOutlined } from '@ant-design/icons';
import React from 'react';
import Modal from 'react-responsive-modal';
import { useHistory } from 'react-router-dom';
import { SearchInput } from '~/components/shared';
import { initiateChat } from '~/redux/slice/chatSlice';
import { useAppDispatch } from '~/redux/store/store2';
import { IChatItemsState, IProfile } from '~/types/types';

interface IProps {
  isOpen: boolean;
  onAfterOpen?: () => void;
  closeModal: () => void;
  openModal: () => void;
  userID: string;
}

const ComposeMessageModal: React.FC<IProps> = (props) => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const clickSearchResultCallback = (user: IChatItemsState | IProfile) => {
    if (props.userID === user.id) return;
    dispatch(initiateChat(user as IChatItemsState));
    props.closeModal();

    if (window.screen.width < 800) {
      history.push(`/chat/${user.username}`);
    }
  }

  return (
    <Modal
      open={props.isOpen}
      onClose={props.closeModal}
      closeOnEsc={true}
      // showCloseIcon={false}
      classNames={{
        overlay: 'ModalOverlay',
        modal: 'Modal',
        modalContainer: 'ModalContainer',
        closeButton: 'ModalCloseButton',
        closeIcon: 'ModalCloseIcon',
      }}
    >
      <div className="relative transition-all pb-8 min-h-18rem">
        <h3 className="py-4 px-8 flex dark:text-white">
          <FormOutlined className="mr-2" />
          Compose Message
        </h3>
        <div className="flex justify-start px-8 mt-4">
          <h4 className="mr-2 pt-2 dark:text-white">To: </h4>
          <SearchInput
            floatingResult={false}
            clickItemCallback={clickSearchResultCallback}
            showNoResultMessage={true}
            preventDefault={true}
          />
        </div>
      </div>

    </Modal>
  );
};

export default ComposeMessageModal;
