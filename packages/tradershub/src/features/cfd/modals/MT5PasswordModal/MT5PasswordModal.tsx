import React, { useCallback, useMemo, useState } from 'react';
import {
    useAccountStatus,
    useActiveTradingAccount,
    useAvailableMT5Accounts,
    useCreateMT5Account,
    useMT5AccountsList,
    useSettings,
    useTradingPlatformPasswordChange,
} from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button, useBreakpoint } from '@deriv/quill-design';
import { ActionScreen, ButtonGroup, Dialog, Modal, SentEmailContent } from '../../../../components';
import MT5PasswordIcon from '../../../../public/images/ic-mt5-password.svg';
import { TMarketTypes, TPlatforms } from '../../../../types';
import { validPassword } from '../../../../utils/password';
import {
    Category,
    companyNamesAndUrls,
    MarketType,
    MarketTypeDetails,
    PlatformDetails,
    QueryStatus,
} from '../../constants';
import { CFDSuccess, CreatePassword, EnterPassword } from '../../screens';
// import { Jurisdiction } from '../../screens/CFDCompareAccounts/constants';
import SuccessButton from './renderSuccessButton';
import { submitHandler } from './SubmitHandler';

type TMT5PasswordModalProps = {
    marketType: TMarketTypes.SortedMT5Accounts;
    platform: TPlatforms.All;
};

const MT5PasswordModal = ({ marketType, platform }: TMT5PasswordModalProps) => {
    const [password, setPassword] = useState('');
    const { error, isLoading: createMT5AccountLoading, isSuccess, mutate, status } = useCreateMT5Account();
    const { isLoading: tradingPlatformPasswordChangeLoading, mutateAsync: tradingPasswordChange } =
        useTradingPlatformPasswordChange();
    const { data: accountStatus } = useAccountStatus();
    const { data: activeTrading } = useActiveTradingAccount();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { data: availableMT5Accounts } = useAvailableMT5Accounts();
    const { data: settings } = useSettings();
    const { getCFDState } = Provider.useCFDContext();
    const { hide, show } = Provider.useModal();
    const { isMobile } = useBreakpoint();

    const isMT5PasswordNotSet = accountStatus?.is_mt5_password_not_set;

    const hasMT5Account = mt5Accounts?.find(account => account.login);
    const isDemo = activeTrading?.is_virtual;
    const marketTypeTitle =
        marketType === MarketType.ALL && Object.keys(PlatformDetails).includes(platform)
            ? PlatformDetails[platform].title
            : MarketTypeDetails[marketType].title;
    const selectedJurisdiction = getCFDState('selectedJurisdiction');

    const landingCompanyName = `(${
        companyNamesAndUrls?.[selectedJurisdiction as keyof typeof companyNamesAndUrls]?.shortcode
    })`;

    const renderTitle = useCallback(() => {
        if (isSuccess) {
            return ' ';
        }
        return `${hasMT5Account ? 'Add' : 'Create'} a ${isDemo ? Category.DEMO : Category.REAL} ${
            PlatformDetails.mt5.title
        } account`;
    }, [hasMT5Account, isDemo, isSuccess]);

    const submitHandlerProps = useMemo(
        () => ({
            activeTrading,
            availableMT5Accounts,
            isMT5PasswordNotSet,
            marketType,
            mutate,
            password,
            selectedJurisdiction,
            settings,
            tradingPasswordChange,
        }),
        [
            activeTrading,
            availableMT5Accounts,
            isMT5PasswordNotSet,
            marketType,
            mutate,
            password,
            selectedJurisdiction,
            settings,
            tradingPasswordChange,
        ]
    );
    const renderFooter = useCallback(() => {
        if (isSuccess) return <SuccessButton hide={hide} isDemo={isDemo} />;
        if (hasMT5Account)
            return (
                <ButtonGroup className='w-full'>
                    <Button
                        fullWidth
                        onClick={() => {
                            show(
                                <Modal>
                                    <Modal.Header title="We've sent you an email" />
                                    <Modal.Content>
                                        <SentEmailContent platform={platform} />
                                    </Modal.Content>
                                </Modal>
                            );
                        }}
                        size='lg'
                        variant='secondary'
                    >
                        Forgot password?
                    </Button>
                    <Button
                        disabled={!password || createMT5AccountLoading || tradingPlatformPasswordChangeLoading}
                        fullWidth
                        isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                        onClick={() => submitHandler(submitHandlerProps)}
                        size='lg'
                    >
                        Add account
                    </Button>
                </ButtonGroup>
            );
        return (
            <Button
                disabled={
                    !password ||
                    createMT5AccountLoading ||
                    tradingPlatformPasswordChangeLoading ||
                    !validPassword(password)
                }
                fullWidth
                isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                onClick={() => submitHandler(submitHandlerProps)}
                size='lg'
            >
                Create Deriv MT5 password
            </Button>
        );
    }, [
        isSuccess,
        hide,
        isDemo,
        hasMT5Account,
        password,
        createMT5AccountLoading,
        tradingPlatformPasswordChangeLoading,
        show,
        platform,
        submitHandlerProps,
    ]);

    const successComponent = useMemo(() => {
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

    const passwordComponent = useMemo(() => {
        if (!isSuccess) {
            return isMT5PasswordNotSet ? (
                <CreatePassword
                    icon={<MT5PasswordIcon />}
                    isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                    onPasswordChange={e => setPassword(e.target.value)}
                    onPrimaryClick={() => submitHandler(submitHandlerProps)}
                    password={password}
                    platform={PlatformDetails.mt5.platform}
                />
            ) : (
                <EnterPassword
                    isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                    marketType={marketType}
                    onPasswordChange={e => setPassword(e.target.value)}
                    onPrimaryClick={() => submitHandler(submitHandlerProps)}
                    onSecondaryClick={() => show(<SentEmailContent platform={platform} />)}
                    password={password}
                    passwordError={error?.error?.code === 'PasswordError'}
                    platform={PlatformDetails.mt5.platform}
                />
            );
        }
    }, [
        isSuccess,
        isMT5PasswordNotSet,
        tradingPlatformPasswordChangeLoading,
        createMT5AccountLoading,
        password,
        marketType,
        error?.error?.code,
        submitHandlerProps,
        show,
        platform,
    ]);

    if (status === QueryStatus.ERROR && error?.error?.code !== 'PasswordError') {
        return <ActionScreen description={error?.error.message} title={error?.error?.code} />;
    }

    if (isMobile) {
        return (
            <Modal>
                <Modal.Header title={renderTitle()} />
                <Modal.Content>
                    {successComponent}
                    {passwordComponent}
                </Modal.Content>
                <Modal.Footer>{renderFooter()}</Modal.Footer>
            </Modal>
        );
    }

    return (
        <Dialog>
            <Dialog.Header />
            <Dialog.Content>
                {successComponent}
                {passwordComponent}
            </Dialog.Content>
        </Dialog>
    );
};

export default MT5PasswordModal;
