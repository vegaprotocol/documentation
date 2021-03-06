module.exports = {
  protodocs: [
    {
      type: "category",
      label: "Files",
      items: [
        {
          type: "category",
          label: "/github.com/mwitkow/go-proto-validators",
          items: [
            {
              type: "doc",
              id: "github.com/mwitkow/go-proto-validators/validator.proto",
            },
          ],
        },
        {
          type: "category",
          label: "/oracles/v1",
          items: [
            { type: "doc", id: "oracles/v1/spec.proto" },
            { type: "doc", id: "oracles/v1/data.proto" },
          ],
        },
        {
          type: "category",
          label: "/commands/v1",
          items: [
            { type: "doc", id: "commands/v1/commands.proto" },
            { type: "doc", id: "commands/v1/validator_commands.proto" },
            { type: "doc", id: "commands/v1/oracles.proto" },
            { type: "doc", id: "commands/v1/transaction.proto" },
          ],
        },
        {
          type: "category",
          label: "/events/v1",
          items: [{ type: "doc", id: "events/v1/events.proto" }],
        },
        {
          type: "category",
          label: "/api",
          items: [{ type: "doc", id: "api/trading.proto" }],
        },
        {
          type: "category",
          label: "/tm",
          items: [{ type: "doc", id: "tm/replay.proto" }],
        },
        {
          type: "category",
          label: "/wallet/v1",
          items: [{ type: "doc", id: "wallet/v1/wallet.proto" }],
        },
        { type: "doc", id: "markets.proto" },
        { type: "doc", id: "vega.proto" },
        { type: "doc", id: "assets.proto" },
        { type: "doc", id: "governance.proto" },
        { type: "doc", id: "chain_events.proto" },
      ],
    },
  ],
};
