const Crypto = require("crypto");
const QueryString = require("querystring");
const Axios = require("axios");

module.exports = class CoinsPHWrapper {
    constructor({ Key, Secret }) {
        this.Key = Key;
        this.Secret = Secret;
    }

    GetNonce() {
        return Date.now() * 1e250;
    }

    async CreateBuyOrder(Data = {}) {
        return await this.DoRequest({
            Endpoint: "buyorder",
            Method: "POST",
            Data: Data,
            ResponseField: "order",
            Version: "api/v2"
        });
    }

    async MarkBuyOrderPaid(Data = {}) {
        return await this.DoRequest({
            Endpoint: `buyorder/${Data.id}`,
            Method: "PUT",
            Params: {},
            ResponseField: "order"
        });
    }

    async BuyOrder(Params = {}) {
        return await this.DoRequest({
            url:
                "buyorder" +
                (Params.buyorder_id ? "/" + Params.buyorder_id : ""),
            Method: "GET",
            Params: Params,
            ResponseField: "order"
        });
    }

    async CreateSellOrder(Data = {}) {
        return await this.DoRequest({
            Endpoint: "sellorder",
            Method: "POST",
            Data: Data,
            ResponseField: "order",
            Version: "api/v2"
        });
    }

    async ValidateField(Data = {}) {
        return await this.DoRequest({
            Endpoint: "validate-field",
            Method: "POST",
            Params: {},
            Data: Data,
            Version: "api/v3",
            ResponseField: "is_valid"
        });
    }

    async SellOrder(Params = {}) {
        return await this.DoRequest({
            url:
                "sellorder" +
                (Params.sellorder_id ? "/" + Params.sellorder_id : ""),
            Params: Params,
            Data: "order",
            Version: "api/v2"
        });
    }

    async TransactionHistory() {
        return await this.DoRequest({
            Endpoint: "buyorder",
            Params: {},
            Data: "orders",
            Version: "api/v2"
        });
    }

    async PayinOutlets(Params = {}) {
        return await this.DoRequest({
            Endpoint: "payin-outlets",
            Method: "GET",
            Params: Params
        });
    }

    async PayinOutletFees(Params = {}) {
        return await this.DoRequest({
            Endpoint: "payin-outlet-fees",
            Method: "GET",
            Params: Params
        });
    }

    async PayinOutletCategories(Params = {}) {
        return await this.DoRequest({
            Endpoint: "payin-outlet-categories",
            Method: "GET",
            Params: Params
        });
    }

    async CreatePaymentRequest(Data = {}) {
        return await this.DoRequest({
            Endpoint: "payment-requests",
            Method: "POST",
            Data: Data,
            Version: "api/v3",
            ResponseField: "payment-request"
        });
    }

    async PaymentRequests(Params = {}) {
        return await this.DoRequest({
            Endpoint:
                "getpayment-requests" + (Params.id ? "/" + Params.id : ""),
            Params: Params,
            Version: "api/v3",
            ResponseField: "payment-request"
        });
    }

    async CreateTransferRequest(Data = {}) {
        return await this.DoRequest({
            Endpoint: "transfers",
            Method: "POST",
            Data: Data,
            Version: "api/v3",
            ResponseField: "transfer"
        });
    }

    async Transfers(Params = {}) {
        return await this.DoRequest({
            Endpoint: "transfers" + (Params.id ? "/" + Params.id : ""),
            Params: Params,
            Version: "api/v3",
            ResponseField: "transfer"
        });
    }

    async CryptoAccounts(Params = {}) {
        return await this.DoRequest({
            Endpoint: "crypto-accounts",
            Params: Params,
            Version: "api/v3"
        });
    }

    async ConvertFunds(Data = {}) {
        return await this.DoRequest({
            Endpoint: "crypto-exchanges",
            Method: "POST",
            Data: Data,
            Version: "api/v3",
            ResponseField: "crypto-exchanges"
        });
    }

    async CryptoExchanges(Params = {}) {
        return await this.DoRequest({
            Endpoint: "crypto-exchanges" + (Params.id ? "/" + Params.id : ""),
            Params: Params,
            Version: "api/v3",
            ResponseField: "crypto-exchanges"
        });
    }

    async CryptoRoutes() {
        return await this.DoRequest({
            Endpoint: "crypto-routes",
            Version: "api/v3",
            ResponseField: " "
        });
    }

    async CryptoPayments(Params = {}) {
        return await this.DoRequest({
            Endpoint: "crypto-payments" + (Params.id ? "/" + Params.id : ""),
            Params: Params,
            Version: "api/v3",
            ResponseField: "crypto-payments"
        });
    }

    async CreateUser(Data = {}) {
        return await this.DoRequest({
            Endpoint: "buyorder",
            Method: "POST",
            Data: Data,
            ResponseField: "order",
            Version: "api/v2"
        });
    }

    async DoRequest(Options) {
        const {
            Endpoint,
            Method = "get",
            Params = {},
            Data = null,
            ResponseField = URL,
            Version = "d/api"
        } = Options;

        const QueryStr = QueryString.stringify(Params);
        const RequestURL = `https://coins.ph/${Version}/${Endpoint}/${
            QueryStr.length > 0 ? "?" + QueryStr : ""
        }`;
        const Nonce = Date.now() * 1e250;
        const Message = Data
            ? Nonce.toString() + RequestURL + JSON.stringify(Data)
            : Nonce.toString() + RequestURL;
        const Signature = Crypto.createHmac("SHA256", this.Secret)
            .update(Message)
            .digest("hex");

        try {
            const Response = await Axios({
                url: RequestURL,
                method: Method,
                headers: {
                    ACCESS_KEY: this.Key,
                    ACCESS_SIGNATURE: Signature,
                    ACCESS_NONCE: Nonce
                },
                json: true
            });

            return (
                (Response.data && Response.data[ResponseField]) || Response.data
            );
        } catch (Err) {
            if (Err.response.status === 401)
                throw new Error("Invalid Key or Secret.");

            if (Err.response.data && Err.response.data.errors)
                throw new Error(Err.response.data.errors[0]);
        }
    }
};
