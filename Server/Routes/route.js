import Router from 'express';
import { createPost, deleteUser, editPost, getPosts, getUsers, Logout, SignInFunction, SigninWithGoogle, SignUpFunction, updateUserProfile, UserInfo,deletePost } from '../Controllers/ControllerFunctions.js';
import authenticateMiddleware from '../Middlewars/middleware.js';
const router=Router();
router.post('/signup',SignUpFunction);
router.post('/signin',SignInFunction);
router.post('/google',SigninWithGoogle)
router.get('/userinfo',authenticateMiddleware,UserInfo);
router.post('/logout',authenticateMiddleware,Logout);
router.get('/getusers',authenticateMiddleware,getUsers);
router.post('/createpost', authenticateMiddleware, createPost);
router.put('/editpost/:postId',authenticateMiddleware,editPost);
router.delete('/deletepost/:postId',authenticateMiddleware,deletePost)
router.get('/getposts',getPosts);
router.put('/update/:userId',updateUserProfile);
router.delete('/delete/:userId',authenticateMiddleware,deleteUser);
export default router;