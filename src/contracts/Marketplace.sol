pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract MarketContract{
    struct AuctionItem{
        uint256 id;
        address tokenAddress;
        uint256 tokenId;
        address payable seller;
        uint256 askingPrice;
        bool isSold;

    }
    AuctionItem[] public ItemsForSale;
    mapping(address=>mapping(uint256 =>bool)) activeItems;

    event itemAdded(uint256 id,uint256 tokenId,address tokenAddress, uint256 askingPrice,address seller);

    event itemSold(uint256 id,address buyer,uint256 askingPrice,address seller,uint256 tokenId,address tokenAddress);

    modifier OnlyItemOwner(address tokenAddress,uint256 tokenId){
        IERC721 tokenContract=IERC721(tokenAddress);
        require(tokenContract.ownerOf(tokenId)==msg.sender);
        _;
    }

    modifier HasTransferApproval(address tokenAddress,uint256 tokenId){
        IERC721 tokenContract=IERC721(tokenAddress);
        require(tokenContract.isApprovedForAll(msg.sender,address(this))==true);

        _;
    }


     modifier HassellApproval(address tokenAddress,address seller){
        IERC721 tokenContract=IERC721(tokenAddress);
        require(tokenContract.isApprovedForAll(seller,address(this))==true);

        _;
    }

    modifier itemExists(uint256 id){
        require(id<ItemsForSale.length && ItemsForSale[id].id==id,"could not find item");
        _;
    }


    modifier isForSale(uint256 id){
        require( ItemsForSale[id].isSold==false,"item is alredy sold");
        _;
    }

    function addItemtoMarket(uint256 tokenId,address tokenAddress,uint256 askingPrice) OnlyItemOwner(tokenAddress,tokenId)  external returns(uint256){

        require(activeItems[tokenAddress][tokenId]==false,"item is already up for sale");

        uint256 newItemid=ItemsForSale.length;
        ItemsForSale.push(AuctionItem(newItemid,tokenAddress,tokenId,payable(msg.sender),askingPrice,false));
        activeItems[tokenAddress][tokenId]=true;

        assert(ItemsForSale[newItemid].id==newItemid);
        emit itemAdded(newItemid, tokenId,tokenAddress,askingPrice,msg.sender);
        return newItemid;

    }

    function buyItem(uint256 id) payable external itemExists(id) isForSale(id) HassellApproval(ItemsForSale[id].tokenAddress,ItemsForSale[id].seller) {
        require(msg.value>=ItemsForSale[id].askingPrice,"Not enough funds send");
        require(msg.sender!=ItemsForSale[id].seller);

        ItemsForSale[id].isSold=true;
        activeItems[ItemsForSale[id].tokenAddress][ItemsForSale[id].tokenId]=false;
        IERC721(ItemsForSale[id].tokenAddress).safeTransferFrom(ItemsForSale[id].seller, msg.sender, ItemsForSale[id].tokenId);
        ItemsForSale[id].seller.transfer(msg.value);
        emit itemSold(id, msg.sender, ItemsForSale[id].askingPrice,ItemsForSale[id].seller,ItemsForSale[id].tokenId,ItemsForSale[id].tokenAddress);

    }


    function getitems() public returns( uint256[] memory, uint256[] memory, address[] memory, bool[] memory){

        uint256[] memory id=new uint256[](ItemsForSale.length);

        uint256[] memory tokid=new uint256[](ItemsForSale.length);

        address[] memory uaddress=new address[](ItemsForSale.length);

        bool[] memory sold=new bool[](ItemsForSale.length);


        for(uint i=0;i<ItemsForSale.length;i++){

            id[i]=ItemsForSale[i].id;
            tokid[i]=ItemsForSale[i].tokenId;
            uaddress[i]=ItemsForSale[i].seller;
            sold[i]=ItemsForSale[i].isSold;

        }

        return (id,tokid,uaddress,sold);






        

    }


}