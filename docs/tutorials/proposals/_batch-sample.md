
## Submitting proposals in a batch
If you want to submit this proposal as part of a larger batch of proposals, follow this sample structure:

```
{
    "batchProposalSubmission": {
        "rationale": {
            "title": "High level title",
            "description": "Description of all parts of this batch of proposals",
        },
        "terms": {
            changes: [{
                    "enactmentTimestamp": 123,
                    "typeOfProposal": {
                        "changes": {
                            "d": true
                        }
                    }
                },
                {
                    "enactmentTimestamp": 123,
                    "typeOfProposal": {
                        "changes": {
                            "d": true
                        }
                    }
                },
                {
                    "enactmentTimestamp": 123,
                    "typeOfProposal": {
                        "changes": {
                            "d": true
                        }
                    }
                }
            ]
        }
    }
}
```