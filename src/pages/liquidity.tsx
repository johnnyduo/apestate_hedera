import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import Button from '@/components/ui/button';
import CoinInput from '@/components/ui/coin-input';
import TransactionInfo from '@/components/ui/transaction-info';
import { Plus } from '@/components/icons/plus';
import ActiveLink from '@/components/ui/links/active-link';
import Trade from '@/components/ui/trade';
import RootLayout from '@/layouts/_root-layout';
import {
  executeBorrow,
  executeRedeem,
  executeShort,
  fetchUsdcBalance,
  refreshOraclePrice,
  CURREX,
  usdcApprove,
} from '@/lib/contract';
import useContractData from '@/lib/hooks/use-contract-data';
import { ethers } from 'ethers';
import { useState, useCallback, useEffect, useContext } from 'react';
import { WalletContext } from '@/lib/hooks/use-connect';
import LeverageBox from '@/components/ui/leverage-box';

interface BorrowPosition {
  positionId: number;
  landId: number;
  usdValue: number;
  tokenValue: number;
}

const BORROW_RATIO = 0.998;

function BorrowPositionControl({
  position,
  onRedeem,
}: {
  position: BorrowPosition;
  onRedeem: () => void;
}) {
  const contractData = useContractData();

  const [executing, setExecuting] = useState(false);

  const redeem = useCallback(async () => {
    try {
      setExecuting(true);
      await executeRedeem(position.positionId);
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
      {/* <div>
        {position.tokenValue}{' '}
        {contractData &&
          contractData[position.landId - 1] &&
          contractData[position.landId - 1].symbol}
      </div> */}
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

const LiquidityPage: NextPageWithLayout = () => {
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

  const [borrowPositions, setBorrowPositions] = useState<BorrowPosition[]>([]);

  const refreshUsdcBalance = useCallback(async () => {
    const usdBalanceRaw = await fetchUsdcBalance();
    setUsdBalance(parseFloat(ethers.utils.formatEther(usdBalanceRaw || '0')));
  }, [setUsdBalance]);

  const fetchPrice = useCallback(() => {
    const data = contractData.find((x) => x.symbol == tokenSymbol);
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

      let newTokenValue = (usdValue / price) * BORROW_RATIO;

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

      let newUsdValue = (tokenValue * price) / BORROW_RATIO;

      setUsdValue(parseFloat(newUsdValue.toFixed(4)));
      setUsdValueText(newUsdValue.toFixed(4));
      setApproved(false);
    },
    [fetchPrice, setUsdValue]
  );

  const refreshBorrowPositions = useCallback(() => {
    const positions: BorrowPosition[] = JSON.parse(
      window.localStorage.getItem(`APESTATE_BORROW_${address}`) || '[]'
    );
    setBorrowPositions(positions);
    return positions;
  }, [setBorrowPositions]);

  const addBorrowPositions = useCallback(
    (position: BorrowPosition) => {
      const positions = refreshBorrowPositions();
      positions.push(position);
      window.localStorage.setItem(
        `APESTATE_BORROW_${address}`,
        JSON.stringify(positions)
      );
      refreshBorrowPositions();
    },
    [refreshBorrowPositions]
  );

  const removeBorrowPositions = useCallback(
    (i: number) => {
      const positions = refreshBorrowPositions();
      positions.splice(i, 1);
      window.localStorage.setItem(
        `APESTATE_BORROW_${address}`,
        JSON.stringify(positions)
      );
      refreshBorrowPositions();
    },
    [refreshBorrowPositions]
  );

  useEffect(() => {
    onTokenChange(tokenValue);
    setBypassUpdateRate(false);
  }, [tokenSymbol]);

  useEffect(() => {
    fetchPrice();
    refreshBorrowPositions();
  }, [contractData]);

  return (
    <>
      <NextSeo title="Trading" description="Apestate" />
      <Trade>
        <div className="mb-5 border-b border-dashed border-gray-200 pb-5 dark:border-gray-800 xs:mb-7 xs:pb-6">
          <div className="relative flex flex-col gap-3">
            <CoinInput
              label={'From'}
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
              >
                <Plus className="h-auto w-3" />
              </Button>
            </div>
            <CoinInput
              label={'To'}
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
          {/* <TransactionInfo label={'Borrow Ratio'} value={'80%'} /> */}
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
        ) : !approved ? (
          <div className="mt-6 grid grid-cols-1 gap-2.5 xs:mt-8">
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
          </div>
        ) : (
          <div className="mt-6 grid gap-2.5 xs:mt-8">
            {/* <Button
              size="large"
              shape="rounded"
              fullWidth={true}
              disabled={executing}
              className="uppercase"
              onClick={async () => {
                if (!address) {
                  return window.alert('Please connect your wallet');
                }

                try {
                  setExecuting(true);

                  const receipt = await executeBorrow(
                    landId,
                    usdValue,
                    tokenValue
                  );

                  console.log(receipt);

                  const positionId = parseInt(
                    receipt.logs.find(
                      (log: any) =>
                        log.topics[0] ==
                        '0x2dd79f4fccfd18c360ce7f9132f3621bf05eee18f995224badb32d17f172df73'
                    ).topics[3]
                  );

                  addBorrowPositions({
                    positionId,
                    landId,
                    usdValue,
                    tokenValue,
                  });

                  setUsdValue(0);
                  setTokenValue(0);
                  setApproved(false);
                  fetchPrice();
                } catch (err) {
                  console.error(err);
                  window.alert('BORROW ERROR');
                } finally {
                  setExecuting(false);
                }
              }}
            >
              BORROW
            </Button> */}

            <Button
              size="large"
              shape="rounded"
              fullWidth={true}
              disabled={executing}
              className="uppercase"
              onClick={async () => {
                if (!address) {
                  return window.alert('Please connect your wallet');
                }

                try {
                  setExecuting(true);

                  const receipt = await executeShort(
                    landId,
                    usdValue,
                    tokenValue
                  );

                  console.log(receipt);

                  const positionId = parseInt(
                    receipt.logs.find(
                      (log: any) =>
                        log.topics[0] ==
                        '0x2dd79f4fccfd18c360ce7f9132f3621bf05eee18f995224badb32d17f172df73'
                    ).topics[3]
                  );

                  addBorrowPositions({
                    positionId,
                    landId,
                    usdValue,
                    tokenValue,
                  });

                  setUsdValue(0);
                  setTokenValue(0);
                  setApproved(false);
                  fetchPrice();
                } catch (err) {
                  console.error(err);
                  window.alert('SHORT ERROR');
                } finally {
                  setExecuting(false);
                }
              }}
            >
              SHORT
            </Button>
          </div>
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

            {borrowPositions.map((position, i) => (
              <BorrowPositionControl
                position={position}
                onRedeem={() => removeBorrowPositions(i)}
                key={i}
              ></BorrowPositionControl>
            ))}
          </div>
        </div>
      </Trade>
    </>
  );
};

LiquidityPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default LiquidityPage;
