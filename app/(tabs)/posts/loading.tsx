import SkPostPreview from "@/components/skeletons/sk-post-preview";

export default function PostsLoading() {
  return [...Array(10)].map((_, index) => <SkPostPreview key={index} />);
}
