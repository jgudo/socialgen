import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import { Boundary, ProfileLoader } from "~/components/shared";
import * as ROUTE from "~/constants/routes";
import { PageNotFound } from "~/pages";
import { setPosts, setPostsOffset, startFetchProfile } from "~/redux/slice/profileSlice";
import { useAppDispatch } from "~/redux/store/store2";
import { IRootState, IUser } from "~/types/types";
import DevCard from "../home/DevCard";
import Header from './Header';
import * as Tab from './Tabs';

interface MatchParams {
  username: string;
}

interface IProps extends RouteComponentProps<MatchParams> {
  children: React.ReactNode;
}

const Profile: React.FC<IProps> = (props) => {
  const dispatch = useAppDispatch();
  const { username } = props.match.params;
  const state = useSelector((state: IRootState) => ({
    profile: state.profile.data,
    auth: state.auth,
    error: state.error.fetchProfileError,
    isLoadingGetUser: state.loading.isFetchingProfile
  }));

  useEffect(() => {
    if (state.profile?.username !== username) {
      dispatch(setPostsOffset(0));
      dispatch(setPosts([]));
      dispatch(startFetchProfile(username));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Boundary>
      {(state.error && !state.isLoadingGetUser) && (
        <PageNotFound />
      )}
      {(state.isLoadingGetUser) && (
        <div className="pt-14"><ProfileLoader /></div>
      )}
      {(!state.error && !state.isLoadingGetUser && state.profile?.id) && (
        <div className="pt-14">
          <Header
            auth={state.auth as IUser}
            profile={state.profile}
          />
          <div className="laptop:px-6% relative flex min-h-10rem  items-start transform laptop:-translate-y-24">
            <div className="hidden laptop:block laptop:w-1/4 laptop:mr-4 laptop:sticky laptop:top-44">
              <Tab.Bio
                bio={state.profile.info.bio}
                dateJoined={state.profile.dateJoined}
              />
            </div>
            <div className="w-full laptop:w-2/4 mb-14">
              <Switch>
                <Route exact path={ROUTE.PROFILE}>
                  <Tab.Posts
                    username={username}
                    auth={state.auth as IUser}
                    isOwnProfile={state.profile?.username !== username}
                  />
                </Route>
                <Route path={ROUTE.PROFILE_FOLLOWERS}>
                  <Tab.Followers isOwnProfile={state.profile?.username !== username} username={username} />
                </Route>
                <Route path={ROUTE.PROFILE_FOLLOWING}>
                  <Tab.Following isOwnProfile={state.profile?.username !== username} username={username} />
                </Route>
                <Route path={ROUTE.PROFILE_BOOKMARKS}>
                  <Tab.Bookmarks username={username} isOwnProfile={state.profile.isOwnProfile} />
                </Route>
                <Route path={ROUTE.PROFILE_INFO}>
                  <Tab.Info />
                </Route>
                <Route path={ROUTE.PROFILE_EDIT_INFO}>
                  <Tab.EditInfo isOwnProfile={state.profile.isOwnProfile} profile={state.profile} />
                </Route>
              </Switch>
            </div>
            <div className="hidden laptop:block laptop:w-1/4 laptop:sticky laptop:top-44 ml-4 space-y-4">
              <DevCard />
            </div>
          </div>
        </div>
      )}
    </Boundary>
  );
};

export default Profile;
