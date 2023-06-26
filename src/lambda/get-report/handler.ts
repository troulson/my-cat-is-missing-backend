import {Database} from "../../model/database";

export const handler = async (event: any) => {

    Database.isLocal = event.hasOwnProperty('isLocalRun') && event.isLocalRun;

    let statusCode: number = 200;
    let body: any = {};

    const query = 'SELECT VERSION()';

    const client = await Database.Connection();
    const result = await client.query(query);

    body.test = result.rows[0];

    return {
        "statusCode": statusCode,
        "body": JSON.stringify(body),
        "headers": {
            "Access-Control-Allow-Headers" : "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET"
        }
    };
}