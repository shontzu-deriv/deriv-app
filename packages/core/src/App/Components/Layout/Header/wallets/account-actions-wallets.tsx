import React from 'react';
import { useHistory } from 'react-router';
import { routes, isTabletOs } from '@deriv/shared';
import { Button, Icon, Popover } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { localize, Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { LoginButton } from '../login-button.jsx';
import { SignupButton } from '../signup-button.jsx';
import ToggleNotifications from '../toggle-notifications.jsx';
import AccountInfoWallets from './account-info-wallets';
import { useIsHubRedirectionEnabled, useAccountSettingsRedirect } from '@deriv/hooks';
import 'Sass/app/_common/components/account-switcher.scss';

const AccountActionsWallets = observer(() => {
    const { client, ui, notifications } = useStore();
    const { is_logged_in, accounts, loginid, has_wallet } = client;
    const { openRealAccountSignup, toggleAccountsDialog, is_accounts_switcher_on } = ui;
    const { isDesktop } = useDevice();
    const { isHubRedirectionEnabled } = useIsHubRedirectionEnabled();
    const { redirect_url } = useAccountSettingsRedirect();
    const { is_notifications_visible, notifications: notificationsArray, toggleNotificationsModal } = notifications;

    const notifications_count = notificationsArray?.length;

    const active_account = accounts?.[loginid ?? ''];
    const is_virtual = active_account?.is_virtual;
    const currency = active_account?.currency;

    const history = useHistory();

    const handleManageFundsRedirect = () => {
        if (isHubRedirectionEnabled) {
            const PRODUCTION_REDIRECT_URL = 'https://hub.deriv.com/tradershub';
            const STAGING_REDIRECT_URL = 'https://staging-hub.deriv.com/tradershub';
            const redirectUrl = process.env.NODE_ENV === 'production' ? PRODUCTION_REDIRECT_URL : STAGING_REDIRECT_URL;

            const url_query_string = window.location.search;
            const url_params = new URLSearchParams(url_query_string);
            const account_currency = window.sessionStorage.getItem('account') || url_params.get('account');

            window.location.href = `${redirectUrl}/redirect?action=redirect_to&redirect_to=wallet${account_currency ? `&account=${account_currency}` : ''}`;
        } else {
            history.push(routes.wallets_transfer as unknown as Parameters<typeof history.push>[0], {
                toAccountLoginId: loginid,
            });
        }
    };

    const accountSettings = (
        <a className='account-settings-toggle' href={redirect_url}>
            <Icon icon='IcUserOutline' />
        </a>
    );

    if (!is_logged_in) {
        return (
            <React.Fragment>
                <LoginButton className='acc-info__button' />
                <SignupButton className='acc-info__button' />
            </React.Fragment>
        );
    }
    if (!isDesktop) {
        return (
            <React.Fragment>
                <AccountInfoWallets is_dialog_on={is_accounts_switcher_on} toggleDialog={toggleAccountsDialog} />
                {!(isHubRedirectionEnabled && has_wallet) && (
                    <div className='acc-info__wallets-notification-icon'>
                        <ToggleNotifications
                            count={notifications_count}
                            is_visible={is_notifications_visible}
                            toggleDialog={toggleNotificationsModal}
                            tooltip_message={undefined}
                        />
                    </div>
                )}
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            {!(isHubRedirectionEnabled && has_wallet) && (
                <ToggleNotifications
                    count={notifications_count}
                    is_visible={is_notifications_visible}
                    toggleDialog={toggleNotificationsModal}
                    tooltip_message={<Localize i18n_default_text='View notifications' />}
                    should_disable_pointer_events
                    showPopover={!isTabletOs}
                />
            )}
            {isTabletOs ? (
                accountSettings
            ) : (
                <Popover
                    classNameBubble='account-settings-toggle__tooltip'
                    alignment='bottom'
                    message={<Localize i18n_default_text='Manage account settings' />}
                    should_disable_pointer_events
                    zIndex='9999'
                >
                    {accountSettings}
                </Popover>
            )}
            <AccountInfoWallets is_dialog_on={is_accounts_switcher_on} toggleDialog={toggleAccountsDialog} />
            {!is_virtual && !currency && (
                <div className='set-currency'>
                    <Button
                        onClick={() => openRealAccountSignup('set_currency')}
                        has_effect
                        type='button'
                        text={localize('Set currency')}
                        primary
                    />
                </div>
            )}
            {currency && (
                <Button
                    className='acc-info__button'
                    has_effect
                    text={localize('Manage funds')}
                    onClick={handleManageFundsRedirect}
                    primary
                />
            )}
        </React.Fragment>
    );
});

export { AccountActionsWallets };
