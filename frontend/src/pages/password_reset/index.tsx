import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
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
import useQueryURL from '~/hooks/useQueryURL';
import { startResetPassword } from '~/redux/slice/authSlice';
import { useAppDispatch } from '~/redux/store/store2';
import { IRootState } from '~/types/types';

const Schema = Yup.object({
  password: Yup.string().required('Password is required'),
  repeatPassword: Yup.string().required('Repeat password to check.'),
}).required();

interface IForm {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

const PasswordReset: React.FC = () => {
  useDocumentTitle('Passwor Reset | Social Gen');
  const query = useQueryURL();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const dispatch = useAppDispatch();

  const { register, handleSubmit, getValues, formState: { errors, touchedFields } } = useForm<IForm>({
    resolver: yupResolver(Schema)
  });
  const passwordsMatch = getValues('password') === getValues('repeatPassword');

  const { error, isLoading } = useSelector((state: IRootState) => ({
    error: state.error.resetPassword,
    isLoading: state.loading.isResettingPassword
  }));

  const onSubmit: SubmitHandler<IForm> = data => {
    const user_id = query.get('user_id');
    const token = query.get('token');
    if (passwordsMatch && user_id && token) {
      console.log('ASDSAD')
      dispatch(startResetPassword({ user_id, token, password: data.password}));
    }
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
        <div className="w-full h-full absolute top-0 left-0 z-0 backdrop-filter backdrop-blur-lg  bg-opacity-90 dark:bg-opacity-30" />
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
              alt="Foodie Logo"
              className="w-24 relative mx-auto laptop:hidden"
            />
          </Link>
          {error && (
            <div className="py-2 px-4 w-full text-center bg-red-500 absolute top-0 left-0">
              <p className="text-white text-sm font-bold">{error?.error?.message || 'Something went wrong :('}</p>
            </div>
          )}
          <div className="w-full text-center">
            <div>
              <h2 className="mt-6 text-xl laptop:text-2xl font-extrabold text-gray-900">
                Reset Password
              </h2>
            </div>
            <form className="mt-8 space-y-6" >
              <div className="rounded-md space-y-2">
                <div className="relative">
                  <CustomInput
                    type={isPasswordVisible ? 'text' : 'password'}
                    name="password"
                    label="password"
                    error={error || errors.password?.message || !passwordsMatch}
                    register={register}
                    required
                    className="text-center"
                    readOnly={isLoading}
                    placeholder="New Password"
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
                  <span className="text-xs ml-4 text-red-500">Passwords do not match</span>
                )}
                <CustomInput
                  type="password"
                  name="repeatPassword"
                  label="repeatPassword"
                  error={error || errors.repeatPassword?.message || !passwordsMatch}
                  register={register}
                  required
                  className="text-center"
                  readOnly={isLoading}
                  placeholder="Repeat New Password"
                />
              </div>
              <button onClick={handleSubmit(onSubmit)} className="button--stretch" disabled={isLoading}>
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </button>
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

export default PasswordReset;
