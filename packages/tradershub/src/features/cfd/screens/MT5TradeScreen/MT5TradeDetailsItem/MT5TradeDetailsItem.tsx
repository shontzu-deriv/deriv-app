import React, { FC, Fragment, useRef } from 'react';
import { useHover } from 'usehooks-ts';
import { qtMerge, Text, useBreakpoint } from '@deriv/quill-design';
import { Clipboard, Tooltip } from '../../../../../components/Base';
import EditIcon from '../../../../../public/images/ic-edit.svg';

type TMT5TradeDetailsItemProps = {
    className?: string;
    label?: string;
    value: string;
    variant?: 'clipboard' | 'info' | 'password';
};

const MT5TradeDetailsItem: FC<TMT5TradeDetailsItemProps> = ({ className, label, value, variant = 'clipboard' }) => {
    const { isDesktop } = useBreakpoint();
    const hoverRef = useRef(null);
    const isHovered = useHover(hoverRef);
    return (
        <div
            className={qtMerge(
                'flex items-center h-1600 justify-between bg-system-light-secondary-background p-[5px] pl-400',
                className
            )}
        >
            {variant !== 'info' && (
                <Fragment>
                    <Text colorStyle='subtle' size='sm'>
                        {label}
                    </Text>
                    <div className='flex items-center space-x-400 pr-400'>
                        <Text bold size='sm'>
                            {value}
                        </Text>
                        {variant === 'clipboard' && <Clipboard textCopy={value} />}
                        {variant === 'password' && (
                            <Tooltip alignment='left' isVisible={isHovered && isDesktop} message='Change password'>
                                <div ref={hoverRef}>
                                    <EditIcon className='cursor-pointer' />
                                </div>
                            </Tooltip>
                        )}
                    </div>
                </Fragment>
            )}
            {variant === 'info' && (
                <Text colorStyle='subtle' size={isDesktop ? 'sm' : 'lg'}>
                    {value}
                </Text>
            )}
        </div>
    );
};

export default MT5TradeDetailsItem;
