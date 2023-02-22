import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <a class="cta" href="/mainnet/concepts/new-to-vega">New to Vega?</a>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig, siteMetadata } = useDocusaurusContext();
  console.dir(siteMetadata)
  return (
    <Layout description={`${siteConfig.tagline}`}>
      <HomepageHeader />
      <main>
        <section id="topics">
          <article>
            <h2>Getting started</h2>
            <p>Learn about the Vega framework and get set up to take part.</p>
            <ul>
              <li><a href="/mainnet/concepts/new-to-vega">Introduction to Vega</a></li>
              <li>Get a <a href="/mainnet/tools/vega-wallet">Vega wallet</a>, on <a href="/mainnet/tools/vega-wallet/desktop-app">desktop</a> or for <a href="/mainnet/tools/vega-wallet/cli-wallet">command line</a></li>
              <li><a class="external" href="https://github.com/orgs/vegaprotocol/projects/114/views/4" target="_blank">Roadmap</a></li>
            </ul>
          </article>
          <article>
            <h2>Governance</h2>
            <p>The network is governed by the community. Take part by voting on proposals and proposing changes.</p>
            <ul>
              <li><a href="/mainnet/concepts/vega-protocol#governance">Introduction to governance</a></li>
              <li><a href="mainnet/tutorials/proposals">Tutorials: Governance proposals</a></li>
              <li><a class="external" href="https://token.vega.xyz/governance" target="_blank">Governance dApp</a></li>
            </ul>
          </article>
          <article>
            <h2>Trading</h2>
            <p>Explore the risk-free Vega testnet, Fairground. Mainnet trading launching soon, starting with cash settled futures.</p>
            <ul>
              <li><a class="external" href="https://console.fairground.wtf/" target="_blank">Fairground trading console</a></li>
              <li><a href="https://docs.vega.xyz/testnet/concepts/new-to-vega" target="_blank">Fairground docs</a></li>
            </ul>
          </article>
        </section>
        <hr/>
        <section id="spotlight">
          <h2>Spotlight</h2>
          <a href="/mainnet/node-operators" class="card cardContainer">
            <h3 class="cardTitle">Node operators: Overview</h3>
            <p class="cardDescription">Get guidance on how to maintain and upgrade a node.</p>
          </a>
          <a href="/mainnet/releases/overview" class="card cardContainer">
            <h3 class="cardTitle">Release summaries</h3>
            <p class="cardDescription">See the latest features and get ahead of breaking changes.</p>
          </a>
          <a href="/mainnet/tools/vega-wallet/desktop-app" class="card cardContainer">
            <h3 class="cardTitle">Vega Wallet</h3>
            <p class="cardDescription">Step-by-step instructions to set up your Vega Wallet using the desktop app.</p>
          </a>
        </section>
      </main>
    </Layout>
  );
}
