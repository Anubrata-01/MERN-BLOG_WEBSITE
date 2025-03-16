import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const {
    title = 'Untitled',
    category = 'Uncategorized',
    image = '',
    slug = '',
  } = post || {};

  const imageSrc = image.startsWith('http')
    ? image
    : `${import.meta.env.VITE_BACKEND_URL}${image}`;

  return (
    <div className="group relative w-full sm:w-auto h-[300px] sm:h-[380px] overflow-hidden rounded-lg border border-teal-500 hover:border-2 transition-all duration-300">
      <Link to={`/post/${slug}`} className="block h-[200px] sm:h-[280px] overflow-hidden">
        <picture>
          {/* Example of adding a WebP source for modern browsers */}
          <source srcSet={imageSrc} type="image/webp" />
          {/* Fallback image */}
          <img
            src={imageSrc}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-all duration-300 group-hover:h-[170px] sm:group-hover:h-[200px]"
          />
        </picture>
      </Link>

      <div className="p-3 flex flex-col gap-2">
        <p className="text-sm sm:text-lg font-semibold line-clamp-2">
          {title}
        </p>
        <span className="italic text-sm text-gray-500">{category}</span>

        <Link
          to={`/post/${slug}`}
          className="absolute bottom-[-200px] left-0 right-0 m-2 py-2 text-center rounded-md !rounded-tl-none border border-teal-500 text-teal-500 bg-white group-hover:bottom-0 hover:bg-teal-500 hover:text-white transition-all duration-300"
        >
          Read Article
        </Link>
      </div>
    </div>
  );
}

PostCard.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
};
