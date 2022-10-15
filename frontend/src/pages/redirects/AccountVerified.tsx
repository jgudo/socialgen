import React from "react";
import { useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { HOME } from "~/constants/routes";
import { useDocumentTitle } from "~/hooks";
import { IRootState } from "~/types/types";

const AccountVerified = () => {
  const auth = useSelector((state: IRootState) => state.auth);

  useDocumentTitle('Account Verified | Social Gen');

  if (auth && !auth.isEmailValidated) {
    return <Redirect to={HOME} />
  }

  return (
    <div className="contain pt-14 min-h-screen flex flex-row space-x-12">
      <img src="/assets/account-verified.svg" className="w-[300px]" alt="" />
      <div className="flex items-start justify-center flex-col">
        <h1 className="mt-8 text-2xl laptop:text-4xl dark:text-white">Account Verified</h1>
        <br />
        <h4 className="text-gray-600 dark:text-gray-400">Your account has been verified. You can now like and comment on posts.</h4>
        <Link className="button inline-flex mt-8" to="/">Back to {auth ? 'home' : 'login'}</Link>
      </div>
    </div>
  );
};

export default AccountVerified;
