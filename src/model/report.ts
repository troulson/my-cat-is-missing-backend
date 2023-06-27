import moment, {Moment} from "moment";
import {Database} from "./database";
import {aws_pinpointemail} from "aws-cdk-lib";
import {validateEmailAddress, validatePastDateString, validateStringNotEmpty} from "../util/validation";
import {ApiError} from "../error/api-error";
import {v4 as UUIDv4} from "uuid";

export class Report {
    private id: string;
    private imageLocation: string;
    private catName: string;
    private content: string;
    private country: string;
    private town: string;
    private missingSince: Moment;
    private email: string;
    private created: Moment;


    private constructor(id: string, imageLocation: string, catName: string, content: string, country: string,
                        town: string, missingSince: Moment, email: string, created: Moment) {

        this.id = id;
        this.imageLocation = imageLocation;
        this.catName = catName;
        this.content = content;
        this.country = country;
        this.town = town;
        this.missingSince = missingSince;
        this.email = email;
        this.created = created;

    }

    public static async create(form: any) {

        const catName = validateStringNotEmpty(form.catName ?? '', '', () => {
            throw new ApiError('The cats name must be provided', 400);
        });

        const country = validateStringNotEmpty(form.country ?? '', '', () => {
            throw new ApiError('A country name must be provided', 400);
        });

        const town = validateStringNotEmpty(form.town ?? '', '', () => {
            throw new ApiError('A town or city must be provided', 400);
        });

        const missingSince = validatePastDateString(form.missingSince, null, 'YYYY-MM-DD', () => {
            throw new ApiError('The missing since date must be valid and in the past', 400);
        });

        const content = validateStringNotEmpty(form.content ?? '', '', () => {
            throw new ApiError('Additional information must be provided', 400);
        });

        const email = validateEmailAddress(form.email ?? '', '', () => {
            throw new ApiError('The provided email address is invalid', 400);
        });

        const report = new this(
            UUIDv4(),
            'https://mcim-image-bucket.s3.amazonaws.com/beefcake.jpg', // Stub
            catName,
            content,
            country,
            town,
            missingSince,
            email,
            moment()
        );

        await report.deploy();

        return report.id;
    }

    private async deploy() {
        const client = await Database.Connection();

        let query = {
            text: 'INSERT INTO report (report_id, image_location, cat_name, content, country, town, missing_since, ' +
                'email, created) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            values: [
                this.id,
                this.imageLocation,
                this.catName,
                this.content,
                this.country,
                this.town,
                this.missingSince.toDate(),
                this.email,
                this.created.toISOString()
            ]
        }

        await client.query(query);
    }
}