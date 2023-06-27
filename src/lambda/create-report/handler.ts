import {Database} from "../../model/database";
import {parse} from "aws-multipart-parser";
import * as aws from "aws-sdk";

export const handler = async (event: any) => {
    Database.isLocal = event.hasOwnProperty('isLocalRun') && event.isLocalRun;

    const formData: any = parse(event, true);

    let statusCode: number = 200;
    let body: any = {};



    return {
        "statusCode": statusCode,
        "body": JSON.stringify(body),
        "headers": {
            "Access-Control-Allow-Headers" : "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        }
    };
}