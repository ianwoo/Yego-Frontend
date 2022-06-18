import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Web3Provider } from "@ethersproject/providers";
import { Modal, ModalProps, Mode, Network } from "../WaterfallDefi";
import "./Header.scss";
import { Dark } from "./svgs/dark";
import { Light } from "./svgs/light";
import useAuth, { useEagerConnect } from "./hooks/useAuth";
import ConnectWalletModal from "./subcomponents/ConnectWalletModal";
//this is for mobile, do later
// import { Burger } from "./svgs/burger";

const formatAccountAddress = (address?: string | null) => {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
};

type Props = {
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  network: Network;
  setNetwork: React.Dispatch<React.SetStateAction<Network>>;
  modal: ModalProps;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
};

function Header(props: Props) {
  const { mode, setMode, network, setNetwork, modal, setModal } = props;

  const { active, account, chainId } = useWeb3React<Web3Provider>();

  const { login, logout } = useAuth(network);

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const location = useLocation();

  const switchNetwork = async (newNetwork: Network) => {
    if (account) {
      const provider = window.ethereum;
      if (provider?.request) {
        try {
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [
              {
                chainId: `0x${newNetwork.toString(16)}`,
              },
            ],
          });
          setNetwork(newNetwork);
        } catch (error) {
          console.error("Failed to setup the network in Metamask:", error);
        }
      }
    } else {
      setNetwork(newNetwork);
    }
  };

  useEffect(() => {
    if (window.location.toString().includes("bnb.waterfalldefi.org")) {
      setNetwork(Network.BNB);
    } else if (window.location.toString().includes("avax.waterfalldefi.org")) {
      setNetwork(Network.AVAX);
    }
  }, [setNetwork]);

  useEffect(() => {
    setNetwork(chainId === Network.AVAX ? Network.AVAX : Network.BNB);
  }, [chainId, setNetwork]);

  useEagerConnect(network);

  return (
    <div className={"header-wrapper " + mode}>
      <div
        className={"mask" + (modal.state !== Modal.None ? " visible" : "")}
        onClick={() => setModal({ state: Modal.None })}
      />
      {modal.state === Modal.ConnectWallet ? (
        <ConnectWalletModal network={network} />
      ) : null}
      <div className="pc-left">
        <div className="waterfalldefi" />
        <div className="menu-block-wrapper">
          <Link
            className="link"
            to={"/"}
            data-selected={location.pathname === "/"}
          >
            Dashboard
          </Link>
        </div>
        <div className="menu-block-wrapper">
          <Link
            className="link"
            to={"/markets"}
            data-selected={location.pathname === "/markets"}
          >
            Markets
          </Link>
        </div>
        <div className="menu-block-wrapper">
          <Link
            className="link"
            to={"/portfolio"}
            data-selected={location.pathname === "/portfolio"}
          >
            My Portfolio
          </Link>
        </div>
        <div className="menu-block-wrapper">
          <Link
            className="link"
            to={"/stake"}
            data-selected={location.pathname === "/stake"}
          >
            Stake
          </Link>
        </div>
        <div className="menu-block-wrapper">
          <a href="https://waterfall-defi.gitbook.io/waterfall-defi/resources/mainnet-user-guide">
            User Guide
          </a>
        </div>
      </div>
      <div className="mobile-left"></div>
      <div className="right">
        <div className="wallet-wrapper">
          <div
            className={"dropdown" + (dropdownOpen ? " open" : "")}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <div
              className={
                "network" + (network === Network.AVAX ? " avax" : " bnb")
              }
            >
              <div className="dropdown-triangle">▼</div>
              {network === Network.AVAX ? "AVAX" : "BNB"}
            </div>
            {dropdownOpen ? (
              network === Network.AVAX ? (
                <div
                  className="network bnb option"
                  onClick={() => switchNetwork(Network.BNB)}
                >
                  BNB
                </div>
              ) : (
                <div
                  className="network avax option"
                  onClick={() => switchNetwork(Network.AVAX)}
                >
                  AVAX
                </div>
              )
            ) : null}
          </div>
          {!active ? (
            <button
              className="connect-wallet-btn"
              onClick={() => {
                setModal({ state: Modal.ConnectWallet });
              }}
            >
              Connect Wallet
            </button>
          ) : (
            <div className="connect-wallet-btn">
              <div>{formatAccountAddress(account)}</div>
            </div>
          )}
        </div>
        {mode === Mode.Light ? (
          <div className="dark-icon" onClick={() => setMode(Mode.Dark)}>
            <Dark />
          </div>
        ) : null}
        {mode === Mode.Dark ? (
          <div className="light-icon" onClick={() => setMode(Mode.Light)}>
            <Light />
          </div>
        ) : null}
      </div>
      {/* todo: mobile drawers */}
      {/* <header>
              <Burger />
              <img src="url(/waterfalldefi.png)" />
            </header> */}
      {/* todo: Connect Wallet Modal component in /subcomponents */}
      {/* <ConnectWalletModal/> */}
    </div>
  );
}

export default Header;
