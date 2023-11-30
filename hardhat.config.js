require("@nomiclabs/hardhat-waffle");

require("dotenv").config();

module.exports={
    solidity:"0.8.19",
    networks:{
        sepolia:{
            url:process.env.Api_key,
            accounts:[process.env.Secret_key],
           
        }
    }
    
  
}