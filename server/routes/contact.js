import express from 'express';

const router = express.Router();

const CLINT_WEBHOOK = 'https://functions-api.clint.digital/endpoints/integration/webhook/6ae05bc2-054e-4edc-af58-18cccc0f81c6';

/* POST /api/contact — envia os dados do formulário para a Clint via POST puro (FormData) */
router.post('/', async (req, res) => {
  const { nome, email, telefone, pacote, origem_lead, data_lead } = req.body;

  if (!nome || !email || !telefone) {
    return res.status(400).json({ error: 'nome, email e telefone são obrigatórios.' });
  }

  try {
    const form = new FormData();
    form.append('nome',        nome);
    form.append('email',       email);
    form.append('telefone',    telefone);
    form.append('pacote',      pacote      || '');
    form.append('origem_lead', origem_lead || '');
    form.append('data_lead',   data_lead   || '');

    const upstream = await fetch(CLINT_WEBHOOK, { method: 'POST', body: form });
    const text = await upstream.text();

    let data = {};
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!upstream.ok) {
      console.error('[contact] Clint erro', upstream.status, text);
      return res.status(upstream.status).json({ error: 'Webhook retornou erro.', detail: data });
    }

    res.json({ ok: true, ...data });
  } catch (err) {
    console.error('[contact]', err.message);
    res.status(500).json({ error: 'Falha ao contatar o serviço de mensagens.' });
  }
});

export default router;
