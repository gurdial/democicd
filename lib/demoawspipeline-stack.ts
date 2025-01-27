import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import {PipelineAppStage} from './pipeline-app-stage';


export class DemoawspipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        // Use a connection created using the AWS console to authenticate to GitHub
        // Other sources are available.
        input: pipelines.CodePipelineSource.connection(
          'gurdial/democicd',
          'main',
          {
            connectionArn:
              'arn:aws:codeconnections:ap-southeast-2:127214181362:connection/cddc42a4-0107-40b2-92c7-3744db19a4bc', 
          }
        ),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

   

  const testingStage = pipeline.addStage(new PipelineAppStage(this, 'testing', {
    env: { account: '127214181362', region: 'ap-southeast-2' }
  }));

  testingStage.addPost(new pipelines.ManualApprovalStep('approval'));
    
  }
}
