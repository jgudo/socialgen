import { LoadingOutlined } from "@ant-design/icons";
import React, { lazy, Suspense } from "react";

const EditPostModal = lazy(() => import('./EditPostModal'));
const PostLikesModal = lazy(() => import('./PostLikesModal'));
const DeletePostModal = lazy(() => import('./DeletePostModal'));

const PostModals = () => {
  return (
    <Suspense fallback={<LoadingOutlined className="text-gray-800 dark:text-white" />}>
      <DeletePostModal />
      <EditPostModal />
      <PostLikesModal />
    </Suspense>
  );
}

export default PostModals;
