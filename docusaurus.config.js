/** @type {import('@docusaurus/types').DocusaurusConfig} */

let vega_version = process.env.VEGA_VERSION;
if (vega_version === undefined || vega_version === "") {
  console.log("Please specify env var VEGA_VERSION.");
  process.exit(1);
}

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
    navbar: {
      title: "Vega documentation",
      logo: {
        alt: "Vega Protocol Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          href: "https://github.com/vegaprotocol/documentation",
          label: "GitHub",
          position: "right",
        },
        {
          to: "/docs/concepts/new-to-vega",
          label: "Concepts",
          position: "left",
        },
        {
          to: "/docs/api/overview",
          label: "API",
          position: "left",
        },
        {
          to: "/docs/tools/overview",
          label: "Tools",
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
              to: "https://www.twitch.tv/vegacommunity",
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
              label: "Telegram",
              to: "https://t.me/vegacommunity",
            },
            {
              label: "Twitter",
              to: "https://twitter.com/vegaprotocol",
            },
            {
              label: "Forum",
              to: "https://community.vega.xyz/",
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
      // GraphQL
      require.resolve("@edno/docusaurus2-graphql-doc-generator"),
      {
        // https://github.com/edno/graphql-markdown#options
        loaders: {
          UrlLoader: "@graphql-tools/url-loader",
        },
        schema:
          "https://raw.githubusercontent.com/vegaprotocol/sdk-docs/" +
          vega_version +
          "/graphql/sources/data-node/schema.graphql",
        rootPath: "docs",
        baseURL: "graphql",
        linkRoot: "/docs",
        diffMethod: "SCHEMA-DIFF",
      },
    ],
  ],
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        debug: undefined,
        blog: false, // disabled
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/vegaprotocol/documentation/edit/main/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
    [
      // gRPC
      "docusaurus-protobuffet",
      {
        protobuffet: {
          fileDescriptorsPath: "./proto.json",
          protoDocsPath: "protodocs", // prodoDocsPath seems to be hard coded to "protodocs", so don't change this
          sidebarPath: "./sidebarsProtodocs.js",
        },
      },
    ],
    [
      // REST
      "redocusaurus",
      {
        specs: [
          {
            specUrl:
              "https://raw.githubusercontent.com/vegaprotocol/protos/" +
              vega_version +
              "/swagger/data-node/api/v1/trading_data.swagger.json",
            routePath: "/docs/api/rest/data-node/data",
          },
          {
            specUrl:
              "https://raw.githubusercontent.com/vegaprotocol/protos/" +
              vega_version +
              "/swagger/data-node/api/v1/trading_proxy.swagger.json",
            routePath: "/docs/api/rest/data-node/proxy",
          },
          {
            specUrl:
              "https://raw.githubusercontent.com/vegaprotocol/protos/" +
              vega_version +
              "/swagger/vega/api/v1/core.swagger.json",
            routePath: "/docs/api/rest/core/core",
          },
          {
            specUrl:
              "https://raw.githubusercontent.com/vegaprotocol/protos/" +
              vega_version +
              "/swagger/vega/api/v1/corestate.swagger.json",
            routePath: "/docs/api/rest/core/state",
          },
        ],
      },
    ],
  ],
  themes: [],
};
