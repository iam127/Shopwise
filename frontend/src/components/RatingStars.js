import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';

export default function RatingStars({ rating = 0, total = 0, size = 14, showCount = true }) {
  const ratingNum = parseFloat(rating) || 0;
  const fullStars = Math.floor(ratingNum);
  const hasHalfStar = ratingNum - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  if (total === 0) {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <StarBorderIcon key={s} className="text-gray-300" style={{ fontSize: size }} />
        ))}
        <span className="text-gray-400 text-xs ml-1">Sin reseñas</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={'full-' + i} className="text-yellow-400" style={{ fontSize: size }} />
      ))}
      {hasHalfStar && <StarHalfIcon className="text-yellow-400" style={{ fontSize: size }} />}
      {[...Array(emptyStars)].map((_, i) => (
        <StarBorderIcon key={'empty-' + i} className="text-gray-300" style={{ fontSize: size }} />
      ))}
      {showCount && (
        <span className="text-gray-400 text-xs ml-1">
          {ratingNum.toFixed(1)} ({total})
        </span>
      )}
    </div>
  );
}