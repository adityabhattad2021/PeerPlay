export const peerplayAddress = "0xA9443c5d0828FE506CD7E203ad905261F4FA9c0C";
    export const peerplayABI = [{"inputs":[{"internalType":"address","name":"platformTokenContractAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"creator","type":"address"},{"indexed":true,"internalType":"uint256","name":"videoId","type":"uint256"},{"indexed":true,"internalType":"address","name":"supporter","type":"address"}],"name":"AccessNFTMinted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"videoId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"RevenueDistributed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"withdrawer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"RevenueWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"supporter","type":"address"},{"indexed":true,"internalType":"address","name":"creator","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"SupportedCreator","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"creator","type":"address"},{"indexed":true,"internalType":"uint256","name":"videoId","type":"uint256"},{"indexed":false,"internalType":"string","name":"title","type":"string"},{"indexed":false,"internalType":"string","name":"description","type":"string"},{"indexed":false,"internalType":"string","name":"livepeerId","type":"string"},{"indexed":false,"internalType":"string","name":"thumbnailHash","type":"string"},{"indexed":false,"internalType":"uint256","name":"videoPrice","type":"uint256"}],"name":"VideoUploaded","type":"event"},{"inputs":[{"internalType":"address","name":"creator","type":"address"}],"name":"calculateSupportPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"checkCreatorRevenue","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"videoId","type":"uint256"}],"name":"checkIfAccessToVideo","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"creator","type":"address"}],"name":"checkIfSupporter","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"checkSupporterRevenue","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllVideos","outputs":[{"components":[{"internalType":"uint256","name":"videoId","type":"uint256"},{"internalType":"address","name":"creator","type":"address"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"livepeerId","type":"string"},{"internalType":"string","name":"thumbnailHash","type":"string"},{"internalType":"uint256","name":"videoPrice","type":"uint256"}],"internalType":"struct PeerPlay.Video[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"creator","type":"address"}],"name":"getNumberOfSupporters","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"creator","type":"address"}],"name":"getSupportersList","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUserMintedVideos","outputs":[{"components":[{"internalType":"uint256","name":"videoId","type":"uint256"},{"internalType":"address","name":"creator","type":"address"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"livepeerId","type":"string"},{"internalType":"string","name":"thumbnailHash","type":"string"},{"internalType":"uint256","name":"videoPrice","type":"uint256"}],"internalType":"struct PeerPlay.Video[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getVideoCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"videoId","type":"uint256"}],"name":"getVideoCreator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"videoId","type":"uint256"}],"name":"getVideoDetails","outputs":[{"components":[{"internalType":"uint256","name":"videoId","type":"uint256"},{"internalType":"address","name":"creator","type":"address"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"livepeerId","type":"string"},{"internalType":"string","name":"thumbnailHash","type":"string"},{"internalType":"uint256","name":"videoPrice","type":"uint256"}],"internalType":"struct PeerPlay.Video","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"videoId","type":"uint256"}],"name":"getVideoPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"videoId","type":"uint256"}],"name":"getVideoTitle","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"creator","type":"address"}],"name":"getVideosList","outputs":[{"components":[{"internalType":"uint256","name":"videoId","type":"uint256"},{"internalType":"address","name":"creator","type":"address"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"livepeerId","type":"string"},{"internalType":"string","name":"thumbnailHash","type":"string"},{"internalType":"uint256","name":"videoPrice","type":"uint256"}],"internalType":"struct PeerPlay.Video[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"videoId","type":"uint256"}],"name":"mintAccessNFTForVideo","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"creator","type":"address"}],"name":"supportCreator","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"livepeerId","type":"string"},{"internalType":"string","name":"thumbnailHash","type":"string"},{"internalType":"uint256","name":"videoPrice","type":"uint256"}],"name":"uploadVideo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawCreatorRevenue","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawSupporterRevenue","outputs":[],"stateMutability":"nonpayable","type":"function"}]