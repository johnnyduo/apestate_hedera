import { useCallback, useContext, useEffect, useState } from 'react';
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
  CURREX,
  executeBuy,
  executeDraw,
  executeSell,
  fetchUsdcBalance,
  refreshOraclePrice,
  usdcApprove,
} from '@/lib/contract';
import { WalletContext } from '@/lib/hooks/use-connect';
import LeverageBox from '@/components/ui/leverage-box';

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

const SwapPage: NextPageWithLayout = () => {
  let [toggleCoin, setToggleCoin] = useState(false);

  const contractData = useContractData();

  const { address, balance } = useContext(WalletContext);

  const [usdValue, setUsdValue] = useState(0);
  const [usdValueText, setUsdValueText] = useState('0');
  const [usdBalance, setUsdBalance] = useState(0);
  const [tokenValue, setTokenValue] = useState(0);
  const [tokenValueText, setTokenValueText] = useState('0');
  const [tokenSymbol, setTokenSymbol] = useState('PYT');
  const [tokenBalance, setTokenBalance] = useState(0);
  const [_bypassUpdateRate, setBypassUpdateRate] = useState(false);
  const bypassUpdateRate = true;

  const [landId, setLandId] = useState(0);
  const [price, setPrice] = useState(0);
  const [priceUpdatedAt, setPriceUpdatedAt] = useState(0);

  // const approved = true;
  const [approved, setApproved] = useState(false);
  const [executing, setExecuting] = useState(false);

  const refreshUsdcBalance = useCallback(async () => {
    const usdBalanceRaw = await fetchUsdcBalance();
    setUsdBalance(parseFloat(ethers.utils.formatEther(usdBalanceRaw || '0')));
  }, [setUsdBalance]);

  const fetchPrice = useCallback(() => {
    const data = contractData.find((x) => x.symbol == tokenSymbol);
    console.log(data);
    const parsedPrice =
      parseFloat(ethers.utils.formatEther(data?.price || '0')) * CURREX;

    setLandId(data?.landId || 0);
    setPrice(parsedPrice);
    setPriceUpdatedAt(data?.lastUpdatedAt || 0);
    setTokenBalance(parseFloat(ethers.utils.formatEther(data?.balance || '0')));

    refreshUsdcBalance().catch((err) => console.error(err));

    return parsedPrice;
  }, [contractData, tokenSymbol, setPrice]);

  const onUSDChange = useCallback(
    (usdValue: number) => {
      const price = fetchPrice();
      console.log(price);

      let newTokenValue = usdValue / price;

      if (toggleCoin) {
        newTokenValue /= 1 - EXCHANGE_FEE;
      } else {
        newTokenValue -= newTokenValue * EXCHANGE_FEE;
      }

      setTokenValue(parseFloat(newTokenValue.toFixed(4)));
      setTokenValueText(newTokenValue.toFixed(4));
      setApproved(false);
    },
    [fetchPrice, setTokenValue]
  );

  const onTokenChange = useCallback(
    (tokenValue: number) => {
      const price = fetchPrice();
      console.log(price);

      let newUsdValue = tokenValue * price;

      if (toggleCoin) {
        newUsdValue -= newUsdValue * EXCHANGE_FEE;
      } else {
        newUsdValue /= 1 - EXCHANGE_FEE;
      }

      setUsdValue(parseFloat(newUsdValue.toFixed(4)));
      setUsdValueText(newUsdValue.toFixed(4));
      setApproved(false);
    },
    [fetchPrice, setUsdValue]
  );

  useEffect(() => {
    onTokenChange(tokenValue);
    setBypassUpdateRate(false);
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

  return (
    <>
      <NextSeo title="Swap" description="Apestate" />
      <Trade>
        <div className="mb-5 border-b border-dashed border-gray-200 pb-5 dark:border-gray-800 xs:mb-7 xs:pb-6">
          <div
            className={cn(
              'relative flex gap-3',
              toggleCoin ? 'flex-col-reverse' : 'flex-col'
            )}
          >
            <CoinInput
              label={toggleCoin ? 'To' : 'From'}
              balance={usdBalance.toFixed(0)}
              defaultCoinIndex={0}
              isUSD={true}
              value={usdValueText}
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
            <CoinInput
              label={toggleCoin ? 'From' : 'To'}
              balance={tokenBalance.toFixed(4)}
              defaultCoinIndex={0}
              value={tokenValueText}
              getCoinValue={(data) => {
                setTokenValue(parseFloat(data.value || '0'));
                setTokenValueText(data.value);
                setTokenSymbol(data.coin);

                if (data.value) {
                  onTokenChange(parseFloat(data.value || '0'));
                }
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 xs:gap-[18px]">
          <TransactionInfo
            label={'Exchange Rate'}
            value={`${price.toFixed(4)} USD/m²`}
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
        </div>

        <div className="mt-4">
          <LeverageBox />
        </div>

        {!bypassUpdateRate &&
        priceUpdatedAt * 1000 < Date.now() - 3600 * 1000 ? (
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
                await refreshOraclePrice(landId);
                setBypassUpdateRate(true);
              } catch (err) {
                console.error(err);
                window.alert('UPDATE RATE ERROR');
              } finally {
                setExecuting(false);
              }
            }}
          >
            UPDATE RATE
          </Button>
        ) : !approved && !toggleCoin ? (
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
                await usdcApprove(usdValue);
                setApproved(true);
              } catch (err) {
                console.error(err);
                window.alert('APPROVE ERROR');
              } finally {
                setExecuting(false);
              }
            }}
          >
            APPROVE
          </Button>
        ) : (
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

                if (toggleCoin) {
                  await executeSell(landId, tokenValue);
                } else {
                  await executeBuy(landId, usdValue);
                }

                addLongPositions({
                  landId,
                  tokenValue,
                  usdValue,
                });

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
            {toggleCoin ? 'SELL' : 'BUY'}
          </Button>
        )}

        <div className="mt-8">
          <div className="text-center text-lg">Positions</div>

          <div
            className="mt-4 grid gap-y-1"
            style={{ gridTemplateColumns: 'auto auto 64px' }}
          >
            <div className="font-bold">AMOUNT</div>
            {/* <div className="font-bold">BALANCE</div> */}
            <div className="font-bold">VALUE</div>
            <div>&nbsp;</div>

            {longPositions.map((position, i) => (
              <LongPositionControl
                position={position}
                onRedeem={() => removeLongPositions(i)}
                key={i}
              ></LongPositionControl>
            ))}
          </div>
        </div>

        {/* <div className="mt-8">
          <div className="text-center text-lg">Draw Free {tokenSymbol}</div>
          <div className="text-center">Diamond tier: 10 draws/day</div>

          <div className="mt-3 text-center">
            <Button onClick={() => executeDraw(landId)}>Draw</Button>
          </div>
        </div> */}
      </Trade>
    </>
  );
};

SwapPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default SwapPage;
