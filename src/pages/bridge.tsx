import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { NextPageWithLayout } from '@/types';
import cn from 'classnames';
import { NextSeo } from 'next-seo';
import Button from '@/components/ui/button';
import CoinInput from '@/components/ui/coin-input';
import TransactionInfo from '@/components/ui/transaction-info';
import { SwapIcon } from '@/components/icons/swap-icon';
import Trade from '@/components/ui/trade';
import RootLayout from '@/layouts/_root-layout';
import useContractData from '@/lib/hooks/use-contract-data';
import { ethers } from 'ethers';
import {
  THBUSD,
  executeBridge,
  executeBuy,
  executeDraw,
  executeSell,
  fetchUsdcBalance,
  refreshOraclePrice,
  usdcApprove,
} from '@/lib/contract';
import { WalletContext } from '@/lib/hooks/use-connect';
import LeverageBox from '@/components/ui/leverage-box';
import CoinSelectView from '@/components/ui/coin-select-view';
import { AnimatePresence, motion } from 'framer-motion';
import { coinList } from '@/data/static/coin-list';
import CoinInputBridge from '@/components/ui/coin-input-bridge';

import { Ethereum } from '@/components/icons/ethereum';
import { Polygon } from '@/components/icons/polygon';

const EXCHANGE_FEE = 30.1 / 10000;

interface LongPosition {
  landId: number;
  usdValue: number;
  tokenValue: number;
}

function LongPositionControl({
  position,
  onRedeem,
}: {
  position: LongPosition;
  onRedeem: () => void;
}) {
  const contractData = useContractData();

  const [executing, setExecuting] = useState(false);

  const redeem = useCallback(async () => {
    try {
      setExecuting(true);
      await executeSell(position.landId, position.tokenValue);
      onRedeem();
    } catch (err) {
      console.error(err);
      window.alert('REDEEM ERROR');
    } finally {
      setExecuting(false);
    }
  }, [position]);

  return (
    <>
      <div>
        {position.tokenValue}{' '}
        {contractData &&
          contractData[position.landId - 1] &&
          contractData[position.landId - 1].symbol}
      </div>
      <div>{position.usdValue * 0.99} USDC</div>
      <div
        className={
          'underline hover:cursor-pointer ' + (executing ? 'opacity-60' : '')
        }
        onClick={() => !executing && redeem()}
      >
        Close
      </div>
    </>
  );
}

