import routes from '@/config/routes';
import { HomeIcon } from '@/components/icons/home';
import { FarmIcon } from '@/components/icons/farm';
import { PoolIcon } from '@/components/icons/pool';
import { ProfileIcon } from '@/components/icons/profile';
import { DiskIcon } from '@/components/icons/disk';
import { ExchangeIcon } from '@/components/icons/exchange';
import { VoteIcon } from '@/components/icons/vote-icon';
import { PlusCircle } from '@/components/icons/plus-circle';
import { CompassIcon } from '@/components/icons/compass';

export const menuItems = [
  {
    name: 'Home',
    icon: <HomeIcon />,
    href: routes.home,
  },
  {
    name: 'Explore',
    icon: <CompassIcon />,
    href: routes.search,
  },
  {
    name: 'Long',
    icon: <ExchangeIcon />,
    href: routes.swap,
  },
  {
    name: 'Short',
    icon: <PoolIcon />,
    href: routes.liquidity,
  },
  // {
  //   name: 'Bridge',
  //   icon: <DiskIcon />,
  //   href: routes.bridge,
  // },
];
