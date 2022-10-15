import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FollowButton } from '~/components/main';
import { Avatar } from "~/components/shared";
import { IProfile, IRootState, IUser } from "~/types/types";

interface IProps {
  profile: IProfile | IUser;
}

const UserCard: React.FC<IProps> = ({ profile }) => {
  const myUsername = useSelector((state: IRootState) => state.auth?.username);

  return (
    <div className="relative flex items-center justify-between px-4 py-2">
      <Link to={`/user/${profile.username}`} className="hover:opacity-80">
        <div className="flex items-center">
          <Avatar url={typeof profile.profilePicture === 'string' ? profile.profilePicture : profile.profilePicture?.url} size="lg" className="mr-2" />
          <div className="flex flex-col">
            {profile.fullname && <p className="text-xs text-gray-600 dark:text-gray-500">{profile.fullname}</p>}
            <h6 className="mr-10 max-w-md overflow-ellipsis overflow-hidden dark:text-indigo-400">@{profile.username}</h6>
          </div>
        </div>
      </Link>
      <div className="absolute px-4 bg-white dark:bg-transparent right-0 top-0 bottom-0 my-auto flex items-center">
        {profile.username === myUsername ? (
          <h4 className="text-gray-400">Me</h4>
        ) : (
          <FollowButton userID={profile.id} isFollowing={profile.isFollowing} />
        )}
      </div>
    </div>
  );
};

export default UserCard;
