import { describe, expect, test } from "vitest";
import { seleccionarUsuarios } from "../src/dbOperations";

describe("Pruebas de transaccion a la BD", () => {
    test("debe de retornar mas de un usuario", async () => {
        const resultado = await seleccionarUsuarios();
        // console.log("resultado de query ", resultado);
        expect(resultado.count).toBe(3);
    });
});