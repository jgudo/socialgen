import { StarOutlined, TeamOutlined } from "@ant-design/icons";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar } from "~/components/shared";
import { IRootState } from "~/types/types";

const SideMenu  = () => {
  const { profilePicture, username } = useSelector((state: IRootState) => ({
    profilePicture: state.auth?.profilePicture,
    username: state.auth?.username
  }));

  return (
    <ul className="overflow-hidden bg-white dark:bg-indigo-1000 laptop:shadow-md laptop:rounded-md ">
      <li className="px-4 py-3 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900">
        <Link to={`/user/${username}`} className="flex items-center text-black">
          <Avatar url={typeof profilePicture === 'string' ? profilePicture : profilePicture?.url} className="mr-4" />
          <h6 className="text-sm dark:text-white">My Profile</h6>
        </Link>
      </li>
      <li className="px-4 py-3 cursor-pointer mt-4 hover:bg-indigo-100  dark:hover:bg-indigo-900">
        <Link to={`/user/${username}/following`} className="flex items-center text-black">
          <TeamOutlined className="text-indigo-700 dark:text-indigo-400" style={{ fontSize: '30px', marginRight: '25px' }} />
          <h6 className="text-sm dark:text-white">Following</h6>
        </Link>
      </li>
      <li className="px-4 py-3 cursor-pointer mt-4 hover:bg-indigo-100  dark:hover:bg-indigo-900">
        <Link to={`/user/${username}/followers`} className="flex items-center text-black">
          <TeamOutlined className="text-indigo-700 dark:text-indigo-400" style={{ fontSize: '30px', marginRight: '25px' }} />
          <h6 className="text-sm dark:text-white">Followers</h6>
        </Link>
      </li>
      <li className="px-4 py-3 cursor-pointer mt-4 hover:bg-indigo-100  dark:hover:bg-indigo-900">
        <Link to={`/user/${username}/bookmarks`} className="flex items-center text-black">
          <StarOutlined className="text-indigo-700 dark:text-indigo-400" style={{ fontSize: '30px', marginRight: '25px' }} />
          <h6 className="text-sm dark:text-white">Bookmarks</h6>
        </Link>
      </li>
    </ul>
  )
};

export default SideMenu;
