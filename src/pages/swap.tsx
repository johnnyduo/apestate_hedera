import { useCallback, useEffect, useState } from 'react';
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
import { THBUSD } from '@/lib/contract';

const EXCHANGE_FEE = 30;

const SwapPage: NextPageWithLayout = () => {
  let [toggleCoin, setToggleCoin] = useState(false);

  const contractData = useContractData();

  const [usdValue, setUsdValue] = useState(0);
  const [tokenValue, setTokenValue] = useState(0);
  const [tokenSymbol, setTokenSymbol] = useState('PYT');

  const [price, setPrice] = useState(0);
  const [priceUpdatedAt, setPriceUpdatedAt] = useState(0);

  const [approved, setApproved] = useState(false);
  const [executing, setExecuting] = useState(false);

  const fetchPrice = useCallback(() => {
    const data = contractData.find((x) => x.symbol == tokenSymbol);
    const parsedPrice =
      parseFloat(ethers.utils.formatEther(data?.price || '0')) * THBUSD;
    setPrice(parsedPrice);
    setPriceUpdatedAt(data?.lastUpdatedAt || 0);

    return parsedPrice;
  }, [contractData, tokenSymbol, setPrice]);

  const onUSDChange = useCallback(() => {
    const price = fetchPrice();
    console.log(price);
  }, [usdValue, fetchPrice, setTokenValue]);

  const onTokenChange = useCallback(() => {
    const price = fetchPrice();
    console.log(price);
  }, [tokenValue, fetchPrice, setUsdValue]);

  useEffect(() => {
    onUSDChange();
  }, [usdValue]);

  useEffect(() => {
    onTokenChange();
  }, [tokenValue, tokenSymbol]);

  return (
    <>
      <NextSeo
        title="Farms"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
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
              exchangeRate={1.0}
              defaultCoinIndex={0}
              isUSD={true}
              getCoinValue={(data) => {
                setUsdValue(parseFloat(data.value || '0'));
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
              exchangeRate={price}
              defaultCoinIndex={0}
              getCoinValue={(data) => {
                setTokenValue(parseFloat(data.value || '0'));
                setTokenSymbol(data.coin);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 xs:gap-[18px]">
          <TransactionInfo label={'Rate'} value={`${price.toFixed(2)} $/m^2`} />
          <TransactionInfo
            label={'Updated At'}
            value={
              priceUpdatedAt
                ? new Date(priceUpdatedAt * 1000).toLocaleString()
                : undefined
            }
          />
          <TransactionInfo label={'Exchange Fee'} value={'0.3%'} />
        </div>
        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
        >
          SWAP
        </Button>
      </Trade>
    </>
  );
};

SwapPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default SwapPage;
