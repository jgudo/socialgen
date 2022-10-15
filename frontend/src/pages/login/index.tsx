import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineLoading } from 'react-icons/ai';
import { MdLock } from 'react-icons/md';
// @ts-ignore
import LazyImage from 'react-lazy-blur-image';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { SocialLogin } from '~/components/shared';
import CustomInput from '~/components/shared/CustomInput';
import { REGISTER } from '~/constants/routes';
import { useDocumentTitle } from '~/hooks';
import { startLogin } from '~/redux/slice/authSlice';
import { useAppDispatch } from '~/redux/store/store2';
import { IRootState } from '~/types/types';

const Schema = Yup.object({
  username: Yup.string().required('Username is required.'),
  password: Yup.string().required('Password is required'),
}).required();

interface IForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const dispatch = useAppDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm<IForm>({
    resolver: yupResolver(Schema)
  });

  useDocumentTitle('Login to Social Gen');

  const { error, isLoading } = useSelector((state: IRootState) => ({
    error: state.error.loginError,
    isLoading: state.loading.isLoggingIn
  }));

  const onSubmit: SubmitHandler<IForm> = (data) => {
    dispatch(startLogin({ username: data.username, password: data.password}));
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div
        className="relative laptop:w-7/12 h-screen laptop:p-8 hidden laptop:justify-start laptop:items-end laptop:flex bg-[#3982ad]"
      >
        <LazyImage
          placeholder="/assets/bg-1-min.jpg"
          uri="/assets/bg-1.jpg"
          render={(src: any, style: any) => <img src={src} className="w-full h-full object-cover absolute top-0 left-0" alt="" />}
        />
        {/* --- LOGO --- */}
        <Link className="absolute left-8 top-8" to="/">
          <img src="/assets/logo-light.svg" alt="Foodie Logo" className="w-32" />
        </Link>
        {/* -- INFO --- */}
        <h3 className="animate-fade text-white w-9/12 mb-14 z-10 drop-shadow-md ">
          Looking for new friends? You're in the right place.
        </h3>
        {/* --- CREDITS LINK --- */}
        <a
          className="animate-fade absolute bottom-8 left-8 text-1xs text-white underline"
          target="_blank"
          rel="noreferrer"
          href="https://www.pexels.com/photo/3-women-and-2-men-sitting-on-white-concrete-fence-4880409/"
        >
          Photo by: Cottonbro
        </a>
      </div>
      <div className="animate-fade laptop:w-5/12 w-full flex items-center flex-col justify-center pt-8 laptop:pt-0 relative">
        <Link to="/">
          <img
            src="/assets/logo.svg"
            alt="SocialGen Logo"
            className="w-12 laptop:w-10 relative mx-auto laptop:hidden"
          />
        </Link>
        {error && (
          <div className="py-2 px-4 w-full text-center bg-red-500 absolute top-0 left-0">
            <p className="text-white text-sm font-bold">{error?.error?.message || 'Something went wrong :('}</p>
          </div>
        )}
        <div className="w-full laptop:px-14 px-8 text-center laptop:text-left">
          <div>
            <h2 className="mt-6 text-xl laptop:text-2xl font-extrabold text-gray-900">
              Login to Social Gen
            </h2>
          </div>
          <form className="mt-8 space-y-6">
            <div className="rounded-md space-y-2">
              <CustomInput
                type="text"
                error={errors.username?.message}
                name="username"
                label="username"
                register={register}
                required
                readOnly={isLoading}
                placeholder="Username"
              />
              <div className="relative">
                <CustomInput
                  type={isPasswordVisible ? 'text' : 'password'}
                  name="password"
                  label="password"
                  error={errors.password?.message}
                  register={register}
                  required
                  readOnly={isLoading}
                  placeholder="Password"
                />
                <div className="absolute right-0 top-0 flex items-center justify-center w-12 h-12 hover:bg-gray-200 cursor-pointer rounded-tr-full rounded-br-full z-10">
                  {isPasswordVisible ? (
                    <EyeInvisibleOutlined
                      className="h-full w-full outline-none text-gray-500"
                      onClick={() => setPasswordVisible(false)}
                    />
                  ) : (
                    <EyeOutlined
                      className="h-full w-full outline-none"
                      onClick={() => setPasswordVisible(true)}
                    />
                  )}
                </div>
              </div>
            </div>
            <Link className="font-medium text-sm text-gray-400 inline-block my-4  laptop:mb-0 hover:text-indigo-500 underline laptop:pl-4" to="/forgot-password">
              Forgot your password?
            </Link>
            <button onClick={handleSubmit(onSubmit)} className="button--stretch" disabled={isLoading}>
              {isLoading ? (
                <AiOutlineLoading className="text-white text-xl animate-spin" />
              ) : (
                <>
                  <MdLock className="absolute left-8 top-0 bottom-0 my-auto" />
                  Login
                </>
              )}
            </button>
            <SocialLogin isLoading={isLoading} />
          </form>
          <div className="text-center mt-8">
            <Link
              className="underline font-medium"
              onClick={(e) => isLoading && e.preventDefault()}
              to={REGISTER}
            >
              I dont have an account
            </Link>
          </div>
          {/* --- COPYRIGHT -- */}
          <span className="text-gray-400 text-xs mx-auto text-center block mt-4">
            &copy;Copyright {new Date().getFullYear()} SocialGen. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
