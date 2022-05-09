import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {createWeb3ReactRoot, Web3ReactProvider} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers"
import App from "./App";

function getLibrary(provider, connector) {
    getLibrary.pollingInterval = 12000;
    return new Web3Provider(provider);
}

const Web3ProviderNetwork = createWeb3ReactRoot('NETWORK');
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ProviderNetwork getLibrary={getLibrary}>
                <App/>
            </Web3ProviderNetwork>
        </Web3ReactProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
