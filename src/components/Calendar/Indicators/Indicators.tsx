import { useTranslations } from 'next-intl';

export const Dot = ({ color, size = 4, ...props }) => {
    const t = useTranslations('calendar');
    const defaultColor = t('indicators.defaultDotColor');

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx={size / 2} cy={size / 2} r={size / 2} fill={color || defaultColor} />
        </svg>
    );
};

export const RoundedRectangle = ({ width = 8, height = 4, color, rx = 2, ...props }) => {
    const t = useTranslations('calendar');
    const defaultColor = t('indicators.defaultRectangleColor');

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
            <rect width={width} height={height} rx={rx} fill={color || defaultColor} {...props} />
        </svg>
    );
};
