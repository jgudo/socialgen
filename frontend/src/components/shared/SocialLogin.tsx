import React from "react";
import { FaFacebookF, FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const SocialLogin: React.FC<{ isLoading: boolean; }> = ({ isLoading }) => {
  const apiURL = import.meta.env.VITE_API_URL;
  const onClickSocialLogin = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (isLoading) e.preventDefault();
  }

  return (
    <div>
      <div className="flex flex-row items-center">
        <div className="w-[25%] tablet:w-[33%] border-t  border-gray-200" />
        <span className="w-[50%] tablet:w-[33%] text-center mx-2 text-xs text-gray-500">OR CONTINUE WITH</span>
        <div className="w-[25%] tablet:w-[33%] border-t  border-gray-200" />
      </div>
      <br />
      <div className="w-full flex flex-col laptop:flex-row space-y-2 laptop:space-y-0  laptop:space-x-2 items-center">
        <a
          className="button w-full bg-blue-500 hover:bg-blue-600"
          href={`${apiURL}/api/v1/auth/facebook`}
          onClick={onClickSocialLogin}
        >
          <FaFacebookF className="absolute left-8 top-0 bottom-0 my-auto text-sm" />
          <span className="inline-block">Facebook</span>
        </a>
        <a
          className="button w-full text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-300"
          href={`${apiURL}/api/v1/auth/google`}
          onClick={onClickSocialLogin}
        >
          <FcGoogle className="absolute left-8 top-0 bottom-0 my-auto text-lg" />
          <span className="inline-block">Google</span>
        </a>
        <a
          className="button w-full border border-gray-300 bg-gray-700 hover:bg-gray-600"
          href={`${apiURL}/api/v1/auth/github`}
          onClick={onClickSocialLogin}
        >
          <FaGithub className="absolute left-8 top-0 bottom-0 my-auto text-sm" />
          <span className="inline-block">GitHub</span>
        </a>
      </div>
    </div>
  )
};

export default SocialLogin;
