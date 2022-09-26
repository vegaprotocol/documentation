/** @type {import('@docusaurus/types').DocusaurusConfig} */

let version = process.env.npm_package_version

if (!version) {
  version = require('./package.json').version
}

if (!version.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/)) {
  throw new Error('Version incorrectly formatted') 
} else {
}

const vVersion = 'v' + version
const shortVersion = version.split('.').slice(0,2).join('.')

module.exports = {
  title: "Vega Protocol",
  tagline: "A protocol for creating and trading derivatives on a fully decentralised network",
  url: "https://docs.vega.xyz/",
  baseUrl: "/",
  trailingSlash: false,
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
        }, */
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
          label: "APIs",
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
  plugins: [
    [
      // This plugin extends the CLI to give us a generator that takes in our schema and produces
      // markdown files inside the docs folder, so these are included in the versioned docs.
      require.resolve("@edno/docusaurus2-graphql-doc-generator"),
      {
        schema: `./specs/v${version}/schema.graphql`,
        rootPath: "docs",
        baseURL: "graphql",
        linkRoot: "/docs/testnet/",
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
        fileDescriptorsPath: `./specs/v${version}/proto.json`,
        protoDocsPath: "./docs/grpc",
        sidebarPath: "./docs/grpc/sidebar.js",
      },
    ],

    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "apiDocs",
        docsPluginId: "classic",
        config: {
          tradingv1v055: {
            specPath: "./specs/v0.55.0/trading_data_v1.swagger.json",
            outputDir: "docs/api/rest/data-v1",
            sidebarOptions: {
              groupPathsBy: "tag",
            },
          },
          tradingv2v055: {
            specPath: "./specs/v0.55.0/trading_data_v2.swagger.json",
            outputDir: "docs/api/rest/data-v2",
            sidebarOptions: {
              groupPathsBy: "tag",
            },
          },
          corev055: {
            specPath: "./specs/v0.55.0/core.swagger.json",
            outputDir: "docs/api/rest/core",
            sidebarOptions: {
              groupPathsBy: "tag",
            },
          },
          statev055: {
            specPath: "./specs/v0.55.0/corestate.swagger.json",
            outputDir: "docs/api/rest/state",
            sidebarOptions: {
              groupPathsBy: "tag",
            },
          },
          statev053: {
            specPath: "./specs/v0.53.0/corestate.swagger.json",
            outputDir: "./versioned_docs/version-v0.53/api/rest/state",
            sidebarOptions: {
              groupPathsBy: "tag",
            },
          },
          corev053: {
            specPath: "./specs/v0.53.0/core.swagger.json",
            outputDir: "./versioned_docs/version-v0.53/api/rest/core",
            sidebarOptions: {
              groupPathsBy: "tag",
            },
          },
          tradingv1v053: {
            specPath: "./specs/v0.53.0/trading_data.swagger.json",
            outputDir: "./versioned_docs/version-v0.53/api/rest/data-v1",
            sidebarOptions: {
              groupPathsBy: "tag",
            },
          },
        },
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
          lastVersion: "v0.53",
          docLayoutComponent: "@theme/DocPage",
          docItemComponent: "@theme/ApiItem",
          versions: {
            current: {
              banner: "unreleased",
              label: `testnet (v${shortVersion})`,
              path: "testnet",
              // Hacky: Classname used for full version number, v prefix. Used for OpenrpcPlayground
              className: `${vVersion}`
            },
            "v0.53": {
              banner: "none",
              label: "mainnet (v0.53)",
              path: "mainnet",
              // Hacky: Classname used for full version number, v prefix. Used for OpenrpcPlayground
              className: "v0.53.0"
            }
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
