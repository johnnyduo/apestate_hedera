import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import Button from '@/components/ui/button';
import CoinInput from '@/components/ui/coin-input';
import TransactionInfo from '@/components/ui/transaction-info';
import { Plus } from '@/components/icons/plus';
import ActiveLink from '@/components/ui/links/active-link';
import Trade from '@/components/ui/trade';
import RootLayout from '@/layouts/_root-layout';
import { fetchUsdcBalance, THBUSD } from '@/lib/contract';
import useContractData from '@/lib/hooks/use-contract-data';
import { ethers } from 'ethers';
import { useState, useCallback, useEffect } from 'react';

const BORROW_RATIO = 0.799;

const LiquidityPage: NextPageWithLayout = () => {
  const contractData = useContractData();

  const [usdValue, setUsdValue] = useState(0);
  const [usdBalance, setUsdBalance] = useState(0);
  const [tokenValue, setTokenValue] = useState(0);
  const [tokenSymbol, setTokenSymbol] = useState('PYT');
  const [tokenBalance, setTokenBalance] = useState(0);

  const [landId, setLandId] = useState(0);
  const [price, setPrice] = useState(0);
  const [priceUpdatedAt, setPriceUpdatedAt] = useState(0);

  const [approved, setApproved] = useState(false);
  const [executing, setExecuting] = useState(false);

  const refreshUsdcBalance = useCallback(async () => {
    const usdBalanceRaw = await fetchUsdcBalance();
    setUsdBalance(parseFloat(ethers.utils.formatEther(usdBalanceRaw || '0')));
  }, [setUsdBalance]);

  const fetchPrice = useCallback(() => {
    const data = contractData.find((x) => x.symbol == tokenSymbol);
    const parsedPrice =
      parseFloat(ethers.utils.formatEther(data?.price || '0')) * THBUSD;

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

  return (
    <>
      <NextSeo title="Liquidity" description="Apestate" />
      <Trade>
        <div className="mb-5 border-b border-dashed border-gray-200 pb-5 dark:border-gray-800 xs:mb-7 xs:pb-6">
          <div className="relative flex flex-col gap-3">
            <CoinInput
              label={'From'}
              balance={usdBalance.toFixed(2)}
              defaultCoinIndex={0}
              isUSD={true}
              value={usdValue}
              getCoinValue={(data) => {
                setUsdValue(parseFloat(data.value || '0'));
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
              label={'Borrow'}
              balance={tokenBalance.toFixed(4)}
              defaultCoinIndex={0}
              value={tokenValue}
              getCoinValue={(data) => {
                setTokenValue(parseFloat(data.value || '0'));
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
            label={'Rate'}
            value={`${price.toFixed(2)} USD/m²`}
          />
          <TransactionInfo
            label={'Updated At'}
            value={
              priceUpdatedAt
                ? new Date(priceUpdatedAt * 1000).toLocaleString()
                : undefined
            }
          />
          <TransactionInfo label={'Borrow Ratio'} value={'80%'} />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2.5 xs:mt-8">
          <ActiveLink href="/liquidity-position">
            <Button
              size="large"
              shape="rounded"
              fullWidth={true}
              className="uppercase"
            >
              BORROW
            </Button>
          </ActiveLink>
          <ActiveLink href="/liquidity-position">
            <Button
              size="large"
              shape="rounded"
              fullWidth={true}
              className="uppercase"
            >
              SHORT
            </Button>
          </ActiveLink>
        </div>
      </Trade>
    </>
  );
};

LiquidityPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default LiquidityPage;
