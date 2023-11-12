const express = require('express');
const bodyParser = require('body-parser');

function useBodyParser(app){
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true, limit: '10mb', parameterLimit: 10000 }));
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: false }));

}

module.exports = useBodyParser