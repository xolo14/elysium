# Elysium Luxury Digital

Luxury boutique hotel site for Elysium Hotels (Madhapur & Hitec City).

**Created by [grootdigitals.com](https://grootdigitals.com)**

## Development

You need Node.js 20+ and npm.

```sh
npm i
npm run dev
```

## Hostinger shared hosting (`public_html/elysium`)

Shared hosting cannot run Node. Use the static package:

```sh
npm run build:shared
# then upload elysium-shared-hosting.zip
```

Site URL: `https://your-domain.com/elysium/`

See `UPLOAD-STEPS.txt` inside the zip.

## Hostinger Node.js / VPS

```sh
npm run build
npm start
```

Use `elysium-hostinger-dist.zip` only on Node plans.
