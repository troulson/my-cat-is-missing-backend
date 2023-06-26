import {Client} from "pg";
import {Config} from "../config/config";

export class Database {

    public static isLocal = false;
    private static connection: Client;


    public static async Connection(): Promise<Client> {

        if (!Database.connection) {
            await this.init();
        }

        return this.connection;
    }

    private static async init() {

        const client = Database.isLocal ?
            new Client({
                host: Config.LOCAL.HOST,
                port: Config.LOCAL.PORT,
                user: Config.LOCAL.USER,
                password: Config.LOCAL.PASSWORD,
                database: Config.LOCAL.DATABASE
            }) :
            new Client({
                host: Config.RDS.HOST,
                port: Config.RDS.PORT,
                user: Config.RDS.USER,
                password: Config.RDS.PASSWORD,
                database: Config.RDS.DATABASE
            });

        await client.connect();

        this.connection = client;

        console.log('Postgres client created.');

    }
}