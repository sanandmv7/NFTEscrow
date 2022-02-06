//SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract NFTEscrow {
    event NFTDeposited(address _seller, address _receiver, uint256 _price);
    event TransferComplete(address _seller, address _receiver, uint256 _price);
    
    uint256 tokenId;
    uint256 price;

    uint256 tokenCount;
    struct NFT {
        address seller;
        address receiver;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool isValid;
    }

    mapping (address=>NFT) receiverToNFT;


    function depositERC721(address _nftContract, uint256 _tokenId, address _receiver, uint256 _price) public {
        require(!receiverToNFT[_receiver].isValid, "Receiver holds another NFT in escrow");
        require(msg.sender == ERC721(_nftContract).ownerOf(_tokenId), "Owner is different");

        receiverToNFT[_receiver] = NFT(msg.sender, _receiver, _nftContract, _tokenId, _price, true);
        ERC721(_nftContract).safeTransferFrom(msg.sender, address(this), _tokenId);

        emit NFTDeposited(msg.sender, _receiver, _price);
    }

    function receiveERC721() external payable{
        require(receiverToNFT[msg.sender].isValid, "Receiver does not have any NFT in escrow");
        NFT memory nft = receiverToNFT[msg.sender];
        require(msg.sender == nft.receiver, "Receiver address is different");
        require(msg.value == nft.price, "Price is different");
        ERC721(nft.nftContract).safeTransferFrom(address(this), nft.receiver, nft.tokenId);
        payable(nft.seller).transfer(msg.value);

        receiverToNFT[msg.sender].isValid = false;

        emit TransferComplete(nft.seller, msg.sender, msg.value);
    }

    function deposit1155(address _nftContract, uint256 _tokenId, address _receiver, uint256 _price) public {
        require(!receiverToNFT[_receiver].isValid, "Receiver holds another NFT in escrow");
        // require(msg.sender == ERC1155(_nftContract).ownerOf(_tokenId), "Owner is different");

        receiverToNFT[_receiver] = NFT(msg.sender, _receiver, _nftContract, _tokenId, _price, true);
        ERC1155(_nftContract).safeTransferFrom(msg.sender, address(this), _tokenId, 1, "");

        emit NFTDeposited(msg.sender, _receiver, _price);
    }

    function receiveERC1155() external payable{
        require(receiverToNFT[msg.sender].isValid, "Receiver does not have any NFT in escrow");
        NFT memory nft = receiverToNFT[msg.sender];
        require(msg.sender == nft.receiver, "Receiver address is different");
        require(msg.value == nft.price, "Price is different");
        ERC1155(nft.nftContract).safeTransferFrom(address(this), nft.receiver, nft.tokenId, 1, "");
        payable(nft.seller).transfer(msg.value);

        receiverToNFT[msg.sender].isValid = false;

        emit TransferComplete(nft.seller, msg.sender, msg.value);
    }
}