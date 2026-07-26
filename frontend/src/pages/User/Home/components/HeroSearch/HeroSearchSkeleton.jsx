const HeroSearchSkeleton = () => {
  return (
    <section className="animate-pulse flex justify-between items-center px-10 py-12">

      {/* Left Side */}
      <div className="flex-1">

        <div className="h-5 w-48 bg-gray-300 rounded mb-6"></div>

        <div className="h-10 w-96 bg-gray-300 rounded mb-3"></div>
        <div className="h-10 w-72 bg-gray-300 rounded mb-8"></div>

        <div className="flex gap-3 mb-8">
          <div className="h-14 flex-1 bg-gray-200 rounded-xl"></div>
          <div className="h-14 w-52 bg-gray-300 rounded-xl"></div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-28 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-32 bg-gray-200 rounded-full"></div>
        </div>

      </div>

      {/* Right Side */}
      <div className="ml-12 w-[450px] h-[450px] bg-gray-300 rounded-3xl"></div>

    </section>
  );
};

export default HeroSearchSkeleton;