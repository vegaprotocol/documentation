---
title: Freeform proposal
hide_title: false
vega_network: TESTNET
keywords:
- proposal
- governance
- newFreeform
- updateNetworkParameter
- newAsset
- newMarket
---
import NetworkParameter from '@site/src/components/NetworkParameter';
import NewFreeformAnnotated from './_generated-proposals/_newFreeform_annotated.md';
import NewFreeformJSON from './_generated-proposals/_newFreeform_json.md';
import NewFreeformCMD from './_generated-proposals/_newFreeform_cmd.md';
import NewFreeformWin from './_generated-proposals/_newFreeform_win.md';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Create a freeform proposal
The aim of this is to allow community to provide votes on proposals which don't change any of the behaviour of the currently running Vega blockchain. That is to say, at enactment time, no changes are effected on the system, but the record of how token holders voted will be stored on chain. 

Note that to create a freeform proposal you need <NetworkParameter frontMatter={frontMatter} param="governance.proposal.freeform.minProposerBalance" hideName={true} suffix="tokens" />
, while to vote you only need <NetworkParameter frontMatter={frontMatter} param="governance.proposal.freeform.minVoterBalance" suffix="tokens" hideName={true}/>.


<Tabs groupId="newFreeform">
  <TabItem value="annotated" label="Annotated example">
    <NewFreeformAnnotated />
  </TabItem>
  <TabItem value="json" label="JSON example">
    <NewFreeformJSON />
  </TabItem>
  <TabItem value="cmd" label="Linux / OSX command line">
    <NewFreeformCMD />
  </TabItem>
  <TabItem value="win" label="Windows command line">
    <NewFreeformWin />
  </TabItem>
</Tabs>
