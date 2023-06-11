// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";


contract PeerPlayTokens is ERC1155 {

    address private platform;

    uint internal executed;

    constructor() ERC1155("") {
        executed=0;
    }   

    
    modifier onlyPlatform(){
        require(msg.sender==platform,"Only Platform can call this function");
        _;
    }

    function setPlatformAddress(address _platformAddress) public {
        require(executed==0,"Function is used already");
        platform=_platformAddress;
        executed=1;
    }

    function mintPlatformVideoNFT(address user,uint256 _tokenID) public onlyPlatform {
        _mint(user,_tokenID,1,"");
    }

}