import './App.css';
import {useWeb3React} from "@web3-react/core";
import {useEffect, useState} from "react";
import {connectors} from "./connectors";

function App() {
    let [count, setCount] = useState(0);

    const {activate, account, connector, chainId} = useWeb3React();
    const connectInjectedConnector = () => {
        setCount(++count);
        activate(connectors.injected);
    }
    // const connectWalletConnectedConnector = () => {
    //    activate(walletConnectConnector);
    // }
    return (
        <div className="App">
            <h1>React Web3 {count}</h1>
            {account ?
                <> <h1>Account: {account}</h1></> :
                <>
                    <button type="button" onClick={connectInjectedConnector}>Connect metamask</button>
                </>
            }
        </div>
    );
}

export default App;
