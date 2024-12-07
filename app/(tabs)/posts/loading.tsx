import PostPreviewSkeleton from "@/components/skeletons/post-preview";

export default function PostsLoading() {
  return [...Array(10)].map((_, index) => <PostPreviewSkeleton key={index} />);
}
