import postgres from "postgres";

const sqlClient = postgres({
host: "localhost",
port: 5432,
database: "test_db",
username: "postgres",
password: "1234",
});

export default sqlClient;