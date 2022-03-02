//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract PlutoToken is ERC20Capped {
    uint256 private immutable _maxMint;
    uint256 private immutable _minMintInterval;

    // The last time each address has mint tokens
    mapping(address => uint256) private _lastMints;
    // The mite amounts of each address
    mapping(address => uint256) private _mintAmounts;

    /**
     * @param cap_ The max amount of tokens that can be issued
     * @param maxMint_ The maximum amount ot tokens that can be mint by an account
     * @param minMintInterval_ The miminimum seconds that an account have to wait before it can mint again
     */
    constructor(
        uint256 cap_,
        uint256 maxMint_,
        uint256 minMintInterval_
    ) ERC20Capped(cap_) ERC20("PlutoToken", "PLT") {
        require(maxMint_ > 0, "PlutoToken: maxMint is 0");
        require(maxMint_ <= cap_, "PlutoToken: maxMint exceed cap");
        require(minMintInterval_ > 0, "PlutoToken: minMintInterval is 0");

        _maxMint = maxMint_;
        _minMintInterval = minMintInterval_;
    }

    /**
     * @dev Returns the max amount that an address can mint
     */
    function maxMint() public view virtual returns (uint256) {
        return _maxMint;
    }

    /**
     * @dev Returns the minimum interval in seconds that have to pass before an address can mint again
     */
    function minMintInterval() public view virtual returns (uint256) {
        return _minMintInterval;
    }

    /**
     * @dev Returns the self balance.
     */
    function balance() public view virtual returns (uint256) {
        return balanceOf(_msgSender());
    }

    /**
     * @dev Creates `amount` new tokens for `to`.
     *
     * See {ERC20-_mint}.
     *
     * Limits:
     * - the amount can not exceed `maxMint` amount per address
     * - the caller can not mint more than once every `minMintInterval` seconds
     * - no tokens can be mint after reaching the `cap`
     */
    function mint(uint256 amount) public virtual {
        require(
            _mintAmounts[_msgSender()] + amount <= maxMint(),
            "PlutoToken: amount exceed the maximum allowed amount"
        );
        require(
            block.timestamp > _lastMints[_msgSender()] + minMintInterval(),
            "PlutoToken: you need to wait before you can mint again"
        );

        _mint(_msgSender(), amount);

        // if mit succeede save the block timestamp as the last time the user
        // called mint
        _lastMints[_msgSender()] = block.timestamp;
        // and the amount that the user has mint
        _mintAmounts[_msgSender()] += amount;
    }
}
