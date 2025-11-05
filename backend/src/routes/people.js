const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /people - lista todos
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, age, created_at FROM people ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar pessoas." });
  }
});

// POST /people - cria
router.post("/", async (req, res) => {
  try {
    const { name, age } = req.body;
    if (!name || typeof name !== "string" || !age) {
      return res.status(400).json({ error: "name e age são obrigatórios." });
    }
    const ageInt = parseInt(age, 10);
    if (Number.isNaN(ageInt) || ageInt < 0) {
      return res
        .status(400)
        .json({ error: "age precisa ser um número válido >= 0." });
    }
    const [result] = await pool.query(
      "INSERT INTO people (name, age) VALUES (?, ?)",
      [name, ageInt]
    );
    const insertedId = result.insertId;
    const [rows] = await pool.query(
      "SELECT id, name, age, created_at FROM people WHERE id = ?",
      [insertedId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar pessoa." });
  }
});

module.exports = router;
