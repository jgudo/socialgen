import React from "react";
import { useSelector } from "react-redux";
import { useDocumentTitle } from "~/hooks";
import { startSendVerificationEmail } from "~/redux/slice/authSlice";
import { useAppDispatch } from "~/redux/store/store2";
import { IRootState } from "~/types/types";

const AccountVerificationFailed = () => {
  useDocumentTitle('Account Verification Failed | Social Gen');
  const st = useSelector((state: IRootState) => ({
    isSendingVerificationMail: state.loading.isSendingVerificationMail,
    hasSentVerificationMail: state.preference.hasSentVerificationMail,
    sendVerificationMailError: state.preference.sendVerificationMailError
  }));

  const dispatch = useAppDispatch();

  const onClickVerify = () => {
    dispatch(startSendVerificationEmail());
  }

  return (
    <div className="contain pt-14 min-h-screen flex flex-row space-x-12">
      <img src="/assets/account-verified.svg" className="w-[300px]" alt="" />
      <div className="flex items-start justify-center flex-col">
        <h1 className="mt-8 text-2xl laptop:text-4xl dark:text-white">Failed to Verify Account</h1>
        <br />
        <h4 className="text-gray-600 dark:text-gray-400">The verification token has expired or invalid.</h4>
        {/* {st.hasSentVerificationMail ? (
          <p className="text-green-600 text-sm inline-block font-bold">Verification mail has been sent to your email {st.auth.email}!</p>
        ) : (
          <button disabled={st.isSendingVerificationMail} className="button inline-flex mt-8">
            {st.isSendingVerificationMail ? <AiOutlineLoading className="animate-spin text-white text-lg" /> : 'Resend Verification Mail'}
          </button>
        )} */}
      </div>
    </div>
  );
};

export default AccountVerificationFailed;
