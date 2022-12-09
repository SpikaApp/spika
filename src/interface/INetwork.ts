interface INetwork {
  name: string;
  data: INetworkData;
  chain_id?: number;
}

interface INetworkData {
  node_url: string;
  faucet_url?: string;
  testnet: boolean;
  custom: boolean;
}

export default INetwork;
