require('dotenv').config();
const express = require('express');
const path = require('path');
const useBodyParser = require('./tools/body-parser');
const sql_migrate = require('./models/mysql/migrate');
const { generate_token } = require('./service/token');

const env = process.env;
const HOST = env.host || "localhost"
const PORT = env.port || 3000
const secretKey = process.env.secret;

const app = express();

app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

useBodyParser(app);

app.get('/', (req, res) => {
    res.render('main');
})

app.get('/token', (req, res) => {
    let answer = { success: true }
    try {
        answer.token = generate_token();
    } catch (err) {
        console.log("Error generating token: ", err);
        answer.success = false;
    }
    res.json(answer);
});

app.listen(PORT, HOST, () => {
    sql_migrate();
    console.log(`Server started at http://${HOST}:${PORT}`);
});