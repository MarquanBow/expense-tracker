import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css"; // Ensure you have Tailwind CSS set up

const API = "http://localhost:5000";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);
  const [summary, setSummary] = useState({ total: 0, remaining: 0, percent_used: 0});
  const [form, setForm] = useState({ name: "", amount: "", category: "", date: "" });

  useEffect(() => {
    axios.get(`${API}/expenses`).then((res) => setExpenses(res.data));
    axios.get(`${API}/budget`).then((res) => setBudget(res.data));
    axios.get(`${API}/summary`).then((res) => setSummary(res.data));
  }, []);

  const addExpense = async () => {
    await axios.post(`${API}/expenses`, form);
    const res = await axios.get(`${API}/expenses`);
    const sumRes = await axios.get(`${API}/summary`);
    setExpenses(res.data);
    setSummary(sumRes.data);
  };

  const updateBudget = async () => {
    await axios.post(`${API}/budget`, { budget});
    const sumRes = await axios.get(`${API}/summary`);
    setSummary(sumRes.data);
  }

   const deleteExpense = async (id) => {
    await axios.delete(`${API}/expenses/${id}`);
    const res = await axios.get(`${API}/expenses`);
    const sumRes = await axios.get(`${API}/summary`);
    setExpenses(res.data);
    setSummary(sumRes.data);
  };
  
return (
    <div className="container">
      <div>
        <h1>💸 Expense Tracker</h1>

        {/* Budget Section */}
        <div>
          <h2>Set Monthly Budget</h2>
          <div>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
            <button
              onClick={updateBudget}
            >
              Save
            </button>
          </div>
        </div>

        {/* Summary Section */}
        <div>
          <h3>Summary</h3>
          <p>Total Spent: <strong>${summary.total}</strong></p>
          <p>Remaining: <strong>${summary.remaining}</strong></p>
          <p>
            Used: <strong>
              {summary.percent_used}%
            </strong>
          </p>
          {summary.percent_used > 90 && (
            <p>⚠️ You’re nearing your budget!</p>
          )}
        </div>

        {/* Expense Form */}
        <div>
          <h2>Add New Expense</h2>
          <div>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Amount"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <input
              placeholder="Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <button
            onClick={addExpense}
          >
            Add Expense
          </button>
        </div>

        {/* Expense List */}
        <div>
          <h2>All Expenses</h2>
          <ul>
            {expenses.map((e) => (
              <li key={e._id}>
                <div>
                  <p>{e.name} - ${e.amount}</p>
                  <p>{e.category} | {e.date}</p>
                </div>
                <button
                  onClick={() => deleteExpense(e._id)}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}