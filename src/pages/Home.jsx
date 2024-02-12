import { useEffect, useState } from "react";
import axios from "axios";
import GroupCard from "../components/GroupCard";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [groups, setGroups] = useState(null);
  const [showGroupInputs, setGroupInputs] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [groupDes, setGroupDes] = useState('')

  const navigate = useNavigate()

  const getGroups = () => {
    axios
      .post(process.env.REACT_APP_BASIC_URL + "/get-groups", {
        user_id: "65c4b3e9983d94439e0e38ae",
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
    axios.post(process.env.REACT_APP_BASIC_URL + "/add-group", {user_id: "65c4b3e9983d94439e0e38ae",group_name: groupName, des: groupDes} ).then((res) => {
        if(res.status == 200) {
            navigate(`/group/${res.data._id}`)
        }
    }).catch((err) => {console.log(err)});;
  }

  useEffect(() => {
    setGroups(null);
    getGroups();
  }, []);
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
