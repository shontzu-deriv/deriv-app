import React, { FC } from 'react';
import { THooks } from 'src/types';
import {
    LabelPairedChevronRightLgFillIcon,
    StandaloneLaptopRegularIcon,
    StandaloneMobileNotchRegularIcon,
} from '@deriv/quill-icons';
import { WalletText } from '../../../../../components/Base';
import { getDeeplinkUrl, getMobileAppInstallerUrl, getWebtraderUrl } from './constants';
import { mobileOSDetectAsync } from './mobileOsDetect';
import './mt5-mobile-redirect-option.scss';

type TMT5MobileRedirectOptionProps = {
    mt5TradeAccount: THooks.MT5AccountsList;
};

const MT5MobileRedirectOption: FC<TMT5MobileRedirectOptionProps> = ({ mt5TradeAccount }) => {
    const mobileURLSet = async () => {
        window.location.replace(getDeeplinkUrl({ mt5TradeAccount }));
        const mobileAppURL = await getMobileAppInstallerUrl({ mt5TradeAccount });
        const os = await mobileOSDetectAsync();
        const timeout = setTimeout(() => {
            mobileAppURL && window.location.replace(mobileAppURL);
        }, 1500);

        const isSafariBrowser = () => {
            return false;
        };

        if (!isSafariBrowser() || (os === 'iOS' && /Version\/17/.test(navigator.userAgent))) {
            window.onblur = () => {
                clearTimeout(timeout);
            };
        }
    };

    return (
        <div className='wallets-mobile-redirect-option'>
            <a
                className='wallets-mobile-redirect-option__button'
                href={getWebtraderUrl({ mt5TradeAccount })}
                rel='noopener noreferrer'
                target='_blank'
            >
                <StandaloneLaptopRegularIcon />
                <div className='wallets-mobile-redirect-option__button__content'>
                    <WalletText align='left' size='xs' weight='bold'>
                        MetaTrader5 web terminal
                    </WalletText>
                </div>
                <LabelPairedChevronRightLgFillIcon />
            </a>
            <button
                className='wallets-mobile-redirect-option__button wallets-mobile-redirect-option__button--blue'
                onClick={mobileURLSet}
            >
                <StandaloneMobileNotchRegularIcon fill='#FFF' />
                <div className='wallets-mobile-redirect-option__button__content'>
                    <WalletText align='left' color='white' size='xs' weight='bold'>
                        Trade with MT5 mobile app
                    </WalletText>
                </div>
                <LabelPairedChevronRightLgFillIcon fill='#FFF' />
            </button>
            <WalletText as='p' size='xs'>
                Note: Don&apos;t have the MT5 app? Tap the
                <span style={{ fontWeight: 'bold' }}> Trade with MT5 mobile app</span> WalletButton to download. Once
                you have installed the app, return to this screen and hit the same button to log in.
            </WalletText>
        </div>
    );
};

export default MT5MobileRedirectOption;
