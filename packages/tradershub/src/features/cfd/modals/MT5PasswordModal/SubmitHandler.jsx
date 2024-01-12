import { Category, MarketType, PlatformDetails } from '../../constants';
import { Jurisdiction } from '../../screens/CFDCompareAccounts/constants';

export const submitHandler = async (
    isMT5PasswordNotSet,
    tradingPasswordChange,
    password,
    marketType,
    activeTrading,
    mutate,
    settings,
    selectedJurisdiction,
    availableMT5Accounts
) => {
    const accountType = marketType === MarketType.SYNTHETIC ? 'gaming' : marketType;

    // in order to create account, we need to set a password through trading_platform_password_change endpoint first
    // then only mt5_create_account can be called, otherwise it will response an error for password required
    if (isMT5PasswordNotSet) {
        await tradingPasswordChange({
            new_password: password,
            platform: PlatformDetails.mt5.platform,
        });
    }

    const categoryAccountType = activeTrading?.is_virtual ? Category.DEMO : accountType;

    mutate({
        payload: {
            account_type: categoryAccountType,
            address: settings?.address_line_1 ?? '',
            city: settings?.address_city ?? '',
            company: selectedJurisdiction,
            country: settings?.country_code ?? '',
            email: settings?.email ?? '',
            leverage: availableMT5Accounts?.find(acc => acc.market_type === marketType)?.leverage ?? 500,
            mainPassword: password,
            ...(marketType === MarketType.FINANCIAL && { mt5_account_type: MarketType.FINANCIAL }),
            ...(selectedJurisdiction &&
                (selectedJurisdiction !== Jurisdiction.LABUAN
                    ? {
                          account_type: categoryAccountType,
                          ...(selectedJurisdiction === MarketType.FINANCIAL && {
                              mt5_account_type: MarketType.FINANCIAL,
                          }),
                      }
                    : {
                          account_type: MarketType.FINANCIAL,
                          mt5_account_type: 'financial_stp',
                      })),
            ...(marketType === MarketType.ALL && { sub_account_category: 'swap_free' }),
            name: settings?.first_name ?? '',
            phone: settings?.phone ?? '',
            state: settings?.address_state ?? '',
            zipCode: settings?.address_postcode ?? '',
        },
    });
};
