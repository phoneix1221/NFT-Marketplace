pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";




contract NFTCollectible is ERC721 {

using Counters for Counters.Counter;
Counters.Counter private _tokenIds;



struct item{
    uint256 id;
    address creator;
    string uri;
    string meta_hash;

}

mapping(string => uint8) hashes;
mapping(uint256=>item) items;



event show(address owner,uint256 totalcount);
event minted(address owner,uint token_id);


    constructor() ERC721("porable", "PCO") public {

    }


    function mint(string memory _hash, string memory _metadata,string memory _uri) public returns (uint256){
        require(hashes[_hash] != 1);

        hashes[_hash] = 1;
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender,newItemId);

        items[newItemId]=item(newItemId,msg.sender,_uri,_metadata);

        _setTokenURI(newItemId, _metadata);
        emit minted(msg.sender,newItemId);
        return newItemId;
    }





    function get() public returns (uint256,address){

        return (balanceOf(msg.sender),msg.sender);
    }



   


}

