// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PeerPlayTokens.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PeerPlay
 * @dev PeerPlay is a decentralized video sharing platform
 * @author Aditya Bhattad
 */
contract PeerPlay is Ownable{
    /**
     * @notice Creator struct
     * @param supporters Number of supporters
     * @param supportPrice Price to support the creator
     * @param supportersList List of supporters
     */
    struct Creator {
        Video[] videos;
        uint256 supporters;
        uint256 supportPrice;
        address[] supportersList;
    }

    /**
     * @notice Video struct
     * @param videoId ID of the video
     * @param creator Address of the creator
     * @param title Title of the video
     * @param description Description of the video
     * @param livepeerId Hash of the video on Livepeer
     * @param thumbnailHash Hash of the thumbnail on IPFS
     * @param videoPrice Price of the video
     */
    struct Video {
        uint256 videoId;
        address creator;
        string title;
        string description;
        string livepeerId;
        string thumbnailHash;
        uint256 videoPrice;
    }

    /**
     * @notice Platform Token Contract Address
     */
    address private immutable platformTokenContract;

    /**
     * @notice Mapping of creator address to creator struct
     */
    mapping(address => Creator) private creators;

    /**
     * @notice Mapping of video ID to video struct
     */
    mapping(uint256 => Video) private videos;

    /**
     * @notice Mapping of supporter address to revenue share
     */
    mapping(address => uint256) private supporterRevenueShare;

    /**
     * @notice Mapping of creator address to revenue share
     */
    mapping(address => uint256) private creatorRevenueShare;

    /**
     * @notice amount of platform revenue share (in ETH)
     */
    uint256 private platformRevenueShare;

    /**
     * @dev Mapping of user address to mapping of creator address to boolean which keeps track if user is supporter of the creator
     */
    mapping (address => mapping (address => bool)) private isSupporter;

    /**
     * @notice Total number of videos
     */
    uint private videoCount;

    /**
     * @notice Event emitted when a creator is supported
     * @param supporter Address of the supporter
     * @param creator Address of the creator
     * @param amount Amount of ETH sent
     */
    event SupportedCreator(
        address indexed supporter,
        address indexed creator,
        uint256 amount
    );

    /**
     * @param creator Address of the creator
     * @param videoId Video ID
     * @param title title of the video
     * @param description discription of the video
     * @param livepeerId livepeerId of the video
     * @param thumbnailHash IPFS hash of the thumbnail
     * @param videoPrice Price to mint the access NFT for the video
     */
    event VideoUploaded(
        address indexed creator,
        uint256 indexed videoId,
        string title,
        string description,
        string livepeerId,
        string thumbnailHash,
        uint256 videoPrice
    );

    /**
     * @param creator Address of the creator
     * @param videoId Video ID
     * @param supporter Address of the supporter
     */
    event AccessNFTMinted(
        address indexed creator,
        uint256 indexed videoId,
        address indexed supporter
    );

    /**
     * @param videoId Video ID
     * @param amount Amount of ETH distributed
     */
    event RevenueDistributed(uint256 indexed videoId, uint256 amount);

    /**
     * @param withdrawer Address of the withdrawer
     * @param amount Amount of ETH withdrawn
     */
    event RevenueWithdrawn(address indexed withdrawer, uint256 amount);


    /**
     * @param platformTokenContractAddress ERC1155 Contract address which keeps track of all the vidoe tokens minted on the platform 
     */
    constructor(address platformTokenContractAddress) {
        platformTokenContract = platformTokenContractAddress;
    }

    /**
     * @param creator Address of the creator
     * @dev Supports a creator by sending ETH
     */
    function supportCreator(address creator) public payable {
        require(creator != address(0), "Invalid creator address");
        require(!isSupporter[msg.sender][creator], "Already a supporter");
        require(msg.value > 0, "Amount must be greater than 0");
        uint256 supportPrice = calculateSupportPrice(creator);
        require(
            msg.value >= supportPrice,
            "Amount must be greater than or equal to support price"
        );
        creatorRevenueShare[creator] += msg.value;
        creators[creator].supporters += 1;
        creators[creator].supportersList.push(msg.sender);
        isSupporter[msg.sender][creator] = true;
        emit SupportedCreator(msg.sender, creator, msg.value);
    }

    /**
     * @param title  title of the video
     * @param description description of the video
     * @param livepeerId livepeer hash of the video
     * @param thumbnailHash IPFS hash of the thumbnail
     * @param videoPrice Price in ETH to access the video
     * @dev Uploads a video
     */
    function uploadVideo(
        string memory title,
        string memory description,
        string memory livepeerId,
        string memory thumbnailHash,
        uint256 videoPrice
    ) public {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(
            bytes(livepeerId).length > 0,
            "Livepeer hash cannot be empty"
        );
        require(
            bytes(thumbnailHash).length > 0,
            "Thumbnail hash cannot be empty"
        );
        require(
            videoPrice >= 0,
            "Video price must be greater than 0 or equal to 0"
        );
        // Increment video count
        videoCount += 1;
        uint256 videoId = videoCount;
        Video memory createdVideo = Video(
            videoId,
            msg.sender,
            title,
            description,
            livepeerId,
            thumbnailHash,
            videoPrice
        );
        videos[videoId] = createdVideo;
        creators[msg.sender].videos.push(createdVideo);
        creators[msg.sender].supportPrice=calculateSupportPrice(msg.sender);
        PeerPlayTokens platformToken=PeerPlayTokens(platformTokenContract);
        // Mint access NFT for the creator, so they have access to their own video.
        platformToken.mintPlatformVideoNFT(msg.sender, videoId);

        emit VideoUploaded(
            msg.sender,
            videoId,
            title,
            description,
            livepeerId,
            thumbnailHash,
            videoPrice
        );
    }

    /**
     * @param videoId ID of the video
     * @dev Mints an access NFT for the video
     */
    function mintAccessNFTForVideo(uint256 videoId) public payable {
        require(videoId > 0 && videoId <= videoCount, "Invalid video ID");
        Video memory video = videos[videoId];
        require(
            msg.value == video.videoPrice,
            "Amount must equal to video price"
        );
        address creator = video.creator;
        require(
            creator != msg.sender,
            "Creator already has access to the video"
        );
        PeerPlayTokens platformToken=PeerPlayTokens(platformTokenContract);
        // Mint access NFT for the supporter
        platformToken.mintPlatformVideoNFT(msg.sender, videoId);
        // Distribute the revenue among the creator and supporters
        distributeRevenue(creator, msg.value, videoId);

        emit AccessNFTMinted(creator, videoId, msg.sender);
    }

    /**
     * @param creator Address of the creator
     * @dev Calculates the support price for a creator
     */
    function calculateSupportPrice(
        address creator
    ) public view returns (uint256) {
        if (creators[creator].supporters < 10) {
            return 0.01 ether;
        } else if (creators[creator].supporters < 100) {
            return 0.1 ether;
        } else if (creators[creator].supporters < 1000) {
            return 1 ether;
        } else if (creators[creator].supporters < 100000) {
            return 10 ether;
        } else {
            return 100 ether;
        }
    }

    /**
     * @param creator Address of the creator
     * @param amount Amount of ETH to distribute
     * @dev Distributes the revenue among the creator and supporters
     */
   function distributeRevenue(
    address creator,
    uint256 amount,
    uint256 videoId
) internal {
    uint256 creatorShare = (amount * 80) / 100;
    uint256 supporterShare = (amount * 19) / 100;
    uint256 platformShare = (amount * 1) / 100;

    creatorRevenueShare[creator] += creatorShare;
    platformRevenueShare += platformShare;

    if (creators[creator].supporters > 0) {
        uint256 sharePerSupporter = supporterShare / creators[creator].supporters;
        for (uint256 i = 0; i < creators[creator].supportersList.length; i++) {
            address supporter = creators[creator].supportersList[i];
            supporterRevenueShare[supporter] += sharePerSupporter;
        }
    } else {
        creatorRevenueShare[creator] += supporterShare;
    }

    emit RevenueDistributed(videoId, amount);
}


    /**
     * @dev Withdraws the revenue share for a supporter
     */
    function withdrawSupporterRevenue() public {
        uint256 share = supporterRevenueShare[msg.sender];
        require(share > 0, "No revenue share to withdraw");

        supporterRevenueShare[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: share}("");
        require(success, "Withdrawal failed");

        emit RevenueWithdrawn(msg.sender, share);
    }

    /**
     * @dev Withdraws the revenue share for a creator
     */
    function withdrawCreatorRevenue() public {
        uint256 share = creatorRevenueShare[msg.sender];
        require(share > 0, "No revenue share to withdraw");

        creatorRevenueShare[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: share}("");
        require(success, "Withdrawal failed");

        emit RevenueWithdrawn(msg.sender, share);
    }

    /**
     * @dev Withdraws the contract balance (Platform revenue)
     */
    function withdraw() public onlyOwner {
        uint256 totalWithdrawal = platformRevenueShare;
        require(
            totalWithdrawal > 0,
            "No revenue share to withdraw"
        );
        platformRevenueShare = 0;
        (bool success, ) = payable(owner()).call{value: totalWithdrawal}(
            ""
        );
        require(success, "Withdrawal failed");

        emit RevenueWithdrawn(owner(), address(this).balance);
    }

    //////////////////////////////////////////////////////////////////
    ///////////////// GETTERS ////////////////////////////////////////
    //////////////////////////////////////////////////////////////////

    /**
     * @param creator Address of the creator
     * @dev Returns the number of supporters for a creator
     */
    function getNumberOfSupporters(
        address creator
    ) public view returns (uint256) {
        return creators[creator].supporters;
    }

    /**
     * @param creator Address of the creator
     * @dev Returns the list of supporters for a creator
     */
    function getSupportersList(
        address creator
    ) public view returns (address[] memory) {
        return creators[creator].supportersList;
    }

    /**
     * @param creator Address of the creator
     * @dev Returns the list of videos for a creator
     */
    function getVideosList(
        address creator
    ) public view returns (Video[] memory) {
        return creators[creator].videos;
    }

    /**
     * @param videoId ID of the video
     * @dev Returns the video details
     */
    function getVideoDetails(
        uint256 videoId
    ) public view returns (Video memory) {
        IERC1155 platformToken=IERC1155(platformTokenContract);
        require(
            platformToken.balanceOf(msg.sender, videoId) == 1,
            "You do not have access to this video"
        );
        return videos[videoId];
    }

    /**
     * @param videoId ID of the video
     * @dev Returns the video price
     */
    function getVideoPrice(uint256 videoId) public view returns (uint256) {
        return videos[videoId].videoPrice;
    }

    /**
     * @param videoId ID of the video
     * @dev Returns the video title
     */
    function getVideoTitle(
        uint256 videoId
    ) public view returns (string memory) {
        return videos[videoId].title;
    }

    /**
     * @dev Returns the total number of videos
     */
    function getVideoCount() public view returns (uint256) {
        return videoCount;
    }

    /**
     * @param videoId ID of the video
     * @dev Returns the creator of the video
     */
    function getVideoCreator(uint256 videoId) public view returns (address) {
        return videos[videoId].creator;
    }

    /**
     * @dev Returns the list of all videos
     */
    function getAllVideos() public view returns (Video[] memory) {
        Video[] memory videosList = new Video[](videoCount);
        for (uint256 i = 1; i <= videoCount; i++) {
            videosList[i - 1] = videos[i];
        }
        return videosList;
    }

    /**
     * @dev Returns the revenue share for a supporter
     */
    function checkSupporterRevenue() public view returns (uint256) {
        return supporterRevenueShare[msg.sender];
    }

    /**
     * @dev Returns the revenue share for a creator
     */
    function checkCreatorRevenue() public view returns (uint256) {
        return creatorRevenueShare[msg.sender];
    }

    /**
     * @dev Returns the list vidoes minted by the user
     */
    function getUserMintedVideos() public view returns(Video[] memory){
        Video[] memory videoList = new Video[](videoCount);
        uint256 counter=0;
        PeerPlayTokens platformToken=PeerPlayTokens(platformTokenContract);
        for(uint i = 1;i<=videoCount;i++){
            if(platformToken.balanceOf(msg.sender, i)>=1){
                videoList[counter]=videos[i];
                counter++;
            }
        }
        return videoList;
    }

    /**
     * @param creator Address of the creator
     * @dev Returns if the user is a supporter of the creator
     */
    function checkIfSupporter(
        address creator
    ) public view returns (bool) {
        return isSupporter[msg.sender][creator];
    }

    function checkIfAccessToVideo(
        uint256 videoId
    ) public view returns(bool){
        PeerPlayTokens platformToken=PeerPlayTokens(platformTokenContract);
         bool hasAccess = platformToken.balanceOf(msg.sender, videoId) == 1;
        return hasAccess;
    }   

}
