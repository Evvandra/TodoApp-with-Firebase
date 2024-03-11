import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../firebase/config.js';
import { addDoc, collection, doc, getDocs, getFirestore, query, where, updateDoc} from "firebase/firestore";
import { Avatar } from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";

// Ensure to call getFirestore to get the Firestore instance


export default function Users() {
  const user = auth.currentUser;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("")
  const [newUsername, setNewUsername] = useState("");
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');


  useEffect(() => {
    async function getUsernameProfile() {
      try {
        const userCollectionRef = collection(db, "users");
        const q = query(userCollectionRef, where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setUsername(doc.data().name);
          setEmail(doc.data().email)
          setUrl(doc.data().profileURL);
        } else {
          alert("No user found for UID: " + user.uid);
        }
      } catch (error) {
        alert("Error fetching user data: " + error.message);
      }
    }

    getUsernameProfile();
  }, []);

  function handleProfileChange(e) {
    if (e.target.files[0]) {
        setImage(e.target.files[0]);
    }
  }

  async function uploadProfile() {
    try {
        const imageRef = ref(storage, `${user.uid}/profile-image`);
        await uploadBytes(imageRef, image);
        const downloadURL = await getDownloadURL(imageRef);

        const userCollectionRef = collection(db, "users");
        const q = query(userCollectionRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef, {
                profileURL: downloadURL
            });
            setUrl(downloadURL);
            alert("Profile image uploaded successfully!");
        } else {
            alert("User document not found");
        }
    } catch (error) {
       alert("Error uploading profile image: " + error.message);
    }
}

  async function updateUsername() {

    if (!newUsername.trim()) {
        alert("Username must not be blank")
        return; 
    }
    
    try {
        const userCollectionRef = collection(db, "users");
        const q = query(userCollectionRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef, {
                name: newUsername,
            })
            setUsername(newUsername);
            alert("Username updated successfully");
            setNewUsername("");
        } else {
            alert("User document not found");
        }
    } catch (error) {
        alert(error.message);
    }

  }

  function handleUsername(e) {
    if (e.target.value.includes(' ')) {
        alert("Username must not include spaces")
        return;
    }
    setNewUsername(e.target.value);
}

  return (
      <div className="bg-white overflow-hidden shadow rounded-lg border">
        
        <div className="px-4 py-5 sm:px-6">

            <h3 className="text-lg leading-6 font-medium text-gray-900">
                {username}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                This is some information about the user.
            </p>
        </div>
        <div className="flex justify-center mb-6 flex-col items-center">
          <Avatar src={url} sx={{ width: 96, height: 96 }}/>
          <input type="file" onChange={handleProfileChange} className="text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block py-2.5 focus:px-1 mt-5"/>
        </div>

        <div className="flex justify-center my-6">
            <button className="h-8 px-5 py-1 rounded-lg shadow-xl bg-blue-500 hover:bg-blue-600" onClick={uploadProfile}>Upload Image</button> 
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                        Full name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {username}
                    </dd>
                    <input type="text" id="username" name="username" className="h-8 border rounded-lg border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-2 " placeholder={username}
                            onChange={handleUsername} value={newUsername} required autoFocus/>
                    <button className="w-28 h-8 px-5 py-1 rounded-lg shadow-xl bg-green-500 hover:bg-green-600" onClick={updateUsername}>Change</button> 
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                        Email address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {email}
                    </dd>
                </div>
            </dl>
        </div>
      </div>
  )
}