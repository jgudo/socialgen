import { createBrowserHistory } from 'history';
import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import { Route, Router, Switch } from "react-router-dom";
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Chats } from '~/components/main';
import { NavBar, Preloader } from "~/components/shared";
import * as ROUTE from "~/constants/routes";
import * as pages from '~/pages';
import { ProtectedRoute, PublicRoute } from "~/routers";
import { startCheckSession } from './redux/slice/authSlice';
import { useAppDispatch } from './redux/store/store2';
import { IRootState } from './types/types';

export const history = createBrowserHistory();

function App() {
  // const [isCheckingSession, setCheckingSession] = useState(true);
  // const dispatch = useDispatch();
  const isCheckingSession = useSelector((state: IRootState) => state.loading.isCheckingSession);
  const dispatch = useAppDispatch();
  const isNotMobile = window.screen.width >= 800;

  useEffect(() => {
    dispatch(startCheckSession());
    // (async () => {
    //   try {
    //     const auth = await checkSession();

    //     dispatch(loginSuccess(auth));

    //     socket.on('connect', () => {
    //       socket.emit('userConnect', auth.id);
    //       console.log('Client connected to socket.');
    //     });

    //     // Try to reconnect again
    //     socket.on('error', function () {
    //       socket.emit('userConnect', auth.id);
    //     });

    //     setCheckingSession(false);
    //   } catch (e) {
    //     console.log('ERROR', e);
    //     setCheckingSession(false);
    //   }
    // })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isCheckingSession ? (
    <Preloader />
  ) : (
    <Router history={history}>
      <main className="relative min-h-screen">
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          transition={Slide}
          draggable={false}
          hideProgressBar={true}
          bodyStyle={{ paddingLeft: '15px' }}
        />
        <NavBar />
        <Switch>
          <PublicRoute path={ROUTE.REGISTER} component={pages.Register} />
          <PublicRoute path={ROUTE.LOGIN} component={pages.Login} />
          <PublicRoute path={ROUTE.FORGOT_PASSWORD} component={pages.ForgotPassword} />
          <PublicRoute path={ROUTE.PASSWORD_RESET} component={pages.PasswordReset} />
          <ProtectedRoute path={ROUTE.SEARCH} component={pages.Search} />
          <Route path={ROUTE.HOME} exact render={(props: any) => <pages.Home key={Date.now()} {...props} />} />
          <ProtectedRoute path={ROUTE.POST} component={pages.Post} />
          <ProtectedRoute path={ROUTE.PROFILE} component={pages.Profile} />
          <ProtectedRoute path={ROUTE.CHAT} component={pages.Chat} />
          <ProtectedRoute path={ROUTE.SUGGESTED_PEOPLE} component={pages.SuggestedPeople} />
          <Route path={ROUTE.SOCIAL_AUTH_FAILED} component={pages.SocialAuthFailed} />
          <Route path={ROUTE.ACCOUNT_VERIFIED} component={pages.AccountVerified} />
          <Route path={ROUTE.ACCOUNT_VERIFICATION_FAILED} component={pages.AccountVerificationFailed} />
          <Route component={pages.PageNotFound} />
        </Switch>
        {isNotMobile && <Chats />}
      </main>
    </Router>
  );
}

export default App;
