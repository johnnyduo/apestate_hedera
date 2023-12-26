import { Bitcoin } from '@/components/icons/bitcoin';
import { Ethereum } from '@/components/icons/ethereum';
import { Tether } from '@/components/icons/tether';
import { Bnb } from '@/components/icons/bnb';
import { Usdc } from '@/components/icons/usdc';
import { Cardano } from '@/components/icons/cardano';
import { Doge } from '@/components/icons/doge';

export type CoinList = 'D1' | 'D2' | 'D3' | 'D4' | 'USDC' | 'D5' | 'THB';

const coinIcons: Record<CoinList, JSX.Element> = {
  D1: <Bitcoin />,
  D2: <Ethereum />,
  D3: <Tether />,
  D4: <Bnb />,
  USDC: <Usdc />,
  D5: <Cardano />,
  THB: <Doge />,
};

interface CurrencySwapIconsProps {
  from: CoinList;
  to: CoinList;
}

export default function CurrencySwapIcons({
  from,
  to,
}: CurrencySwapIconsProps) {
  return (
    <div className="flex items-center">
      <div className="flex items-center">
        <div className="relative">{coinIcons[from]}</div>
        <div className="ltr:-ml-1.5 rtl:-mr-1.5">{coinIcons[to]}</div>
      </div>
      <div className="whitespace-nowrap text-sm font-medium uppercase text-black ltr:ml-3 rtl:mr-3 dark:text-white">
        {from}-{to}
      </div>
    </div>
  );
}
