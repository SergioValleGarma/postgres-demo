import sqlClient from "./sqlClient";
/**
 * esta funcion obtendra usuarios de tabla
 */
export async function seleccionarUsuarios(){
    return await sqlClient `select * from usuario`;
}
