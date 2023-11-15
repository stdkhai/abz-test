require('dotenv').config();
const express = require('express');
const path = require('path');
const useBodyParser = require('./tools/body-parser');
const sql_migrate = require('./models/mysql/migrate');
const { generate_token } = require('./service/token');
const usersRouter = require('./routes/user-router');
const https = require('https');
const fs = require('fs');
const mid = require('./middleware/base');
const errors = require('./service/errors');
const positionsRouter = require('./routes/positions-router');
const { get_all_tokens } = require('./models/mysql/token');



const env = process.env;
const HOST = env.host || "localhost"
const PORT = env.port || 3000

const app = express();

app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

useBodyParser(app);

//
// routers
//
app.use('/users',usersRouter)
app.use('/positions', positionsRouter)

app.get('/', async(req, res) => {
    let tokens = await get_all_tokens();
    res.render('main', {tokens, selectedToken: tokens.length!=0?tokens[0].token:""});
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

var server;
if (env.dev!='true') {
    var key = fs.readFileSync(env.pk);
    var cert = fs.readFileSync(env.cert);
    var options = {
        key: key,
        cert: cert
    };
    server = https.createServer(options, app);
}else{
    server = app;
}

server.listen(PORT, HOST, () => {
    sql_migrate();
   // mockup();
    console.log(`Server started at http://${HOST}:${PORT}`);
});
