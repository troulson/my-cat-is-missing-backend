import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {aws_apigateway} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import {SubnetType} from "aws-cdk-lib/aws-ec2";
import {DockerImageCode} from "aws-cdk-lib/aws-lambda";
import {ArnPrincipal, PolicyStatement, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {AwsCustomResource, AwsCustomResourcePolicy, AwsSdkCall, PhysicalResourceId} from "aws-cdk-lib/custom-resources";
import * as s3 from 'aws-cdk-lib/aws-s3';
import {BlockPublicAccess} from "aws-cdk-lib/aws-s3";

export class MyCatIsMissingBackendStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // In a normal production environment, the use of hard-coded database credentials is strongly advised against.
        // A more appropriate solution would be to use the SecretsManager but for the purposes of this assignment this
        // will be sufficient.

        const databaseName = 'mycatismissing';
        const databaseUsername = 'postgres';
        const databasePassword = 'Q5xtBNrQu3jC';

        // A VPC is required to allow lambda functions and the RDS instance to connect.
        const vpc = new ec2.Vpc(this, 'VpcLambda', {
            maxAzs: 2,
            natGateways: 0,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'egress',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                },
                {
                    cidrMask: 24,
                    name: 'isolated',
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                },
            ],
        });

        const imageBucket = new s3.Bucket(this, 'McimImageBucket', {
            bucketName: "mcim-image-bucket",
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            versioned: true,
            publicReadAccess: true,
            //blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
        });

        // Security group for lambda functions
        const lambdaSecurityGroup = new ec2.SecurityGroup(this, 'LambdaSecurityGroup', {
            vpc,
        });

        // Create report lambda function
        const createReportLambda = new lambda.Function(this, 'CreateReportLambda', {
            functionName: 'create-report',
            code: new lambda.AssetCode('src'),
            handler: './lambda/create-report/handler.handler',
            runtime: lambda.Runtime.NODEJS_18_X,
            memorySize: 128,
            timeout: cdk.Duration.seconds(30),
            vpc,
            vpcSubnets: {subnetType: SubnetType.PRIVATE_WITH_EGRESS},
            securityGroups: [lambdaSecurityGroup]
        });

        imageBucket.grantReadWrite(createReportLambda);

        // Get page lambda function
        const getPageLambda = new lambda.Function(this, 'GetPageLambda', {
            functionName: 'get-page',
            code: new lambda.AssetCode('src'),
            handler: './lambda/get-page/handler.handler',
            runtime: lambda.Runtime.NODEJS_18_X,
            memorySize: 128,
            timeout: cdk.Duration.seconds(10),
            vpc,
            vpcSubnets: {subnetType: SubnetType.PRIVATE_WITH_EGRESS},
            securityGroups: [lambdaSecurityGroup]
        });

        // Get report lambda
        const getReportLambda = new lambda.Function(this, 'GetReportLambda', {
            functionName: 'get-report',
            code: new lambda.AssetCode('src'),
            handler: './lambda/get-report/handler.handler',
            runtime: lambda.Runtime.NODEJS_18_X,
            memorySize: 128,
            timeout: cdk.Duration.seconds(10),
            vpc,
            vpcSubnets: {subnetType: SubnetType.PRIVATE_WITH_EGRESS},
            securityGroups: [lambdaSecurityGroup]
        });

        // Create Report API
        const createReportApi = new aws_apigateway.LambdaRestApi(this, 'CreateReportApi', {
            handler: createReportLambda,
            proxy: false,
            description: 'API for create-report',
        });

        createReportApi.root.addResource('create').addMethod('POST');

        // Get Page API
        const getPageApi = new aws_apigateway.LambdaRestApi(this, 'GetPageApi', {
            handler: getPageLambda,
            proxy: false,
            description: 'API for get-page',
        });

        getPageApi.root.addResource('page').addMethod('GET');

        // Get Report API
        const getReportApi = new aws_apigateway.LambdaRestApi(this, 'GetReportApi', {
            handler: getReportLambda,
            proxy: false,
            description: 'API for get-report',
        });

        getReportApi.root.addResource('report').addMethod('GET');

        // Create a security group for the RDS database
        const dbSecurityGroup = new ec2.SecurityGroup(this, 'DbSecurityGroup', {
            vpc,
        });

        // Database instance
        const dbInstance = new rds.DatabaseInstance(this, 'DbInstance', {
            engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_14_3 }),
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
            vpc,
            vpcSubnets: vpc.selectSubnets({
                subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
            }),
            databaseName,
            securityGroups: [dbSecurityGroup],
            credentials: rds.Credentials.fromPassword(databaseUsername, cdk.SecretValue.unsafePlainText(databasePassword)),
            allocatedStorage: 20
        });

        // Docker image function for initialising the database
        const dockerImageFunction = new lambda.DockerImageFunction(this, 'ResourceInitialiserLambda', {
            memorySize: 128,
            functionName: 'ResourceInitialiserLambda',
            code: DockerImageCode.fromImageAsset(`${__dirname}/../init`, {}),
            vpc,
            vpcSubnets: vpc.selectSubnets({
                subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
            }),
            securityGroups: [lambdaSecurityGroup],
            timeout: cdk.Duration.minutes(3),
            allowAllOutbound: true,
            environment: {
                DB_ENDPOINT_ADDRESS: dbInstance.dbInstanceEndpointAddress,
                DB_NAME: databaseName,
                DB_PASSWORD: databasePassword,
                DB_USER: databaseUsername
            }
        });

        // Allow ingress on TCP port 5432 (postgres)
        dbSecurityGroup.addIngressRule(
            lambdaSecurityGroup,
            ec2.Port.tcp(5432),
            'Lambda to Postgres database'
        );

        // Invoke the initialiser upon stack updates granting the necessary permissions
        const customResourceFnRole = new Role(this, 'AwsCustomResourceRole', {
            assumedBy: new ServicePrincipal('lambda.amazonaws.com')
        });

        dockerImageFunction.grantInvoke(customResourceFnRole);

        const sdkCall: AwsSdkCall = {
            service: 'Lambda',
            action: 'invoke',
            parameters: {
                FunctionName: dockerImageFunction.functionName,
            },
            physicalResourceId: PhysicalResourceId.of(`${id}-AwsSdkCall-${dockerImageFunction.currentVersion.version}`)
        }

        const customResource = new AwsCustomResource(this, 'AwsCustomResource', {
            policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
            onUpdate: sdkCall,
            timeout: cdk.Duration.minutes(3),
            role: customResourceFnRole
        });

        customResource.node.addDependency(dbInstance);
    }
}
