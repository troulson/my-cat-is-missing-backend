import fs from "fs";
import path from "path";
import { Client } from "pg";

export const handler = async (event: any, context: any): Promise<any> => {

    try {
        const host = process.env.DB_ENDPOINT_ADDRESS || '';
        const database = process.env.DB_NAME || '';
        const password = process.env.DB_PASSWORD || '';
        const user = process.env.DB_USER || '';

        const client = new Client({
            user,
            password,
            host,
            database,
            port: 5432,
        });

        await client.connect();

        const sql = fs.readFileSync(path.join(__dirname, 'script.sql')).toString();

        await client.query(sql);
        await client.end();

    } catch (err) {
        console.error('Error initialising RDS database.');
    }
}