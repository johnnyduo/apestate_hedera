import { ethers } from 'ethers';
import { MulticallWrapper } from 'ethers-multicall-provider';
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import FakeUSDCABI from './abis/FakeUSDC.json';
import OracleABI from './abis/LandPriceOracle.json';
import ExchangeABI from './abis/LandPriceExchange.json';
import { WalletContext } from './hooks/use-connect';
import { useInterval } from 'usehooks-ts';

export interface ContractData {
  landId: number;
  symbol: string;
  balance: string;
  price: string;
  lastUpdatedAt: number;
}

const SYMBOL_CONTRACT_DATA = ['PYT', 'TLR', 'LPO', 'STN'];

const DEFAULT_CONTRACT_DATA: ContractData[] = [
  {
    landId: 1,
    symbol: 'PYT',
    balance: '0',
    price: '0',
    lastUpdatedAt: 0,
  },
  {
    landId: 2,
    symbol: 'TLR',
    balance: '0',
    price: '0',
    lastUpdatedAt: 0,
  },
  {
    landId: 3,
    symbol: 'LPO',
    balance: '0',
    price: '0',
    lastUpdatedAt: 0,
  },
  {
    landId: 4,
    symbol: 'STN',
    balance: '0',
    price: '0',
    lastUpdatedAt: 0,
  },
];

export const ContractDataContext = React.createContext<ContractData[]>(
  DEFAULT_CONTRACT_DATA
);

const provider = MulticallWrapper.wrap(
  new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT)
);

export const FakeUSDC = new ethers.Contract(
  process.env.NEXT_PUBLIC_USDC_CONTRACT!,
  FakeUSDCABI,
  provider
);
export const Oracle = new ethers.Contract(
  process.env.NEXT_PUBLIC_ORACLE_CONTRACT!,
  OracleABI,
  provider
);
export const Exchange = new ethers.Contract(
  process.env.NEXT_PUBLIC_EXCHANGE_CONTRACT!,
  ExchangeABI,
  provider
);

export async function fetchContractData(address: string) {
  const promises = [];

  for (let landId = 1; landId <= 4; landId++) {
    promises.push(Exchange.balanceOf(address, landId));
  }

  for (let landId = 1; landId <= 4; landId++) {
    promises.push(Oracle.price(landId));
  }

  for (let landId = 1; landId <= 4; landId++) {
    promises.push(Oracle.latestFulfill(landId));
  }

  const response = await Promise.all(promises);

  const balances = response.slice(0, 4);
  const prices = response.slice(4, 8);
  const updatedAts = response.slice(8, 12);

  const result: ContractData[] = [];

  for (let i = 0; i < 4; i++) {
    result.push({
      landId: i + 1,
      symbol: SYMBOL_CONTRACT_DATA[i],
      balance: balances[i],
      price: prices[i],
      lastUpdatedAt: updatedAts[i],
    });
  }

  console.log(result);

  return result;
}

export function ContractDataProvider({ children }: { children: ReactNode }) {
  const [contractData, setContractData] = useState<ContractData[]>([]);
  const { address } = useContext(WalletContext);

  const refreshContractData = useCallback(async () => {
    if (address) {
      setContractData(await fetchContractData(address));
    }
  }, [setContractData, address]);

  useEffect(() => {
    refreshContractData();
  }, [address]);

  useInterval(() => refreshContractData(), 3000);

  return (
    <ContractDataContext.Provider value={contractData}>
      {children}
    </ContractDataContext.Provider>
  );
}
