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

export let CURREX = 1;

export interface ContractData {
  landId: number;
  symbol: string;
  balance: string;
  balancePolygon: string;
  price: string;
  lastUpdatedAt: number;
}

const SYMBOL_CONTRACT_DATA = [
  'D1',
  'D2',
  'D3',
  'D4',
  'D5',
  'D6',
  'D7',
  'D8',
  'D9',
  'D10',
  'D11',
  'D12',
  'BINHC',
  'CAN',
  'GO',
  'HOC',
  'NHA',
  'THU',
  'BINH',
  'TANP',
  'TANB',
  'CU',
];

const DEFAULT_CONTRACT_DATA: ContractData[] = SYMBOL_CONTRACT_DATA.map(
  (symbol) => ({
    landId: 1,
    symbol,
    balance: '0',
    balancePolygon: '0',
    price: '0',
    lastUpdatedAt: 0,
  })
);

export const ContractDataContext = React.createContext<ContractData[]>(
  DEFAULT_CONTRACT_DATA
);

// const provider = MulticallWrapper.wrap(
//   new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT)
// );

const provider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_RPC_ENDPOINT
);

const polygonProvider = MulticallWrapper.wrap(
  new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_ENDPOINT_POLYGON
  )
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
export const ExchangePolygon = new ethers.Contract(
  process.env.NEXT_PUBLIC_EXCHANGE_CONTRACT!,
  ExchangeABI,
  polygonProvider
);

const TOKEN_LENGTH = 22;

export async function fetchContractData(address: string) {
  const promises = [];

  for (let landId = 1; landId <= TOKEN_LENGTH; landId++) {
    promises.push(Oracle.price(landId));
  }

  for (let landId = 1; landId <= TOKEN_LENGTH; landId++) {
    promises.push(Oracle.latestFulfill(landId));
  }

  if (address) {
    for (let landId = 1; landId <= TOKEN_LENGTH; landId++) {
      promises.push(Exchange.balanceOf(address, landId));
    }

    for (let landId = 1; landId <= TOKEN_LENGTH; landId++) {
      // promises.push(ExchangePolygon.balanceOf(address, landId));
      promises.push(Promise.resolve('0'));
    }
  } else {
    for (let i = 0; i < TOKEN_LENGTH * 2; i++) {
      promises.push(Promise.resolve('0'));
    }
  }

  const response = await Promise.all(promises);

  const prices = response.slice(0, TOKEN_LENGTH);
  const updatedAts = response.slice(TOKEN_LENGTH, TOKEN_LENGTH * 2);
  const balances = response.slice(TOKEN_LENGTH * 2, TOKEN_LENGTH * 3);
  const balancesPolygon = response.slice(TOKEN_LENGTH * 3, TOKEN_LENGTH * 4);

  const result: ContractData[] = [];

  for (let i = 0; i < 4; i++) {
    result.push({
      landId: i + 1,
      symbol: SYMBOL_CONTRACT_DATA[i],
      balance: balances[i],
      balancePolygon: balancesPolygon[i],
      price: prices[i],
      lastUpdatedAt: updatedAts[i],
    });
  }

  // console.log(result);

  return result;
}

