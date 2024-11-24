const EmptyStateFooter = ({ text }: { text: string }) => {
  return (
    <section className="flex flex-col gap-6 justify-center items-center h-screen text-gray-400">
      <h3 className="font-medium text-lg">{text}</h3>
    </section>
  );
};

export default EmptyStateFooter;