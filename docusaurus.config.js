/** @type {import('@docusaurus/types').DocusaurusConfig} */

let vega_version = process.env.VEGA_VERSION;
if (vega_version === undefined || vega_version === "") {
  console.log("Please specify env var VEGA_VERSION.");
  process.exit(1);
}

module.exports = {
  title: "Vega Protocol",
  tagline:
    "a protocol for creating and trading derivatives on a fully decentralised network",
  url: "https://docs.fairground.vega.xyz/",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "vegaprotocol",
  projectName: "documentation",
  themeConfig: {
    navbar: {
      title: "Vega Protocol documentation",
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
          to: "/docs/concepts/vega-chain",
          label: "Concepts",
          position: "left"
        },
        {
          to: "/docs/api/overview",
          label: "API",
          position: "left"
        },
        {
          to: "/docs/tools/vega-wallet",
          label: "Tools",
          position: "left"
        }

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
              to: "https://medium.com/vegaprotocol",
            },
            {
              label: "Twitch",
              to: "https://www.twitch.tv/vegacommunity",
            },
            {
              label: "YouTube",
              to: "https://www.youtube.com/channel/UC3xDuTW9fd1Y7jpCkOwOuHQ",
            },
          ],
        },
        {
          title: "Fairground Testnet",
          items: [
            {
              label: "Console",
              to: "https://console.fairground.wtf/",
            },
          ],
        },
        {
          title: "Social",
          items: [
            {
              label: "Discord",
              to: "https://discord.com/invite/ZNEMCYd",
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
          "https://raw.githubusercontent.com/vegaprotocol/api/" +
          vega_version +
          "/graphql/schema.graphql",
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
              "https://raw.githubusercontent.com/vegaprotocol/api/" +
              vega_version +
              "/rest/api/trading.swagger.json",
            routePath: "/docs/rest/",
          },
        ],
      },
    ],
  ],
  themes: [],
};
