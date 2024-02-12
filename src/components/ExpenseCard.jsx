import React from 'react'

const ExpenseCard = ({expense}) => {
    const current_user_id = '65c4b3e9983d94439e0e38ae'
    const getYourInpact = () => {
       const sumObj = expense.expense_sums.filter(expense =>expense.user_id === current_user_id)
       console.log("sumObj",sumObj[0])
       return (sumObj[0].lend - sumObj[0].owe).toFixed(2)
    }
    const money = getYourInpact()
  return (
    <div className='my-2 p-2 flex justify-between bg-slate-200 rounded-lg items-center'>
        <div className="">
        <p>{expense.expense_name}</p>
        <p>{expense.price} ({expense.paid_by.name})</p>

        </div>
        <p className={money>0? "text-green-500":"text-red-700"}>{Math.abs( money)}</p>
    </div>
  )
}

export default ExpenseCard