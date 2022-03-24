pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";




contract NFTCollectible is ERC721 {

using Counters for Counters.Counter;
Counters.Counter private _tokenIds;
mapping(string => uint8) hashes;
struct NFTToken{
    string asset_hash;
    string meta_hash;
}

NFTToken[] public token ;

event show(address owner,uint256 totalcount);
event minted(address owner,uint token_id);


    constructor() ERC721("NFTCollectible", "NCO") public {

    }


    function mint(string memory _hash, string memory _metadata) public returns (uint256){
        require(hashes[_hash] != 1);
        hashes[_hash] = 1;
        NFTToken memory newNFTToken = NFTToken({
            asset_hash: _hash,
            meta_hash: _metadata
        });

        token.push(newNFTToken);
       
        uint256 newItemId = _tokenIds.current();
         _tokenIds.increment();
        _mint(msg.sender,newItemId);
        _setTokenURI(newItemId, _metadata);
        emit minted(msg.sender,newItemId);
        return newItemId;
    }


    function getmintedtokens()external view returns(uint256[] memory)
    {
        
        uint256 TokenCount= balanceOf(msg.sender);

        if (TokenCount == 0) {
            return new uint256[](0);
        } else {

            uint256[] memory result = new uint256[](TokenCount);
            uint256 totalNTF = token.length;
            uint256 resultIndex = 0;
            uint256 tokenId = 0;
            while (tokenId <totalNTF) {
                if (ownerOf(tokenId) == msg.sender) {
                    result[resultIndex] = tokenId;
                    resultIndex = resultIndex.add(1);
                }
                tokenId = tokenId.add(1);
            }
            return result;

        }
    }



    function get() public returns (uint256,address){

        return (balanceOf(msg.sender),msg.sender);
    }



    function gettokenDetails(uint256 tokenId) external view returns (uint256, string memory,string memory) {
        NFTToken storage NFTtoken = token[tokenId];
        return (tokenId, NFTtoken.asset_hash, NFTtoken.meta_hash);
    }


}

