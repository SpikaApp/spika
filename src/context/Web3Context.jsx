import React, { useState, useContext } from "react";
import * as aptos from "aptos";
import { client, faucetClient, tokenClient } from "../utils/client";
import { UIContext } from "./UIContext";
import { AccountContext } from "./AccountContext";
import * as token from "../utils/token";
import * as bcsPayload from "../utils/payload";

export const Web3Context = React.createContext();

export const Web3Provider = ({ children }) => {
  const {
    throwAlert,
    account,
    currentAddress,
    privateKey,
    setBalance,
    currentAsset,
    setIsLoading,
  } = useContext(AccountContext);
  const { setOpenSendDialog } = useContext(UIContext);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [maxGasAmount] = useState("1000"); // todo: integrate to SendDialog
  const [estimatedTxnResult, setEstimatedTxnResult] = useState([]);
  const [isValidTransaction, setIsValidTransaction] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [receivedEvents, setReceivedEvents] = useState([]);
  const [accountTokens, setAccountTokens] = useState([]);
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [collectionUri, setCollectionUri] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftUri, setNftUri] = useState("");
  const [nftSupply, setNftSupply] = useState("");
  const [nftDetails, setNftDetails] = useState([]);

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

  // Request Faucet to fund address with test coins
  const mintCoins = async () => {
    try {
      const account = new aptos.AptosAccount(privateKey, currentAddress);
      await faucetClient.fundAccount(account.address(), amount);
      throwAlert(21, "Success", `Received ${amount} ${token.aptosCoin[0].ticker}`);
    } catch (error) {
      throwAlert(22, "Transaction failed", `${error}`);
      setIsLoading(false);
      console.log(error);
    }
  };

  const estimateTransaction = async () => {
    try {
      const payload = await bcsPayload.transfer(recipientAddress, amount);
      const rawTxn = await client.generateRawTransaction(currentAddress, payload);
      const bcsTxn = aptos.AptosClient.generateBCSSimulation(account, rawTxn);
      const estimatedTxn = (await client.submitBCSSimulation(bcsTxn))[0];
      if (estimatedTxn.success === true) {
        // logic if Move says wagmi
        setIsValidTransaction(true);
        setEstimatedTxnResult(estimatedTxn);
        throwAlert(30, "Transaction is valid", `${estimatedTxn.vm_status}`);
      }
      if (estimatedTxn.success === false) {
        // logic if txn aborted by Move
        setEstimatedTxnResult(estimatedTxn);
        throwAlert(33, "Transaction is invalid", `${estimatedTxn.vm_status}`);
        setRecipientAddress("");
        setAmount("");
      }
    } catch (error) {
      // logic if txn body doesn't looks good to be submitted to VM
      throwAlert(34, "Failed to estimate", `${error}`);
      setRecipientAddress("");
      setAmount("");
      console.log(error);
    }
  };

  const sendTransaction = async () => {
    try {
      const payload = await bcsPayload.transfer(recipientAddress, amount);
      const rawTxn = await client.generateRawTransaction(currentAddress, payload);
      const bcsTxn = aptos.AptosClient.generateBCSTransaction(account, rawTxn);
      const transactionRes = await client.submitSignedBCSTransaction(bcsTxn);
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
    let accountResource = resources.find((r) => r.type === currentAsset[1].module);
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
    let accountResource = resources.find((r) => r.type === currentAsset[1].module);
    let counter = parseInt(accountResource.data.deposit_events.counter);
    if (counter <= 25) {
      let data = await client.getEventsByEventHandle(
        currentAddress,
        currentAsset[1].module,
        "deposit_events"
      );
      let res = data.reverse((r) => r.type === "sequence_number");
      setReceivedEvents(res);
    } else {
      let data = await client.getEventsByEventHandle(
        currentAddress,
        currentAsset[1].module,
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
      let tokenStore = resources.find((r) => r.type === token.tokenStore.module);

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
    <Web3Context.Provider
      value={{
        setRecipientAddress,
        amount,
        setAmount,
        isValidTransaction,
        setIsValidTransaction,
        estimatedTxnResult,
        transactions,
        receivedEvents,
        nftDetails,
        handleMint,
        handleSend,
        getReceivedEvents,
        getSentTransactions,
        handleEstimate,
        accountTokens,
        getAccountTokens,
        getBalance,
        handleCreateCollection,
        handleCreateNft,
        getNftDetails,
        setCollectionName,
        setCollectionDescription,
        setCollectionUri,
        setNftName,
        setNftDescription,
        setNftSupply,
        setNftUri,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
