import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ExpenseCard from "../components/ExpenseCard";
import userLogo from './../img/user.png'

const Group = () => {
  const { id } = useParams();
  const [groupInfo, setGroupInfo] = useState(null);
  const [groupExpenses, setGroupExpenses] = useState(null);
  const [showSearchUser, setShowSearchUser] = useState(false);
  const [inputSearch, setInputSearch] = useState('');
  const [findedUsers, setFindedUsers] = useState(null)

  const getGroupInfo = () => {
    axios
      .post(process.env.REACT_APP_BASIC_URL + "/get-group-info", {
        group_id: id,
      })
      .then((res) => {
        setGroupInfo(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getGroupExpenses = () => {
    axios
      .post(process.env.REACT_APP_BASIC_URL + "/get-group-expense", {
        group_id: id,
      })
      .then((res) => {
        setGroupExpenses(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInputSearch =(e) => {
    setInputSearch(e.target.value)
    setFindedUsers(null)

    if(e.target.value.length > 0) {
      axios.post(process.env.REACT_APP_BASIC_URL + '/search-user', {phrase: e.target.value, group_id:id}).then(result=>{
        setFindedUsers(result.data)
        
      }).catch(err=>console.log(err))
    } 
  }

  const handleAddToGroup =(user_id) => {
    axios.post(process.env.REACT_APP_BASIC_URL + '/add-to-group', {user_id, group_id: id}).then(result=>{
        if(result.status === 200){
            setGroupInfo(null)
            setInputSearch('')
            setFindedUsers(null)
            getGroupInfo()
        }
    }).catch(err=>console.log(err))
  }

  useEffect(() => {
    setGroupInfo(null);
    setGroupExpenses(null);
    getGroupExpenses();
    getGroupInfo();
  }, []);
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="">
          <h1 className="text-2xl">
            група <strong>{groupInfo?.group_name}</strong>
          </h1>
          <p className="text-stone-600">{groupInfo?.des}</p>
        </div>
        <div className="">{groupInfo?.total_spends}</div>
      </div>

      <div className="members flex">
        учасники:
        {groupInfo?.members.map(member=>(
            <div key={member._id}>
                <img className="w-6 h-6 inline-block" src={userLogo} alt="userLogo" />
                <span>{member.name} </span>
            </div>
        ))}
        <div className="addMember">

        <button className="bg-green-700 text-white px-3" onClick={(e)=>setShowSearchUser(prev=>!prev)} >  {showSearchUser?"X":"Додати учасника"}</button>
        {showSearchUser? (<>
            <input type="text" value={inputSearch} className="border" onChange={handleInputSearch} placeholder="Почніть вводити імя користувача" />

            {findedUsers && findedUsers.map((user,i)=>(
               <div key={user._id} className="flex justify-between">
                <div className="">
               <img className="w-6 h-6 inline-block" src={userLogo} alt="userLogo" />
               <span>{user.name} </span>
                </div>
                <button onClick={()=>handleAddToGroup(user._id)} className="bg-green-700 text-white px-2">add</button>
           </div>
            ))}</>
        ):''}
        </div>
      </div>

      {groupExpenses &&
        groupExpenses.map((expense, i) => (
          <ExpenseCard key={i} expense={expense} />
        ))}
    </div>
  );
};

export default Group;
