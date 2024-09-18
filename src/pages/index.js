import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";
import Link from '@docusaurus/Link';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {usePluginData} from '@docusaurus/useGlobalData';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const versions = usePluginData('docusaurus-plugin-content-docs');
  const isBrowser = useIsBrowser();
  const base = isBrowser ? getBaseUrl(versions) : 'mainnet'

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <Link className="cta" href={`${base}/concepts/new-to-vega`}>New to Vega?</Link>
      </div>
    </header>
  );
}

// This feels hacky - but Link doesn't appear to prefix version on the hompage
// presumably because it's not served by Docs
const DEFAULT = 'mainnet'

// Given an array of versions, and a selected version (see below), return the
// appropriate base path for the version
function getSelectedBase(versions, selectedVersion) {
   if (!selectedVersion) {
    return DEFAULT
   }

   const chosenVersion = versions.find(ver => ver.name === selectedVersion)
   if (!chosenVersion) {
    return DEFAULT
   }

   return chosenVersion.path
}

// Detect if the user has selected a version, gather plugin information together
// and select a base url for homepage links
function getBaseUrl(versions) {
  if (!window || !window.localStorage || !versions || !versions.versions) {
    return DEFAULT
  }

  const v = window.localStorage.getItem('docs-preferred-version-default') || DEFAULT
   
  return getSelectedBase(versions.versions, v)
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const versions = usePluginData('docusaurus-plugin-content-docs');
  const isBrowser = useIsBrowser();
  const base = isBrowser ? getBaseUrl(versions) : 'mainnet'
  
  return (
    <Layout description={`${siteConfig.tagline}`}>
      <HomepageHeader />
      <main>
        <section id="topics">
          <article>
            <h2>Getting started</h2>
            <p>Get to know the Vega framework and what's coming up next.</p>
            <ul>
              <li><Link href={`${base}/concepts/new-to-vega`}>About the protocol</Link></li>
              <li><Link className="external" href="https://github.com/orgs/vegaprotocol/projects/114/views/4" target="_blank">Roadmap</Link></li>
            </ul>
          </article>
          <article>
            <h2>Trading</h2>
            <p>Place orders on derivatives markets with a trading dApp for Vega software. You'll need a Vega Wallet.</p>
            <ul>
              <li><Link className="external" href="https://console.fairground.wtf/" target="_blank">Testnet trading dApp</Link></li>
              <li><Link to={`${base}/tools/vega-wallet/`}>Vega Wallet software</Link></li>
            </ul>
          </article>
          <article>
            <h2>Governance</h2>
            <p>The network is governed by the community. Use your tokens to propose and vote on changes.</p>
            <ul>
              <li><Link to={`${base}/concepts/governance`}>Intro to governance</Link></li>
              <li><Link to={`${base}/tutorials/proposals`}>Tutorials: How to propose</Link></li>
              <li><Link className="external" href="https://governance.vega.xyz" target="_blank">Governance dApp</Link></li>
            </ul>
          </article>
        </section>
        <hr/>
        <section id="spotlight">
          <h2>Spotlight</h2>
          <Link to={`${base}/node-operators`} className="card cardContainer">
            <h3 className="cardTitle">Node operators: Overview</h3>
            <p className="cardDescription">Read the guides to maintain and upgrade a node.</p>
          </Link>
          <Link to={`${base}/releases/overview`} className="card cardContainer">
            <h3 className="cardTitle">Release summaries</h3>
            <p className="cardDescription">See the new features, get ahead of breaking changes.</p>
          </Link>
          <Link to={`${base}/api/overview`} className="card cardContainer">
            <h3 className="cardTitle">Developing & APIs</h3>
            <p className="cardDescription">What you need to know to start developing on Vega.</p>
          </Link>
        </section>
      </main>
    </Layout>
  );
}
