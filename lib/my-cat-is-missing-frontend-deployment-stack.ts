import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {BlockPublicAccess, BucketAccessControl} from "aws-cdk-lib/aws-s3";

export class MyCatIsMissingFrontendDeploymentStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // S3 Bucket for frontend
        const frontendBucket = new cdk.aws_s3.Bucket(this, "my-cat-is-missing-frontend", {
            bucketName: "my-cat-is-missing-frontend",
            publicReadAccess: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            websiteErrorDocument: "index.html",
            blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
            accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL
        });

        // Deploy to S3 bucket
        new cdk.aws_s3_deployment.BucketDeployment(this, "deployStaticWebsite", {
            sources: [cdk.aws_s3_deployment.Source.asset('../my-cat-is-missing-frontend/build')],
            destinationBucket: frontendBucket
        });

    }
}