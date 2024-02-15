import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";

const ExpenseCard = ({ expense }) => {
  let {
    userAuth: { id },
  } = useContext(UserContext);

  const [showExpenseDetails, setShowExpenseDetails] = useState(false);
  const [expenseDetails, setExpenseDetails] = useState([]);

  const getYourInpact = () => {
    const sumObj = expense.expense_sums.filter(
      (expense) => expense.user_id === id
    );
    return (sumObj[0].lend - sumObj[0].owe).toFixed(2);
  };
  let userSumsIds = [];
  expense.expense_sums.forEach((element) => {
    userSumsIds.push(element._id);
  });

  function formatDateString(inputDate) {
    const dateObject = new Date(inputDate);

    const day = dateObject.getDate();
    const month = new Intl.DateTimeFormat("uk-UA", { month: "short" }).format(
      dateObject
    );
    const year = dateObject.getFullYear();

    return (
      <div className="flex flex-col justify-center">
        <p className="">{`${day} ${month}`}</p>
        <p className="text-sm text-gray-400 text-center">{`${year}`}</p>
      </div>
    );
  }

  useEffect(() => {
    if (showExpenseDetails == true) {
      axios
        .post(process.env.REACT_APP_BASIC_URL + "/get-expense-details", {
          ids: userSumsIds,
        })
        .then((result) => {
          if (result.status == 200) {
            setExpenseDetails(result.data);
          }
        });
    }
  }, [showExpenseDetails]);

  return (
    <>
      <div
        onClick={() => setShowExpenseDetails((prev) => !prev)}
        className="my-2 p-2 flex justify-between bg-slate-200 rounded-lg items-center"
      >
        <div className="flex gap-4">
          {formatDateString(expense.createdAt)}
          <div className="">
            <p>
              <strong>{expense.expense_name}</strong>
            </p>

            {id == expense.paid_by._id ? (
              <p className="text-gray-400">
                ви оплатили{" "}
                <strong className="text-black">
                  {expense.expense_price + " ₴"}
                </strong>
              </p>
            ) : (
              <p className="text-gray-400">
                <strong className="text-black">{expense.paid_by.name}</strong>{" "}
                оплатив
                <strong className="text-black">
                  {" " + expense.expense_price + " ₴"}
                </strong>
              </p>
            )}
          </div>
        </div>
        <p
          className={`${
            getYourInpact() > 0 ? "text-green-500" : "text-red-700"
          } flex flex-col items-end`}
        >
          <span>
            <strong>
              {Math.abs(getYourInpact())}
              {" ₴"}
            </strong>
          </span>
          <span className="text-sm">
            {getYourInpact() > 0 ? "ви позичили" : "ви винні"}
          </span>
        </p>
      </div>
      {showExpenseDetails ? (
        <div className="flex gap-10 ">
          <div className="bg-green-100 rounded-2xl p-2">
            <p>оплатив</p>
            <p>
              {expense.paid_by.name} {expense.expense_price} ₴
            </p>
          </div>
          <div className="bg-red-100 rounded-2xl p-2">
            <p>винні</p>
            {expenseDetails?.map((expense, i) => (
              <p key={i}>
                {expense.user_id.name} {expense.owe} ₴
              </p>
            ))}
          </div>
          <div className="bg-blue-100 rounded-2xl flex flex-col justify-around p-2">
            <button className="bg-green-200 p-2 rounded-xl">редагувати</button>
            <button className="bg-red-200 p-2 rounded-xl">видалити</button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ExpenseCard;
