// src/App.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import { auth } from "./firebaseConfig";
import Auth from "./Auth";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);
  const [summary, setSummary] = useState({ total: 0, remaining: 0, percent_used: 0 });
  const [form, setForm] = useState({ name: "", amount: "", category: "", date: "" });

  // Helper: Get headers with Firebase ID token
  const getAuthHeaders = async () => {
    if (!auth.currentUser) return {};
    const token = await auth.currentUser.getIdToken();
    return { Authorization: `Bearer ${token}` };
  };

  const fetchAll = async () => {
    const headers = await getAuthHeaders();
    const [expRes, budRes, sumRes] = await Promise.all([
      axios.get(`${API}/expenses`, { headers }),
      axios.get(`${API}/budget`, { headers }),
      axios.get(`${API}/summary`, { headers }),
    ]);
    setExpenses(expRes.data);
    setBudget(budRes.data);
    setSummary(sumRes.data);
  };

  useEffect(() => {
    if (user) fetchAll();
  }, [user]);

  const addExpense = async () => {
    const headers = await getAuthHeaders();
    await axios.post(`${API}/expenses`, form, { headers });
    fetchAll();
  };

  const updateBudget = async () => {
    const headers = await getAuthHeaders();
    await axios.post(`${API}/budget`, { budget }, { headers });
    fetchAll();
  };

  const deleteExpense = async (id) => {
    const headers = await getAuthHeaders();
    await axios.delete(`${API}/expenses/${id}`, { headers });
    fetchAll();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">💸 Expense Tracker</h1>

      {/* Auth Section */}
      <Auth onUser={setUser} />

      {!user ? (
        <p>Please log in to use the app.</p>
      ) : (
        <>
          {/* Budget Section */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Set Monthly Budget</h2>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="border px-2 py-1"
              />
              <button onClick={updateBudget} className="bg-green-500 text-white px-3 py-1 rounded">
                Save
              </button>
            </div>
          </div>

          {/* Summary Section */}
          <div className="mb-4">
            <h3 className="font-semibold">Summary</h3>
            <p>Total Spent: <strong>${summary.total}</strong></p>
            <p>Remaining: <strong>${summary.remaining}</strong></p>
            <p>Used: <strong>{summary.percent_used}%</strong></p>
            {summary.percent_used > 90 && <p className="text-red-500">⚠️ You’re nearing your budget!</p>}
          </div>

          {/* Add Expense Form */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Add New Expense</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border px-2 py-1"
              />
              <input
                placeholder="Amount"
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="border px-2 py-1"
              />
              <input
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="border px-2 py-1"
              />
              <input
                placeholder="Date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="border px-2 py-1"
              />
            </div>
            <button onClick={addExpense} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
              Add Expense
            </button>
          </div>

          {/* Expenses List */}
          <div>
            <h2 className="text-xl font-semibold">All Expenses</h2>
            <ul className="space-y-2">
              {expenses.map((e) => (
                <li key={e._id} className="flex justify-between border p-2 rounded shadow-sm">
                  <div>
                    <p>{e.name} - ${e.amount}</p>
                    <p className="text-sm text-gray-600">{e.category} | {e.date}</p>
                  </div>
                  <button onClick={() => deleteExpense(e._id)} className="text-red-600">🗑️</button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
