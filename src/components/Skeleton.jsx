function CardSkeleton() {
  return (
    <div className="card skeleton-card" aria-hidden="true">
      <div className="poster">
        <div className="skeleton shimmer-poster" />
      </div>
      <div className="card-body">
        <div className="skeleton shimmer-line w-70" />
        <div className="skeleton shimmer-line w-40" />
        <div className="skeleton shimmer-line w-55 short" />
      </div>
    </div>
  );
}

function GridSkeleton({ count = 12 }) {
  return (
    <div className="movie-grid">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export { CardSkeleton, GridSkeleton };
export default GridSkeleton;
