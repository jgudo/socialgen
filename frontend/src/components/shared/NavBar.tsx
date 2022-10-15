import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import { withAuth, withTheme } from "~/components/hoc";
import { LogoutModal, Messages, Notification } from '~/components/main';
import { Avatar, SearchInput, ThemeToggler } from "~/components/shared";
import { FORGOT_PASSWORD, LOGIN, PASSWORD_RESET, REGISTER } from '~/constants/routes';
import { useModal } from "~/hooks";
import { useAppDispatch } from "~/redux/store/store2";
import { IRootState } from "~/types/types";
import VerifyEmailMessage from "./VerifyEmailMessage";

const NavBarMobile = lazy(() => import('./NavBarMobile'));

interface IProps {
  isAuth: boolean;
  theme: string;
}

const NavBar: React.FC<IProps> = ({ isAuth, theme }) => {
  const dispatch = useAppDispatch();
  const { isLoggingOut, auth, isSendingVerificationMail } = useSelector((state: IRootState) => ({
    isLoggingOut: state.loading.isLoggingOut,
    auth: state.auth,
    error: state.error.logoutError,
    isSendingVerificationMail: state.loading.isSendingVerificationMail
  }));
  const logoutModal = useModal();
  const { pathname } = useLocation();
  const isLaptop = window.screen.width >= 1024;

  const hideNavToPaths = [LOGIN, REGISTER, FORGOT_PASSWORD, PASSWORD_RESET];

  return hideNavToPaths.includes(pathname)
    ? null
    : (
      <>
        {isLaptop ? (
          <nav className="fixed top-0 w-full  z-50">
            <VerifyEmailMessage />
            <div className="contain flex justify-between items-center border-b border-transparent dark:border-gray-900 align-center w-100 bg-white text-gray-700 h-60px py-2 w-full shadow-md laptop:shadow-sm dark:bg-indigo-1000">
              <div className="flex items-center space-x-8">
                {/* ---- LOGO -------- */}
                <Link
                  to={{
                    pathname: '/',
                    state: { from: pathname }
                  }}
                >
                  <img
                    src={theme === 'dark' ? '/assets/logo-light.svg' : '/assets/logo-dark.svg'}
                    alt=""
                    className="w-32"
                  />
                </Link>
                {/* -------- SEARCH BAR ------- */}
                <SearchInput />
              </div>
              <div className="hidden laptop:flex laptop:items-center space-x-2">
                {isAuth ? (
                  <>
                    {/* ----- FOLLOW/MESSAGE/NOTIF ICONS ------ */}
                    <ul className="flex items-center space-x-8 mr-8">
                      <li className="flex items-center justify-center w-10 h-10 cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-indigo-1100">
                        <Messages isAuth={isAuth} />
                      </li>
                      <li className="flex items-center justify-center w-10 h-10 cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-indigo-1100">
                        <Notification isAuth={isAuth} />
                      </li>
                    </ul>
                    <div className="flex items-center">
                      {/* ---- AVATAR WITH  USERNAME ----------- */}
                      <Link to={`/user/${auth?.username}`} className="cursor-pointer">
                        <div className="flex items-center">
                          <Avatar url={typeof auth?.profilePicture === 'string' ? auth?.profilePicture : auth?.profilePicture?.url} className="mr-2" />
                          <h6 className="text-sm mr-10 dark:text-indigo-400">@{auth?.username}</h6>
                        </div>
                      </Link>
                      {/* ----- LOGOUT BUTTON ------ */}
                      <button
                        className="button--muted !rounded-full dark:bg-indigo-1100 dark:text-white dark:hover:bg-indigo-900 dark:hover:text-white dark:active:bg-indigo-1100"
                        onClick={logoutModal.openModal}
                        disabled={isLoggingOut}
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <ul className="flex items-center">
                    <li className="group inline-block mx-3">
                      <NavLink to="/login" className="group-hover:text-indigo-600 text-gray-500 dark:hover:text-white" activeClassName="nav-active">
                        Login
                      </NavLink>
                    </li>
                    <li className="group inline-block mx-3">
                      <NavLink to="/register" className="button py-1" activeClassName="nav-active">
                        Register
                      </NavLink>
                    </li>
                  </ul>
                )
                }
                <ThemeToggler />
              </div>
            </div>
          </nav>
        ) : (
          <Suspense fallback={<nav className="bg-white h-60px fixed top-0 left-0 w-full shadow-md"></nav>}>
            <NavBarMobile
              isAuth={isAuth}
              theme={theme}
              auth={auth}
              openModal={logoutModal.openModal}
            />
          </Suspense>
        )
        }
        <LogoutModal
          isOpen={logoutModal.isOpen}
          closeModal={logoutModal.closeModal}
          openModal={logoutModal.openModal}
        />
      </>
    )
};

export default withTheme(withAuth(NavBar));
