import { TxnBuilderTypes } from "aptos";

interface IContextPayload {
  register: (coinType: string) => Promise<TxnBuilderTypes.TransactionPayloadEntryFunction>;
  transfer: (args: IPayloadTransferArgs) => Promise<TxnBuilderTypes.TransactionPayloadEntryFunction>;
  collection: (args: IPayloadCollectionArgs) => Promise<TxnBuilderTypes.TransactionPayload>;
  nft: (args: IPayloadNftArgs) => Promise<TxnBuilderTypes.TransactionPayload>;
}

export interface IPayloadTransferArgs {
  recipientAddress: string;
  currentAsset: string;
  amount: number;
}

export interface IPayloadCollectionArgs {
  name: string;
  description: string;
  uri: string;
  maxAmount: string;
}

export interface IPayloadNftArgs {
  address: string;
  collectionName: string;
  name: string;
  description: string;
  supply: string;
  uri: string;
  max: string;
  royalty_payee_address: string;
  royalty_points_denominator: number;
  royalty_points_numerator: number;
  property_keys: Array<string>;
  property_values: Array<string>;
  property_types: Array<string>;
}

export default IContextPayload;
