import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class MyCatIsMissingBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create report lambda function
    const createReportLambda = new lambda.Function(this, 'createReportLambda', {
      functionName: 'create-report',
      code: new lambda.AssetCode('src'),
      handler: './lambda/create-report/handler.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      memorySize: 128,
      timeout: cdk.Duration.seconds(10)
    });

    // Get page lambda function
    const getPageLambda = new lambda.Function(this, 'getPageLambda', {
      functionName: 'get-page',
      code: new lambda.AssetCode('src'),
      handler: './lambda/get-page/handler.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      memorySize: 128,
      timeout: cdk.Duration.seconds(10)
    });

    // Get report lambda
    const getReportLambda = new lambda.Function(this, 'getReportLambda', {
      functionName: 'get-report',
      code: new lambda.AssetCode('src'),
      handler: './lambda/get-report/handler.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      memorySize: 128,
      timeout: cdk.Duration.seconds(10)
    });

  }
}
