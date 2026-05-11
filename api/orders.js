module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, endpoint: '/api/orders' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { BOT_TOKEN, CHAT_ID } = process.env;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: 'Telegram is not configured' });
  }

  const payload = req.body || {};
  const name = String(payload.name || '').trim();
  const telegram = String(payload.telegram || '').trim();
  const description = String(payload.description || '').trim();

  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required.' });
  }

  const dateStr = new Date().toLocaleString('ru-RU', {
    timeZone: 'Asia/Qyzylorda',
  });
  const text = [
    '🔔 <b>Новая заявка</b>',
    '',
    `📅 <b>Дата:</b> ${dateStr}`,
    `👤 <b>Имя:</b> ${escapeHtml(name)}`,
    `✈️ <b>Telegram:</b> ${escapeHtml(telegram || 'Не указан')}`,
    '📝 <b>Описание:</b>',
    escapeHtml(description),
  ].join('\n');

  const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: 'HTML',
    }),
  });

  if (!telegramResponse.ok) {
    const details = await telegramResponse.text();
    console.error('Telegram sendMessage failed:', details);
    return res.status(500).json({ error: 'Failed to send notification' });
  }

  return res.status(201).json({ success: true, message: 'Order created' });
};

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