const BridgePage: NextPageWithLayout = () => {
  let [toggleCoin, setToggleCoin] = useState(false);

  const contractData = useContractData();

  const { address } = useContext(WalletContext);

  const [usdValue, setUsdValue] = useState(0);
  const [usdValueText, setUsdValueText] = useState('0');
  const [usdBalance, setUsdBalance] = useState(0);
  const [tokenValue, setTokenValue] = useState(0);
  const [tokenValueText, setTokenValueText] = useState('0');
  const [tokenSymbol, setTokenSymbol] = useState('PYT');
  const [tokenBalance, setTokenBalance] = useState(0);
  const [polygonTokenBalance, setPolygonTokenBalance] = useState(0);

  const [landId, setLandId] = useState(0);
  const [price, setPrice] = useState(0);
  const [priceUpdatedAt, setPriceUpdatedAt] = useState(0);

  const approved = true;
  const [_approved, setApproved] = useState(false);
  const [executing, setExecuting] = useState(false);

  const [visibleCoinList, setVisibleCoinList] = useState(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  const refreshUsdcBalance = useCallback(async () => {
    const usdBalanceRaw = await fetchUsdcBalance();
    setUsdBalance(parseFloat(ethers.utils.formatEther(usdBalanceRaw || '0')));
  }, [setUsdBalance]);

  const fetchPrice = useCallback(() => {
    const data = contractData.find((x) => x.symbol == tokenSymbol);
    console.log(data);
    const parsedPrice =
      parseFloat(ethers.utils.formatEther(data?.price || '0')) * THBUSD;

    setLandId(data?.landId || 0);
    setPrice(parsedPrice);
    setPriceUpdatedAt(data?.lastUpdatedAt || 0);
    setTokenBalance(parseFloat(ethers.utils.formatEther(data?.balance || '0')));
    setPolygonTokenBalance(
      parseFloat(ethers.utils.formatEther(data?.balancePolygon || '0'))
    );

    refreshUsdcBalance().catch((err) => console.error(err));

    return parsedPrice;
  }, [contractData, tokenSymbol, setPrice]);

  const onUSDChange = useCallback(
    (usdValue: number) => {
      // const price = fetchPrice();
      const price = 1;
      console.log(price);

      let newTokenValue = usdValue / price;

      // if (toggleCoin) {
      //   newTokenValue /= 1 - EXCHANGE_FEE;
      // } else {
      //   newTokenValue -= newTokenValue * EXCHANGE_FEE;
      // }

      setTokenValue(parseFloat(newTokenValue.toFixed(4)));
      setTokenValueText(newTokenValue.toFixed(4));
      setApproved(false);
    },
    [fetchPrice, setTokenValue]
  );

  const onTokenChange = useCallback(
    (tokenValue: number) => {
      // const price = fetchPrice();
      const price = 1;
      console.log(price);

      let newUsdValue = tokenValue * price;

      // if (toggleCoin) {
      //   newUsdValue -= newUsdValue * EXCHANGE_FEE;
      // } else {
      //   newUsdValue /= 1 - EXCHANGE_FEE;
      // }

      setUsdValue(parseFloat(newUsdValue.toFixed(4)));
      setUsdValueText(newUsdValue.toFixed(4));
      setApproved(false);
    },
    [fetchPrice, setUsdValue]
  );

  useEffect(() => {
    onTokenChange(tokenValue);
  }, [tokenSymbol]);

  useEffect(() => {
    fetchPrice();
  }, [contractData]);

  const [longPositions, setLongPositions] = useState<LongPosition[]>([]);

  const refreshLongPositions = useCallback(() => {
    const positions: LongPosition[] = JSON.parse(
      window.localStorage.getItem(`APESTATE_LONG_${address}`) || '[]'
    );
    setLongPositions(positions);
    return positions;
  }, [setLongPositions]);

  const addLongPositions = useCallback(
    (position: LongPosition) => {
      const positions = refreshLongPositions();
      positions.push(position);
      window.localStorage.setItem(
        `APESTATE_LONG_${address}`,
        JSON.stringify(positions)
      );
      refreshLongPositions();
    },
    [refreshLongPositions]
  );

  const removeLongPositions = useCallback(
    (i: number) => {
      const positions = refreshLongPositions();
      positions.splice(i, 1);
      window.localStorage.setItem(
        `APESTATE_LONG_${address}`,
        JSON.stringify(positions)
      );
      refreshLongPositions();
    },
    [refreshLongPositions]
  );

  useEffect(() => {
    refreshLongPositions();
  }, []);

  const selectedCoin = useMemo(
    () => coinList.find((x) => x.code == tokenSymbol),
    [tokenSymbol]
  );

  return (
    <>
      <NextSeo title="Swap" description="Apestate" />
      <Trade>
        <div className="mb-5 border-b border-dashed border-gray-200 pb-5 dark:border-gray-800 xs:mb-7 xs:pb-6">
          <div className="mb-3 flex gap-2">
            {coinList.map((coin) => (
              <div
                className={`flex items-center gap-2 rounded-2xl border border-gray-700 py-2 px-3 hover:cursor-pointer ${
                  tokenSymbol == coin.code ? 'bg-brand' : ''
                }`}
                key={coin.code}
                onClick={() => setTokenSymbol(coin.code)}
              >
                {coin.icon}
                {coin.code}
              </div>
            ))}
          </div>

          <div
            className={cn(
              'relative flex gap-3',
              toggleCoin ? 'flex-col-reverse' : 'flex-col'
            )}
          >
            <CoinInputBridge
              label={toggleCoin ? 'To' : 'From'}
              balance={tokenBalance.toFixed(4)}
              defaultCoinIndex={0}
              isUSD={true}
              value={usdValueText}
              symbol="ETH"
              icon={<Ethereum></Ethereum>}
              getCoinValue={(data) => {
                setUsdValue(parseFloat(data.value || '0'));
                setUsdValueText(data.value);
                if (data.value) {
                  onUSDChange(parseFloat(data.value || '0'));
                }
              }}
            />
            <div className="absolute top-1/2 left-1/2 z-[1] -mt-4 -ml-4 rounded-full bg-white shadow-large dark:bg-gray-600">
              <Button
                size="mini"
                color="gray"
                shape="circle"
                variant="transparent"
                onClick={() => setToggleCoin(!toggleCoin)}
              >
                <SwapIcon className="h-auto w-3" />
              </Button>
            </div>
            <CoinInputBridge
              label={toggleCoin ? 'From' : 'To'}
              balance={polygonTokenBalance.toFixed(4)}
              defaultCoinIndex={0}
              isUSD={true}
              value={tokenValue}
              symbol="Polygon"
              icon={<Polygon></Polygon>}
              getCoinValue={(data) => {
                setTokenValue(parseFloat(data.value || '0'));
                setTokenValueText(data.value);
                // setTokenSymbol(data.coin);

                if (data.value) {
                  onTokenChange(parseFloat(data.value || '0'));
                }
              }}
            />
          </div>
        </div>
        {/* <div className="flex flex-col gap-4 xs:gap-[18px]">
          <TransactionInfo
            label={'Exchange Rate'}
            value={`${price.toFixed(4)} ETH/m²`}
          />
          <TransactionInfo
            label={'Updated At'}
            value={
              priceUpdatedAt
                ? new Date(priceUpdatedAt * 1000).toLocaleString()
                : undefined
            }
          />
          <TransactionInfo label={'Funding Rate'} value={'0.25%'} />
        </div> */}

        {/* <div className="mt-4">
          <LeverageBox />
        </div> */}

        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          disabled={executing}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
          onClick={async () => {
            if (!address) {
              return window.alert('Please connect your wallet');
            }

            try {
              setExecuting(true);

              await executeBridge(landId, usdValue);

              setUsdValue(0);
              setTokenValue(0);
              setApproved(false);
              fetchPrice();
            } catch (err) {
              console.error(err);
              window.alert(`${toggleCoin ? 'SELL' : 'BUY'} ERROR`);
            } finally {
              setExecuting(false);
            }
          }}
        >
          BRIDGE
        </Button>
      </Trade>

      <AnimatePresence>
        {visibleCoinList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-700 bg-opacity-60 p-4 text-center backdrop-blur xs:p-5"
          >
            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-full align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <motion.div
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              exit={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              ref={modalContainerRef}
              className="inline-block text-left align-middle"
            >
              <CoinSelectView
                onSelect={(selectedCoin) => setTokenSymbol(selectedCoin.code)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

BridgePage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default BridgePage;
