import axios from "axios";
export async function getBalanceByAddress(chainAddress) {
    const resp = await axios.get("https://api.goby.app/v1/balance", { params: { address: chainAddress } });
    return resp.data.amount;
}
