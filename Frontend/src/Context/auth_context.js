import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthContextProvider(props) {
  const [loggedIn, setLoggedIn] = useState(undefined);
  const [UserName, setUsername] = useState("");
  const [userprofile, setuserprofile] = useState("");
  const [userId, setUserId] = useState("")
  async function getuserdeatils() {
    try {
      const res = await axios.get("/auth/dashboard");
      setUsername(res.data.name);
      setuserprofile(res.data.profilePic);
      setUserId(res.data._id);
      await axios.get(`/cart/${res.data._id}`)
        .then((responce) => {
          let localStore = [];
          responce.data.products.map((curElem)=>{
            localStore.push({Quantity:curElem.quantity, id: curElem.productId, images:curElem.images, max:6, name: curElem.name, price:curElem.price, total_cost:(curElem.quantity*curElem.price) })
            console.log("ls", localStore);
            if (localStore === 'undefined') {
              console.log("[]")
            }
            else{
              localStorage.setItem("SavorCart", JSON.stringify(localStore));
            }
          })
        })
    } catch (err) {
      console.error(err);
    }
  }
  async function getLoggedIn() {
    const loggedInRes = await axios.get("/auth/loggedIn");
    setLoggedIn(loggedInRes.data);
  }

  useEffect(() => {
    getuserdeatils();
    getLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ UserName, userprofile, getuserdeatils, loggedIn, getLoggedIn, userId }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContextProvider };