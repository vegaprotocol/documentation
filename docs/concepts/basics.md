---
title: Vega protocol
sidebar_label: Welcome
---
import {FeatureList, Column, Feature} from "@site/src/components/FeatureList"

Welcome! This site documents how the Vega protocol works.

This site documents both Vega's mainnet and testnet networks. Mainnet describes the software version run by the network's validators, while testnet has the latest released code. Use the nav bar at the top to switch between them.

<div class="container">
  <div class="row">
    <div class="col col--4">
      <a href="/testnet/concepts/trading-on-vega">
        <div class="card">
          <div class="card__image">
            <img src={require("/static/img/intros/trading-concepts.png").default} alt="Learn" />
          </div>
          <div class="card__body">
            <h3>Trading on Vega</h3>
            Learn about the trading infrastructure built on Vega.
          </div>
        </div>
      </a>
    </div>
    <div class="col col--4">
      <a href="/testnet/concepts/liquidity">
        <div class="card">
          <div class="card__image">
            <img src={require("/static/img/intros/liquidity.png").default} alt="Providing liquidity" />
          </div>
          <div class="card__body">
            <h3>Provide liquidity</h3>
            Incubate markets and earn revenue on the fees.
          </div>
        </div>
      </a>
    </div>
        <div class="col col--4">
      <a href="/testnet/api/overview">
        <div class="card">
          <div class="card__image">
            <img src={require("/static/img/intros/api-docs.png").default} alt="Start using the APIs" />
          </div>
          <div class="card__body">
            <h3>Dig into the APIs</h3>
            What you need to know, plus all the endpoints. No auth token needed.
          </div>
        </div>
      </a>
    </div>
  </div>
</div>

<hr class="subsection" />

<FeatureList>
  <Column title="Get to know the protocol">
    <Feature url="/testnet/concepts/vega-chain" title="Vega Blockchain" subtitle="How the Vega PoS chain works" image="chain.png" />
    <Feature url="/testnet/concepts/governance" title="Governance" subtitle="Learn about governance" subtitle="Make your voice heard, take part in governance." image="governance.png" />
  </Column>
  <Column title="Use Vega">
    <Feature url="https://console.vega.xyz" title="Trade on Console" subtitle="Console is a trading interface for Vega" image="console.png" />
    <Feature url="/testnet/tools" title="Apps" subtitle="Browse wallet apps and other tools for Vega" image="apps.png" />
  </Column>
    <Column title="Set up a node">
    <Feature url="/testnet/node-operators/" title="Run a validator node" subtitle="Support running the network by becoming a validator" image="run-node.png" />
    <Feature url="/testnet/node-operators#get-started-with-a-data-node" title="Start up a data node" subtitle="Get direct access to network and trading data with your own data node." image="data-node.png" />
    </Column>
</FeatureList>