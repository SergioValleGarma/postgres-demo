import fastify from 'fastify';
const server = fastify();
// configira las rutas
server.get('/', async (request, reply) => {
return { hello: 'world' };
});
// se inicializael servidor
server.listen({port: 3000}, (err, address) => {
if (err) throw err;
console.log(`Server listening on ${address}`);
});