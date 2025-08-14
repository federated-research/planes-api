# Planes API Documentation

This repository contains the early-stage schema for the Planes API.

The aim of this API is to define a consistent way for systems to describe and interact with Trellis **Planes**.

Read more about [Trellis](https://docs.federated-analytics.ac.uk/trellis).

See the human-readable [reference documentation](https://trellis.federated-analytics.ac.uk).

## Developer

```bash
npm install
npm run build
```

## Usage

- Add OpenAPI specs to `apis/<path>/api.yaml`
- Run `npm run build` to generate docs
- Push to trigger GitHub Actions deployment

## Structure

```
apis/
├── analysis/v0.0.1/api.yaml
├── control/v0.0.1/api.yaml
└── data/v0.0.1/api.yaml
```

The folder structure maps directly to URL paths. Any `api.yaml` file found will be published at that path.

GitHub Actions builds and deploys to Pages automatically.
