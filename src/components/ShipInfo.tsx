interface ShipInfoProps {
  ship?: string;
}

export const ShipInfo = (props: ShipInfoProps) => {
  return <>{props.ship}</>;
};
