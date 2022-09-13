module.exports = [
  {
    type: 'category',
    label: 'Core Service',
    link: {
      type: 'generated-index',
      title: 'CoreService',
      slug: '/category/versioned_docs/version-v0.53/api/rest/core/core-service'
    },
    items: [
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/core/core-service-last-block-height',
        label: 'Get the height of the last tendermint block',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/core/core-service-statistics',
        label: 'Get Statistics on Vega',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/core/core-service-get-vega-time',
        label: 'Get Time',
        className: 'api-method get'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/core/core-service-submit-transaction',
        label: 'Submit a signed transaction',
        className: 'api-method post'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/core/core-service-check-transaction',
        label: 'Check a signed transaction',
        className: 'api-method post'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/core/core-service-submit-raw-transaction',
        label: 'Submit a version agnostic signed transaction',
        className: 'api-method post'
      },
      {
        type: 'doc',
        id: 'versioned_docs/version-v0.53/api/rest/core/core-service-check-raw-transaction',
        label: 'Check a raw signed transaction',
        className: 'api-method post'
      }
    ]
  }
]
