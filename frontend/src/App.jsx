import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPeople = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/people`);
      const data = await res.json();
      setPeople(data);
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar pessoas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !age) return alert("Preencha name e age");
    try {
      const res = await fetch(`${API_BASE}/people`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age: Number(age) }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro");
      }
      const newPerson = await res.json();
      setPeople((prev) => [newPerson, ...prev]);
      setName("");
      setAge("");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar pessoa: " + err.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "30px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Cadastro: Nome e Idade</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 8 }}>
          <label>Nome</label>
          <br />
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Idade</label>
          <br />

          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            type="number"
          />
        </div>
        <button type="submit">Salvar</button>
      </form>

      <h2>Registros</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {people.map((p) => (
            <li key={p.id}>
              <strong>{p.name}</strong> — {p.age} anos (id: {p.id})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
