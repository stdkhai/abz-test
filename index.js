require('dotenv').config();
const express = require('express');
const path = require('path');
const useBodyParser = require('./tools/body-parser');
const sql_migrate = require('./models/mysql/migrate');
const { generate_token } = require('./service/token');
const usersRouter = require('./routes/user-router');
const Response = require('./models/web/response');
const mid = require('./middleware/base');
const errors = require('./service/errors');

const env = process.env;
const HOST = env.host || "localhost"
const PORT = env.port || 3000
const secretKey = process.env.secret;

const app = express();

app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

useBodyParser(app);

//
// routers
//
app.use('/users',usersRouter)

app.get('/', (req, res) => {
    res.render('main');
})

app.get('/token', mid.response_base, (req, res) => {
    try {
        res.locals.body.add_result('token', generate_token())
    } catch (err) {
        res.locals.body.add_message(err)
    }
    res.json(res.locals.body);
});

app.use(mid.response_base, (req,res)=>{
    res.locals.body.add_message(errors.PageNotFound);
    res.status(404);
    res.json(res.locals.body);
});

app.listen(PORT, HOST, () => {
    sql_migrate();
   // mockup();
    console.log(`Server started at http://${HOST}:${PORT}`);
});