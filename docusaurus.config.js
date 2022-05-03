/** @type {import('@docusaurus/types').DocusaurusConfig} */

module.exports = {
  title: "Vega",
  tagline:
    "A protocol for creating and trading derivatives on a fully decentralised network",
  url: "https://docs.vega.xyz/",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "vegaprotocol",
  projectName: "documentation",
  themeConfig: {
    image: "img/logo-y.png",
    navbar: {
      title: "Vega documentation",
      logo: {
        alt: "Vega Protocol Logo",
        src: "img/logo-y.png",
      },
      items: [
/*        {
          type: "docsVersionDropdown",
          position: "right",
          // Removes the All Versions page
          dropdownItemsAfter: [],
          dropdownActiveClassDisabled: true,
          // Makes the menu not clickable when not open
          href: '#'
        },*/
        {
          href: "https://github.com/vegaprotocol/documentation",
          label: "GitHub",
          position: "right",
        },
        {
          type: "doc",
          docId: "concepts/new-to-vega",
          label: "Concepts",
          position: "left",
        },
        {
          type: "doc",
          docId: "api/overview",
          label: "API",
          position: "left",
        },
        {
          type: "doc",
          docId: "tutorials/index",
          label: "API tutorials",
          position: "left",
        },
        {
          type: "doc",
          docId: "tools/index",
          label: "Apps and Tools",
          position: "left",
        },
        {
          type: "doc",
          docId: "releases/overview",
          label: "Releases",
          position: "left",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Vega Protocol",
          items: [
            {
              label: "Website",
              to: "http://vega.xyz/",
            },
            {
              label: "GitHub",
              to: "https://github.com/vegaprotocol",
            },
            {
              label: "Blog",
              to: "https://blog.vega.xyz",
            },
            {
              label: "Twitch",
              to: "https://www.twitch.tv/vegaprotocol",
            },
            {
              label: "YouTube",
              to: "https://www.youtube.com/vegaprotocol",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Discord",
              to: "https://vega.xyz/discord",
            },
            {
              label: "Twitter",
              to: "https://twitter.com/vegaprotocol",
            },
            {
              label: "Forum",
              to: "https://community.vega.xyz/",
            },
            {
              label: "Telegram",
              to: "https://t.me/vegacommunity",
            },
          ],
        },
        {
          title: "Fairground",
          items: [
            {
              label: "Home",
              to: "https://fairground.wtf/",
            },
            {
              label: "Docs",
              to: "https://docs.fairground.vega.xyz/",
            },
            {
              label: "Vega Console",
              to: "https://console.fairground.wtf/",
            },
          ],
        },
      ],
      copyright: `Copyright ©2018-${new Date().getFullYear()} Gobalsky Labs Limited, registered in Gibraltar`,
    },
  },
  plugins: [
    [
      // This plugin extends the CLI to give us a generator that takes in our schema and produces
      // markdown files inside the docs folder, so these are included in the versioned docs.
      require.resolve("@edno/docusaurus2-graphql-doc-generator"),
      {
        // https://github.com/edno/graphql-markdown#options
        loaders: {
          UrlLoader: "@graphql-tools/url-loader",
        },
        schema: "./schema.graphql",
        rootPath: "docs",
        baseURL: "graphql",
        linkRoot: "/docs/testnet/",
        diffMethod: "SCHEMA-DIFF",
      },
    ],
    [
      // An alternative to algolia
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        language: ["en"],
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: ["/docs"],
      },
    ],
    [
      // docusaurus-protobuffet as a preset is the standard approach. However, we want the GRPC docs to be
      // versioned along with the ./docs/ folder, so here we are using the plugin for it's file generation
      // portion only. The *plugin* extends the docusaurus CLI to give us `generate-grpc`, but does not
      // set up another instance of `docs` that controls rendering for the GRPC portion of the docs. Which
      // is to say: GRPC is treated like any other part of our docs.
      //
      // The weird thing this causes is that the React components in ProtoFile are provided by the theme, which
      // is no long available - so that component has been 'swizzled' out of the theme and in to ./src/theme
      require.resolve("docusaurus-protobuffet-plugin"),
      {
        routeBasePath: "/docs/testnet/grpc",
        fileDescriptorsPath: "./proto.json",
        protoDocsPath: "./docs/grpc",
        sidebarPath: "./docs/grpc/sidebar.js",
      },
    ],
  ],
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        debug: undefined,
        // We don't have a '/blog/' section on the site, so disable this section
        blog: false,
        // Configuration for the '/docs/' section of the site
        docs: {
          disableVersioning: false,
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/vegaprotocol/documentation/edit/main/",
          lastVersion: "v0.47.0",
          versions: {
            current: {
              banner: "unreleased",
              label: "testnet (v0.50)",
              path: "testnet",
            },
            "v0.47.0": {
              banner: "none",
              label: "mainnet (v0.47)",
              path: "mainnet",
            },
          },
        },
        // Vega specific theme overrides go here
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
    [
      // REST - see note at the top. Currently this is not versioned inside docs, but can be
      "redocusaurus",
      {
        theme: {
          primaryColor: undefined,
          options: {
            expandDefaultServerVariables: true,
            expandResponses: "all",
            hideDownloadButton: true,
            schemaExpansionLevel: 5,
            expandSingleSchemaField: true
          },
        },
        // start-rest-versions
        specs: [
          {
            id: "trading-v0.47.0",
            spec: "https://raw.githubusercontent.com/vegaprotocol/protos/v0.47.0/swagger/data-node/api/v1/trading_data.swagger.json",
            route: "/docs/mainnet/api/rest/data-node/data",
            layout: {
              searchMetaDatas: {
                version: "v0.47.6",
              },
            },
          },
          {
            id: "core-v0.47.0",
            spec: "https://raw.githubusercontent.com/vegaprotocol/protos/v0.47.0/swagger/vega/api/v1/core.swagger.json",
            route: "/docs/mainnet/api/rest/core/core",
            layout: {
              searchMetaDatas: {
                version: "v0.47.0",
              },
            },
          },
          {
            id: "proxy-v0.47.0",
            spec: "https://raw.githubusercontent.com/vegaprotocol/protos/v0.47.0/swagger/data-node/api/v1/trading_proxy.swagger.json",
            route: "/docs/mainnet/api/rest/data-node/proxy",
            layout: {
              searchMetaDatas: {
                version: "v0.47.0",
              },
            },
          },
          {
            id: "state-v0.47.0",
            spec: "https://raw.githubusercontent.com/vegaprotocol/protos/v0.47.0/swagger/data-node/api/v1/trading_data.swagger.json",
            route: "/docs/mainnet/api/rest/core/state",
            layout: {
              searchMetaDatas: {
                version: "v0.47.0",
              },
            },
          },
          {
            id: "trading-v0.50.1",
            spec: "https://raw.githubusercontent.com/vegaprotocol/protos/v0.50.1/swagger/data-node/api/v1/trading_data.swagger.json",
            route: "/docs/testnet/api/rest/data-node/data",
            layout: {
              searchMetaDatas: {
                version: "v0.50.1",
              },
            },
          },
          {
            id: "core-v0.50.1",
            spec: "https://raw.githubusercontent.com/vegaprotocol/protos/v0.50.1/swagger/vega/api/v1/core.swagger.json",
            route: "/docs/testnet/api/rest/core/core",
            layout: {
              searchMetaDatas: {
                version: "v0.50.1",
              },
            },
          },
          {
            id: "state-v0.50.1",
            spec: "https://raw.githubusercontent.com/vegaprotocol/protos/v0.50.1/swagger/vega/api/v1/corestate.swagger.json",
            route: "/docs/testnet/api/rest/core/state",
            layout: {
              searchMetaDatas: {
                version: "v0.50.1",
              },
            },
          },
        ],
        // end-rest-versions
      },
    ],
  ],
  themes: ["@saucelabs/theme-github-codeblock"],
};
