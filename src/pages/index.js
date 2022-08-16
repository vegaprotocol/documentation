import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";
import HomepageFeatures from "../components/HomepageFeatures";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <a class="cta" href="/docs/mainnet/concepts/new-to-vega">New to Vega?</a>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`} description="${siteConfig.tagline}">
      <HomepageHeader />
      <main>
        <section id="topics">
          <article>
            <h2>Getting started</h2>
            <p>Learn about the Vega framework and get set up to take part.</p>
            <ul>
              <li><a href="/docs/mainnet/concepts/new-to-vega">Introduction to Vega</a></li>
              <li>Get a <a href="/docs/mainnet/tools/vega-wallet">Vega wallet</a>, on <a href="/docs/mainnet/tools/vega-wallet/desktop-app">desktop</a> or <a href="/docs/mainnet/tools/vega-wallet/cli-wallet">command line</a></li>
            </ul>
          </article>
          <article>
            <h2>Governance</h2>
            <p>The network is improved through making and voting on proposals.</p>
            <ul>
              <li><a href="/docs/mainnet/concepts/vega-protocol#governance">Introduction to governance</a></li>
              <li><a href="docs/mainnet/tutorials/proposals">Tutorials: Governance proposals</a></li>
              <li><a class="external" href="https://token.vega.xyz/governance" target="_blank">Governance dApp</a></li>
            </ul>
          </article>
          <article>
            <h2>Trading</h2>
            <p>The official Vega testnet, Fairground, offers a risk-free trading environment.</p>
            <ul>
              <li><a class="external" href="https://console.fairground.wtf/" target="_blank">Fairground trading console</a></li>
              <li><a class="external" href="https://docs.fairground.vega.xyz/" target="_blank">Fairground docs</a></li>
            </ul>
          </article>
        </section>
        <hr/>
        <section id="spotlight">
          <h2>Spotlight</h2>
          <a href="/docs/mainnet/node-operators" class="card">
            <h3>Node operators: Overview</h3>
            <p>Get guidance on how to maintain and upgrade a node.</p>
          </a>
          <a href="/docs/mainnet/releases/overview" class="card">
            <h3>Releases</h3>
            <p>See the latest features and get ahead of breaking changes.</p>
          </a>
          <a href="/docs/testnet/tools/vega-wallet/cli-wallet" class="card">
            <h3>Wallet CLI</h3>
            <p>Step-by-step instructions to set up your first wallet.</p>
          </a>
          <a href="/docs/testnet/tutorials/staking-tokens" class="card">
            <h3>Staking tokens</h3>
            <p>Using the Vega Wallet and smart contracts to stake unlocked tokens.</p>
          </a>
        </section>
      </main>
    </Layout>
  );
}
