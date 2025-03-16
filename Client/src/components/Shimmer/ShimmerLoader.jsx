

const ShimmerLoader = ({ width = '100%', height = '20px', borderRadius = '8px' }) => {
  return (
    <div
      className="animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
};

export default ShimmerLoader;
