import {Database} from "../../model/database";
import {parse} from "aws-multipart-parser";
import * as aws from "aws-sdk";

export const handler = async (event: any) => {
    Database.isLocal = event.hasOwnProperty('isLocalRun') && event.isLocalRun;

    const formData: any = parse(event, true);

    let statusCode: number = 200;
    let body: any = {};

    body.image = formData.image;

    const s3 = new aws.S3();

    const base64Data = Buffer.from(formData.image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const type = formData.image.split(';')[0].split('/')[1];

    const params = {
        Bucket: 'mcim-image-bucket',
        Key: `hello.${type}`, // type is not required
        Body: base64Data,
        //ACL: 'public-read',
        ContentEncoding: 'base64', // required
        ContentType: `image/${type}` // required. Notice the back ticks
    }

    console.log(JSON.stringify(params));

    let location = '';
    let key = '';

    await new Promise<void>((resolve, reject) => {
        s3.upload(params, (err: any) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    });

    console.log('Done');

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