// Reti supportate per depositi e prelievi.
export const NETWORKS = ["BTC", "ETH", "BSC", "TRC20"] as const;
export type Network = (typeof NETWORKS)[number];

export const NETWORK_LABEL: Record<Network, string> = {
  BTC: "Bitcoin (BTC)",
  ETH: "Ethereum (ERC-20)",
  BSC: "BNB Smart Chain (BEP-20)",
  TRC20: "USDT (TRC-20 / TRON)",
};

export function isNetwork(value: string): value is Network {
  return (NETWORKS as readonly string[]).includes(value);
}

// Stessi controlli della funzione SQL request_withdrawal (doppia difesa)
const ADDRESS_PATTERN: Record<Network, RegExp> = {
  TRC20: /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
  ETH: /^0x[0-9a-fA-F]{40}$/,
  BSC: /^0x[0-9a-fA-F]{40}$/,
  BTC: /^([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[ac-hj-np-z02-9]{11,71})$/,
};

export function isValidAddress(network: Network, address: string): boolean {
  return ADDRESS_PATTERN[network].test(address);
}

export const ADDRESS_PLACEHOLDER: Record<Network, string> = {
  BTC: "bc1… oppure 1… / 3…",
  ETH: "0x…",
  BSC: "0x…",
  TRC20: "T…",
};

export function addressExplorerUrl(network: string, address: string): string {
  switch (network) {
    case "BTC":
      return `https://mempool.space/address/${address}`;
    case "ETH":
      return `https://etherscan.io/address/${address}`;
    case "BSC":
      return `https://bscscan.com/address/${address}`;
    default:
      return `https://tronscan.org/#/address/${address}`;
  }
}

// Etichetta leggibile per un valore qualsiasi salvato nel database
export function networkLabel(value: string): string {
  return isNetwork(value) ? NETWORK_LABEL[value] : value;
}
