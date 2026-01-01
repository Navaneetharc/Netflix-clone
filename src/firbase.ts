// import { initializeApp } from "firebase/app";
// import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
// import { addDoc, collection, getFirestore } from "firebase/firestore";
// import { toast } from "react-toastify";

// const firebaseConfig = {
//   apiKey: "AIzaSyDh_p1qzU0gAlo03ZlF5-JOr0_kWYzJh8s",
//   authDomain: "netflix-clone-2a9a0.firebaseapp.com",
//   projectId: "netflix-clone-2a9a0",
//   storageBucket: "netflix-clone-2a9a0.firebasestorage.app",
//   messagingSenderId: "915809938672",
//   appId: "1:915809938672:web:2f8cbfe6e031bffc682635"
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);

// const getAuthErrorMessage = (code: string): string => {
//   switch (code) {
//     case "auth/email-already-in-use":
//       return "This email is already in use.";
//     case "auth/invalid-email":
//       return "Please enter a valid email address.";
//     case "auth/weak-password":
//       return "Password should be at least 6 characters.";
//     case "auth/user-not-found":
//       return "No account found with this email.";
//     case "auth/wrong-password":
//       return "Incorrect password.";
//     case "auth/too-many-requests":
//       return "Too many attempts. Please try again later.";
//     default:
//       return "Something went wrong. Please try again.";
//   }
// };


// export const signup = async(name: string, email: string, password: string): Promise<void> => {
//   try{
//    const res = await createUserWithEmailAndPassword(auth,email,password);
//    const user = res.user;
//    await addDoc(collection(db, "users"), {
//     uid: user.uid,
//     name,
//     authProvider: "local",
//     email
//    });

//    toast.success("Account created successfully");
//   }catch(err: unknown){
//     if (err && typeof err === "object" && "code" in err) {
//       const message = getAuthErrorMessage((err as { code: string }).code);
//       toast.error(message);
//     }else{
//       console.error("Unknown error occurred");
//       toast.error("Something went wrong. Please try again.");
//     }
//   }
// };

// export const login = async(email:string,password:string): Promise<void> => {
//   try {
//       await signInWithEmailAndPassword(auth,email,password);
//       toast.success("Welcome back");
//   } catch (err: unknown) {
//      if (err && typeof err === "object" && "code" in err) {
//       const message = getAuthErrorMessage((err as { code: string }).code);
//       toast.error(message);
//     }else{
//       console.error("Unknown error occurred");
//       toast.error("Unable to sign in. Please try again.");
//     }
//   }
// } 

// export const logout = () => {
//   signOut(auth);
// }

// firebase.ts
import { initializeApp } from "firebase/app";
import { 
  createUserWithEmailAndPassword, 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";

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
export const db = getFirestore(app);

// 1. SIGN UP 
// We just perform the action. If it fails, the error bubbles up to AuthContext.
export const signup = async (name: string, email: string, password: string) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const user = res.user;
  
  // Create the user profile in Firestore
  await addDoc(collection(db, "users"), {
    uid: user.uid,
    name,
    authProvider: "local",
    email,
    watchlist: [] // Initial empty watchlist
  });
};

// 2. LOG IN
export const login = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};

// 3. LOG OUT
export const logout = async () => {
  await signOut(auth);
};