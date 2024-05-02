import { describe, test } from "vitest";
import { migrateDB } from "../src/dbMigrate";

///esta prueba no deberia estar
describe("Pruebas para generar migration", () => {
    test.skip("debe de retornar mas de un usuario", async () => {
        await migrateDB();
    });
});