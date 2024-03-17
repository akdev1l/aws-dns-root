import * as cdk from 'aws-cdk-lib';
import { aws_iam as iam, aws_route53 as route53 } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as akdev from './akdev-constructs';

export class DnsRootStack extends cdk.Stack {
  readonly githubActionsOidcProvider: akdev.GithubActionsOidcProvider;
  readonly awsRootZone: route53.PublicHostedZone;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.githubActionsOidcProvider = new akdev.GithubActionsOidcProvider(this, 'GithubOidcProvider', {
      owner: 'akdev1l',
      repo: 'aws-dns-root',
      branch: 'main',
    });

    this.awsRootZone = new route53.PublicHostedZone(this, 'RootDnsZone', {
      zoneName: 'aws.akdev.xyz',
    });

    const delegates = [
        new iam.AccountPrincipal('749640853560'),
    ];
    delegates.forEach(delegate => this.awsRootZone.grantDelegation(delegate));

    const output: Record<string, string> = {
      RootZoneId: this.awsRootZone.hostedZoneId,
      RootNameservers: cdk.Fn.join(', ', this.awsRootZone.hostedZoneNameServers ?? ["none"]),
    };
    Object.keys(output)
      .forEach(key => new cdk.CfnOutput(this, `${key}Output`, {
        value: output[key],
      }));
  }
}
