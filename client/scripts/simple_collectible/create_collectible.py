
#!/usr/bin/python3
from flask import Blueprint
from brownie import SimpleCollectible, accounts, network, config
#from helpful_scripts import OPENSEA_FORMAT
#network.connect('rinkeby')

OPENSEA_FORMAT = "https://testnets.opensea.io/assets/{}/{}"


# IPFS LINK TO EXPERIENCE
sample_token_uri = "https://ipfs.io/ipfs/QmWxzMCE1EWWJ3vtyRqgD3mTt55jDsCqv3Wc2kbgUWuwv5?filename=1-MTB.json"

nftcode = Blueprint("nftcode", __name__)

# Fijar si hay que cambiar el /nftcode por create_collectible
@nftcode.route("/create_collectible")
@nftcode.route("/")

def main():
    dev = accounts.add(config["wallets"]["from_key"]) 
    print(network.show_active())
    simple_collectible = SimpleCollectible[len(SimpleCollectible) - 1]
    token_id = simple_collectible.tokenCounter()
    transaction = simple_collectible.createCollectible(sample_token_uri, {"from": dev})
    transaction.wait(1)
    #Hacemos un Print para ver por terminal del link, y el return que sera lo que se le devuelve al usuario.
    def return_nft():
        nft_link = "Awesome! You can view your NFT at {}".format(OPENSEA_FORMAT.format(simple_collectible.address, token_id))
        print(nft_link)
        return(nft_link)

    return_nft()
    return(return_nft)