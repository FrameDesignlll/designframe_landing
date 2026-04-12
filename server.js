require('dotenv').config();
const express = require('express');
const Database = require('better-sqlite3');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = new Database('./database.sqlite');

db.exec(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    telegram TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

db.exec(`CREATE TABLE IF NOT EXISTS admins (
    chat_id TEXT PRIMARY KEY
)`);

console.log('Database connected and initialized.');

// Telegram Bot Logic
bot.onText(/^\/start(?: (.+))?$/, (msg, match) => {
    const chatId = msg.chat.id.toString();
    const password = match[1];

    if (password === ADMIN_PASSWORD) {
        try {
            db.prepare(`INSERT OR IGNORE INTO admins (chat_id) VALUES (?)`).run(chatId);
            bot.sendMessage(chatId, '✅ Пароль принят! Теперь вы будете получать уведомления о новых заказах с сайта.');
            console.log(`New admin registered: ${chatId}`);
        } catch (err) {
            bot.sendMessage(chatId, 'Произошла ошибка при сохранении прав администратора.');
        }
    } else {
        bot.sendMessage(chatId, 'Добро пожаловать. Если вы администратор, введите /start <пароль>');
    }
});

// Order API Endpoint
app.post('/api/orders', (req, res) => {
    const { name, telegram, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required.' });
    }

    try {
        const result = db.prepare(
            `INSERT INTO orders (name, telegram, description) VALUES (?, ?, ?)`
        ).run(name, telegram || '', description);

        const orderId = result.lastInsertRowid;
        res.status(201).json({ success: true, message: 'Order created', orderId });

        // Send notification to all admins
        const admins = db.prepare(`SELECT chat_id FROM admins`).all();
        const dateStr = new Date().toLocaleString('ru-RU');
        const notificationMsg = `🔔 <b>Новая заявка</b>\n\n` +
                                `📅 <b>Дата:</b> ${dateStr}\n` +
                                `👤 <b>Имя:</b> ${name}\n` +
                                `✈️ <b>Telegram:</b> ${telegram || 'Не указан'}\n` +
                                `📝 <b>Описание:</b>\n${description}`;

        admins.forEach(row => {
            bot.sendMessage(row.chat_id, notificationMsg, { parse_mode: 'HTML' })
                .catch(err => console.error('Error sending message to', row.chat_id, err));
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Waiting for Bot Admins to use '/start ${ADMIN_PASSWORD}'...`);
});