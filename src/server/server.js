require('dotenv').config();
 
const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');

(async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
        routes: {
            cors: {
              origin: ['*'],
            },
            payload: {
                maxBytes: 1000000 
            },
        },
    });
 
    const model = await loadModel();
    server.app.model = model;
 
    server.route(routes);
 
    server.ext('onPreResponse', function (request, h) {
        const response = request.response;
 
         if (response instanceof InputError) {
             const newResponse = h.response({
                 status: 'fail',
                 message: `${response.message}`
             })
             newResponse.code(response.statusCode)
             return newResponse;
         }
 
        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: response.output.payload.message || 'Terjadi kesalahan pada server.'
            });
    
            // Gunakan status code default jika statusCode tidak valid
            const statusCode = Number.isInteger(response.output.statusCode) 
                ? response.output.statusCode 
                : 500;
    
            newResponse.code(statusCode);
            return newResponse;
        }
    
        return h.continue;
    });
 
    await server.start();
    console.log(`Server start at: ${server.info.uri}`);
})();