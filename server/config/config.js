/**
 * PUERTO
 */
process.env.PORT = process.env.PORT || 3000;


/**
 * ENTORNO
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


/**
 * BASE DE DATOS
 */
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

/**
 * VENCIMIENTO DEL TOKEN 60 * 60 * 24 * 30
 */
process.env.EXPIRACION_TOKEN = 60 * 60 * 24 * 30;


/**
 * SEMILLA DE AUTENTICACION
 */
process.env.SEMILLA_AUTENTICACION = process.env.SEMILLA_AUTENTICACION || 'este-es-el-seed-desarrollo';

/**
 * GOOGLE CLIENT ID
 */

process.env.CLIENT_ID = process.env.CLIENT_ID || '840553277222-ammujd3govoikicun3bn66nhs31ttbg1.apps.googleusercontent.com'

/**
 * PASSWORD DE GOOGLE
 */
process.env.PASS_GOOGLE = ':)';