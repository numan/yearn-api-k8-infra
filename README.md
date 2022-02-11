# Introduction

Built using [cdk8s](https://cdk8s.io/).

This defines a deployment for [Yearn API](https://github.com/yearn/yearn-api) using kubernetes.

This was build to compare and contrast the against the [cdk version](https://github.com/yearn/yearn-api-infra).

## Prerequisite

- Install [cdk8s](https://cdk8s.io/)
- Install [minikube](https://minikube.sigs.k8s.io/docs/start/) 
- Install the [nginx ingress controller](https://kubernetes.github.io/ingress-nginx/deploy/#environment-specific-instructions)
- Build a local version of [yearn api](https://github.com/yearn/yearn-api): `docker build -t yearn-api:dev .`
- Install all local requirements: `npm i`
- Create all your secrets: `kubectl create secret generic yearn-api-secrets --from-literal=WEB3_HTTP_PROVIDER='https://eth-mainnet.alchemyapi.io/v2/<KEY>' --from-literal=WEB3_HTTP_PROVIDER_FTM_URL='https://rpc.fantom.com' --from-literal=WEB3_HTTP_PROVIDER_FTM_USERNAME='opera' --from-literal=WEB3_HTTP_PROVIDER_FTM_PASSWORD='<PASSWORD>' --from-literal=REMOTE_WRITE_PASSWORD='<PASSWORD>' --from-literal=REMOTE_WRITE_USERNAME='<USERNAME>'`

## Building Kubernetes Chart

```bash
$ npm run build
```

## Deploy on Kubernetes

```bash
$ kubectl apply -f dist/yearn-api-k8-infra.k8s.yaml
```

## Access the API

```bash
$ curl http://localhost/v1/chains/1/vaults/all
```

## Useful Commands

```
 Your cdk8s typescript project is ready!

   cat help         Print this message
 
  Compile:
   npm run compile     Compile typescript code to javascript (or "yarn watch")
   npm run watch       Watch for changes and compile typescript in the background
   npm run build       Compile + synth

  Synthesize:
   npm run synth       Synthesize k8s manifests from charts to dist/ (ready for 'kubectl apply -f')

 Deploy:
   kubectl apply -f dist/

 Upgrades:
   npm run import        Import/update k8s apis (you should check-in this directory)
   npm run upgrade       Upgrade cdk8s modules to latest version
   npm run upgrade:next  Upgrade cdk8s modules to latest "@next" version (last commit)
```