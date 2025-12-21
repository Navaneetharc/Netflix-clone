// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration


// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID
// };

const firebaseConfig = {
  apiKey: "AIzaSyDh_p1qzU0gAlo03ZlF5-JOr0_kWYzJh8s",
  authDomain: "netflix-clone-2a9a0.firebaseapp.com",
  projectId: "netflix-clone-2a9a0",
  storageBucket: "netflix-clone-2a9a0.firebasestorage.app",
  messagingSenderId: "915809938672",
  appId: "1:915809938672:web:2f8cbfe6e031bffc682635"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

const getAuthErrorMessage = (code: string): string => {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already in use.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
};



export const signup = async(name: string, email: string, password: string): Promise<void> => {
  try{
   const res = await createUserWithEmailAndPassword(auth,email,password);
   const user = res.user;
   await addDoc(collection(db, "users"), {
    uid: user.uid,
    name,
    authProvider: "local",
    email
   });

   toast.success("Account created successfully");
  }catch(err: unknown){
    if (err && typeof err === "object" && "code" in err) {
      const message = getAuthErrorMessage((err as { code: string }).code);
      toast.error(message);
    }else{
      console.error("Unknown error occurred");
      toast.error("Something went wrong. Please try again.");
    }
  }
};

export const login = async(email:string,password:string): Promise<void> => {
  try {
      await signInWithEmailAndPassword(auth,email,password);
      toast.success("Welcome back");
  } catch (err: unknown) {
     if (err && typeof err === "object" && "code" in err) {
      const message = getAuthErrorMessage((err as { code: string }).code);
      toast.error(message);
    }else{
      console.error("Unknown error occurred");
      toast.error("Unable to sign in. Please try again.");
    }
  }
} 

export const logout = () => {
  signOut(auth);
}
