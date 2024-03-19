import React, { Fragment } from 'react';
import {
    CTraderSuccessModal,
    DxtradePasswordModal,
    JurisdictionModal,
    MT5AccountTypeModal,
    MT5PasswordModal,
    TopUpModal,
    TradeModal,
} from '@/features/cfd/modals';
import MT5SuccessModal from '@/features/cfd/modals/MT5PasswordModal/MT5SuccessModal';
import { ChangePassword } from '@/features/cfd/screens';
import { RealAccountCreation } from '@/flows';
import MT5ChangePasswordModal from './MT5ChangePasswordModal/MT5ChangePasswordModal';
import { AccountSelector } from './AccountSelector';
import { AddOrManageAccount } from './AddOrManageAccount';
import { DummyComponentModal } from './DummyComponentModal';
import { RegulationModal } from './RegulationModal';

/**
 * @description The place to import and export all modals
 * @returns  {React.ReactElement}
 */
const Modals = () => {
    return (
        <Fragment>
            {/* PLS DO NOT ADD ANY PROPS TO ANY MODALS HERE.💥 */}
            <AccountSelector />
            <AddOrManageAccount />
            <DummyComponentModal />
            <DxtradePasswordModal />
            <JurisdictionModal />
            <RealAccountCreation />
            <TradeModal />
            <TopUpModal />
            <ChangePassword />
            <MT5AccountTypeModal />
            <RegulationModal />
            <CTraderSuccessModal />
            <MT5SuccessModal />
            <MT5PasswordModal />
            <MT5ChangePasswordModal />
        </Fragment>
    );
};

export default Modals;
