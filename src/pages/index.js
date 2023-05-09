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
            <p>Learn about the Vega framework and get set up to take part.</p>
            <ul>
              <li><Link href={`${base}/concepts/new-to-vega`}>Introduction to Vega</Link></li>
              <li>Get a <Link to={`${base}/tools/vega-wallet`}>Vega wallet</Link>, on <Link to={`${base}/tools/vega-wallet/desktop-app`}>desktop</Link> or for <Link to={`${base}/tools/vega-wallet/cli-wallet`}>command line</Link></li>
              <li><Link className="external" base="https://github.com/orgs/vegaprotocol/projects/114/views/4" target="_blank">Roadmap</Link></li>
            </ul>
          </article>
          <article>
            <h2>Governance</h2>
            <p>The network is governed by the community. Take part by voting on proposals and proposing changes.</p>
            <ul>
              <li><Link to={`${base}/concepts/governance`}>Introduction to governance</Link></li>
              <li><Link to={`${base}/tutorials/proposals`}>Tutorials: Governance proposals</Link></li>
              <li><Link className="external" href="https://token.vega.xyz/governance" target="_blank">Governance dApp</Link></li>
            </ul>
          </article>
          <article>
            <h2>Trading</h2>
            <p>Explore the risk-free Vega testnet, Fairground. Mainnet trading launching soon, starting with cash settled futures.</p>
            <ul>
              <li><Link className="external" href="https://console.fairground.wtf/" target="_blank">Fairground trading console</Link></li>
              <li><Link href="https://docs.vega.xyz/testnet/concepts/new-to-vega" target="_blank">Fairground docs</Link></li>
            </ul>
          </article>
        </section>
        <hr/>
        <section id="spotlight">
          <h2>Spotlight</h2>
          <Link to={`${base}/node-operators`} className="card cardContainer">
            <h3 className="cardTitle">Node operators: Overview</h3>
            <p className="cardDescription">Get guidance on how to maintain and upgrade a node.</p>
          </Link>
          <Link to={`${base}/releases/overview`} className="card cardContainer">
            <h3 className="cardTitle">Release summaries</h3>
            <p className="cardDescription">See the latest features and get ahead of breaking changes.</p>
          </Link>
          <Link to={`${base}/tools/vega-wallet/desktop-app`} className="card cardContainer">
            <h3 className="cardTitle">Vega Wallet</h3>
            <p className="cardDescription">Step-by-step instructions to set up your Vega Wallet using the desktop app.</p>
          </Link>
        </section>
      </main>
    </Layout>
  );
}
