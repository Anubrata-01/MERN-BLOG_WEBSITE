
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className='group relative w-full border border-teal-500 hover:border-2 h-[300px] sm:h-[380px] overflow-hidden rounded-lg sm:w-auto transition-all'>
      <Link to={`/post/${post.slug}`}>
        <img
          src={`${post?.image}`}
            
          alt='post cover'
          className='h-[200px] sm:h-[280px] w-full  object-cover group-hover:h-[170px] sm:group-hover:h-[200px] transition-all duration-300 z-20'
        />
      </Link>
      <div className='p-3 flex flex-col gap-2'>
        <p className='text-sm sm:text-lg font-semibold line-clamp-2'>{post.title}</p>
        <span className='italic text-sm'>{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
        >
          Read article
        </Link>
      </div>
    </div>
  );
}

PostCard.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    category:PropTypes.string,
    image: PropTypes.string,
    slug: PropTypes.string,
    content: PropTypes.string,
  }),
};
