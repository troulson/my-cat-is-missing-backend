import {Database} from "../../model/database";
import {Report} from "../../model/report";
import {ApiError} from "../../error/api-error";

export const handler = async (event: any) => {
    Database.isLocal = event.hasOwnProperty('isLocalRun') && event.isLocalRun;

    let statusCode: number = 200;
    let body: any = {};

    try {
        if (event.queryStringParameters.hasOwnProperty('id')) {
            const report = await Report.retrieve(event.queryStringParameters.id);

            body = report.getFormattedAttributes();

        } else {
            throw new ApiError('Report ID is missing', 400);
        }

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
            "Access-Control-Allow-Methods": "OPTIONS,GET"
        }
    };
}