
// import { useState } from "react";
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import axios from 'axios';
// import { CREATE_POST_URL, UPLOAD_URL } from "../constant/constantfile";


// const CreatePost = () => {
//     const [file, setFile] = useState(null);
//     const [formData, setFormData] = useState({
//       title: '',
//       category: 'uncategorized',
//       content: '',
//       image: '',
//     });
//     const [uploading, setUploading] = useState(false);
//     const [uploadError, setUploadError] = useState(null);
//     const [postError, setPostError] = useState(null);
//     const [postSuccess, setPostSuccess] = useState(false);
//     const [imagePreview, setImagePreview] = useState(null);
  
//     const handleImageUpload = async (e) => {
//       const file = e.target.files[0];
//       if (file) {
//         setFile(file);
//         try {
//           setUploading(true);
//           const uploadFormData = new FormData();
//           uploadFormData.append('image', file);
  
//           const response = await fetch(UPLOAD_URL, {
//             method: 'POST',
//             body: uploadFormData,
//             credentials: 'include',
//           });
  
//           if (response.ok) {
//             const data = await response.json();
//             if (data?.path) {
//               setFormData((prev) => ({
//                 ...prev,
//                 image: data.path,
//               }));
//               setImagePreview(URL.createObjectURL(file));
//             } else {
//               setUploadError('Failed to upload image. Path is missing.');
//             }
//           } else {
//             setUploadError('Failed to upload image. Please try again.');
//           }
//         } catch (error) {
//           console.error('Upload Error:', error);
//           setUploadError(
//             error.response?.data?.message ||
//               'An error occurred while uploading the image.'
//           );
//         } finally {
//           setUploading(false);
//         }
//       }
//     };
    

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.id]: e.target.value });
//     };

//     const handlePublish = async () => {
//         setPostError(null);
//         setPostSuccess(false);

//         try {
//             const token = localStorage.getItem('authToken');
//             const response = await axios.post(CREATE_POST_URL, formData, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 },
//                 withCredentials: true,
//             });

//             if (response.status === 201) {
//                 setPostSuccess(true);
//                 setFormData({
//                     title: '',
//                     category: 'uncategorized',
//                     content: '',
//                     image: '',
//                 });
//                 setFile(null);
//                 setImagePreview(null);
//             }
//         } catch (error) {
//             console.error("Post creation error:", error);
//             setPostError(error.response?.data?.message || 'Error creating post. Please try again.');
//         }
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-900">
//             <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-md shadow-lg">
//                 <h1 className="text-2xl font-semibold text-center text-white mb-6">Create a post</h1>

//                 {postError && (<div className="bg-red-500 text-white p-3 rounded-md mb-4">{postError}</div>)}
//                 {postSuccess && (<div className="bg-green-500 text-white p-3 rounded-md mb-4">Post created successfully!</div>)}

//                 <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
//                     <input type="text" placeholder="Title" required id="title" className="flex-1 p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} value={formData.title} />
//                     <select className="p-3 bg-gray-700 text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" id="category" onChange={handleChange} value={formData.category}>
//                         <option value='uncategorized'>Select a category</option>
//                         <option value='javascript'>JavaScript</option>
//                         <option value='reactjs'>React.js</option>
//                         <option value='nextjs'>Next.js</option>
//                     </select>
//                 </div>

//                 <div className="flex items-center gap-4 border-2 border-dashed border-gray-600 p-4 rounded-md mb-6">
//                     <input type="file" className="hidden" id="file-upload" onChange={handleImageUpload} />
//                     <label htmlFor="file-upload" className="px-4 py-2 bg-gray-700 text-gray-400 rounded-md cursor-pointer">Choose file</label>
//                     <span className="text-gray-400">{file ? file.name : "No file chosen"}</span>
//                     {uploading && <span className="text-white ml-2">Uploading...</span>}
//                     {uploadError && <span className="text-red-500 ml-2">{uploadError}</span>}
//                 </div>
//                 {imagePreview && (
//                     <img src={imagePreview || formData?.image} alt={formData.title || "Post Image"} className='w-full h-72 object-cover' />
//                 )}
//                 <div className="mb-6">
//                     <textarea placeholder="Write something..." className="w-full p-4 bg-gray-700 text-gray-400 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none" id="content" onChange={handleChange} value={formData.content}></textarea>
//                 </div>

//                 <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-md hover:opacity-90" onClick={handlePublish}>Publish</button>
//             </div>
//         </div>
//     );
// };

// export default CreatePost;


import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { CREATE_POST_URL, UPLOAD_URL } from "../constant/constantfile";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "uncategorized",
    content: "",
    image: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [postError, setPostError] = useState(null);
  const [postSuccess, setPostSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      try {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append("image", file);

        const response = await fetch(UPLOAD_URL, {
          method: "POST",
          body: uploadFormData,
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.path) {
            setFormData((prev) => ({
              ...prev,
              image: data.path,
            }));
            setImagePreview(URL.createObjectURL(file));
          } else {
            setUploadError("Failed to upload image. Path is missing.");
          }
        } else {
          setUploadError("Failed to upload image. Please try again.");
        }
      } catch (error) {
        console.error("Upload Error:", error);
        setUploadError(
          error.response?.data?.message ||
            "An error occurred while uploading the image."
        );
      } finally {
        setUploading(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleContentChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handlePublish = async () => {
    setPostError(null);
    setPostSuccess(false);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(CREATE_POST_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.status === 201) {
        setPostSuccess(true);
        setFormData({
          title: "",
          category: "uncategorized",
          content: "",
          image: "",
        });
        setFile(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Post creation error:", error);
      setPostError(
        error.response?.data?.message || "Error creating post. Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-md shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-white mb-6">
          Create a post
        </h1>

        {postError && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4">
            {postError}
          </div>
        )}
        {postSuccess && (
          <div className="bg-green-500 text-white p-3 rounded-md mb-4">
            Post created successfully!
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1 p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={formData.title}
          />
          <select
            className="p-3 bg-gray-700 text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="category"
            onChange={handleChange}
            value={formData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </select>
        </div>

        <div className="flex items-center gap-4 border-2 border-dashed border-gray-600 p-4 rounded-md mb-6">
          <input
            type="file"
            className="hidden"
            id="file-upload"
            onChange={handleImageUpload}
          />
          <label
            htmlFor="file-upload"
            className="px-4 py-2 bg-gray-700 text-gray-400 rounded-md cursor-pointer"
          >
            Choose file
          </label>
          <span className="text-gray-400">
            {file ? file.name : "No file chosen"}
          </span>
          {uploading && <span className="text-white ml-2">Uploading...</span>}
          {uploadError && (
            <span className="text-red-500 ml-2">{uploadError}</span>
          )}
        </div>
        {imagePreview && (
          <img
            src={imagePreview || formData?.image}
            alt={formData.title || "Post Image"}
            className="w-full h-72 object-cover"
          />
        )}
        <div className="mb-6 ">
          <ReactQuill
            theme="snow"
            placeholder="Write something..."
            className="text-yellow-50"
            value={formData.content}
            onChange={handleContentChange}
          />
        </div>

        <button
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-md hover:opacity-90"
          onClick={handlePublish}
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
