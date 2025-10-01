import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "https://marketplacesite.onrender.com";

function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-900 text-white flex justify-between">
        <Link to="/">Home</Link>
        <div>
          <Link to="/login" className="mr-4">Login</Link>
          <Link to="/signup" className="mr-4">Signup</Link>
          <Link to="/admin">Admin</Link>
        </div>
      </nav>
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  const [products, setProducts] = useState([
    { id: 1, name: "Test Product", price: 99 },
    { id: 2, name: "Another Product", price: 149 }
  ]);

  return (
    <div>
      <h1 className="text-2xl mb-4">Products</h1>
      <ul>
        {products.map(p => (
          <li key={p.id} className="mb-2 p-2 border rounded">
            <strong>{p.name}</strong> - ${p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}


function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/admin");
    } else {
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto">
      <h2 className="text-xl mb-4">Login</h2>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="border p-2 w-full mb-2"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
      />
      <button className="bg-blue-600 text-white p-2 w-full">Login</button>
    </form>
  );
}

function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      navigate("/login");
    } else {
      alert("Signup failed");
    }
  };

  return (
    <form onSubmit={handleSignup} className="max-w-sm mx-auto">
      <h2 className="text-xl mb-4">Signup</h2>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="border p-2 w-full mb-2"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
      />
      <button className="bg-green-600 text-white p-2 w-full">Signup</button>
    </form>
  );
}

function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setProducts([...products, data]);
    setForm({ name: "", price: "" });
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Admin Dashboard</h2>
      <form onSubmit={addProduct} className="mb-6">
        <input
          className="border p-2 mr-2"
          placeholder="Product name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border p-2 mr-2"
          placeholder="Price"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
        />
        <button className="bg-purple-600 text-white p-2">Add</button>
      </form>
      <ul>
        {products.map(p => (
          <li key={p.id} className="mb-2 p-2 border rounded">
            {p.name} - ${p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
