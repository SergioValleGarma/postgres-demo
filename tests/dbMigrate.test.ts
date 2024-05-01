import { describe, test } from "vitest";
import { migrateDB } from "../src/dbMigrate";

describe("Pruebas para generar migration", () => {
    test("debe de retornar mas de un usuario", async () => {
        await migrateDB();
    });
});