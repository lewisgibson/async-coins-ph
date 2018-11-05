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

const SendFunds = async (Address, Amount, Message) => {
    try {
        const MyAccountData = await CoinsPHClient.CryptoAccounts();
        const MyAccounts = MyAccountData["crypto-accounts"];
        const MyPBTCAccount = MyAccounts.find(Acc => Acc.currency === "PBTC");
        return await CoinsPHClient.CreateTransferRequest({
            currency: "PBTC",
            account: MyPBTCAccount.id,
            target_address: Address,
            amount: Amount,
            message: Message
        });
    } catch (Err) {
        console.error(Err);
    }
};

const Core = async() => {
	for(let i = 0; i < 4; i++) {
		console.log(i);
		const Output = await SendFunds("3E6PkwBiRRwLvaicoLTNBNb5BEF7NGiq1U", 10, Date.now().toString());
		if(Output) console.log(Output);
	}
};

Core();