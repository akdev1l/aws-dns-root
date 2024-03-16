import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as akdev from './akdev-constructs';

export class DnsRootStack extends cdk.Stack {
  readonly githubActionsOidcProvider: akdev.GithubActionsOidcProvider;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.githubActionsOidcProvider = new akdev.GithubActionsOidcProvider(this, 'GithubOidcProvider', {
      owner: 'akdev1l',
      repo: 'aws-dns-root',
      branch: 'main',
    });
  }
}
