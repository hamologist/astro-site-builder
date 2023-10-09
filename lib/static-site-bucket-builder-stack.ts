import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment';

export class StaticSiteBucketBuilderStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const staticSiteBucketParameter = new cdk.CfnParameter(this, "staticSiteBucketName", {
      type: "String",
      description: "The name of the Amazon S3 bucket where the static site will be deployed.",
    });

    const staticSiteBucket = new s3.Bucket(this, 'StaticSiteBucket', {
      bucketName: staticSiteBucketParameter.valueAsString,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
    });

    staticSiteBucket.grantPublicAccess();

    new s3Deployment.BucketDeployment(this, 'StaticSiteBucketDeployment', {
      sources: [s3Deployment.Source.asset("./deploy")],
      destinationBucket: staticSiteBucket,
    });

    new cdk.CfnOutput(this, 'StaticSiteBucketUrl', {
      value: staticSiteBucket.bucketWebsiteUrl,
    });
  }
}
