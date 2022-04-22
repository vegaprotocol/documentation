/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

let { schemaSidebar } = require("./docs/graphql/sidebar-schema");
let { protodocs } = require("./docs/grpc/sidebars");

module.exports = {
  api: [
    "api/overview",
    {
      type: "doc",
      label: "GraphQL",
      id: "graphql/schema",
    },
    {
      type: "link",
      href: "/docs/grpc/vega/vega.proto",
      label: "GRPC",
    },
    {
      type: "category",
      label: "REST",
      collapsed: false,
      items: [
        {
          type: "doc",
          id: "api/rest/overview",
          label: "Overview",
        },
        {
          type: "link",
          href: "/docs/api/rest/data-node/data",
          label: "Data node",
        },
        {
          type: "link",
          href: "/docs/api/rest/data-node/proxy",
          label: "Data node proxy",
        },
        {
          type: "link",
          href: "/docs/api/rest/core/core",
          label: "Core",
        },
        {
          type: "link",
          href: "/docs/api/rest/core/state",
          label: "Core state",
        },
      ],
    },
  ],
  concepts: [
    {
      type: "autogenerated",
      dirName: "concepts",
    },
  ],
  tools: [
    {
      type: "autogenerated",
      dirName: "tools",
    },
  ],
  releases: [
    {
      type: "autogenerated",
      dirName: "releases",
    },
  ],
  grpc: protodocs, 
  // GraphQL
  schemaSidebar: schemaSidebar,
};
