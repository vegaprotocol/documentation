const { dirname } = require('path');
const fs = require('fs')

// Used to sanity check the version string that was passed in
const semver = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/

// Simply used to track if any proto files were filtered out
let madeChanges = false

// Ensure we're working from the expected folder
const appDir = dirname(require.main.filename);
console.debug('  Switching to:' + appDir)
process.chdir(appDir);

// Protos with this string as their filename will be removed
const protosToRemove = [
    // Internal types only
    'vega/checkpoint/v1/checkpoint.proto',
    // Internal types only
    'vega/snapshot/v1/snapshot.proto',
]

// Get the target version name from the command line
const version = process.argv[2]
if (!version.match(semver)) {
    console.error('  Version string does not look right: ' + version)
    process.exit(1)
}

// Check the protos file exists
const filePath = `../specs/${version}/proto.json`
if (!fs.existsSync(filePath)) {
    console.error('  File does not exist: ' + filePath)
    process.exit(1)
}

// Filter the { files: [] } property
const protos = require(filePath)
console.debug('  Opened ' + filePath)
const filteredProtos = protos.files.filter(f => {
    const res =  !(protosToRemove.includes(f.name))

    if (res === false) {
        madeChanges = true
        console.debug('   - Removing ' + f.name)
    }

    return res
})

// Overwrite the protos file if we filtered out any files
if (madeChanges) {
    fs.writeFileSync(filePath, JSON.stringify({ files: filteredProtos }), 'utf-8')
    console.debug('  Wrote ' + filePath)
} else {
    console.debug('  No changes made')
}