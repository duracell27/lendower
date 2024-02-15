import React, { useRef, useState } from "react";
import userLogo from "./../img/user.png";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const descriptions = {
  порівно: "загальна сума ділиться порівну на вибрану кількість людей",
  відсотково: "вкажіть відсотки суми на потрібного користувача",
  розподіл:
    "вкажіть кількість частин на користувача. Наприклад вася зїв 2 шматки піци а льоша 3",
  вручну: "просто впишіть суми користувачам",
  "додаткові витрати":
    "при бажанні можна вказати додаткові витрати користувачу. Наприклад рахунок ділиться порівну на всіх але ростик ще брав баночку рево, тому додайт в поле вводу +50грн",
};

const ExpenseDivide = ({
  members,
  divideType,
  expensePrice,
  paid_by,
  name,
  group_id,
  getExpenseFunc,
  setShowAddExpense,
  setExpensePrice,
  getGroupInfo,
}) => {
    
  const formRef = useRef();
  let obj = {};
  for (let value of members) {
    obj[value._id] = "on";
  }

  const [forminfo, setFormInfo] = useState(obj);
  


  const handleChange = () => {
    
    const form = new FormData(formRef.current);
    const formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }
    setFormInfo(formData);
  };

  const addExpenseSum = async (id, lend, owe) => {
    const res = await axios.post(
      process.env.REACT_APP_BASIC_URL + "/addExpenseSum",
      { user_id: id, lend, owe }
    );
    return res.data;
  };

  const handleSubmitExpense = async () => {
    let mass = [];

    for (let [key, value] of Object.entries(forminfo)) {
      const lend = key == paid_by ? expensePrice : 0;
      const owe = (expensePrice / Object.keys(forminfo).length).toFixed(2);

      mass.push(await addExpenseSum(key, lend, owe));
    }

    console.log("expensesums", mass);

    axios
      .post(process.env.REACT_APP_BASIC_URL + "/addExpense", {
        expense_name: name,
        expense_price: +expensePrice,
        expense_type: divideType,
        group_id,
        expense_sums: mass,
        paid_by,
      })
      .then((result) => {
        if (result.status == 200) {
          toast.success("Витрату додано");
          setShowAddExpense(false);
          setExpensePrice("");
          getExpenseFunc();
          getGroupInfo();
        }
        console.log(result.data);
      });
  };

  return (
    <div>
      <Toaster />
      <div className="bg-blue-200 rounded-2xl mt-2 p-2">
        <p>{divideType}</p>
        <span className="text-gray-400">{descriptions[divideType]}</span>
      </div>
      <div className="">
        <div className="">
          <form ref={formRef}>
            {members.map((member, i) => (
              <label key={i} className="flex my-2">
                <img
                  className="w-5 h-5 inline-block"
                  src={userLogo}
                  alt="userlogo"
                />
                <span className="flex-1 border-b">{member.name}</span>
                <input
                  type="checkbox"
                  name={member._id}
                  checked={forminfo[member._id] == "on"}
                  onChange={(e) => handleChange(e.target.value, member._id)}
                />
              </label>
            ))}
          </form>
        </div>
      </div>
      <div className="">
        {Object.keys(forminfo).length ? (
          <>
            <p>
              {(expensePrice / Object.keys(forminfo).length).toFixed(2)}грн. /
              на людину
            </p>
            <p>Загалом на {Object.keys(forminfo).length} людей</p>
            <button
              className="bg-green-700 text-white px-3"
              onClick={handleSubmitExpense}
              type="button"
            >
              Зберегти
            </button>
          </>
        ) : (
          <p>Ви маєте вибрати хоча би 1 платника</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseDivide;
