import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { UserCard } from "~/components/main";
import { UserLoader } from "~/components/shared";
import { startFetchProfile } from "~/redux/slice/profileSlice";
import { useAppDispatch } from "~/redux/store/store2";
import { IRootState } from "~/types/types";

const DevCard = () => {
  const dispatch = useAppDispatch();
  const { isLoading, profile, auth } = useSelector((state: IRootState) => ({
    auth: state.auth,
    profile: state.profile.developer,
    isLoading: state.loading.isFetchingProfile
  }))

  useEffect(() => {
    if (!profile) {
      dispatch(startFetchProfile('jgudo'));
    }
  }, []);

  return (
    <div className="w-full py-4 bg-white dark:bg-indigo-1000 rounded-md shadow-lg overflow-hidden">
      <div className="px-4 flex justify-between mb-4">
        <h4 className="dark:text-white">Follow the Dev.</h4>
      </div>
      {isLoading && !profile ? (
        <UserLoader />
      ) : profile ? (
        <UserCard profile={profile} />
      ) : null}
    </div>
  );
};

export default DevCard;
