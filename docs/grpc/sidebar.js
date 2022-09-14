module.exports = {
  protodocs: [
    {
      type: 'category',
      label: 'GRPC',
      items: [
        {
          type: 'category',
          label: '/vega',
          items: [
            {
              type: 'category',
              label: '/oracles/v1',
              items: [
                { type: 'doc', id: 'grpc/vega/oracles/v1/spec.proto' },
                { type: 'doc', id: 'grpc/vega/oracles/v1/data.proto' }
              ]
            },
            {
              type: 'category',
              label: '/commands/v1',
              items: [
                { type: 'doc', id: 'grpc/vega/commands/v1/commands.proto' },
                { type: 'doc', id: 'grpc/vega/commands/v1/oracles.proto' },
                { type: 'doc', id: 'grpc/vega/commands/v1/signature.proto' },
                {
                  type: 'doc',
                  id: 'grpc/vega/commands/v1/validator_commands.proto'
                },
                { type: 'doc', id: 'grpc/vega/commands/v1/transaction.proto' }
              ]
            },
            {
              type: 'category',
              label: '/events/v1',
              items: [{ type: 'doc', id: 'grpc/vega/events/v1/events.proto' }]
            },
            {
              type: 'category',
              label: '/api/v1',
              items: [
                { type: 'doc', id: 'grpc/vega/api/v1/core.proto' },
                { type: 'doc', id: 'grpc/vega/api/v1/corestate.proto' }
              ]
            },
            {
              type: 'category',
              label: '/checkpoint/v1',
              items: [
                { type: 'doc', id: 'grpc/vega/checkpoint/v1/checkpoint.proto' }
              ]
            },
            {
              type: 'category',
              label: '/snapshot/v1',
              items: [
                { type: 'doc', id: 'grpc/vega/snapshot/v1/snapshot.proto' }
              ]
            },
            {
              type: 'category',
              label: '/wallet/v1',
              items: [{ type: 'doc', id: 'grpc/vega/wallet/v1/wallet.proto' }]
            },
            { type: 'doc', id: 'grpc/vega/markets.proto' },
            { type: 'doc', id: 'grpc/vega/vega.proto' },
            { type: 'doc', id: 'grpc/vega/assets.proto' },
            { type: 'doc', id: 'grpc/vega/governance.proto' },
            { type: 'doc', id: 'grpc/vega/chain_events.proto' }
          ]
        },
        {
          type: 'category',
          label: '/grpc/data-node/api',
          items: [
            {
              type: 'category',
              label: '/v1',
              items: [
                { type: 'doc', id: 'grpc/data-node/api/v1/trading_data.proto' }
              ]
            },
            {
              type: 'category',
              label: '/v2',
              items: [
                { type: 'doc', id: 'grpc/data-node/api/v2/trading_data.proto' }
              ]
            }
          ]
        }
      ]
    }
  ]
}
