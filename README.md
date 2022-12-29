[![Netlify Status](https://api.netlify.com/api/v1/badges/5c36333c-e63e-4bb3-8819-ef16ff2183de/deploy-status)](https://app.netlify.com/sites/vega-docusaurus/deploys)

# Documenting the Vega protocol

This repo includes documentation about the Vega protocol.

If you have any questions, drop them into Vega's [Discord](https://vega.xyz/discord), [Telegram](https://t.me/vegacommunity), or [Forum](https://community.vega.xyz).

# Software

This website is built using [Docusaurus 2](https://docusaurus.io/). For more information on how to make changes in this repository, or how to run the site locally, [see CONTRIBUTING.md](./CONTRIBUTING.md).

## Docusaurus plugins

- [docusaurus-protobuffet](https://github.com/protobuffet/docusaurus-protobuffet) - Protobuf docs
- [docusaurus-openapi-docs](https://github.com/PaloAltoNetworks/docusaurus-openapi-docs) - REST docs
- [docusaurus2-graphql-doc-generator](https://github.com/graphql-markdown/graphql-markdown) - GraphQL docs
- [docusaurus-search-local](https://github.com/easyops-cn/docusaurus-search-local) - Search

## Versioning

All of the text content and API documentation is tied to a release version of the core. To understand how we used Docusaurus versioning, [see VERSIONING.md](./VERSIONING.md).

## Configuration notes

- GraphQL docs are generated in to `/docs/graphql/`
- docusaurus-protobuffet-plugin is used to generate docs, but unlike the defaults setup generates them into the `/docs/` so as to avoid documenting them separately
- New versions of REST docs are configured in `docusaurus.config.js`
- When copying between versions, some files (particularly ones with Ethereum addresses) need to be checked to ensure the [Frontmatter](https://docusaurus.io/docs/markdown-features#front-matter) point to the right networks

# [License](./LICENSE)

MIT
