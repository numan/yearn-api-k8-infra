import { Construct } from "constructs";
import { App, Chart, ChartProps } from "cdk8s";
import * as kplus from "cdk8s-plus-22";

import { Redis } from "cdk8s-redis";
import { EnvValue } from "cdk8s-plus-22";

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    const secret = kplus.Secret.fromSecretName("yearn-api-secrets");

    const redis = new Redis(this, "RedisWithReplica", {
      replicas: 2,
    });

    const ingress = new kplus.Ingress(this, "ingress", {
      metadata: {
        annotations: {
          "kubernetes.io/ingress.class": "nginx",
        },
      },
    });

    // define resources here
    const deployment = new kplus.Deployment(this, "Deployment", {
      replicas: 3,
      containers: [
        {
          // image: "ealen/echo-server",
          image: "yearn-api:dev",
          imagePullPolicy: kplus.ImagePullPolicy.NEVER,
          env: {
            WEB3_HTTP_PROVIDER: EnvValue.fromSecretValue({
              secret,
              key: "WEB3_HTTP_PROVIDER",
            }),
            WEB3_HTTP_PROVIDER_FTM_URL: EnvValue.fromSecretValue({
              secret,
              key: "WEB3_HTTP_PROVIDER_FTM_URL",
            }),
            WEB3_HTTP_PROVIDER_FTM_USERNAME: EnvValue.fromSecretValue({
              secret,
              key: "WEB3_HTTP_PROVIDER_FTM_USERNAME",
            }),
            WEB3_HTTP_PROVIDER_FTM_PASSWORD: EnvValue.fromSecretValue({
              secret,
              key: "WEB3_HTTP_PROVIDER_FTM_PASSWORD",
            }),
            REMOTE_WRITE_PASSWORD: EnvValue.fromSecretValue({
              secret,
              key: "REMOTE_WRITE_PASSWORD",
            }),
            REMOTE_WRITE_USERNAME: EnvValue.fromSecretValue({
              secret,
              key: "REMOTE_WRITE_USERNAME",
            }),
            REMOTE_WRITE: EnvValue.fromValue("https://prometheus-prod-10-prod-us-central-0.grafana.net/api/prom/push"),
            REQUEST_TIMEOUT: EnvValue.fromValue("1000"),
            API_MIGRATION_URL: EnvValue.fromValue("https://api.yearn.finance"),
            PORT: EnvValue.fromValue("3004"),
            REDIS_CONNECTION_STRING: EnvValue.fromValue(`redis://${redis.primaryHost}:6379`),
          },
        },
      ],
    });

    deployment.exposeViaIngress("/", { port: 3004, ingress });

    // ingress.addRule('/', ingressBackend);
  }
}

const app = new App();
new MyChart(app, "yearn-api-k8-infra");
app.synth();
