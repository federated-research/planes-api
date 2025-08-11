# Planes API Documentation

Documentation for Plane APIs.

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
