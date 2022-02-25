//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
  
import "@openzeppelin/contracts/access/Ownable.sol";

contract Donations is Ownable {
  event Donate(address from, uint value);
  struct Donater {
    uint amount;
    bool donated;
  }

  address[] public uniqueAddresses;
  mapping(address => Donater) public donaters;

  function donate() external payable {
    if(!donaters[msg.sender].donated) {
      donaters[msg.sender].amount += msg.value;
      donaters[msg.sender].donated = true;
      uniqueAddresses.push(msg.sender);
    } else {
      donaters[msg.sender].amount += msg.value;
    }
    emit Donate(msg.sender, msg.value);
  }

  function withdraw(address payable _to) external onlyOwner {
    _to.transfer(address(this).balance);
  }

  function getDonaters() external view returns(address[] memory) {
    return uniqueAddresses;
  }

  function getDonaterAmount(address _addr) external view returns(uint) {
    return donaters[_addr].amount;
  }
}
