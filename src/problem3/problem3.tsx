interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string; // Fix: Added missing blockchain property
}

interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
}

interface Props extends BoxProps { }

// Refactor: Move static function outside the component
const getPriority = (blockchain: string): number => {
    switch (blockchain) {
        case 'Osmosis':
            return 100;
        case 'Ethereum':
            return 50;
        case 'Arbitrum':
            return 30;
        case 'Zilliqa':
        case 'Neo':
            return 20;
        default:
            return -99;
    }
};

const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    // Mocking the hooks for now so types don't complain entirely
    const balances: WalletBalance[] = useWalletBalances();
    const prices = usePrices();

    const sortedBalances = useMemo(() => {
        return balances
            .filter((balance: WalletBalance) => {
                const balancePriority = getPriority(balance.blockchain);
                // Fix: `lhsPriority` was undefined. Use `balancePriority`.
                // Fix: Changed logic to > 0 instead of <= 0, assuming we want to display balances with funds.
                return balancePriority > -99 && balance.amount > 0;
            })
            .sort((lhs: WalletBalance, rhs: WalletBalance) => {
                const leftPriority = getPriority(lhs.blockchain);
                const rightPriority = getPriority(rhs.blockchain);
                // Fix: Handled all cases, simpler logic
                return rightPriority - leftPriority;
            });
    }, [balances]); // Fix: Removed 'prices' dependency from useMemo

    const rows = sortedBalances.map((balance: WalletBalance) => {
        // Fix: prices[balance.currency] might be undefined. Provide a fallback.
        const usdValue = (prices[balance.currency] || 0) * balance.amount;

        // Fix: Formatted strings should be generated here directly inside the iteration to avoid mapping multiple times.
        const formattedAmount = balance.amount.toFixed(6); // e.g. 6 decimal points

        return (
            <WalletRow
                className={classes.row} // Assuming this comes from a global styles context/import
                key={balance.currency} // Fix: Anti-pattern to use index as keys; Use unique ID.
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={formattedAmount}
            />
        );
    });

    return (
        <div {...rest}>
            {rows}
        </div>
    );
};

export default WalletPage;