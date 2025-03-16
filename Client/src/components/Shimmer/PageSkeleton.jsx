
import ShimmerLoader from './ShimmerLoader';

const PageSkeleton = () => {
  return (
    <div className="p-6 space-y-4">
      {/* Simulated Title */}
      <ShimmerLoader width="60%" height="32px" />

      {/* Simulated Content Lines */}
      <ShimmerLoader width="100%" height="16px" />
      <ShimmerLoader width="100%" height="16px" />
      <ShimmerLoader width="80%" height="16px" />

      {/* Simulated Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <ShimmerLoader height="200px" />
        <ShimmerLoader height="200px" />
        <ShimmerLoader height="200px" />
      </div>
    </div>
  );
};

export default PageSkeleton;
