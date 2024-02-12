import axios from "axios";
import React, { useContext, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { UserContext } from "../App";
import { storeInSession } from "../utils/session";
import { useNavigate } from "react-router-dom";


let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const Auth = () => {
  const [tabName, setTabName] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  let {userAuth, setUserAuth} = useContext(UserContext)

  const handleAuth = () => {
    if (tabName === "registr") {
      if (name.length < 3) {
        toast.error('імя повинно бути більше ніж 3 символи')
          
      }
      if (!email.length) {
        toast.error('введіть свій емейл')
 
      }
      if (!emailRegex.test(email)) {
        toast.error('не правильний емейл')
        
      }
      if (!passwordRegex.test(password)) {
        toast.error('пароль має бути від 6 до 20 символів, 1 цифра, 1 велика, 1 мала літера')
      }
      axios.post(process.env.REACT_APP_BASIC_URL + "/registr", {
        name,
        email,
        password,
      }).then(response=>{
        if(response.status === 200){
            console.log('front from back',response.data)
            storeInSession('user', JSON.stringify(response.data))
            setUserAuth(response.data)
          toast.success('реєстрація успішна')
           navigate('/')
        }
      });
    }
  };
  return (
    <div className="p-2">
      <Toaster />
      <div className="flex justify-center gap-5 p-2">
        <button
          className={
            (tabName == "login" ? " bg-cyan-500 " : " bg-slate-500 ") +
            " text-white px-2"
          }
          onClick={() => setTabName("login")}
        >
          Логін
        </button>
        <button
          className={
            (tabName == "registr" ? " bg-cyan-500 " : " bg-slate-500 ") +
            " text-white px-2"
          }
          onClick={() => setTabName("registr")}
        >
          Реєстрація
        </button>
      </div>
      <div className="flex flex-col">
        {tabName != "login" ? (
          <input
            className="border mb-2"
            type="text"
            placeholder="Імя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          ""
        )}
        <input
          className="border mb-2"
          type="text"
          placeholder="Емейл"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border mb-2"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleAuth} className="bg-orange-600 text-white px-3">
          {tabName == "login" ? "увійти" : "зареєструватись"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
