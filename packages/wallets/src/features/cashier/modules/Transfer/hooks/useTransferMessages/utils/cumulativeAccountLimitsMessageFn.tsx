import React from 'react';
import { Localize } from '@deriv-com/translations';
import { TMessageFnProps, TTransferMessage } from '../../../types';

let message: TTransferMessage['message'];

const cumulativeAccountLimitsMessageFn = ({
    activeWallet,
    activeWalletExchangeRates,
    displayMoney,
    limits,
    sourceAccount,
    sourceAmount,
    targetAccount,
}: TMessageFnProps) => {
    if (!targetAccount) return null;

    const isTransferBetweenWallets =
        sourceAccount.account_category === 'wallet' && targetAccount.account_category === 'wallet';

    const isDemoTransfer = activeWallet?.is_virtual;

    const keyAccountType =
        [sourceAccount, targetAccount].find(acc => acc.account_category !== 'wallet')?.account_type ?? 'internal';

    const platformKey = keyAccountType === 'standard' ? 'dtrade' : keyAccountType;

    const allowedSumUSD = isDemoTransfer
        ? //@ts-expect-error needs backend type
          Number(limits?.daily_cumulative_amount_transfers?.virtual?.allowed)
        : //@ts-expect-error needs backend type
          Number(limits?.daily_cumulative_amount_transfers?.[platformKey]?.allowed);

    const availableSumUSD = isDemoTransfer
        ? //@ts-expect-error needs backend type
          Number(limits?.daily_cumulative_amount_transfers?.virtual?.available)
        : //@ts-expect-error needs backend type
          Number(limits?.daily_cumulative_amount_transfers?.[platformKey]?.available);

    if (
        !sourceAccount.currency ||
        !targetAccount.currency ||
        !sourceAccount.currencyConfig ||
        !targetAccount.currencyConfig ||
        (allowedSumUSD !== 0 && !allowedSumUSD) ||
        (availableSumUSD !== 0 && !availableSumUSD)
    )
        return null;

    const formattedDemoLimit = displayMoney?.(
        availableSumUSD,
        sourceAccount.currencyConfig.display_code,
        sourceAccount.currencyConfig.fractional_digits
    );

    if (isDemoTransfer) {
        if (sourceAmount && allowedSumUSD === availableSumUSD) {
            message = (
                <Localize
                    i18n_default_text='Your daily transfer limit for virtual funds is {{formattedDemoLimit}}'
                    values={{ formattedDemoLimit }}
                />
            );

            return {
                message,
                type: 'success' as const,
            };
        }

        message = (
            <Localize
                i18n_default_text='Your remaining daily transfer limit for virtual funds is {{formattedDemoLimit}}.'
                values={{ formattedDemoLimit }}
            />
        );

        return {
            message,
            type: 'success' as const,
        };
    }

    // separated the exchangeRates check to prevent checking for demo transfer
    if (
        (sourceAccount.currency !== activeWallet.currency &&
            !activeWalletExchangeRates?.rates?.[sourceAccount.currency]) ||
        (targetAccount.currency !== activeWallet.currency &&
            !activeWalletExchangeRates?.rates?.[targetAccount.currency])
    )
        return null;

    const USDToSourceRate =
        activeWallet.currency === sourceAccount.currency
            ? 1 / (activeWalletExchangeRates?.rates?.USD ?? 1)
            : // if the source ("from") account is not the active wallet,
              // compute USD -> sourceCurrency rate as activeWalletCurrency -> sourceCurrency rate,
              // divided by activeWalletCurrency -> USD rate
              (activeWalletExchangeRates?.rates?.[sourceAccount.currency] ?? 1) /
              (activeWalletExchangeRates?.rates?.USD ?? 1);

    const sourceCurrencyLimit = allowedSumUSD * USDToSourceRate;
    const sourceCurrencyRemainder = Number(
        (availableSumUSD * USDToSourceRate).toFixed(sourceAccount.currencyConfig.fractional_digits)
    );

    const formattedSourceCurrencyLimit = displayMoney?.(
        sourceCurrencyLimit,
        sourceAccount.currencyConfig.display_code,
        sourceAccount.currencyConfig.fractional_digits
    );

    const formattedSourceCurrencyRemainder = displayMoney?.(
        sourceCurrencyRemainder,
        sourceAccount.currencyConfig.display_code,
        sourceAccount.currencyConfig.fractional_digits
    );

    if (availableSumUSD === 0) {
        message = isTransferBetweenWallets ? (
            <Localize
                i18n_default_text='You have reached your daily transfer limit of {{formattedSourceCurrencyLimit}} between your Wallets. The limit will reset at 00:00 GMT.'
                values={{ formattedSourceCurrencyLimit }}
            />
        ) : (
            <Localize
                i18n_default_text='You have reached your daily transfer limit of {{formattedSourceCurrencyLimit}} between your {{sourceAccountName}} and {{targetAccountName}}. The limit will reset at 00:00 GMT.'
                values={{
                    formattedSourceCurrencyLimit,
                    sourceAccountName: sourceAccount.accountName,
                    targetAccountName: targetAccount.accountName,
                }}
            />
        );

        return {
            message,
            type: 'error' as const,
        };
    }

    if (sourceAmount && allowedSumUSD === availableSumUSD) {
        message = isTransferBetweenWallets ? (
            <Localize
                i18n_default_text='The daily transfer limit between your Wallets is {{formattedSourceCurrencyLimit}}.'
                values={{ formattedSourceCurrencyLimit }}
            />
        ) : (
            <Localize
                i18n_default_text='The daily transfer limit between your {{sourceAccountName}} and {{targetAccountName}} is {{formattedSourceCurrencyLimit}}.'
                values={{
                    formattedSourceCurrencyLimit,
                    sourceAccountName: sourceAccount.accountName,
                    targetAccountName: targetAccount.accountName,
                }}
            />
        );

        return {
            message,
            type: sourceAmount > sourceCurrencyRemainder ? ('error' as const) : ('success' as const),
        };
    }

    if (sourceAmount && sourceCurrencyRemainder - sourceAmount <= 1000) {
        message = isTransferBetweenWallets ? (
            <Localize
                i18n_default_text='The remaining daily transfer limit between your Wallets is {{formattedSourceCurrencyRemainder}}.'
                values={{ formattedSourceCurrencyRemainder }}
            />
        ) : (
            <Localize
                i18n_default_text='The remaining daily transfer limit between your {{sourceAccountName}} and {{targetAccountName}} is {{formattedSourceCurrencyRemainder}}.'
                values={{
                    formattedSourceCurrencyRemainder,
                    sourceAccountName: sourceAccount.accountName,
                    targetAccountName: targetAccount.accountName,
                }}
            />
        );

        return {
            message,
            type: sourceAmount > sourceCurrencyRemainder ? ('error' as const) : ('success' as const),
        };
    }

    return null;
};

export default cumulativeAccountLimitsMessageFn;
