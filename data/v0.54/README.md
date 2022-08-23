A lot of API changes happened between 0.53 and 0.54, including removing 
the automatic generation of the Swagger & Protobuf description files. These
will return, but for this version they are committed in this folder.

These can be removed when 0.54 is no longer deployed on any relevant networks,
and future versions should be able to return to using ./scripts/generate_proposals.js to fetch the API descriptors.