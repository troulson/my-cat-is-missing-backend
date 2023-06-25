#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MyCatIsMissingBackendStack } from '../lib/my-cat-is-missing-backend-stack';
import {MyCatIsMissingFrontendDeploymentStack} from "../lib/my-cat-is-missing-frontend-deployment-stack";

const app = new cdk.App();

new MyCatIsMissingFrontendDeploymentStack(app, 'MyCatIsMissingFrontendDeploymentStack');
new MyCatIsMissingBackendStack(app, 'MyCatIsMissingBackendStack');