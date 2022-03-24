const Marketplace = artifacts.require("MarketContract");

module.exports = function(deployer) {
  deployer.deploy(Marketplace);
};
