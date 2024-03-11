import { useNavigate, Link } from "react-router-dom";
import '../App.css';
import Users from "../pages/Users";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/config";
import {useDispatch} from 'react-redux';
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";



export default function Landing() {

  const navigate = useNavigate();
  const user = auth.currentUser;
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function getUsernameByUID() {
      try {
        const userCollectionRef = collection(db, "users");
        const q = query(userCollectionRef, where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setUsername(doc.data().name);
        } else {
          alert("No user found for UID: " + user.uid);
        }
      } catch (error) {
        alert("Error fetching user data: " + error.message);
      }
    }

    getUsernameByUID();
  }, []);

  async function handleSignOut() {
    try {
      await signOut(auth)
      navigate("/");
    } catch (error) {
      alert(error);
    }
  }


  return (
    <div className="item-center w-full bg-white shadow-xl flex-col justify-center p-10 rounded-lg mt-28">
      <div className="mb-12">
        <h1 className="text-black text-2xl font-bold text-center uppercase tracking-[.2em] mb-8 leading-loose">Hello, welcome to your Todo List App
        <br /> 
        This is {username} 
        </h1>
      </div>


      <Link to="/todo">
        <div className="flex justify-center ">
          <button className=" btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded">
            Go to your Todo List →
          </button>
        </div>   
      </Link>  
        <Link to="/Users">
          <div className="flex justify-center ">
            <button className=" btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded">
              Account Details
            </button>
          </div> 
        </Link>
        <div className="flex justify-center ">
          <button onClick={handleSignOut} className=" btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded">
            Sign Out
          </button>
        </div> 

        <div className="absolute bottom-6 w-full font-bold text-lg left-0 text-center italic text-gray-600">
          <p>Made by Evandra Harya Putra (2602118433)</p>
        </div>

    </div>
  );
}
