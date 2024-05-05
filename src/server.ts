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

// insertar usuarios
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

//editar usuario
type ActualizarUsuarioRequest = {
    id: number;
  } & InsertUsuarioRequest;
  
  server.put<{
    Body: ActualizarUsuarioRequest;
    Params: { id: number };
  }>("/usuarios/:id", async (request, reply) => {
    const { id, ...camposActuzlizables } = request.body;
    const { id: idParam } = request.params;
    // /usuario/321 -> se quiere editar el usuario 321
    // body -> { id: 123, nombres: "nuevo nombre"} -> si se lee el id del boy
    // para actualizar, se terminará modificando otro registro

    if (id !== +idParam) {
      reply.code(400);
      return;
    }
  
    // obtener el registro existente
    // const arreglo = await db...
    // forma tradicional:
    // const usuarioActual = arreglo[0]
    const [usuarioActual] = await db
      .select()
      .from(usuario)
      .where(eq(usuario.id, id))
      .limit(1);
    if (!usuarioActual) {
      reply.code(404);
      return;
    }
  
    // para hacer un update, vamos a hacer un merge de los campos
    const queryUpdate = db
      .update(usuario)
      .set({ ...usuarioActual, ...camposActuzlizables })
      .where(eq(usuario.id, id));
  
    return {
      result: await queryUpdate,
    };
  });
// // eliminar usuarios por id
// server.delete('/usuarios/:id', async (request, reply) =>
//     {
//         const {id: paramId} = request.params as {id: number};
//     await db.delete(usuario).where(eq(usuario.id, paramId)); 
//     return { message: 'El usuario ha sido eliminado.' };
//     });

// se inicializael servidor
server.listen({port: 3000}, (err, address) => {
if (err) throw err;
console.log(`Server listening on ${address}`);
});