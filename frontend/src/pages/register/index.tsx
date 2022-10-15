import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
// @ts-ignore
import LazyImage from 'react-lazy-blur-image';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { SocialLogin } from '~/components/shared';
import CustomInput from '~/components/shared/CustomInput';
import { LOGIN } from '~/constants/routes';
import { useDocumentTitle } from '~/hooks';
import { startRegister } from '~/redux/slice/authSlice';
import { useAppDispatch } from '~/redux/store/store2';
import { IRootState } from '~/types/types';

const Schema = Yup.object({
  username: Yup.string().max(24, 'Max length of 24 exceeded').required('Username is required.'),
  email: Yup.string().matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Invalid email format')
    .required('Email is required.'),
  password: Yup.string().required('Password is required'),
  repeatPassword: Yup.string().required('Repeat password to check.'),
}).required();

interface IForm {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

const Register: React.FC = () => {
  useDocumentTitle('Register to Social Gen');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const dispatch = useAppDispatch();

  const { register, handleSubmit, getValues, formState: { errors, touchedFields } } = useForm<IForm>({
    resolver: yupResolver(Schema)
  });
  const passwordsMatch = getValues('password') === getValues('repeatPassword');

  const { error, isLoading } = useSelector((state: IRootState) => ({
    error: state.error.registerError,
    isLoading: state.loading.isRegistering
  }));

  const onSubmit: SubmitHandler<IForm> = data => {
    if (passwordsMatch) {
      dispatch(startRegister({ email: data.email, password: data.password, username: data.username }));
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div
        className="relative hidden laptop:w-7/12 h-screen laptop:p-8 laptop:sticky laptop:top-0 laptop:flex laptop:justify-start laptop:items-end bg-[#e3dad5]"
      >
        {/* ---- BACKGROUND IMAGE -----  */}
        <LazyImage
          placeholder="/assets/bg-2-min.jpg"
          uri="/assets/bg-2.jpg"
          render={(src: any, style: any) => <img src={src} className="w-full h-full object-cover absolute top-0 left-0" alt="" />}
        />
        {/* --- LOGO --- */}
        <Link className="absolute left-8 top-8" to="/">
          <img src="/assets/logo-dark.svg" alt="Foodie Logo" className="w-32" />
        </Link>
        {/* -- INFO --- */}
        <h3 className="animate-fade text-white w-9/12 mb-14 z-10">
          Create your account now and discover new ideas and connect with people.
        </h3>
        {/* --- CREDITS LINK --- */}
        <a
          className="animate-fade absolute bottom-8 left-8 text-1xs text-white underline"
          target="_blank"
          rel="noreferrer"
          href="https://www.pexels.com/photo/man-in-blue-button-up-shirt-standing-beside-woman-in-white-coat-4881665/"
        >
          Photo by: Cottonbro
        </a>
      </div>
      <div className="relative animate-fade w-full text-center laptop:w-5/12 laptop:text-left flex items-center flex-col justify-center py-8">
        <Link to="/">
          <img
            src="/assets/logo.svg"
            alt="Foodie Logo"
            className="w-12 laptop:w-10 relative mx-auto laptop:hidden"
          />
        </Link>
        {error && (
          <div className="py-2 px-4 w-full text-center bg-red-500 absolute top-0 left-0">
            <p className="text-white text-sm font-bold">{error?.error?.message || 'Something went wrong :('}</p>
          </div>
        )}
        <form className="w-full px-8 laptop:px-14">
          <div>
            <h2 className="mt-6 text-xl laptop:text-2xl font-extrabold text-gray-900">
              Create your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" >
            <div className="rounded-md space-y-2">
              <CustomInput
                type="text"
                error={error || errors.username?.message}
                name="username"
                label="username"
                register={register}
                required
                readOnly={isLoading}
                placeholder="Username"
              />
              <CustomInput
                type="email"
                name="email"
                label="email"
                error={error || errors.email?.message}
                register={register}
                required
                readOnly={isLoading}
                placeholder="Email"
              />
              <div className="relative">
                <CustomInput
                  type={isPasswordVisible ? 'text' : 'password'}
                  name="password"
                  label="password"
                  error={error || errors.password?.message || !passwordsMatch}
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
              {touchedFields.password && touchedFields.repeatPassword && !passwordsMatch && (
                <span className="text-[11px] ml-4 text-red-500">Passwords do not match</span>
              )}
              <CustomInput
                type="password"
                name="repeatPassword"
                label="repeatPassword"
                error={error || errors.repeatPassword?.message || !passwordsMatch}
                register={register}
                required
                readOnly={isLoading}
                placeholder="Repeat Password"
              />
            </div>
            <button onClick={handleSubmit(onSubmit)} className="button--stretch" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </button>
            <SocialLogin isLoading={isLoading} />
          </form>
          <div className="text-center mt-8">
            <Link
              className="underline font-medium"
              onClick={(e) => isLoading && e.preventDefault()}
              to={LOGIN}
            >
              Login instead
            </Link>
          </div>
          {/* --- COPYRIGHT -- */}
          <span className="text-gray-400 text-xs mx-auto text-center block mt-4">
            &copy;Copyright {new Date().getFullYear()} SocialGen
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;
