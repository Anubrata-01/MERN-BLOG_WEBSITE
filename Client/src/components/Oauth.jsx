import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { app } from "../firebase.js";
import { useAtom } from "jotai";
import { userInfoAtom } from "../StoreContainer/store.js";
import { SIGNIN_WITH_GOOGLE_URL } from "../constant/constantfile.js";

const Oauth = () => {
    const auth = getAuth(app)
    const navigate = useNavigate();
    const [,setUserInfo]=useAtom(userInfoAtom)
    const handleGoogleClick=async()=>{
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            console.log(resultsFromGoogle)
            const res = await fetch(SIGNIN_WITH_GOOGLE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
                credentials:"include"
                })
            const data = await res.json()
            console.log(data);
            if (res.ok){
                setUserInfo(data);
                navigate('/')
            }
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <button className="w-full mt-2 bg-gradient-to-r flex justify-center from-red-500 to-purple-500 text-white py-2 rounded-md hover:bg-teal-700 focus:outline-none focus:ring focus:ring-teal-300 dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus:ring-teal-400" onClick={handleGoogleClick}>
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </button>
  );
};

export default Oauth;
