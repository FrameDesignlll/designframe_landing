require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const bot = process.env.BOT_TOKEN
    ? new TelegramBot(process.env.BOT_TOKEN, { polling: false })
    : null;
const CHAT_ID = process.env.CHAT_ID;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/orders', async (req, res) => {
    const { name, telegram, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required.' });
    }

    const dateStr = new Date().toLocaleString('ru-RU');
    const notificationMsg = `🔔 <b>Новая заявка</b>\n\n` +
                            `📅 <b>Дата:</b> ${dateStr}\n` +
                            `👤 <b>Имя:</b> ${name}\n` +
                            `✈️ <b>Telegram:</b> ${telegram || 'Не указан'}\n` +
                            `📝 <b>Описание:</b>\n${description}`;

    try {
        if (!bot || !CHAT_ID) {
            console.error('Telegram is not configured. Add BOT_TOKEN and CHAT_ID to environment variables.');
            return res.status(500).json({ error: 'Telegram is not configured' });
        }

        await bot.sendMessage(CHAT_ID, notificationMsg, { parse_mode: 'HTML' });
        res.status(201).json({ success: true, message: 'Order created' });
    } catch (err) {
        console.error('Error sending message:', err);
        res.status(500).json({ error: 'Failed to send notification' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
