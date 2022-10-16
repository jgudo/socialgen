import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { UserCard } from "~/components/main";
import { UserLoader } from "~/components/shared";
import { startFetchDev } from "~/redux/slice/profileSlice";
import { useAppDispatch } from "~/redux/store/store2";
import { IRootState } from "~/types/types";

const DevCard = () => {
  const dispatch = useAppDispatch();
  const { isLoading, profile } = useSelector((state: IRootState) => ({
    profile: state.profile.developer,
    isLoading: state.loading.isFetchingDev
  }))

  useEffect(() => {
    if (!profile) {
      dispatch(startFetchDev());
    }
  }, []);

  return (
    <div className="w-full py-4 bg-white dark:bg-indigo-1000 tablet:rounded-md shadow-lg overflow-hidden">
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
