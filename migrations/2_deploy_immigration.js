const Migrations = artifacts.require("Immigration");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
