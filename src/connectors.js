import {InjectedConnector} from "@web3-react/injected-connector";
import {WalletConnectConnector} from "@web3-react/walletconnect-connector";

const INFURA_KEY = '5194fde9bf364940a1bbaffd59534e78';
const NETWORK_URL = {
    1: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    4: `https://rinkeby.infura.io/v3/${INFURA_KEY}`
}
const BRIDGE_URL = `https://bridge.walletconnect.org`;

const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42]
})

const walletConnect = new WalletConnectConnector({
    supportedChainIds: [1, 3, 4, 5, 42],
    rpc: NETWORK_URL, //là provider
    bridge: BRIDGE_URL,
    qrcode: true
})

export const connectors = {
    injected: injected,
    walletConnect: walletConnect
}