import BitcoinImage from '@/assets/images/coin/bitcoin.svg';
import TetherImage from '@/assets/images/coin/tether.svg';
import CardanoImage from '@/assets/images/coin/cardano.svg';
import BinanceImage from '@/assets/images/coin/binance.svg';

import { Bitcoin } from '@/components/icons/bitcoin';
import { Tether } from '@/components/icons/tether';
import { Bnb } from '@/components/icons/bnb';
import { Cardano } from '@/components/icons/cardano';
import { Border } from '@/components/icons/border';

///minimal
export const priceFeedData = [
  {
    id: '0',
    name: 'DISTRICT1',
    symbol: 'D1',
    balance: '0',
    usdBalance: '0', //price per square meter
    logo: BitcoinImage,
    change: '+12.5%',
    isChangePositive: true,
    color: '#FDEDD4',
    icon: <Border />,
    prices: [
      { name: 1, value: 15187.44 },
      { name: 2, value: 21356.99 },
      { name: 3, value: 34698.98 },
      { name: 4, value: 37587.55 },
      { name: 5, value: 17577.4 },
      { name: 6, value: 26577.4 },
      { name: 7, value: 23577.4 },
      { name: 8, value: 18577.4 },
      { name: 9, value: 28577.4 },
    ],
    lastUpdatedAt: 0,
  },
  {
    id: '1',
    name: 'DISTRICT2',
    symbol: 'D2',
    balance: '0',
    usdBalance: '0',
    logo: TetherImage,
    change: '-1.5%',
    isChangePositive: false,
    color: '#E1F9F1',
    icon: <Tether />,
    prices: [
      { name: 1, value: 12187.44 },
      { name: 2, value: 21356.99 },
      { name: 3, value: 37698.98 },
      { name: 4, value: 39587.55 },
      { name: 5, value: 29577.4 },
      { name: 6, value: 31577.4 },
      { name: 7, value: 47577.4 },
      { name: 8, value: 36577.4 },
      { name: 9, value: 28577.4 },
    ],
    lastUpdatedAt: 0,
  },
  {
    id: '2',
    name: 'DISTRICT3',
    symbol: 'D3',
    balance: '0',
    usdBalance: '0',
    logo: CardanoImage,
    change: '+12.5%',
    isChangePositive: true,
    color: '#DBE3FF',
    icon: <Cardano />,
    prices: [
      { name: 1, value: 25187.44 },
      { name: 2, value: 21356.99 },
      { name: 3, value: 34698.98 },
      { name: 4, value: 37587.55 },
      { name: 5, value: 17577.4 },
      { name: 6, value: 26577.4 },
      { name: 7, value: 23577.4 },
      { name: 8, value: 18577.4 },
      { name: 9, value: 28577.4 },
    ],
    lastUpdatedAt: 0,
  },
  {
    id: '3',
    name: 'DISTRICT4',
    symbol: 'D4',
    balance: '0',
    usdBalance: '0',
    logo: BinanceImage,
    change: '+1.5%',
    isChangePositive: true,
    color: '#FBF5D5',
    icon: <Bnb />,
    prices: [
      { name: 1, value: 15187.44 },
      { name: 2, value: 16356.99 },
      { name: 3, value: 17698.98 },
      { name: 4, value: 37587.55 },
      { name: 5, value: 17577.4 },
      { name: 6, value: 20577.4 },
      { name: 7, value: 29577.4 },
      { name: 8, value: 33577.4 },
      { name: 9, value: 39577.4 },
    ],
    lastUpdatedAt: 0,
  },
];
