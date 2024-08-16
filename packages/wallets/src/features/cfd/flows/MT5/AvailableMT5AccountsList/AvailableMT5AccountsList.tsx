import React, { useCallback, useEffect, useState } from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { TradingAccountCard, WalletText } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import { THooks } from '../../../../../types';
import { getMarketTypeDetails, PRODUCT } from '../../../constants';
import { JurisdictionModal, MT5PasswordModal } from '../../../modals';
import { ClientVerification } from '../../ClientVerification';
import './AvailableMT5AccountsList.scss';

type TProps = {
    account: THooks.AvailableMT5Accounts;
};

const AvailableMT5AccountsList: React.FC<TProps> = ({ account }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { setModalState, show } = useModal();
    const { description, title } = getMarketTypeDetails(account.product)[account.market_type || 'all'];
    const [showMt5PasswordModal, setShowMt5PasswordModal] = useState(false);

    const onButtonClick = useCallback(() => {
        if (activeWallet?.is_virtual) {
            show(
                <MT5PasswordModal
                    marketType={account?.market_type || 'synthetic'}
                    platform={account.platform}
                    product={account.product}
                />
            );
        } else if (account.product === PRODUCT.ZEROSPREAD) {
            show(
                <ClientVerification
                    onCompletion={() => {
                        setShowMt5PasswordModal(true);
                    }}
                    selectedJurisdiction={account.shortcode}
                />
            );
        } else {
            show(<JurisdictionModal />);
        }
        setModalState('marketType', account.market_type);
        setModalState('selectedJurisdiction', account.shortcode);
    }, [
        activeWallet?.is_virtual,
        show,
        account.market_type,
        account.platform,
        setModalState,
        account.product,
        account?.shortcode,
    ]);

    useEffect(() => {
        if (showMt5PasswordModal) {
            show(
                <MT5PasswordModal
                    isVirtual={activeWallet?.is_virtual}
                    marketType={account?.market_type || 'all'}
                    platform={account.platform}
                    product={account.product}
                />
            );
        }
    }, [showMt5PasswordModal]);

    return (
        <TradingAccountCard
            leading={
                <div className='wallets-available-mt5__icon'>
                    {getMarketTypeDetails(account.product)[account.market_type || 'all'].icon}
                </div>
            }
            onClick={onButtonClick}
            trailing={
                <div className='wallets-available-mt5__icon'>
                    <LabelPairedChevronRightCaptionRegularIcon width={16} />
                </div>
            }
        >
            <div className='wallets-available-mt5__details'>
                <div className='wallets-available-mt5__title'>
                    <WalletText size='sm'>{title}</WalletText>
                    {account.product === PRODUCT.ZEROSPREAD && (
                        <div className='wallets-available-mt5__badge'>
                            <WalletText size='xs' weight='bold'>
                                NEW
                            </WalletText>
                        </div>
                    )}
                </div>
                <WalletText size='xs'>{description}</WalletText>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableMT5AccountsList;