export function ContractDataProvider({ children }: { children: ReactNode }) {
  const [contractData, setContractData] = useState<ContractData[]>([]);
  const { address } = useContext(WalletContext);

  const refreshContractData = useCallback(async () => {
    setContractData(await fetchContractData(address));
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

async function getSigner(ignoreAddress: boolean = false) {
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  const signer = provider.getSigner();
  console.log(signer);

  const address = await signer.getAddress();

  if (!address && !ignoreAddress) {
    window.alert('Please connect wallet first');
    throw new Error('Please connect wallet first');
  }

  const chainId = await signer.getChainId();

  // if (chainId != 11155111 && chainId != 80001) {
  //   window.alert('Please switch to sepolia testnet');
  //   throw new Error('Please switch to sepolia testnet');
  // }

  return signer;
}

export async function fetchApproval(address?: string) {
  const signer = await getSigner(true);
  const approval = await FakeUSDC.allowance(
    address ?? (await signer.getAddress()),
    Exchange.address
  );
  return approval;
}

export async function fetchUsdcBalance(address?: string) {
  const signer = await getSigner(true);
  const balance = await FakeUSDC.balanceOf(
    address ?? (await signer.getAddress())
  );
  return balance;
}

export async function usdcFaucet(amount: string | number) {
  const signer = await getSigner();

  const FakeUSDC = new ethers.Contract(
    process.env.NEXT_PUBLIC_USDC_CONTRACT!,
    FakeUSDCABI,
    signer
  );

  await (
    await FakeUSDC.mint(
      await signer.getAddress(),
      ethers.utils.parseEther(amount.toString())
    )
  ).wait();
}

export async function usdcApprove(amount: string | number) {
  const FakeUSDC = new ethers.Contract(
    process.env.NEXT_PUBLIC_USDC_CONTRACT!,
    FakeUSDCABI,
    await getSigner()
  );

  return await (
    await FakeUSDC.approve(
      Exchange.address,
      ethers.utils.parseEther(amount.toString())
    )
  ).wait();
}

export async function refreshOraclePrice(landId: number) {
  const Oracle = new ethers.Contract(
    process.env.NEXT_PUBLIC_ORACLE_CONTRACT!,
    OracleABI,
    await getSigner()
  );

  return await (await Oracle.requestVolumeData(landId)).wait();
}

export async function executeBuy(landId: number, usdAmount: string | number) {
  const Exchange = new ethers.Contract(
    process.env.NEXT_PUBLIC_EXCHANGE_CONTRACT!,
    ExchangeABI,
    await getSigner()
  );

  // return await (
  //   await Exchange.buy(landId, {
  //     value: ethers.utils.parseEther(usdAmount.toString()),
  //   })
  // ).wait();

  return await (
    await Exchange.buy(landId, ethers.utils.parseEther(usdAmount.toString()))
  ).wait();
}

export async function executeSell(
  landId: number,
  shareAmount: string | number
) {
  const Exchange = new ethers.Contract(
    process.env.NEXT_PUBLIC_EXCHANGE_CONTRACT!,
    ExchangeABI,
    await getSigner()
  );

  return await (
    await Exchange.sell(landId, ethers.utils.parseEther(shareAmount.toString()))
  ).wait();
}

export async function executeBorrow(
  landId: number,
  usdAmount: string | number,
  shareAmount: string | number
) {
  const Exchange = new ethers.Contract(
    process.env.NEXT_PUBLIC_EXCHANGE_CONTRACT!,
    ExchangeABI,
    await getSigner()
  );

  return await (
    await Exchange.borrow(
      landId,
      ethers.utils.parseEther(usdAmount.toString()),
      ethers.utils.parseEther(shareAmount.toString())
      // { value: ethers.utils.parseEther(usdAmount.toString()) }
    )
  ).wait();
}

export async function executeShort(
  landId: number,
  usdAmount: string | number,
  shareAmount: string | number
) {
  const Exchange = new ethers.Contract(
    process.env.NEXT_PUBLIC_EXCHANGE_CONTRACT!,
    ExchangeABI,
    await getSigner()
  );

  return await (
    await Exchange.borrowAndSell(
      landId,
      ethers.utils.parseEther(usdAmount.toString()),
      ethers.utils.parseEther(shareAmount.toString())
      // { value: ethers.utils.parseEther(usdAmount.toString()) }
    )
  ).wait();
}

export async function executeRedeem(positionId: number) {
  const Exchange = new ethers.Contract(
    process.env.NEXT_PUBLIC_EXCHANGE_CONTRACT!,
    ExchangeABI,
    await getSigner()
  );

  return await (await Exchange.redeem(positionId)).wait();
}

export async function executeDraw(landId: number) {
  const Exchange = new ethers.Contract(
    process.env.NEXT_PUBLIC_EXCHANGE_CONTRACT!,
    ExchangeABI,
    await getSigner()
  );

  return await (await Exchange.drawLand(landId)).wait();
}

export async function executeBridge(landId: number, amount: number) {
  const signer = await getSigner();

  const Exchange = new ethers.Contract(
    process.env.NEXT_PUBLIC_EXCHANGE_CONTRACT!,
    ExchangeABI,
    signer
  );

  const chainId = await signer.getChainId();
  let destinationChainSelector;

  if (chainId == 11155111) {
    destinationChainSelector = '12532609583862916517';
  } else if (chainId == 80001) {
    destinationChainSelector = '16015286601757825753';
  }

  return await (
    await Exchange.bridge(
      destinationChainSelector,
      landId,
      ethers.utils.parseEther(amount.toString())
    )
  ).wait();
}
