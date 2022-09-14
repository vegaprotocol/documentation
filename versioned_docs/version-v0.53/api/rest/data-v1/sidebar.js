module.exports = [
  {
    type: 'category',
    label: 'Trading Data (v1)',
    link: {
      type: 'generated-index',
      title: 'TradingDataService',
      slug: '/category/versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service'
    },
    items: [
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-assets',
        label: 'Get a list of all assets on Vega',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-global-reward-pool-accounts',
        label:
          'Get a list of accounts holding reward pools\nCan be filtered by asset, there will be 1 reward pool account per\nasset in the network.',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-fee-infrastructure-accounts',
        label:
          'Get a list of accounts holding infrastructure fees.\nCan be filtered by asset, there will be 1 infrastructure fee account per\nasset in the network.',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-asset-by-id',
        label: 'Get an asset by its identifier',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-delegations',
        label: 'Get delegation data',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-deposit',
        label: 'Get a deposit by its identifier',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-get-epoch-2',
        label:
          'Get data for a specific epoch, if id omitted it gets the current epoch',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-get-epoch',
        label:
          'Get data for a specific epoch, if id omitted it gets the current epoch',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-get-new-asset-proposals',
        label:
          'Get governance data (proposals and votes) for proposals aiming to create new assets',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-get-new-market-proposals',
        label:
          'Get governance data (proposals and votes) for proposals that aim creating new markets',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-get-proposal-by-reference',
        label:
          'Get governance data (proposals and votes) for a proposal located by reference',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-get-proposal-by-id',
        label:
          'Get governance data (proposals and votes) for a proposal located by ID',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-get-proposals',
        label: 'Get governance data (proposals and votes) for all proposals',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-get-key-rotations',
        label: 'Get all key rotations',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-liquidity-provisions-2',
        label: 'Get the liquidity provision orders',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-liquidity-provisions',
        label: 'Get the liquidity provision orders',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-markets',
        label: 'Get a list of Markets',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-markets-data',
        label: 'Get a list of Market Data',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-market-data-by-id',
        label: 'Get Market Data by Market ID',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-market-by-id',
        label: 'Get a Market by ID',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-market-accounts',
        label: 'Get a list of Accounts by Market',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-candles',
        label: 'Get a list of Candles by Market',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-market-depth',
        label: 'Get Market Depth',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-orders-by-market',
        label: 'Get a list of Orders by Market',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-order-by-market-and-id',
        label: 'Get an Order by Market and Order ID',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-trades-by-market',
        label: 'Get a list of Trades by Market',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-last-trade',
        label: 'Get latest Trade',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-network-parameters',
        label: 'Get the network parameters',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-get-nodes',
        label: 'List all known network nodes',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-get-node-data',
        label: 'Get data of current node',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-get-node-by-id',
        label: 'Get a specific node by ID',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-list-oracle-data',
        label: 'Get all oracle data',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-oracle-specs',
        label: 'Get the oracle specs',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-oracle-spec',
        label: 'Get an oracle spec by ID.',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-oracle-data-by-spec',
        label: 'Get oracle data that matched the given spec',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-estimate-fee',
        label: 'Get an estimate for the fee to be paid for a given order',
        className: 'api-method post'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-estimate-margin',
        label: 'Get an estimate for the margin required for a new order',
        className: 'api-method post'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-trades-by-order',
        label: 'Get a list of Trades by Order',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-order-versions-by-id',
        label: 'Get all versions of the order by its orderID',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-order-by-reference',
        label: 'Get an Order by Pending Order reference (UUID)',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-parties',
        label: 'Get a list of Parties',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-party-by-id',
        label: 'Get a Party by ID',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-party-accounts',
        label: 'Get a list of Accounts by Party',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-deposits',
        label: 'Get deposits for a party',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-margin-levels',
        label: 'Get Margin Levels by Party ID',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-orders-by-party',
        label: 'Get a list of Orders by Party',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-positions-by-party',
        label: 'Get a list of Positions by Party',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-get-proposals-by-party',
        label:
          'Get governance data (proposals and votes) for proposals by party authoring them',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-get-rewards',
        label: 'Get rewards',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-trades-by-party',
        label: 'Get a list of Trades by Party',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-get-votes-by-party',
        label: 'Get votes by party casting them',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-party-stake',
        label: 'TradingDataService_PartyStake',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-get-vega-time',
        label: 'Get Time',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-transfers',
        label: 'TradingDataService_Transfers',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-withdrawals',
        label: 'Get withdrawals for a party',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-withdrawal',
        label: 'Get a withdrawal by its identifier',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/data-v1/trading-data-service-erc-20-withdrawal-approval',
        label:
          'Get the bundle approval for an ERC20 withdrawal,\nthese data are being used to bundle the call to the smart contract on the ethereum bridge',
        className: 'api-method get'
      }
    ]
  }
]
