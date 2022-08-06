import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as aptos from "aptos";
import * as bip39 from "@scure/bip39";
import * as english from "@scure/bip39/wordlists/english";
import { sign } from "tweetnacl";
import * as passworder from "@metamask/browser-passworder";
import { UIContext } from "./UIContext";
import isEqual from "lodash/isEqual";
import { PLATFORM, NODE_URL, FAUCET_URL } from "../utils/constants";
import { setMem, getMem, removeMem, setStore, getStore, clearStore } from "../utils/store";
import * as token from "../utils/token";
import * as bcsPayload from "../utils/payload";

export const AccountContext = React.createContext();

export const AccountProvider = ({ children }) => {
  const [alertSignal, setAlertSignal] = useState(0);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accountImported, setAccountImported] = useState(false);
  const [mnemonic, setMnemonic] = useState("");
  const [newMnemonic, setNewMnemonic] = useState("");
  const [privateKey, setPrivateKey] = useState([]); // Uint8Array
  const [currentAddress, setCurrentAddress] = useState(""); // AuthKey in HexString
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [collectionUri, setCollectionUri] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftUri, setNftUri] = useState("");
  const [nftSupply, setNftSupply] = useState(""); // number ?
  const [account, setAccount] = useState([]); // AptosAccount
  const [balance, setBalance] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [receivedEvents, setReceivedEvents] = useState([]);
  const [accountTokens, setAccountTokens] = useState([]);
  const [nftDetails, setNftDetails] = useState([]);
  const [amount, setAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isValidTransaction, setIsValidTransaction] = useState(false);
  const [estimatedTxnResult, setEstimatedTxnResult] = useState([]);
  const [currentAsset] = useState(token.AptosCoin);
  const [maxGasAmount] = useState("1000");
  const {
    handleLoginUI,
    setOpenLoginDialog,
    setMnemonicRequired,
    setPrivateKeyRequired,
    setOpenLogoutDialog,
    setOpenSendDialog,
    setAccountRoutesEnabled,
  } = useContext(UIContext);

  const navigate = useNavigate();

  const client = new aptos.AptosClient(NODE_URL);
  const tokenClient = new aptos.TokenClient(client);
  const faucetClient = new aptos.FaucetClient(NODE_URL, FAUCET_URL, null);

  useEffect(() => {
    if (PLATFORM === "chrome-extension:") {
      chrome.runtime.connect({ name: "spika" });
    }
    walletState();
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      if (PLATFORM === "chrome-extension:") {
        chrome.runtime.sendMessage({
          id: "service_worker",
          task: "listen",
        });
      }
      handleLogin();
    }
  }, [isUnlocked === true]);

  const walletState = async () => {
    const data = await getMem(PLATFORM, "PWD");
    if (data === undefined || data === null) {
      checkIfLoginRequired();
    } else {
      setPassword(data);
      setIsUnlocked(true);
    }
  };

  const checkIfLoginRequired = async () => {
    try {
      const data = await getStore(PLATFORM, "ACCOUNT_IMPORTED");
      if (data) {
        handleLoginUI();
      } else {
        navigate("/");
      }
    } catch (error) {
      setAccountImported(false);
      setAccountRoutesEnabled(true);
      console.log(error);
    }
  };

  const handleLogin = async () => {
    try {
      setOpenLoginDialog(false);
      setIsLoading(true);
      setAccountRoutesEnabled(false);
      await loadAccount();
      setIsLoading(false);
      setPassword("");
      if (PLATFORM === "chrome-extension:") {
        chrome.runtime.sendMessage({
          id: "service_worker",
          task: "listen",
        });
      }
    } catch (error) {
      setOpenLoginDialog(false);
      throwAlert(62, "Failed load account", `${error}`);
      setPassword("");
      console.log("Error occured during loading account");
      setAccountRoutesEnabled(true);
    }
  };

  const handleLogout = () => {
    if (PLATFORM === "chrome-extension:") {
      chrome.runtime.sendMessage({
        id: "service_worker",
        task: "idle",
      });
    }
    navigate("/");
    setPrivateKey("");
    setCurrentAddress("");
    setAccount([]);
    clearPasswords();
    removeMem(PLATFORM, "PWD");
    setAccountImported(false);
    clearStore(PLATFORM);
    setOpenLogoutDialog(false);
    setAccountRoutesEnabled(true);
  };

  const handleLock = () => {
    if (PLATFORM === "chrome-extension:") {
      chrome.runtime.sendMessage({
        id: "service_worker",
        task: "idle",
      });
    }
    setPrivateKey("");
    setCurrentAddress("");
    setAccount([]);
    clearPasswords();
    removeMem(PLATFORM, "PWD");
    setAccountImported(false);
    handleLoginUI();
  };

  const clearPasswords = () => {
    setPassword("");
    setConfirmPassword("");
  };

  const throwAlert = (signal, title, message) => {
    setAlertSignal(signal);
    setAlertTitle(title);
    setAlertMessage(message);
  };

  const handleCreate = async () => {
    if (password === confirmPassword && password.length > 5) {
      setIsLoading(true);
      await createAccount();
      clearPasswords();
      setIsLoading(false);
    } else if (password === "") {
      throwAlert(52, "Incorrect password", "Password field cannot be empty");
      clearPasswords();
    } else if (password !== confirmPassword) {
      throwAlert(53, "Incorrect password", "Passwords do not match");
      clearPasswords();
    } else if ([password.length > 5]) {
      throwAlert(54, "Incorrect password", "Password must be at least 6 characters long");
      clearPasswords();
    }
  };

  const handleImport = async () => {
    if (password === confirmPassword && password.length > 5) {
      setIsLoading(true);
      await importAccount();
      clearPasswords();
      setIsLoading(false);
    } else if (password === "") {
      throwAlert(52, "Incorrect password", "Password field cannot be empty");
      clearPasswords();
    } else if (password !== confirmPassword) {
      throwAlert(53, "Incorrect password", "Passwords do not match");
      clearPasswords();
    } else if ([password.length > 5]) {
      throwAlert(54, "Incorrect password", "Password must be at least 6 characters long");
      clearPasswords();
    }
  };

  const handleGenerate = () => {
    generateMnemonic();
  };

  const generateMnemonic = () => {
    const mn = bip39.generateMnemonic(english.wordlist);
    setNewMnemonic(mn);
  };

  const handleRevealMnemonic = async () => {
    try {
      const encryptedMnemonic = await getStore(PLATFORM, "DATA0");
      let decryptedMnemonic = await passworder.decrypt(password, encryptedMnemonic);
      throwAlert(91, "Secret Recovery Phrase", decryptedMnemonic);
      setPassword("");
      setMnemonicRequired(false);
      setOpenLoginDialog(false);
    } catch (error) {
      throwAlert(92, "Error", "Incorrect password");
      setPassword("");
      setMnemonicRequired(false);
      setOpenLoginDialog(false);
    }
  };

  const handleRevealPrivateKey = async () => {
    try {
      const encryptedPrivateKey = await getStore(PLATFORM, "DATA1");
      let decryptedPrivateKey = await passworder.decrypt(password, encryptedPrivateKey);
      throwAlert(81, "Private Key", `0x${decryptedPrivateKey}`);
      setPassword("");
      setPrivateKeyRequired(false);
      setOpenLoginDialog(false);
    } catch (error) {
      throwAlert(92, "Error", "Incorrect password");
      setPassword("");
      setPrivateKeyRequired(false);
      setOpenLoginDialog(false);
    }
  };

  const createAccount = async () => {
    try {
      const accountSeed = bip39.mnemonicToSeedSync(newMnemonic);
      const seed = new Uint8Array(accountSeed).slice(0, 32);
      const keypair = sign.keyPair.fromSeed(seed);
      const secretKey = keypair.secretKey;
      const secretKeyHex64 = Buffer.from(keypair.secretKey).toString("hex").slice(0, 64);
      const address = keypair.publicKey.Hex;
      const account = new aptos.AptosAccount(secretKey, address);
      await faucetClient.fundAccount(account.address(), 0); // Workaround during devnet
      let resources = await client.getAccountResources(account.address());
      let accountResource = resources.find((r) => isEqual(r.type, currentAsset[1]));
      let encryptedMnemonic = await passworder.encrypt(password, newMnemonic);
      let encryptedPrivateKey = await passworder.encrypt(password, secretKeyHex64);
      if (PLATFORM === "chrome-extension:") {
        chrome.runtime.sendMessage({
          id: "service_worker",
          task: "listen",
        });
      }
      setStore(PLATFORM, "ACCOUNT_IMPORTED", true);
      setStore(PLATFORM, "DATA0", encryptedMnemonic);
      setStore(PLATFORM, "DATA1", encryptedPrivateKey);
      setMem(PLATFORM, "PWD", password);
      setAccountImported(true);
      setPrivateKey(secretKey);
      setAccount(account);
      setCurrentAddress(account.address().toString());
      setBalance(accountResource.data.coin.value);
      setNewMnemonic("");
      setMnemonic("");
      throwAlert(1, "New Account Created", `Address:\n${account.address().toString()}`);
    } catch (error) {
      throwAlert(2, "Failed create account", `${error}`);
      console.log(error);
    }
  };

  const importAccount = async () => {
    try {
      const accountSeed = bip39.mnemonicToSeedSync(mnemonic);
      const seed = new Uint8Array(accountSeed).slice(0, 32);
      const keypair = sign.keyPair.fromSeed(seed);
      const secretKey = keypair.secretKey;
      const secretKeyHex64 = Buffer.from(keypair.secretKey).toString("hex").slice(0, 64);
      const address = keypair.publicKey.Hex;
      const account = new aptos.AptosAccount(secretKey, address);
      await faucetClient.fundAccount(account.address(), 0); // Workaround during devnet
      let resources = await client.getAccountResources(account.address());
      let accountResource = resources.find((r) => isEqual(r.type, currentAsset[1]));
      let encryptedMnemonic = await passworder.encrypt(password, mnemonic);
      let encryptedPrivateKey = await passworder.encrypt(password, secretKeyHex64);
      if (PLATFORM === "chrome-extension:") {
        chrome.runtime.sendMessage({
          id: "service_worker",
          task: "listen",
        });
      }
      setStore(PLATFORM, "ACCOUNT_IMPORTED", true);
      setStore(PLATFORM, "DATA0", encryptedMnemonic);
      setStore(PLATFORM, "DATA1", encryptedPrivateKey);
      setMem(PLATFORM, "PWD", password);
      setAccountImported(true);
      setPrivateKey(secretKey);
      setAccount(account);
      setCurrentAddress(account.address().toString());
      setBalance(accountResource.data.coin.value);
      setMnemonic("");
      throwAlert(11, "Account Imported", `Address:\n${account.address().toString()}`);
    } catch (error) {
      throwAlert(12, "Failed import account", `${error}`);
      console.log(error);
    }
  };

  const loadAccount = async () => {
    try {
      const encryptedMnemonic = await getStore(PLATFORM, "DATA0");
      const decryptedMnemonic = await passworder.decrypt(password, encryptedMnemonic);
      try {
        const accountSeed = bip39.mnemonicToSeedSync(decryptedMnemonic);
        const seed = new Uint8Array(accountSeed).slice(0, 32);
        const keypair = sign.keyPair.fromSeed(seed);
        const secretKey = keypair.secretKey;
        const address = keypair.publicKey.Hex;
        const account = new aptos.AptosAccount(secretKey, address);
        if (!isUnlocked) {
          await faucetClient.fundAccount(account.address(), 0); // Workaround during devnet
        }
        let resources = await client.getAccountResources(account.address());
        let accountResource = resources.find((r) => isEqual(r.type, currentAsset[1]));
        setMem(PLATFORM, "PWD", password);
        setAccountImported(true);
        setPrivateKey(secretKey);
        setAccount(account);
        setCurrentAddress(account.address().toString());
        setBalance(accountResource.data.coin.value);
      } catch (error) {
        console.log(error);
        throwAlert(42, "Failed load account", `${error}`);
      }
    } catch (error) {
      console.log(error);
      throwAlert(55, "Error", "Incorrect password");
      setPassword("");
      setOpenLoginDialog(true);
    }
  };

  const submitTransactionHelper = async (account, payload) => {
    const [{ sequence_number: sequenceNumber }, chainId] = await Promise.all([
      client.getAccount(account.address()),
      client.getChainId(),
    ]);

    const rawTxn = new aptos.TxnBuilderTypes.RawTransaction(
      aptos.TxnBuilderTypes.AccountAddress.fromHex(account.address()),
      BigInt(sequenceNumber),
      payload,
      BigInt(parseInt(maxGasAmount)),
      1n,
      BigInt(Math.floor(Date.now() / 1000) + 20),
      new aptos.TxnBuilderTypes.ChainId(chainId)
    );

    const bcsTxn = aptos.AptosClient.generateBCSTransaction(account, rawTxn);
    const transactionRes = await client.submitSignedBCSTransaction(bcsTxn);

    return transactionRes.hash;
  };

  const handleMint = async () => {
    setIsLoading(true);
    await mintCoins();
    setIsLoading(false);
    setAmount("");
  };

  const handleEstimate = async () => {
    setIsLoading(true);
    setOpenSendDialog(false);
    await estimateTransaction();
    setIsLoading(false);
  };

  const handleSend = async () => {
    setIsLoading(true);
    await sendTransaction();
    setIsLoading(false);
    setIsValidTransaction(false);
    setEstimatedTxnResult([]);
    setRecipientAddress("");
    setAmount("");
  };

  const handleCreateCollection = async () => {
    setIsLoading(true);
    await createCollection();
    setIsLoading(false);
    setCollectionName("");
    setCollectionDescription("");
    setCollectionUri("");
  };

  const handleCreateNft = async () => {
    setIsLoading(true);
    await createNft();
    setIsLoading(false);
    setCollectionName("");
    setNftName("");
    setNftDescription("");
    setNftUri("");
    setNftSupply("");
  };

  const mintCoins = async () => {
    try {
      const account = new aptos.AptosAccount(privateKey, currentAddress);
      await faucetClient.fundAccount(account.address(), amount);
      throwAlert(21, "Success", `Received ${amount} Aptos Coin`);
    } catch (error) {
      throwAlert(22, "Transaction failed", `${error}`);
      setIsLoading(false);
      console.log(error);
    }
  };

  const payload = {
    type: "script_function_payload",
    function: {
      module: {
        address: currentAsset[1].address,
        name: currentAsset[1].module,
      },
      name: "transfer",
    },
    type_arguments: currentAsset[1].generic_type_params,
    arguments: [currentAddress, amount],
  };

  const estimateTransaction = async () => {
    try {
      const txnRequest = await client.generateTransaction(currentAddress, payload, {
        max_gas_amount: maxGasAmount,
      });
      const estimatedTxn = await client.simulateTransaction(account, txnRequest);
      if (estimatedTxn[0].success === true) {
        // logic if Move says wagmi
        setIsValidTransaction(true);
        setEstimatedTxnResult(estimatedTxn[0]);
        throwAlert(30, "Transaction estimated as valid", `${estimatedTxn[0].vm_status}`);
      }
      if (estimatedTxn[0].success === false) {
        // logic if txn aborted by Move
        setEstimatedTxnResult(estimatedTxn[0]);
        throwAlert(33, "Transaction estimated as invalid", `${estimatedTxn[0].vm_status}`);
        setRecipientAddress("");
        setAmount("");
      }
    } catch (error) {
      // logic if txn body doesn't looks good to be submitted to VM
      throwAlert(34, "Failed to estimate transaction", `${error}`);
      setRecipientAddress("");
      setAmount("");
      console.log(error);
    }
  };

  const sendTransaction = async () => {
    try {
      const txnRequest = await client.generateTransaction(currentAddress, payload, {
        max_gas_amount: maxGasAmount,
      });
      const signedTxn = await client.signTransaction(account, txnRequest);
      const transactionRes = await client.submitTransaction(signedTxn);
      await client.waitForTransaction(transactionRes.hash);
      throwAlert(31, "Transaction sent", `${transactionRes.hash}`);
    } catch (error) {
      throwAlert(32, "Transaction failed", `${error}`);
      console.log(error);
      setIsLoading(false);
      console.log(error);
    }
  };

  const createCollection = async () => {
    try {
      const collection = await bcsPayload.collection(
        collectionName,
        collectionDescription,
        collectionUri,
        1
      );
      await submitTransactionHelper(account, collection);

      throwAlert(61, "Transaction sent", `${collection}`);
    } catch (error) {
      throwAlert(62, "Transaction failed", `${error}`);
      setIsLoading(false);
      console.log(error);
    }
  };

  const createNft = async () => {
    try {
      const nft = await bcsPayload.nft(
        currentAddress,
        collectionName,
        nftName,
        nftDescription,
        nftSupply,
        nftUri,
        1
      );

      await submitTransactionHelper(account, nft);
      throwAlert(71, "Transaction sent", `${nft}`);
    } catch (error) {
      throwAlert(72, "Transaction failed", `${error}`);
      setIsLoading(false);
      console.log(error);
    }
  };

  const getBalance = async () => {
    let resources = await client.getAccountResources(account.address());
    let accountResource = resources.find((r) => isEqual(r.type, currentAsset[1]));
    setBalance(accountResource.data.coin.value);
  };

  const getSentTransactions = async () => {
    let currentAccount = await client.getAccount(currentAddress);
    let sn = parseInt(currentAccount.sequence_number);
    if (sn <= 25) {
      let data = await client.getAccountTransactions(currentAddress);
      let res = data.reverse((r) => r.type === "version");
      setTransactions(res);
    } else {
      let data = await client.getAccountTransactions(currentAddress, {
        start: sn - 25,
        limit: 25,
      });
      let res = data.reverse((r) => r.type === "version");
      setTransactions(res);
    }
  };

  const getReceivedEvents = async () => {
    let resources = await client.getAccountResources(currentAddress);
    let accountResource = resources.find((r) => isEqual(r.type, currentAsset[1]));

    let counter = parseInt(accountResource.data.deposit_events.counter);

    if (counter <= 25) {
      let data = await client.getEventsByEventHandle(
        currentAddress,
        currentAsset[1],
        "deposit_events"
      );
      let res = data.reverse((r) => r.type === "sequence_number");
      setReceivedEvents(res);
    } else {
      let data = await client.getEventsByEventHandle(
        currentAddress,
        currentAsset[1],
        "deposit_events",
        {
          start: counter - 25,
        }
      );
      let res = data.reverse((r) => r.type === "sequence_number");
      setReceivedEvents(res);
    }
  };

  const getAccountTokens = async () => {
    try {
      // Get total number of Token deposit_events received by an account
      let resources = await client.getAccountResources(currentAddress);
      let tokenStore = resources.find((r) => isEqual(r.type, token.tokenStore));

      const getTokens = async () => {
        if (tokenStore === undefined) {
          // console.log("Account doesn't hold any NFT yet");
          return setAccountTokens(0);
        } else {
          let counter = parseInt(tokenStore.data.deposit_events.counter);
          // Get Token deposit_events
          let data = await client.getEventsByEventHandle(
            currentAddress,
            tokenStore.type,
            "deposit_events",
            {
              limit: counter,
            }
          );

          // Get TokenId for accountDepositedTokens and remove dublicates
          let tokenIds = [...new Set(data.map((i) => i.data.id))];

          // Returns an array of tokenId and value
          const accountTokensBalances = await Promise.all(
            tokenIds.map(async (i) => {
              let data = await tokenClient.getTokenBalanceForAccount(currentAddress, i);
              return data;
            })
          );

          // Returns an array of tokenId and value for all tokens with > 0 balance
          let result = accountTokensBalances.filter((r) => {
            return r.amount !== "0";
          });

          if (result == undefined) {
            setAccountTokens(0);
          } else {
            setAccountTokens(result);
          }
        }
      };
      getTokens();
    } catch (error) {
      console.log(error);
    }
  };

  const getNftDetails = async () => {
    try {
      if (accountTokens === 0) {
        // console.log("Account doesn't hold any NFT yet");
        return setNftDetails(0);
      } else {
        let data = await Promise.all(
          accountTokens.map(
            async (i) =>
              await tokenClient.getTokenData(
                i.id.token_data_id.creator,
                i.id.token_data_id.collection,
                i.id.token_data_id.name
              )
          )
        );
        let res = data.reverse();
        return setNftDetails(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AccountContext.Provider
      value={{
        mnemonic,
        newMnemonic,
        setNewMnemonic,
        setMnemonic,
        alertTitle,
        alertSignal,
        setAlertSignal,
        setAlertTitle,
        alertMessage,
        setAlertMessage,
        isLoading,
        handleImport,
        currentAddress,
        accountImported,
        collectionName,
        setCollectionName,
        collectionDescription,
        setCollectionDescription,
        collectionUri,
        setCollectionUri,
        handleCreateCollection,
        nftName,
        setNftName,
        nftDescription,
        setNftDescription,
        nftUri,
        setNftUri,
        nftSupply,
        setNftSupply,
        handleCreateNft,
        balance,
        handleGenerate,
        handleCreate,
        amount,
        setAmount,
        handleMint,
        handleEstimate,
        handleSend,
        getBalance,
        recipientAddress,
        setRecipientAddress,
        getSentTransactions,
        transactions,
        isValidTransaction,
        setIsValidTransaction,
        estimatedTxnResult,
        setEstimatedTxnResult,
        getReceivedEvents,
        receivedEvents,
        getAccountTokens,
        getNftDetails,
        accountTokens,
        nftDetails,
        handleLogout,
        handleLock,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        handleLogin,
        handleRevealMnemonic,
        handleRevealPrivateKey,
        currentAsset,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
