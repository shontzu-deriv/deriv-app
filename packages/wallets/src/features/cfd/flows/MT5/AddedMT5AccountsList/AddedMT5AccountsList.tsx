import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useAuthorize, useJurisdictionStatus } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { WalletBadge } from '../../../../../components';
import { InlineMessage, WalletText } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { TradingAccountCard } from '../../../../../components/TradingAccountCard';
import { THooks } from '../../../../../types';
import { getMarketTypeDetails, PlatformDetails } from '../../../constants';
import { MT5TradeModal, VerificationFailedModal } from '../../../modals';
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
    const { title } = getMarketTypeDetails(account.product)[account.market_type ?? 'all'];
    const { show } = useModal();

    return (
        <TradingAccountCard
            disabled={jurisdictionStatus.is_pending}
            leading={
                <div className='wallets-added-mt5__icon'>
                    {getMarketTypeDetails(account.product)[account.market_type || 'all'].icon}
                </div>
            }
            onClick={() => {
                jurisdictionStatus.is_failed
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
            }}
            trailing={
                <div
                    className={classNames('wallets-added-mt5__icon', {
                        'wallets-added-mt5__icon--pending': jurisdictionStatus.is_pending,
                    })}
                >
                    <LabelPairedChevronRightCaptionRegularIcon width={16} />
                </div>
            }
        >
            <div className='wallets-added-mt5__details'>
                <div className='wallets-added-mt5__details-title'>
                    <WalletText size='sm'>{title}</WalletText>
                    {!activeWallet?.is_virtual && (
                        <WalletBadge>{account.landing_company_short?.toUpperCase()}</WalletBadge>
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
                                Pending verification
                            </WalletText>
                        </InlineMessage>
                    </div>
                )}

                {jurisdictionStatus.is_failed && (
                    <div className='wallets-added-mt5__details-badge'>
                        <InlineMessage size='xs' type='error' variant='outlined'>
                            <WalletText color='error' size='2xs' weight='bold'>
                                Verification failed.{' '}
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
                                    Why?
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
