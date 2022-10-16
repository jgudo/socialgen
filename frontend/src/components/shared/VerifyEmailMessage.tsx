import React from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { startSendVerificationEmail } from '~/redux/slice/authSlice';
import { closeVerificationMessage } from '~/redux/slice/preferenceSlice';
import { useAppDispatch } from '~/redux/store/store2';
import { IRootState } from '~/types/types';

interface IProps {
  url?: string;
  size?: string;
  className?: string;
}

const VerifyEmailMessage: React.FC<IProps> = ({ url, size, className }) => {
  const st = useSelector((state: IRootState) => ({
    auth: state.auth,
    isSendingVerificationMail: state.loading.isSendingVerificationMail,
    hasSentVerificationMail: state.preference.hasSentVerificationMail,
    sendVerificationMailError: state.preference.sendVerificationMailError,
    isOpenVerificationMessage: state.preference.isOpenVerificationMessage,
  }));
  const dispatch = useAppDispatch();

  const onClickVerify = () => {
    dispatch(startSendVerificationEmail());
  }

  const onClickClose = () => {
    if (st.isSendingVerificationMail) return;

    dispatch(closeVerificationMessage());
  }


  if (st.auth && ((!st.auth?.isEmailValidated && st.isOpenVerificationMessage) || st.isOpenVerificationMessage)) {
    return (
      <div className="w-full p-2 bg-white dark:bg-indigo-950 flex flex-row justify-center items-center fixed left-0 bottom-0 space-x-4">
        <IoMdClose className="text-gray-600 dark:text-gray-500 cursor-pointer shrink-0 hover:opacity-80 relative laptop:absolute laptop:left-4 laptop:top-0 laptop:bottom-0 my-auto" onClick={onClickClose}/>
        {st.hasSentVerificationMail ? (
          <p className="text-green-600 text-sm inline-block font-bold">Verification mail has been sent to your email {st.auth.email}!</p>
        ) : (
          <>
            <p className="text-gray-600 dark:text-orange-600 text-sm inline-block">Verify your email so you won't lose access to your account.</p>
            <button
              disabled={st.isSendingVerificationMail}
              onClick={onClickVerify}
              className="button-warning text-xs px-3 py-1 shrink-0"
            >
              {st.isSendingVerificationMail ? <AiOutlineLoading className="animate-spin text-white text-lg" /> :  'VERIFY EMAIL'}
            </button>
          </>
        )}
      </div>
    )
  } else {
    return null;
  }
};

export default VerifyEmailMessage;
