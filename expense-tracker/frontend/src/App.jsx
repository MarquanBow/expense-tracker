import { useState, useEffect } from "react";
import axios from "axios";

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

  return (
    <div className="p-4">
      <h1>Expense Tracker</h1>

      {/* ⬇️ Budget UI Section */}
      <div>
        <h2>Monthly Budget</h2>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
        <button onClick={updateBudget}>Set Budget</button>
      </div>

      <div>
        <h3>Summary</h3>
        <p>Total Spent: ${summary.total}</p>
        <p>Remaining: ${summary.remaining}</p>
        <p>Used: {summary.percent_used}%</p>
        {summary.percent_used > 90 && (
          <p style={{ color: "red" }}>⚠️ Near Budget Limit!</p>
        )}
      </div>

      {/* ⬇️ Expense Form and List */}
      <div>
        <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Amount" type="number" onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <input placeholder="Category" onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input placeholder="Date" type="date" onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <button onClick={addExpense}>Add</button>

        <ul>
          {expenses.map((e) => (
            <li key={e._id}>
              {e.name} - ${e.amount} - {e.category} - {e.date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
