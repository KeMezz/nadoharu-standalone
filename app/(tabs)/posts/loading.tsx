import PostPreviewSkeleton from "@/components/domains/post/preview-skeleton";

export default function PostsLoading() {
  return [...Array(10)].map((_, index) => <PostPreviewSkeleton key={index} />);
}
