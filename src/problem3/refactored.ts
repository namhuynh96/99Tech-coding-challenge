interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

type Props = BoxProps;

const WalletPage: React.FC<Props> = () => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const filteredBalances = balances.filter((balance) => {
    const balancePriority = getPriority(balance.blockchain);
    if (balancePriority > -99 && balance.amount <= 0) {
      return true;
    }
    return false;
  });

  const sortedBalances = filteredBalances.sort(
    (lhs, rhs) => getPriority(lhs.blockchain) - getPriority(rhs.blockchain)
  );

  const formattedBalances = sortedBalances.map((balance) => ({
    ...balance,
    formatted: balance.amount.toFixed(),
  }));

  const rows = formattedBalances.map((balance, index) => {
    const usdValue = prices[balance.currency]
      ? prices[balance.currency] * balance.amount
      : undefined;
    return (
      <WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return <div>{rows}</div>;
};

function getPriority(blockchain: string): number {
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
}
