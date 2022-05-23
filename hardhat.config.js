require("@nomiclabs/hardhat-waffle");

// Substrate predefined key (for testing)
const priv_key = "99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.2",
  networks: {
    frontier: {
      url: `http://localhost:9933`,
      accounts: [priv_key]
    }
  },
};
