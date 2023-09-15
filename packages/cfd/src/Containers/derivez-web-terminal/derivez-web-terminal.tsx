import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { getDerivEzWebTerminalLink } from '../../Helpers/constants';
import { observer, useStore } from '@deriv/stores';
import { Icon } from '@deriv/components';

const DerivezWebTerminal = () => {
    const history = useHistory();
    const location = useLocation();
    const routeToPrevious = () => history.push(routes.traders_hub);
    const { traders_hub } = useStore();
    const { is_real } = traders_hub;
    const account_type = is_real ? 'real' : 'demo';

    const derivez_token = location.state.derivez_token || '';

    const derivezWebTraderUrl = getDerivEzWebTerminalLink(account_type, derivez_token);

    return (
        <div className='derivez-web-terminal'>
            <span className='derivez-web-terminal-header'>
                <Icon icon='IcCross' onClick={routeToPrevious} className='derivez-web-terminal-header-icon' />
            </span>
            <iframe src={derivezWebTraderUrl} className='derivez-web-terminal-iframe' />
        </div>
    );
};

export default observer(DerivezWebTerminal);
