import { useQuery } from '@deriv/api';
import useAuthorize from './useAuthorize';

export type TPlatformStatus = Exclude<
    NonNullable<ReturnType<typeof useQuery<'trading_platform_status'>>['data']>['trading_platform_status'][0],
    undefined
>;

/** A custom hook that gets the list of statuses of ctrader dxtrade mt5 platform. */
const useTradingPlatformStatus = () => {
    const { isSuccess } = useAuthorize();
    const { data, ...rest } = useQuery('trading_platform_status', {
        options: { enabled: isSuccess, refetchInterval: 120000 },
    });

    const tradingPlatformStatusData = data?.trading_platform_status;

    /**
     * Retrieves the status of a specified trading platform.
     * @param platform The platform identifier (e.g., 'ctrader', 'dxtrade', 'mt5').
     * @returns The status of the identified platform ('active', 'maintenance', 'unavailable').
     */
    const getPlatformStatus = (platform: TPlatformStatus['platform']) => {
        return tradingPlatformStatusData?.find((status: TPlatformStatus) => status.platform === platform)?.status;
    };

    return {
        ...rest,
        data: tradingPlatformStatusData,
        getPlatformStatus,
    };
};

export default useTradingPlatformStatus;