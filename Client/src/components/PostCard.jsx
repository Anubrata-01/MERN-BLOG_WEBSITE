// import PropTypes from "prop-types";

// const PostCard = ({ post }) => {
//   const { title, image, slug, content } = post || {};
//   const backendUrl = "http://localhost:7000";

//   return (
//     <div className="p-4 rounded-2xl shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
//       <div className="overflow-hidden rounded-lg">
//         {image ? (
//           <img
//             src={`${backendUrl}${image}`}
//             alt={title}
//             className="w-full h-48 object-cover"
//           />
//         ) : (
//           <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
//             No Image Available
//           </div>
//         )}
//       </div>
//       <div className="mt-4">
//         <h2 className="text-xl font-bold text-gray-800">{title || "Untitled Post"}</h2>
        
//         {slug && (
//           <a
//             href={`/post/${slug}`}
//             className="text-blue-500 hover:underline text-sm mt-4 inline-block"
//           >
//             Read More
//           </a>
//         )}
//       </div>
//     </div>
//   );
// };

// PostCard.propTypes = {
//   post: PropTypes.shape({
//     title: PropTypes.string,
//     image: PropTypes.string,
//     slug: PropTypes.string,
//     content: PropTypes.string,
//   }),
// };

// export default PostCard;

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
    const backendUrl="http://localhost:7000"
  return (
    <div className='group relative w-full border border-teal-500 hover:border-2 h-[300px] sm:h-[380px] overflow-hidden rounded-lg sm:w-auto transition-all'>
      <Link to={`/post/${post.slug}`}>
        <img
          src={`${backendUrl}${post?.image}`}
            
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
