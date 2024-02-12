
import Header from "./components/Header";

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Group from "./pages/Group";
import Auth from "./pages/Auth";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./utils/session";

export const UserContext = createContext({})


function App() {
  const [userAuth, setUserAuth] = useState('')

  useEffect(()=>{
    let userInSession = lookInSession('user')
    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null });
  },[])

  return (
    <UserContext.Provider value={{userAuth, setUserAuth}}>

    <Routes>
      <Route path="/" element={<Header/>}>
        <Route index element={<Home/>} />
        <Route path="/auth" element={<Auth/>}/>
        <Route path="/group/:id" element={<Group/>}/>
      </Route>

    </Routes>
    </UserContext.Provider>
    // <div className="App">

    //   <
    //   <Header />
    //   <div className="container">
    //     <h1 className="text-2xl">Ваші групи</h1>
    //     {groups && groups.data.map((group) => (
    //       <div key={group._id}>
    //         <GroupCard group={group}/>
    //       </div>
    //     ))}
    //   </div>
    // </div>
  );
}

export default App;
