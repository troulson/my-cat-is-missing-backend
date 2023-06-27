import {Database} from "../../model/database";
import {parse} from "aws-multipart-parser";
import {Report} from "../../model/report";

export const handler = async (event: any) => {
    Database.isLocal = event.hasOwnProperty('isLocalRun') && event.isLocalRun;

    let statusCode: number = 200;
    let body: any = {};

    const formData: any = parse(event, true);

    try {
        body.reportId = await Report.create(formData);

    } catch (error: any) {
        body = error.message;
        statusCode = error.statusCode;
    }

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