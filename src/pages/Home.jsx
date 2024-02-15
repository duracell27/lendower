import { useContext, useEffect, useState } from "react";
import axios from "axios";
import GroupCard from "../components/GroupCard";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const Home = () => {
  const [groups, setGroups] = useState(null);
  const [showGroupInputs, setGroupInputs] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [groupDes, setGroupDes] = useState('')

  const navigate = useNavigate()
  let {userAuth:{access_token, id}} = useContext(UserContext)
  

  const getGroups = () => {
    axios
      .post(process.env.REACT_APP_BASIC_URL + "/get-groups", {
        user_id: id,
      })
      .then((res) => {
        setGroups(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleShowAddGroup = () => {
    setGroupInputs(prev=>!prev)
  }

  const handleAddGroup = () =>{
    axios.post(process.env.REACT_APP_BASIC_URL + "/add-group", {user_id: id,group_name: groupName, des: groupDes} ).then((res) => {
        if(res.status == 200) {
            navigate(`/group/${res.data._id}`)
        }
    }).catch((err) => {console.log(err)});;
  }

  useEffect(() => {
    setGroups(null);
    getGroups();
  }, []);
  if(!access_token){
    return (
      <div className="flex flex-col bg-amber-200 justify-center items-center py-10">
        <h3>привіт, я допоможу тобі порахувати ваші витрати у ваших тусовках</h3>
        <button onClick={()=>navigate('/auth')} className="bg-orange-600 text-white mt-5 px-3">почати рахувати</button>
      </div>
    )
  }
  return (
    
    <div>
      <h1 className="text-2xl">Ваші групи</h1>

      {groups &&
        groups.data.map((group) => (
          <div key={group._id}>
            <GroupCard group={group} />
          </div>
        ))}

        <div className="flex justify-center flex-col">
            <button onClick={handleShowAddGroup} className="bg-green-500 px-5"> {showGroupInputs?'X':"створити групу"}</button>
            {showGroupInputs?(<div className="group_inputs flex flex-col">
                <input className="border" value={groupName} onChange={(e)=>setGroupName(e.target.value)} type="text" placeholder="Введіть назву групи" />
                <input className="border" value={groupDes} onChange={(e)=>setGroupDes(e.target.value)} type="text" placeholder="Введіть опис групи" />
                <button className="bg-green-500 px-5" onClick={handleAddGroup}>Cтворити</button>
            </div>):''}
            
        </div>
    </div>
  );
};

export default Home;
