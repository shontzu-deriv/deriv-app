import React from 'react';
import classNames from 'classnames';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { Button, Icon, StaticUrl, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getMobileAppInstallerURL } from '../Helpers/constants';
import './mt5-mobile-redirect-option.scss';

type TMT5MobileRedirectOptionProps = {
    mt5_trade_account: DetailsOfEachMT5Loginid;
};
const MT5MobileRedirectOption = ({ mt5_trade_account }: TMT5MobileRedirectOptionProps) => {
    const isSafari = () => {
        return typeof window.safari !== 'undefined';
    };

    const mobileURLSet = () => {
        let deep_link = `metatrader5://account?login=${mt5_trade_account?.login}&server=${mt5_trade_account?.server_info?.environment}`;

        window.location.replace(deep_link);

        const timeout = setTimeout(() => {
            deep_link = getMobileAppInstallerURL();
        }, 3000);
        if (!isSafari()) {
            window.onblur = () => {
                clearTimeout(timeout);
            };
        }
        return deep_link;
    };

    return (
        <div className='mt5-download-container'>
            <a
                className={classNames('mt5-download-container--option')}
                href={`${mt5_trade_account.webtrader_url}&login=${mt5_trade_account?.login}&server=${mt5_trade_account?.server_info?.environment}`}
                target='_blank'
                rel='noopener noreferrer'
            >
                <div className='center'>
                    <Icon icon={'IcDesktopOutline'} size={16} />
                    <Text as='p' align='left' size='xxs' weight='bold' className='title'>
                        <Localize i18n_default_text={'MetaTrader5 web terminal'} />
                    </Text>
                    <Icon icon={'IcChevronRight'} size={16} />
                </div>
            </a>
            <Button
                className={classNames('mt5-download-container--option blue')}
                classNameSpan='mt5-download-container--span'
                onClick={() => mobileURLSet()}
            >
                <div className='center'>
                    <Icon icon={'IcMobileOutline'} size={16} />
                    <Text as='p' align='left' size='xxs' weight='bold' className='title'>
                        <Localize i18n_default_text={'Trade with MT5 mobile app'} />
                    </Text>
                    <Icon icon={'IcChevronRightLight'} size={16} />
                </div>
            </Button>

            <Text as='p' size='xxxs'>
                <Localize
                    i18n_default_text="Note: Don't have the MT5 app? Tap the <0>Trade with MT5 mobile app</0> button to download. Once you have
                installed the app, return to this screen and hit the same button to log in."
                    components={[<strong key={0} />]}
                />
            </Text>

            <Text as='p' align='center' size='xxs'>
                <Localize
                    i18n_default_text='For MT5 login issues, visit our <0>Help Centre</0>.'
                    components={[
                        <StaticUrl
                            key={0}
                            className='help-center-link'
                            href='/help-centre/dmt5/#log-in-to-my-Deriv-MT5-account'
                        />,
                    ]}
                />
            </Text>
        </div>
    );
};

export default MT5MobileRedirectOption;
