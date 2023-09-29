/** @type {import('@docusaurus/types').DocusaurusConfig} */

const { shortenVersion, openApiConfig, version, mainnetVersion } = require('./scripts/docusaurus.config.openapi.js')

module.exports = {
  title: "Vega Protocol Documentation",
  tagline: "Documentation of a protocol for creating and trading derivatives on a fully decentralised network",
  url: "https://docs.vega.xyz/",
  baseUrl: "/",
  trailingSlash: false,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "vegaprotocol",
  projectName: "documentation",
  themeConfig: {
    image: "img/preview-image.png",
    navbar: {
      title: "Vega documentation",
      logo: {
        alt: "Vega Protocol Logo",
        src: "/img/logo-y.png",
      },
      items: [
        {
          type: "docsVersionDropdown",
          position: "right",
          // Removes the All Versions page
          dropdownItemsAfter: [],
          dropdownActiveClassDisabled: true,
          // Makes the menu not clickable when not open
          href: '#'
        },
        {
          href: "https://github.com/vegaprotocol/documentation",
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
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
          label: "APIs",
          position: "left",
        },
        {
          type: "doc",
          docId: "tutorials/index",
          label: "Tutorials",
          position: "left",
        },
        {
          type: "doc",
          docId: "tools/index",
          label: "Apps",
          position: "left",
        },
        {
          type: "doc",
          docId: "releases/overview",
          label: "Releases",
          position: "left",
        },
        {
          type: "doc",
          docId: "node-operators/index",
          label: "Node operators",
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
              label: "Vega Console",
              to: "http://console.vega.xyz/",
            },
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
            ],
        },
        {
          title: "Status",
          items: [
            {
              label: "Mainnet incidents",
              to: "https://blog.vega.xyz/tagged/vega-incident-reports",
            },
            {
              label: "Known issues",
              to: "https://github.com/orgs/vegaprotocol/projects/122",
            },
            {
              label: "Share feedback",
              to: "https://github.com/vegaprotocol/feedback/discussions",
            },
            {
              label: "Roadmap",
              to: "https://github.com/orgs/vegaprotocol/projects/114/views/4",
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
          title: "Fairground, Vega testnet",
          items: [
            {
              label: "Home",
              to: "https://fairground.wtf/",
            },
            {
              label: "Console (Fairground)",
              to: "https://console.fairground.wtf/",
            },
          ],
        },
      ],
      copyright: `Copyright ©2018-${new Date().getFullYear()} Gobalsky Labs Limited, registered in Gibraltar`,
    },
    languageTabs: [
      {
        highlight: "bash",
        language: "curl",
        logoClass: "bash",
      },
      {
        highlight: "python",
        language: "python",
        logoClass: "python",
      },
      {
        highlight: "go",
        language: "go",
        logoClass: "go",
      },
      {
        highlight: "javascript",
        language: "nodejs",
        logoClass: "nodejs",
      }
    ],
  },
  webpack: {
    jsLoader: (isServer) => ({
      loader: require.resolve('swc-loader'),
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          target: 'es2017',
        },
        module: {
          type: isServer ? 'commonjs' : 'es6',
        },
      },
    }),
  },
  plugins: [
    [
      // This plugin extends the CLI to give us a generator that takes in our schema and produces
      // markdown files inside the docs folder, so these are included in the versioned docs.
      require.resolve("@edno/docusaurus2-graphql-doc-generator"),
      {
        schema: `./specs/v${version}/schema.graphql`,
        rootPath: "docs/api/",
        baseURL: "graphql",
        linkRoot: "/testnet/api/",
        diffMethod: "none",
        docOptions: {
          toc: true,
          pagination: true,
          index: true
        }
      }
    ],
    [
      // An alternative to algolia
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        language: ["en"],
        hashed: true,
        explicitSearchResultPath: true,
        indexBlog: false,
        docsRouteBasePath: ["/"],
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
        routeBasePath: "/testnet/api/grpc",
        fileDescriptorsPath: `./specs/v${version}/proto.json`,
        protoDocsPath: "./docs/api/grpc/",
        sidebarPath: "./docs/api/grpc/sidebar.js",
      },
    ],

    [
      // See ./scripts/docusaurus.config.openapi.js for how this is generated, but in short it takes the
      // current 'mainnet' vresion and the current 'testnet' version from package.json, iterates over the
      // ./specs/[version number] folder to get all the swagger files, then generates them in a predictable
      // way
      "docusaurus-plugin-openapi-docs",
      {
        id: "apiDocs",
        docsPluginId: "classic",
        config:  openApiConfig
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
          lastVersion: `v${shortenVersion(mainnetVersion)}`,
          docLayoutComponent: "@theme/DocPage",
          docItemComponent: "@theme/ApiItem",
          routeBasePath: '/',
          versions: {
            current: {
              banner: "unreleased",
              label: `testnet (v${shortenVersion(version)})`,
              path: "testnet",
              // Hacky: Classname used for full version number, v prefix. Used for OpenrpcPlayground
              className: `v${version}`
            },
            "v0.72": {
              banner: "none",
              label: `mainnet (v${shortenVersion(mainnetVersion)})`,
              path: "mainnet",
              // Hacky: Classname used for full version number, v prefix. Used for OpenrpcPlayground
              className: `v${mainnetVersion}`
            },
          },
        },
        // Vega specific theme overrides go here
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  themes: [
    "docusaurus-theme-openapi-docs",
    "@vegaprotocol/docusaurus-theme-github-codeblock",
  ],
};

