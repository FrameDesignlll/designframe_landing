require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
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
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            telegram TEXT,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS admins (
            chat_id TEXT PRIMARY KEY
        )`);
        console.log('Database connected and initialized.');
    }
});

// Telegram Bot Logic
bot.onText(/^\/start(?: (.+))?$/, (msg, match) => {
    const chatId = msg.chat.id.toString();
    const password = match[1];

    if (password === ADMIN_PASSWORD) {
        db.run(`INSERT OR IGNORE INTO admins (chat_id) VALUES (?)`, [chatId], function(err) {
            if (err) {
                bot.sendMessage(chatId, 'Произошла ошибка при сохранении прав администратора.');
                return;
            }
            bot.sendMessage(chatId, '✅ Пароль принят! Теперь вы будете получать уведомления о новых заказах с сайта.');
            console.log(`New admin registered: ${chatId}`);
        });
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

    db.run(
        `INSERT INTO orders (name, telegram, description) VALUES (?, ?, ?)`,
        [name, telegram || '', description],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }

            const orderId = this.lastID;
            res.status(201).json({ success: true, message: 'Order created', orderId });

            // Send notification to all admins
            db.all(`SELECT chat_id FROM admins`, [], (err, rows) => {
                if (err) {
                    console.error('Error fetching admins', err);
                    return;
                }

                const dateStr = new Date().toLocaleString('ru-RU');
                const notificationMsg = `🔔 <b>Новая заявка</b>\n\n` +
                                        `📅 <b>Дата:</b> ${dateStr}\n` +
                                        `👤 <b>Имя:</b> ${name}\n` +
                                        `✈️ <b>Telegram:</b> ${telegram || 'Не указан'}\n` +
                                        `📝 <b>Описание:</b>\n${description}`;

                rows.forEach(row => {
                    bot.sendMessage(row.chat_id, notificationMsg, { parse_mode: 'HTML' })
                        .catch(err => console.error('Error sending message to', row.chat_id, err));
                });
            });
        }
    );
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Waiting for Bot Admins to use '/start ${ADMIN_PASSWORD}'...`);
});
