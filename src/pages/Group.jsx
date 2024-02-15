import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ExpenseCard from "../components/ExpenseCard";
import userLogo from "./../img/user.png";
import ExpenseDivide from "../components/ExpenseDivide";

const Group = () => {
  const { id } = useParams();
  const [groupInfo, setGroupInfo] = useState(null);
  const [groupExpenses, setGroupExpenses] = useState(null);
  const [showSearchUser, setShowSearchUser] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [findedUsers, setFindedUsers] = useState(null);

  const [expenseTypes, setExpenseTypes] = useState([
    "порівно",
    "відсотково",
    "розподіл",
    "вручну",
    "додаткові витрати",
  ]);
  const [activeExpenseType, setActiveExpenseType] = useState("порівно");
  const [paid_by, setPaid_by] = useState(null);

  const [expenseName, setExpenseName] = useState("");
  const [expensePrice, setExpensePrice] = useState("");

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showExpenseDivide, setShowExpenseDivide] = useState(false);

  const getGroupInfo = () => {
    axios
      .post(process.env.REACT_APP_BASIC_URL + "/get-group-info", {
        group_id: id,
      })
      .then((res) => {
        setGroupInfo(res.data);
        setPaid_by(res.data.members[0]._id);
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

  const handleInputSearch = (e) => {
    setInputSearch(e.target.value);
    setFindedUsers(null);

    if (e.target.value.length > 0) {
      axios
        .post(process.env.REACT_APP_BASIC_URL + "/search-user", {
          phrase: e.target.value,
          group_id: id,
        })
        .then((result) => {
          setFindedUsers(result.data);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleAddToGroup = (user_id) => {
    axios
      .post(process.env.REACT_APP_BASIC_URL + "/add-to-group", {
        user_id,
        group_id: id,
      })
      .then((result) => {
        if (result.status === 200) {
          setGroupInfo(null);
          setInputSearch("");
          setFindedUsers(null);
          getGroupInfo();
        }
      })
      .catch((err) => console.log(err));
  };

  const handleExpensePrice = (e) => {
    setExpensePrice(e.target.value);
    if (e.target.value.length > 0) {
      setShowExpenseDivide(true);
    } else setShowExpenseDivide(false);
  };

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
        <div className="text-gray-400">загальні витрати: <strong className="text-black">{groupInfo?.total_spends} ₴</strong></div>
      </div>

      <div className="members flex p-2 border">
        учасники:
        {groupInfo?.members.map((member) => (
          <div
            key={member._id}
            className="bg-gray-400 rounded-xl px-2 text-white mx-2"
          >
            <img
              className="w-6 h-6 inline-block"
              src={userLogo}
              alt="userLogo"
            />
            <span>{member.name} </span>
          </div>
        ))}
        <div className="addMember flex-1 text-right">
          <button
            className="bg-green-700 text-white px-3"
            onClick={(e) => setShowSearchUser((prev) => !prev)}
          >
            {" "}
            {showSearchUser ? "X" : "Додати учасника"}
          </button>
          {showSearchUser ? (
            <>
              <input
                type="text"
                value={inputSearch}
                className="border"
                onChange={handleInputSearch}
                placeholder="Почніть вводити імя користувача"
              />

              {findedUsers &&
                findedUsers.map((user, i) => (
                  <div key={user._id} className="flex justify-between">
                    <div className="">
                      <img
                        className="w-6 h-6 inline-block"
                        src={userLogo}
                        alt="userLogo"
                      />
                      <span>{user.name} </span>
                    </div>
                    <button
                      onClick={() => handleAddToGroup(user._id)}
                      className="bg-green-700 text-white px-2"
                    >
                      add
                    </button>
                  </div>
                ))}
            </>
          ) : (
            ""
          )}
        </div>
      </div>

      {groupExpenses?.length ? (
        groupExpenses.map((expense, i) => (
          <ExpenseCard key={i} expense={expense} />
        ))
      ) : (
        <p className="bg-gray-400 text-white px-2 my-3">тут ще немає витрат</p>
      )}

      <div className="border p-2 my-3">
        <button
          onClick={() => setShowAddExpense((prev) => !prev)}
          className="bg-green-500 px-3"
        >
          додати витрату
        </button>
        {showAddExpense && (
          <>
            <div className="flex flex-col">
              <input
                className="p-2 border my-2"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                type="text"
                placeholder="Назва витрати"
              />
              <input
                className="p-2 border my-2"
                value={expensePrice}
                onChange={handleExpensePrice}
                type="text"
                placeholder="сума"
              />
              {showExpenseDivide ? (
                <>
                  <label>
                    хто оплачував?
                    <select
                      className="p-2 border my-2"
                      value={paid_by}
                      onChange={(e) => setPaid_by(e.target.value)}
                    >
                      {groupInfo.members &&
                        groupInfo.members.map((member, id) => (
                          <option value={member._id} key={member._id}>
                            {member.name}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label>
                    розділити як?
                    <select
                      className="p-2 border my-2"
                      value={activeExpenseType}
                      onChange={(e) => setActiveExpenseType(e.target.value)}
                    >
                      {expenseTypes &&
                        expenseTypes.map((type, id) => (
                          <option value={type} key={id}>
                            {type}
                          </option>
                        ))}
                    </select>
                  </label>
                  <ExpenseDivide
                    members={groupInfo?.members}
                    divideType={activeExpenseType}
                    expensePrice={expensePrice}
                    paid_by={paid_by}
                    group_id={id}
                    name={expenseName}
                    getExpenseFunc={getGroupExpenses}
                    setShowAddExpense={setShowAddExpense}
                    setExpensePrice={setExpensePrice}
                    getGroupInfo={getGroupInfo}
                  />
                </>
              ) : (
                ""
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Group;
