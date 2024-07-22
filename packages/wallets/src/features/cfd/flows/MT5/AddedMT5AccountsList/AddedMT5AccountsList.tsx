import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useAuthorize, useJurisdictionStatus, useTradingPlatformStatus } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon, LegacyWarningIcon } from '@deriv/quill-icons';
import { Badge } from '@deriv-com/ui';
import { InlineMessage, WalletText } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { TradingAccountCard } from '../../../../../components/TradingAccountCard';
import useDevice from '../../../../../hooks/useDevice';
import { THooks } from '../../../../../types';
import { MarketTypeDetails, PlatformDetails } from '../../../constants';
import {
    AccountUnavailableModal,
    MT5TradeModal,
    ServerMaintenanceModal,
    VerificationFailedModal,
} from '../../../modals';
import './AddedMT5AccountsList.scss';

type TProps = {
    account: THooks.MT5AccountsList;
};

const AddedMT5AccountsList: React.FC<TProps> = ({ account }) => {
    const { data: activeWallet } = useAuthorize();
    const { getVerificationStatus } = useJurisdictionStatus();
    const jurisdictionStatus = useMemo(
        () => getVerificationStatus(account.landing_company_short || 'svg', account.status),
        [account.landing_company_short, account.status, getVerificationStatus]
    );
    const { title } = MarketTypeDetails[account.market_type ?? 'all'];
    const { isMobile } = useDevice();
    const { show } = useModal();
    const { t } = useTranslation();

    const { data: tradingPlatformStatus } = useTradingPlatformStatus();
    const platformStatus = tradingPlatformStatus?.find(
        (status: { platform: string; status: string }) => status.platform === account.platform
    )?.status;

    const hasPlatformStatus = account.status === 'unavailable' || platformStatus === 'maintenance';

    const getBadgeText = () => {
        if (account.status === 'unavailable') return t('Account unavailable');
        if (platformStatus === 'maintenance') return t('Server maintenance');
        return '';
    };

    return (
        <TradingAccountCard
            disabled={jurisdictionStatus.is_pending}
            leading={
                <div className='wallets-added-mt5__icon'>{MarketTypeDetails[account.market_type || 'all'].icon}</div>
            }
            onClick={() => {
                if (platformStatus === 'maintenance') return show(<ServerMaintenanceModal />);
                if (account.status === 'unavailable') return show(<AccountUnavailableModal />);
                if (platformStatus === 'active') {
                    return jurisdictionStatus.is_failed
                        ? show(<VerificationFailedModal selectedJurisdiction={account.landing_company_short} />, {
                              defaultRootId: 'wallets_modal_root',
                          })
                        : show(
                              <MT5TradeModal
                                  marketType={account.market_type ?? 'all'}
                                  mt5Account={account}
                                  platform={PlatformDetails.mt5.platform}
                              />
                          );
                }
            }}
            trailing={
                <div
                    className={classNames('wallets-added-mt5__icon', {
                        'wallets-added-mt5__icon--pending': jurisdictionStatus.is_pending,
                    })}
                >
                    {hasPlatformStatus ? (
                        <Badge
                            badgeSize='xs'
                            color='warning'
                            isBold
                            leftIcon={<LegacyWarningIcon iconSize='xs' />}
                            padding='tight'
                            rounded='sm'
                            variant='bordered'
                        >
                            {getBadgeText()}
                        </Badge>
                    ) : (
                        <div className='wallets-available-mt5__icon'>
                            <LabelPairedChevronRightCaptionRegularIcon width={16} />
                        </div>
                    )}
                </div>
            }
        >
            <div className='wallets-added-mt5__details'>
                <div className='wallets-added-mt5__details-title'>
                    <WalletText size='sm'>{title}</WalletText>
                    {!activeWallet?.is_virtual && (
                        <div className='wallets-added-mt5__details-title-landing-company'>
                            <WalletText color='black' size={isMobile ? 'sm' : 'xs'}>
                                {account.landing_company_short?.toUpperCase()}
                            </WalletText>
                        </div>
                    )}
                </div>
                {!(jurisdictionStatus.is_failed || jurisdictionStatus.is_pending) && (
                    <WalletText size='sm' weight='bold'>
                        {account.display_balance}
                    </WalletText>
                )}

                <WalletText as='p' size='xs'>
                    {account.display_login}
                </WalletText>
                {jurisdictionStatus.is_pending && (
                    <div className='wallets-added-mt5__details-badge'>
                        <InlineMessage size='xs' type='warning' variant='outlined'>
                            <WalletText color='warning' size='2xs' weight='bold'>
                                {t('Pending verification')}
                            </WalletText>
                        </InlineMessage>
                    </div>
                )}

                {jurisdictionStatus.is_failed && (
                    <div className='wallets-added-mt5__details-badge'>
                        <InlineMessage size='xs' type='error' variant='outlined'>
                            <WalletText color='error' size='2xs' weight='bold'>
                                {t('Verification failed.')}
                                <a
                                    onClick={() =>
                                        show(
                                            <VerificationFailedModal
                                                selectedJurisdiction={account.landing_company_short}
                                            />,
                                            {
                                                defaultRootId: 'wallets_modal_root',
                                            }
                                        )
                                    }
                                >
                                    {t('Why?')}
                                </a>
                            </WalletText>
                        </InlineMessage>
                    </div>
                )}
            </div>
        </TradingAccountCard>
    );
};

export default AddedMT5AccountsList;
