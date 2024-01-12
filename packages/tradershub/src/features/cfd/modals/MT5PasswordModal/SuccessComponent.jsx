import React, { useMemo } from 'react';
import { Category } from '../../constants';
import { CFDSuccess } from '../../screens';
import SuccessButton from './renderSuccessButton';

const SuccessComponent = ({
    activeTrading,
    hide,
    isDemo,
    isSuccess,
    landingCompanyName,
    marketType,
    marketTypeTitle,
    mt5Accounts,
    selectedJurisdiction,
}) => {
    return useMemo(() => {
        const renderSuccessDescription = () => {
            return isDemo
                ? `Let's practise trading with ${activeTrading?.display_balance} virtual funds.`
                : `Transfer funds from your ${activeTrading?.currency} Wallet to your ${marketTypeTitle} ${landingCompanyName} account to start trading.`;
        };

        if (isSuccess) {
            return (
                <CFDSuccess
                    description={renderSuccessDescription()}
                    displayBalance={
                        mt5Accounts?.find(account => account.market_type === marketType)?.display_balance ?? '0.00'
                    }
                    landingCompany={selectedJurisdiction}
                    marketType={marketType}
                    platform='mt5'
                    renderButtons={() => <SuccessButton hide={hide} isDemo={isDemo} />}
                    title={`Your ${marketTypeTitle} ${isDemo ? Category.DEMO : landingCompanyName} account is ready`}
                />
            );
        }
        return <h1>{isSuccess}</h1>;
    }, [
        isSuccess,
        isDemo,
        activeTrading?.currency,
        activeTrading?.display_balance,
        marketTypeTitle,
        landingCompanyName,
        mt5Accounts,
        selectedJurisdiction,
        marketType,
        hide,
    ]);
};

export default SuccessComponent;
