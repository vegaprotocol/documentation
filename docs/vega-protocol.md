# Vega Protocol 
 ## Transaction messages 
 (to include protobufs of CORE txs (i.e. ones that actually appear in TM blocks)) 
 ## Governance protocol
  ### Market creation
  ### Market updates
  ### Parameter changes
  ### Voting on proposals
  ### Asset creation
 ## Trading protocol
  ### Submitting an order
Traders can submit orders into any market that is active - i.e. not in a protective auction, or matured, expired, or settled. Orders will only be accepted if sufficient margin can be allocated from a trader's available collateral. 

If, during continuous trading, an order is going to be matched with another order on the book for the same party (wash trade), then execution of that order will be stopped and the order will be cancelled and removed (if on the book). 

   #### Order sizes
Order sizes can be fractional, as long as the order is within the maximum number of decimal places allowable. Any order containing more precision that this will be rejected.  If a market requires that orders are specified using integers, fractional order sizes does not apply and 1 is the smallest increment. A market's decimal places are specified in the market framework (link).

   #### Amending an order
Amendments that change price or increase size will be executed as an atomic cancel and replace, meaning the time priority will be lost (i.e. as if the original order was cancelled and removed from the book and a new order submitted with the modified values). 

   #### Cancelling an order
   #### Order types/Times in force
   ### Batch operations on orders
 ## Collateral protocol
  ### Depositing 
  ### Withdrawing
  ### Adding assets (links to governance) 
 ## Supplying data
