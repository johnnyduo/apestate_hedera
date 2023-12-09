import PolygonImg from '@/assets/images/coin/matic.svg';

export function Polygon(props: React.SVGAttributes<{}>) {
  return (
    <img
      src={PolygonImg.src}
      style={{ width: 24, height: 24 }}
      {...props}
    ></img>
  );
}
