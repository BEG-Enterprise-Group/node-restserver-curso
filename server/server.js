/**
 * CREACION DE VARIABLES Y SOLICITUDES DE ARCHIVOS
 */

require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

/**
 * PARSE APPLICATION/x-www-form-urlencoded
 */
app.use(bodyParser.urlencoded({ extended: false }))

/**
 * PARSE PARA APLICATION/CONTENT JSON
 */
app.use(bodyParser.json())


/**
 * CONFIGURACION GLOBAL DE LAS RUTAS
 */
app.use(require('./routes/index'));

/**
 * CONEXION A LA BASE DE DATOS
 */
mongoose.connect(process.env.URLDB, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    },
    (err, res) => {
        if (err) throw err;
        console.log('Base de datos conectada');
    });


/**
 * PUERTO DEL SERVER
 */
app.listen(process.env.PORT, () => {
    console.log(`Escuchando por el puerto: ${process.env.PORT}`);
});