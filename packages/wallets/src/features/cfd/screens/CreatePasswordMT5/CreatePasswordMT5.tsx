import React, { useState } from 'react';
import { DerivLightDmt5PasswordIcon } from '@deriv/quill-icons';
import { WalletButton, WalletPasswordFieldLazy, WalletText } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import { THooks, TPlatforms } from '../../../../types';
import { validPassword, validPasswordMT5 } from '../../../../utils/password-validation';
import { CFDPasswordModalTnc } from '../../components/CFDPasswordModalTnc';
import { CFD_PLATFORMS, PlatformDetails, PRODUCT } from '../../constants';
import './CreatePasswordMT5.scss';

type TProps = {
    isLoading?: boolean;
    isVirtual?: boolean;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick: () => void;
    password: string;
    platform: TPlatforms.All;
    product?: THooks.AvailableMT5Accounts['product'];
};

const CreatePasswordMT5: React.FC<TProps> = ({
    isLoading,
    isVirtual,
    onPasswordChange,
    onPrimaryClick,
    password,
    platform,
    product,
}) => {
    const { isDesktop } = useDevice();
    const { title } = PlatformDetails[platform as keyof typeof PlatformDetails];
    const isMT5 = platform === CFD_PLATFORMS.MT5;
    const disableButton = isMT5 ? !validPasswordMT5(password) : !validPassword(password);
    const [checked, setChecked] = useState(!(product === PRODUCT.ZEROSPREAD && !isVirtual));

    return (
        <div className='wallets-create-password-mt5'>
            {isDesktop && (
                <div className='wallets-create-password-mt5__header'>
                    <WalletText lineHeight='xl' weight='bold'>
                        Create a {title} password
                    </WalletText>
                </div>
            )}
            <div className='wallets-create-password-mt5__body'>
                <DerivLightDmt5PasswordIcon height={120} width={120} />
                <WalletText size={isDesktop ? 'sm' : 'md'}>
                    Note: You can use this password for all your {title} accounts.
                </WalletText>
                <WalletPasswordFieldLazy
                    label={`${title} password`}
                    mt5Policy={isMT5}
                    onChange={onPasswordChange}
                    password={password}
                />
                {product === PRODUCT.ZEROSPREAD && !isVirtual && (
                    <CFDPasswordModalTnc
                        checked={checked}
                        onChange={() => setChecked(prev => !prev)}
                        platform={platform}
                        product={product}
                    />
                )}
            </div>

            {isDesktop && (
                <div className='wallets-create-password-mt5__footer'>
                    <WalletButton
                        disabled={!password || isLoading || disableButton || !checked}
                        isLoading={isLoading}
                        onClick={onPrimaryClick}
                        size='lg'
                    >
                        {`Create ${title} password`}
                    </WalletButton>
                </div>
            )}
        </div>
    );
};

export default CreatePasswordMT5;
