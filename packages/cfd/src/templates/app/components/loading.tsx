import classNames from 'classnames';
import React from 'react';
import { Text } from '@deriv/components';

type TLoadingProps = {
    className?: string;
    id?: string | undefined;
    is_fullscreen?: boolean;
    is_slow_loading?: boolean;
    status?: string[];
    theme?: string;
};

function Loading({
    className,
    id,
    is_fullscreen = true,
    is_slow_loading,
    status = [],
    theme,
}: TLoadingProps): React.ReactElement {
    const theme_class = theme ? `barspinner-${theme}` : 'barspinner-light';
    return (
        <div
            className={classNames(
                'initial-loader',
                {
                    'initial-loader--fullscreen': is_fullscreen,
                },
                className
            )}
        >
            <div id={id} className={classNames('initial-loader__barspinner', 'barspinner', theme_class)}>
                {Array.from(new Array(5)).map((x, inx) => (
                    <div
                        key={inx}
                        className={`initial-loader__barspinner--rect barspinner__rect barspinner__rect--${
                            inx + 1
                        } rect${inx + 1}`}
                    />
                ))}
            </div>
            {is_slow_loading &&
                status.map((text, inx) => (
                    <Text as='h3' color='prominent' size='xs' align='center' key={inx}>
                        {text}
                    </Text>
                ))}
        </div>
    );
}

export default Loading;
