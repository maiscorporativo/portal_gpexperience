import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db.js';

const router = express.Router();

/* ── POST /api/auth/login ─────────────────────────────────────── */
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role)
    return res.status(400).json({ error: 'username, password e role são obrigatórios' });

  try {
    const [rows] = await pool.query(
      'SELECT * FROM admin_users WHERE LOWER(username) = LOWER(?) AND role = ? LIMIT 1',
      [username, role]
    );
    if (!rows.length) return res.status(401).json({ error: 'Usuário ou senha inválidos' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Usuário ou senha inválidos' });

    res.json({ ok: true, username: user.username, role: user.role });
  } catch (err) {
    console.error('[POST /api/auth/login]', err.message);
    res.status(500).json({ error: 'Erro interno' });
  }
});

/* ── Middleware: apenas master pode gerenciar usuários ─────────── */
async function requireMaster(req, res, next) {
  const masterUser = req.headers['x-master-user'];
  const masterPass = req.headers['x-master-pass'];

  if (!masterUser || !masterPass) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM admin_users WHERE LOWER(username) = LOWER(?) AND role = ? LIMIT 1',
      [masterUser, 'master']
    );
    if (!rows.length) return res.status(403).json({ error: 'Acesso negado' });

    const valid = await bcrypt.compare(masterPass, rows[0].password_hash);
    if (!valid) return res.status(403).json({ error: 'Acesso negado' });

    req.masterUser = rows[0];
    next();
  } catch (err) {
    console.error('[requireMaster]', err.message);
    res.status(500).json({ error: 'Erro interno' });
  }
}

/* ── GET /api/auth/users ─── listar todos ─────────────────────── */
router.get('/users', requireMaster, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, role FROM admin_users ORDER BY role DESC, username ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error('[GET /api/auth/users]', err.message);
    res.status(500).json({ error: 'Erro interno' });
  }
});

/* ── POST /api/auth/users ─── criar usuário ───────────────────── */
router.post('/users', requireMaster, async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role)
    return res.status(400).json({ error: 'username, password e role são obrigatórios' });

  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, ?)',
      [username, hash, role]
    );
    res.json({ ok: true, id: result.insertId, username, role });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Username já existe' });
    console.error('[POST /api/auth/users]', err.message);
    res.status(500).json({ error: 'Erro interno' });
  }
});

/* ── PUT /api/auth/users/:id ─── editar usuário ───────────────── */
router.put('/users/:id', requireMaster, async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;
  if (!username || !role)
    return res.status(400).json({ error: 'username e role são obrigatórios' });

  try {
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query(
        'UPDATE admin_users SET username = ?, password_hash = ?, role = ? WHERE id = ?',
        [username, hash, role, id]
      );
    } else {
      await pool.query(
        'UPDATE admin_users SET username = ?, role = ? WHERE id = ?',
        [username, role, id]
      );
    }
    res.json({ ok: true });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Username já existe' });
    console.error('[PUT /api/auth/users]', err.message);
    res.status(500).json({ error: 'Erro interno' });
  }
});

/* ── DELETE /api/auth/users/:id ─── excluir usuário ──────────── */
router.delete('/users/:id', requireMaster, async (req, res) => {
  const { id } = req.params;

  // Impede deletar o último master
  try {
    const [masters] = await pool.query("SELECT id FROM admin_users WHERE role = 'master'");
    const targetIsMaster = masters.some(m => String(m.id) === String(id));
    if (targetIsMaster && masters.length <= 1) {
      return res.status(400).json({ error: 'Não é possível excluir o único usuário master.' });
    }
    // Impede self-delete
    if (String(req.masterUser?.id) === String(id)) {
      return res.status(400).json({ error: 'Você não pode excluir a si mesmo.' });
    }
    await pool.query('DELETE FROM admin_users WHERE id = ?', [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/auth/users]', err.message);
    res.status(500).json({ error: 'Erro interno' });
  }
});

export default router;
