If you want to submit this proposal as part of a larger batch of proposals, follow this sample structure:

```
{
    "batchProposalSubmission": {
        "rationale": {
            "title": "High level title",
            "description": "Description of all parts of this batch of proposals"
        },
        "terms": {
            "closingTimestamp": "123",
            "changes": [
                {
                    "enactmentTimestamp": 123,
                    "cancelTransfer": {
                        "changes": {
                            "transferId": "345"
                        }
                    }
                },
                {
                    "enactmentTimestamp": 123,
                    "cancelTransfer": {
                        "changes": {
                            "transferId": "789"
                        }
                    }
                }
            ]
        }
    }
}
```