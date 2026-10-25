# Release procedure

Use Node 22.x and Yarn 1.22.22. `yarn install --frozen-lockfile --non-interactive`
and `yarn build` generate the Prisma client and build Next.js. Neither command
runs a migration, seed, or database write. Vercel uses these commands explicitly
in vercel.json (the same safe build pattern as carrot-market).

Database migrations are a separate, manual owner operation. Before any future
release that needs a migration, the owner must inspect the SQL and migration
history, verify the target environment and DATABASE_URL, arrange a backup and
recovery plan, and confirm preview databases are isolated from production.
Only then, from the reviewed release commit in the intended environment, run
`yarn prisma migrate deploy` explicitly. Never put that command in install,
build, postinstall, or a preview hook. This PR does not change the DB schema and
has not run migrations or seeds.

Before merging, inspect the latest Vercel check and authenticated build logs.
Earlier main and PR previews failed; the exact remote failure cause is unverified.
A successful local build with dummy configuration does not prove remote deployment
health. Check dashboard command overrides and Node 22 settings; repository config
cannot verify or change those remote settings.

Image uploads require NEXT_PUBLIC_CF_ACCOUNT_HASH to match the account used by
the existing getImageUrl frontend helper. Store the canonical base URL
`https://imagedelivery.net/<account-hash>/<image-id>`; delivery variants are added
when rendering. Existing stored values are not rewritten. An unchanged avatar
uses the existing empty/omitted form field and preserves the stored value.
