require("dotenv-safe").config();

/**
 *  Replace with
 *  require("async-coins-ph")
 *  when not testing locally.
 */
const CoinsPHWrapper = require("../index.js");
const CoinsPHClient = new CoinsPHWrapper({
    Key: process.env.CoinsPHKey,
    Secret: process.env.CoinsPHSecret
});

const GetMyAccounts = async () => {
    try {
        const MyAccountData = await CoinsPHClient.CryptoAccounts();
        const MyAccounts = MyAccountData["crypto-accounts"];
        for (const Account of MyAccounts) console.log(Account);

        const MyBTCAccount = MyAccounts.find(Acc => Acc.currency === "BTC");
        const MyBTCBalance = parseFloat(MyBTCAccount.balance);
        console.log(`BTC Balance: ${MyBTCBalance}`);
    } catch (Err) {
        console.error(Err);
    }
};

GetMyAccounts();
