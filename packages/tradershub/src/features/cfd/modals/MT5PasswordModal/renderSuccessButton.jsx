import React from 'react';
import { useHistory } from 'react-router-dom'; // if you're using react-router
import { Button } from '@deriv/quill-design';
import { ButtonGroup } from '../../../../components';

const SuccessButton = ({ hide, isDemo }) => {
    const history = useHistory();

    if (isDemo) {
        return (
            <Button onClick={hide} size='lg'>
                OK
            </Button>
        );
    }
    return (
        <ButtonGroup className='justify-center w-full'>
            <Button onClick={hide} size='lg' variant='secondary'>
                Maybe later
            </Button>
            <Button
                onClick={() => {
                    hide();
                    history.push('/cashier/transfer');
                }}
                size='lg'
            >
                Transfer funds
            </Button>
        </ButtonGroup>
    );
};

export default SuccessButton;
