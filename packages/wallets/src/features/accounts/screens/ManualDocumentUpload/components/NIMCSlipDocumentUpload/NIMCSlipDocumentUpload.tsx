import React from 'react';
import { Divider, Dropzone, WalletText, WalletTextField } from '../../../../../../components';
import NIMCSlipFront from '../../../../../../public/images/accounts/nimc-slip-front.svg';
import ProofOfAgeIcon from '../../../../../../public/images/accounts/proof-of-age.svg';
import { DocumentRuleHints } from '../DocumentRuleHints';
import './NIMCSlipDocumentUpload.scss';

const NIMCSlipDocumentUpload = () => {
    return (
        <div className='wallets-nimc-slip-document-upload' data-testid='dt_driving-license-document-upload'>
            <WalletText>First, enter your NIMC slip number.</WalletText>
            <WalletTextField label='NIMC slip number*' />
            <Divider />
            <div className='wallets-nimc-slip-document-upload__document-section'>
                <WalletText>Next, upload both of the following documents.</WalletText>
                <div className='wallets-nimc-slip-document-upload__dropzones'>
                    <div className='wallets-nimc-slip-document-upload__dropzones--left'>
                        <Dropzone
                            buttonText='Drop file or click here to upload'
                            description='Upload your NIMC slip.'
                            fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                            icon={<NIMCSlipFront />}
                            maxSize={8388608}
                        />
                    </div>
                    <div className='wallets-nimc-slip-document-upload__dropzones--right'>
                        <Dropzone
                            buttonText='Drop file or click here to upload'
                            description='Upload your proof of age: birth certificate or age declaration document.'
                            fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                            icon={<ProofOfAgeIcon />}
                            maxSize={8388608}
                        />
                    </div>
                </div>
                <DocumentRuleHints docType='nimcSlip' />
            </div>
        </div>
    );
};

export default NIMCSlipDocumentUpload;
