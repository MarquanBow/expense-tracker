import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ name: "", amount: "", category: "", date: "" });

  useEffect(() => {
    axios.get(`${API}/expenses`).then((res) => setExpenses(res.data));
  }, []);

  const addExpense = async () => {
    await axios.post(`${API}/expenses`, form);
    const res = await axios.get(`${API}/expenses`);
    setExpenses(res.data);
  };

  const deleteExpense = async (id) => {
    await axios.delete(`${API}/expenses/${id}`);
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Expense Tracker</h1>
      <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Amount" type="number" onChange={(e) => setForm({ ...form, amount: e.target.value })} />
      <input placeholder="Category" onChange={(e) => setForm({ ...form, category: e.target.value })} />
      <input placeholder="Date" type="date" onChange={(e) => setForm({ ...form, date: e.target.value })} />
      <button onClick={addExpense}>Add</button>

      <ul className="mt-4">
        {expenses.map((e) => (
          <li key={e.id}>
            {e.name} - ${e.amount} - {e.category} - {e.date}
            <button onClick={() => deleteExpense(e.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
