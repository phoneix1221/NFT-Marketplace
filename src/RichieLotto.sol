pragma solidity >=0.7.0 <0.9.0;

interface IBEP20 {
    function totalSupply() external view returns (uint256);
    function decimals() external view returns (uint8);
    function symbol() external view returns (string memory);
    function name() external view returns (string memory);
    function getOwner() external view returns (address);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address _owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Ownable {
    address private owner;
    
    event OwnerSet(address indexed oldOwner, address indexed newOwner);
    
    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnerSet(address(0), owner);
    }
    
    function changeOwner(address newOwner) public isOwner {
        emit OwnerSet(owner, newOwner);
        owner = newOwner;
    }
    function getOwner() external view returns (address) {
        return owner;
    }
}

contract RichieLotto is Ownable {
    address private operator;
    
    uint256 private prize = 0;
    address private winner = address(0);
    
    address private RICHIETOKEN_ADDRESS = 0xC7Bc24c4C18F8251D31611114d0e7B5F5ef76762;
    IBEP20  private RICHIETOKEN = IBEP20(RICHIETOKEN_ADDRESS);
    uint256 private constant PRIZE_WALLET_THRESHOLD = 100 * 10 ** 6 * 10 ** 9;
    
    event Operator(address indexed operator);
    event Draw(address indexed newWinner, uint256 indexed newPrize);
    event Claim(address indexed winner, uint256 indexed prize);
    
    modifier isOperator() {
        require(msg.sender == operator, "Caller is not operator");
        _;
    }
    
    modifier isWinner() {
        require(msg.sender == winner, "Caller is not winner");
        _;
    }
    
    function changeOperator(address newOperator) external isOwner {
        emit Operator(newOperator);
        operator = newOperator;
    }
    
    function getPrize() external isWinner view returns (uint256) {
        return prize;
    }
    function getWinner() external view returns (address) {
        return winner;
    }
    function newDraw(address newWinner) external isOperator {
        uint256 newPrize = RICHIETOKEN.balanceOf(address(this)) - PRIZE_WALLET_THRESHOLD;
        require(newPrize > 0, "The prize wallet has less than 100M RICHIE tokens");
        winner = newWinner;
        prize = newPrize;
        emit Draw(winner, prize);
    }
    function claimPrize() external isWinner {
        require(prize > 0, "Prize is already claimed to the winner");
        require(RICHIETOKEN.balanceOf(address(this)) >= prize, "Not enough balance in the prize wallet");
        RICHIETOKEN.transfer(winner, prize);
        emit Claim(winner, prize);
        prize = 0;
    }
}