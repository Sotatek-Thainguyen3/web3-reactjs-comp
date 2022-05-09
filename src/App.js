import './App.scss';
import {useWeb3React} from "@web3-react/core";
import {useEffect, useState} from "react";
import {connectors} from "./connectors";
import Web3 from "web3";

import ERC20_ABI from './ERC20_ABI.json'

function App() {
    const {activate, account, connector, chainId, library, deactivate} = useWeb3React();

    let [balance, setBalance] = useState('');
    let [network, setNetwork] = useState('');
    let [balanceOf, setBalanceOf] = useState('');
    let [valueDeposit, setValueDeposit] = useState('');
    let [valueWithdraw, setValueWithdraw] = useState('');
    let [errorMessage, setErrorMessage] = useState('');
    let [isLoading, setStateLoading] = useState(false);

    const addressContract = '0xc778417E063141139Fce010982780140Aa0cD5Ab';

    useEffect(() => {
        const provider = window.localStorage.getItem("provider");
        if (provider) activate(connectors[provider]);
        if (account) {
            getInfoStatic();
        }
    }, [account]);

    /**
     * Connect with connect đã inject browser (vì js của metamask đã được inject vào trong windown)
     * @returns {Promise<void>}
     */
    const connectInjectedConnector = async () => {
        await activate(connectors.injected);
        setProvider('injected');
    }

    /**
     * Connect wallet for mobile
     * @returns {Promise<void>}
     */
    const connectWalletConnectedConnector = async () => {
        await activate(connectors.walletConnect);
        setProvider('walletConnect');
    }

    /**
     * This function only clear data in browser, however it connects with wallet
     */
    const disconnect = async () => {
        window.localStorage.clear();
        deactivate();
    }

    const setProvider = (type) => {
        window.localStorage.setItem("provider", type);
    };

    const getInfoStatic = async () => {
        debugger
        if (account && library && chainId) {
            await getBalance();
            await getBalanceOf();
            setNetwork(library.network.name);
        }
    }

    const getBalance = async () => {
        const web3 = new Web3(library.provider)
        await web3.eth.getBalance(account).then(result => {
            setBalance(web3.utils.fromWei(result, 'ether'));
        })
    }

    const getBalanceOf = async () => {
        const web3 = new Web3(library.provider);
        const wethContract = new web3.eth.Contract(ERC20_ABI, addressContract); //Khởi tạo contract

        await wethContract.methods.balanceOf(account).call().then(result => {
            setBalanceOf(web3.utils.fromWei(result, 'ether'));
        })
    }

    const deposit = async () => {
        if (valueDeposit) {
            const web3 = new Web3(library.provider);
            const wethContract = new web3.eth.Contract(ERC20_ABI, addressContract);

            const valueConvert = web3.utils.toWei(valueDeposit, 'ether');
            const estimateGas = await wethContract.methods.deposit().estimateGas({
                from: account,
                value: valueConvert
            })
            try {
                setStateLoading(true);
                await wethContract.methods.deposit().send({
                    from: account,
                    value: valueConvert,
                    gas: estimateGas
                })

                //refresh
                getInfoStatic();
                resetForm();
            } catch (error) {
                setErrorMessage(error.message);
            }
            setStateLoading(false);
        }
    }

    const withdraw = async () => {
        const web3 = new Web3(library.provider);
        const wethContract = new web3.eth.Contract(ERC20_ABI, addressContract);

        const valueChange = web3.utils.toWei(valueWithdraw);
        const estimateGas = await wethContract.methods.withdraw(valueChange).estimateGas({from: account});
        try {
            setStateLoading(true);
            await wethContract.methods.withdraw(valueChange).send({from: account, gas: estimateGas});
            getInfoStatic();
            resetForm();
        } catch (error) {
            setErrorMessage(error.message);
        }
        setStateLoading(false);
    }

    const resetForm = () => {
        setErrorMessage('');
        setValueDeposit('');
        setValueWithdraw('')
    }

    return (
        <div className="App">
            <h1>React Web3</h1>
            <div className="info-account">
                {account ? <>
                        <h2>Account: {account}</h2>
                        <h2>ETH balance: {balance}</h2>
                        <h2>WETH balance: {balanceOf}</h2>
                        <h2>Network: {network ? network : 'no network'}</h2>
                        <div className="form">
                            <div className="form-deposit">
                                <input type="number" value={valueDeposit}
                                       disabled={isLoading}
                                       onChange={(event) => setValueDeposit(event.target.value)}/> <br/>
                                <button type="button" className="form-button"
                                        onClick={deposit}
                                        disabled={isLoading}>{isLoading ? 'loading...' : 'Deposit ETH'}</button>
                            </div>
                            <div className="form-withdraw">
                                <input type="number" value={valueWithdraw}
                                       disabled={isLoading}
                                       onChange={(event) => setValueWithdraw(event.target.value)}/><br/>
                                <button type="button" className="form-button"
                                        onClick={withdraw}
                                        disabled={isLoading}>{isLoading ? 'loading...' : 'Withdraw ETH'}</button>
                            </div>
                        </div>
                        <small className="show-error-message">{errorMessage}</small>
                    </>
                    : ''}
            </div>
            {
                !account ?
                    <>
                        <div className="button-group">
                            <button type="button" onClick={connectInjectedConnector}>Connect metamask</button>
                            <button type="button" onClick={connectWalletConnectedConnector}>Connect wallet connect
                            </button>
                        </div>
                    </> : <>
                        <button className="disconnect" onClick={disconnect}>Logout / Disconnect</button>
                    </>
            }

        </div>
    );
}

export default App;
