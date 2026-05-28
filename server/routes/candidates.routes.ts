import { Router } from 'express';
import { getDb } from '../../server-db';

const router = Router();

router.get('/candidates', async (req, res) => {
  try {
    const db = await getDb();
    const candidates = await db.all(`
      SELECT c.*, v.title as vacancy_title 
      FROM candidates c
      LEFT JOIN vacancies v ON c.vacancy_id = v.id
      ORDER BY c.applied_at DESC
    `);
    res.json({ success: true, candidates });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/candidates', async (req, res) => {
  try {
    const { name, email, phone, vacancy_id, cv_text } = req.body;
    const db = await getDb();
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').slice(0, 19);

    const result = await db.run(
      'INSERT INTO candidates (name, email, phone, vacancy_id, cv_text, applied_at, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, vacancy_id || null, cv_text, formattedDate, 'Novo']
    );

    res.json({ success: true, id: result.lastID, message: 'Currículo enviado com sucesso! Agradecemos o interesse.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const db = await getDb();
    await db.run('UPDATE candidates SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'Status do candidato atualizado.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.run('DELETE FROM candidates WHERE id = ?', [id]);
    res.json({ success: true, message: 'Candidato removido do sistema.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
