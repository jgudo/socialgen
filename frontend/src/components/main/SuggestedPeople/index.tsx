import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FollowButton } from "~/components/main";
import { Avatar, UserLoader } from "~/components/shared";
import { SUGGESTED_PEOPLE } from "~/constants/routes";
import { startGetSuggestedPeople } from "~/redux/slice/suggestedPeopleSlice";
import { useAppDispatch } from "~/redux/store/store2";
import { IError, IRootState } from "~/types/types";

const SuggestedPeople: React.FC = () => {
  const { people, isLoading, error } = useSelector((state: IRootState) => ({
    people: state.suggestedPeople.items.slice(0, 6),
    isLoading: state.loading.isFetchingSuggestedPeople,
    error: state.error.fetchSuggestedPeopleError,
  }));
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (people.length === 0) {
      dispatch(startGetSuggestedPeople({ offset: 0, limit: 6 }))
    }
  }, []);

  return (
    <div className="w-full py-4 bg-white dark:bg-indigo-1000 rounded-md shadow-md overflow-hidden">
      <div className="px-4 flex justify-between mb-4">
        <h4 className="dark:text-white">Suggested People</h4>
        <Link to={SUGGESTED_PEOPLE} className="text-xs underline dark:text-indigo-500">See all</Link>
      </div>
      {isLoading && (
        <div className="min-h-10rem px-4">
          <UserLoader />
          <UserLoader />
          <UserLoader />
          <UserLoader />
        </div>
      )}
      {(!isLoading && error) && (
        <div className="flex min-h-10rem items-center justify-center">
          <span className="text-gray-400 italic">
            {(error as IError)?.error?.message || 'Something went wrong :('}
          </span>
        </div>
      )}
      <div className="divide-y divide-gray-100 dark:divide-indigo-950">
        {!error && !isLoading && people.map((user) => (
          <div key={user.id || user._id}>
            <div className="relative flex items-center justify-between px-4 py-2">
              <Link to={`/user/${user.username}`} className="hover:opacity-80">
                <div className="flex items-center">
                  <Avatar url={typeof user.profilePicture === 'string' ? user.profilePicture : user.profilePicture?.url} className="mr-2" />
                  <div className="flex flex-col">
                    {user.fullname && <p className="text-xs text-gray-600 dark:text-gray-500">{user.fullname}</p>}
                    <h6 className="mr-10 text-sm overflow-ellipsis overflow-hidden dark:text-white">{user.username}</h6>
                  </div>
                </div>
              </Link>
              <div className="absolute px-4 bg-white dark:bg-indigo-1000 right-0 top-0 bottom-0 my-auto flex items-center">
                <FollowButton
                  userID={user.id || user._id}
                  isFollowing={user.isFollowing}
                  size="sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedPeople;
