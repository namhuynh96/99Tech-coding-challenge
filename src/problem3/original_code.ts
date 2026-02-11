interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}
// Props is empty, it can be writen `type Props = BoxProps`
interface Props extends BoxProps {}
// the props parameters can remove type Props declaration
const WalletPage: React.FC<Props> = (props: Props) => {
  // rest should be destructured and children is not used
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // function getPriority is a pure function, it should stay out of the component
  // the `blockchain` parameter has `any` type, it should has type `string`
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return (
      balances
        // filter should be done out of sortedBalances
        // should not clarify type for the callback parameters, it should be inferred from balances
        .filter((balance: WalletBalance) => {
          //
          const balancePriority = getPriority(balance.blockchain);
          // 2 conditions can be merged into one: balancePriority > -99 && balance.amount <= 0 and lhsPriority cannot be found
          if (lhsPriority > -99) {
            if (balance.amount <= 0) {
              return true;
            }
          }
          return false;
        })
        // should not clarify type for the callback parameters, it should be inferred from balances
        .sort((lhs: WalletBalance, rhs: WalletBalance) => {
          const leftPriority = getPriority(lhs.blockchain);
          const rightPriority = getPriority(rhs.blockchain);
          // can just return leftPriority - rightPriority
          if (leftPriority > rightPriority) {
            return -1;
          } else if (rightPriority > leftPriority) {
            return 1;
          }
        })
    );
    // prices should not stay in the dependencies
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    // can just return {...balance, formatted: balance.amount.toFixed()}
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  // rows needs to use formattedBalances
  const rows = sortedBalances.map(
    // should not clarify type for the callback parameters, it should be inferred from balances
    (balance: FormattedWalletBalance, index: number) => {
      // prices[balance.currency] can be undefined
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          // it's better to have balance.id as key
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  // use specific props instead of ...rest
  return <div {...rest}>{rows}</div>;
};
