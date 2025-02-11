// import { useEffect, useState } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import axios from "axios";
// import { CREATE_POST_URL } from "../constant/constantfile";
// import { supabase } from "../supabase";
// import { useLocation } from "react-router-dom";
// // import { useNavigate } from "react-router-dom";

// const CreatePost = () => {
//   const [file, setFile] = useState(null);
//   const location=useLocation();
//   const existingPost = location.state || null;
//   const [formData, setFormData] = useState({
//     title: existingPost?.title || "",
//     category: existingPost?.category || "uncategorized",
//     content: existingPost?.content || "",
//     image: existingPost?.image || "",
//   });
//   const [uploading, setUploading] = useState(false);
//   const [postError, setPostError] = useState(null);
//   const [postSuccess, setPostSuccess] = useState(false);
   
//   console.log(existingPost)
//   useEffect(() => {
//     if (existingPost) {
//       setFormData({
//         title: existingPost.title,
//         category: existingPost.category,
//         content: existingPost.content,
//         image: existingPost.image,
//       });
//     }
//   }, [existingPost]);
//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       try {
//         setUploading(true);
//         setFile(file);
//         const fileName = `${Date.now()}.${file.name.split(".").pop()}`;
//         const { data, error } = await supabase.storage.from("postPictures").upload(fileName, file);
//         if (error) throw error;
//         const { data: publicUrlData } = supabase.storage.from("postPictures").getPublicUrl(fileName);
//         setFormData((prev) => ({ ...prev, image: publicUrlData?.publicUrl }));
//       } catch (error) {
//         console.error("Upload Error:", error);
//       } finally {
//         setUploading(false);
//       }
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const handleContentChange = (content) => {
//     setFormData((prev) => ({ ...prev, content }));
//   };

//   const handlePublish = async () => {
//     setPostError(null);
//     setPostSuccess(false);
//     try {
//       const token = localStorage.getItem("authToken");
//       console.log(token)
//       const response = await axios.post(CREATE_POST_URL, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       });
//       if (response.status === 201) {
//         setPostSuccess(true);
//         setFormData({ title: "", category: "uncategorized", content: "", image: "" });
//         setFile(null);
//       }
//     } catch (error) {
//       console.error("Post creation error:", error);
//       setPostError(error.response?.data?.message || "Error creating post. Please try again.");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-900">
//       <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-md shadow-lg">
//         <h1 className="text-2xl font-semibold text-center text-white mb-6">
//         {existingPost ? "Edit Post" : "Create a Post"}
//         </h1>

//         {postError && <div className="bg-red-500 text-white p-3 rounded-md mb-4">{postError}</div>}
//         {postSuccess && <div className="bg-green-500 text-white p-3 rounded-md mb-4">Post created successfully!</div>}

//         <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
//           <input
//             type="text"
//             placeholder="Title"
//             required
//             id="title"
//             className="flex-1 p-3 bg-gray-700 text-white rounded-md"
//             onChange={handleChange}
//             value={formData.title}
//           />
//           <select className="p-3 bg-gray-700 text-gray-400 rounded-md" id="category" onChange={handleChange} value={formData.category}>
//             <option value="uncategorized">Select a category</option>
//             <option value="javascript">JavaScript</option>
//             <option value="reactjs">React.js</option>
//             <option value="nextjs">Next.js</option>
//           </select>
//         </div>

//         <div className="flex items-center gap-4 border-2 border-dashed border-gray-600 p-4 rounded-md mb-6">
//           <input type="file" className="hidden" id="file-upload" onChange={handleImageUpload} />
//           <label htmlFor="file-upload" className="px-4 py-2 bg-gray-700 text-gray-400 rounded-md cursor-pointer">Choose file</label>
//           <span className="text-gray-400">{file ? file.name : "No file chosen"}</span>
//           {uploading && <span className="text-white ml-2">Uploading...</span>}
//         </div>
//         {formData.image && <img src={formData.image} alt="Post" className="w-full h-72 object-cover mb-6" />}

//         <ReactQuill theme="snow" placeholder="Write something..." value={formData.content} onChange={handleContentChange} />

//         <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-md hover:opacity-90 mt-6" onClick={handlePublish}>
//           Publish
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreatePost;


import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { CREATE_POST_URL, EDIT_POST_URL } from "../constant/constantfile.js"; // Define your update post URL
import { supabase } from "../supabase";
import { useLocation, useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [postError, setPostError] = useState(null);
  const [postSuccess, setPostSuccess] = useState(false);
  const [publishing, setPublishing] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const existingPost = location.state || null;

  // Initial Form Data
  const [formData, setFormData] = useState({
    title: existingPost?.title || "",
    category: existingPost?.category || "uncategorized",
    content: existingPost?.content || "",
    image: existingPost?.image || "",
  });
console.log(formData)
  useEffect(() => {
    if (existingPost) {
      setFormData({
        title: existingPost.title,
        category: existingPost.category,
        content: existingPost.content,
        image: existingPost.image,
      });
    }
  }, [existingPost]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // if (!file.type.startsWith("image/")) {
    //   setPostError("Only image files are allowed.");
    //   return;
    // }

    try {
      setUploading(true);
      setFile(file);
      const fileName = `${Date.now()}.${file.name.split(".").pop()}`;
      const {  data,error } = await supabase.storage.from("postPictures").upload(fileName, file);
      if (error) throw error;
      const { data:publicUrl } = supabase.storage.from("postPictures").getPublicUrl(fileName);
      console.log(data)
      setFormData((prev) => ({ ...prev, image: publicUrl?.publicUrl }));
    } catch (error) {
      console.error("Upload Error:", error);
      setPostError("Failed to upload image. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handlePublish = async () => {
    setPublishing(true);
    setPostError(null);
    setPostSuccess(false);

    try {
      const token = localStorage.getItem("authToken");
      // if (!token) throw new Error("User not authenticated.");

      const url = existingPost ? `${EDIT_POST_URL}/${existingPost._id}` : CREATE_POST_URL;
      const method = existingPost ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: formData,
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        setPostSuccess(true);
        setFormData({ title: "", category: "uncategorized", content: "", image: "" });
        setFile(null);

        setTimeout(() => {
          navigate("/"); // Redirect to posts list after success
        }, 2000);
      }
    } catch (error) {
      console.error("Post error:", error.response || error);
      setPostError(error.response?.data?.message || "Error creating/updating post. Try again.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-md shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-white mb-6">
          {existingPost ? "Edit Post" : "Create a Post"}
        </h1>

        {postError && <div className="bg-red-500 text-white p-3 rounded-md mb-4">{postError}</div>}
        {postSuccess && <div className="bg-green-500 text-white p-3 rounded-md mb-4">
          {existingPost ? "Post updated successfully!" : "Post created successfully!"}
        </div>}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1 p-3 bg-gray-700 text-white rounded-md"
            onChange={handleChange}
            value={formData.title}
          />
          <select className="w-full p-3 bg-gray-700 text-gray-400 rounded-md" id="category" onChange={handleChange} value={formData.category}>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </select>
        </div>

        <div className="flex items-center gap-4 border-2 border-dashed border-gray-600 p-4 rounded-md mb-6">
          <input type="file" className="hidden" id="file-upload" onChange={handleImageUpload} />
          <label htmlFor="file-upload" className="px-4 py-2 bg-gray-700 text-gray-400 rounded-md cursor-pointer">Choose file</label>
          <span className="text-gray-400">{file ? file.name : "No file chosen"}</span>
          {uploading && <span className="text-white ml-2">Uploading...</span>}
        </div>

        {formData.image && <img src={formData.image} alt="Post" className="w-full h-72 object-cover mb-6" />}

        <ReactQuill theme="snow" placeholder="Write something..." value={formData.content} onChange={handleContentChange} />

        <button
          className={`w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-md hover:opacity-90 mt-6 ${publishing ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handlePublish}
          disabled={publishing}
        >
          {publishing ? (existingPost ? "Updating..." : "Publishing...") : (existingPost ? "Update Post" : "Publish")}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
