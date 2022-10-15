import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
// @ts-ignore
import LazyImage from 'react-lazy-blur-image';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import CustomInput from '~/components/shared/CustomInput';
import { LOGIN } from '~/constants/routes';
import { useDocumentTitle } from '~/hooks';
import { startRecoverPassword } from '~/redux/slice/authSlice';
import { useAppDispatch } from '~/redux/store/store2';
import { IRootState } from '~/types/types';

const Schema = Yup.object({
  username: Yup.lazy((value) => value.includes('@')
  ? Yup
    .string()
    .matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Invalid email format')
    .required('Username/Email is required is required.')
  : Yup.string()
    .required('Username/Email is required.')),
}).required();

interface IForm {
  username: string;
}

const ForgotPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useSelector((state: IRootState) => ({
    isLoading: state.loading.isRecoveringPassword,
    error: state.error.recoverPassword
  }));
  const [successSent, setSucessSent] = useState(false); // State for determining if sending password reset email was sent

  const { register, getValues, handleSubmit, formState: { errors } } = useForm<IForm>({
    resolver: yupResolver(Schema)
  });

  useDocumentTitle('Recover Password | Social Gen');

  const onSubmit: SubmitHandler<IForm> = (data) => {
    dispatch(startRecoverPassword({
      username: data.username,
      successCallback: () => setSucessSent(true)
    }));
    // dispatch(startLogin({ username: data.username }));
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div
        className="relative w-full h-screen laptop:p-8 hidden items-center justify-center laptop:flex bg-[#3982ad]"
      >
        <LazyImage
          placeholder="/assets/bg-1-min.jpg"
          uri="/assets/bg-1.jpg"
          render={(src: any, style: any) => <img src={src} className="w-full h-full object-cover absolute top-0 left-0" alt="" />}
        />
        <div className="w-full h-full absolute top-0 left-0 z-0 backdrop-filter backdrop-blur-lg  bg-opacity-90 dark:bg-opacity-30"/>
        {/* --- LOGO --- */}
        <Link className="absolute left-8 top-8" to="/">
          <img src="/assets/logo-light.svg" alt="Foodie Logo" className="w-32" />
        </Link>
        <a
          className="animate-fade absolute bottom-8 left-8 text-1xs text-white underline"
          target="_blank"
          rel="noreferrer"
          href="https://www.pexels.com/photo/3-women-and-2-men-sitting-on-white-concrete-fence-4880409/"
        >
          Photo by: Cottonbro
        </a>
      <div className="animate-fade flex w-[400px] bg-white rounded-md items-center flex-col justify-center px-8 py-16 laptop:pt-0 relative">
        <br />
        <Link to="/">
          <img
            src="/assets/logo.svg"
            alt="SocialGen Logo"
            className="w-10 relative mx-auto laptop:hidden"
          />
        </Link>
        {error && (
          <div className="py-2 px-4 w-full text-center bg-red-500 absolute top-0 left-0">
            <p className="text-white text-sm font-bold">{error?.error?.message || 'Something went wrong :('}</p>
          </div>
        )}
        <div className="w-full text-center">
          <div>
            <h2 className="mt-6  text-center text-xl laptop:text-2xl font-extrabold text-gray-700">
              Recover Password
            </h2>
          </div>
          <form className="mt-8 space-y-6">
            <div className="rounded-md space-y-2">
              {successSent ? (
                <p className='text-green-600 text-center'>
                  If {getValues('username').includes('@') ? 'email address' : 'username'} &nbsp;
                  <b>{getValues('username')}</b> matches an existing account, please check the email and follow the password
                  reset instruction.
                </p>
              ) : (
                <>
                  <CustomInput
                    type="text"
                    error={errors.username?.message}
                    name="username"
                    label="username"
                    register={register}
                    required
                    className="text-center"
                    readOnly={isLoading}
                    placeholder="Username or Email Address"
                  />
                  <br />
                <button onClick={handleSubmit(onSubmit)} className="button--stretch" disabled={isLoading}>
                  {isLoading ? 'Sending Password Reset Link...' : 'Submit'}
                </button>
                </>
              )}
            </div>
          </form>
          <div className="text-center mt-8">
            <Link
              className="underline font-medium"
              onClick={(e) => isLoading && e.preventDefault()}
              to={LOGIN}
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
