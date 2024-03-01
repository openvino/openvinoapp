const IPFS = require('ipfs');


const pepe = async() => {
    const node = await IPFS.create();
    const version = await node.version();
    console.log('IPFS Version:', version.version);
}

pepe();
