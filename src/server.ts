import { eq } from "drizzle-orm";
import db from "./db";
import { usuario } from "./schema-introspect";
import fastify from 'fastify';
const server = fastify();
// configira las rutas
server.get('/', async (request, reply) => {
    console.log("los headers de la solicitud son ", request.headers);
    if (request.headers["header-invalido"] === "valor_no_valido") {
        reply.code(400);
        return;
    };
return { hello: 'world 1' };
});
// querystring params
// /usuarios?fechaIni=2024-04-20&fechaFin=2024-05-12
server.get("/usuarios", async (request, reply) => {
    try {
        const {fechaIni,fechaFin} = request.query as {
            fechaIni: string;
            fechaFin: string;
        };
        const user = await db.select().from(usuario);
    return {
        success: true,
        data: user,
        queryString: {
            fechaIni,
            fechaFin,
        }
    }
    } catch (error) {
        console.error("error alobtener la tabla usuarios", error);
        return{
            success: false,
            message: "Ocurrio un error, vuelve a intertarlo en unos minutos",
        }
    }
});

server.get('/usuarios/:id', async (request, reply) => {
    const {id: paramId} = request.params as {id: number};
const user = await db.select().from(usuario).where(eq(usuario.id, paramId));
if (!user[0]) {
    reply.code(404);
    return;
}
return user[0];
});

type InsertUsuarioRequest = {
 nombres: string;
};
server.post<{ Body: InsertUsuarioRequest}>('/usuarios', async (request, reply) => {
    const { nombres } = request.body;
    if (!nombres) {
        reply.code(400);
        return;
    }
    const newUser = await db.insert(usuario).values({
    nombres, })
    .returning({id: usuario.id});
    return newUser;
    });

// se inicializael servidor
server.listen({port: 3000}, (err, address) => {
if (err) throw err;
console.log(`Server listening on ${address}`);
});