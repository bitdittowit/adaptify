
export const Dot = ({ color = 'red', size = 4, ...props }) => {
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx={size / 2} cy={size / 2} r={size / 2} fill={color} />
        </svg>
    )
}

export const RoundedRectangle = ({
    width = 8,
    height = 4,
    color = "black",
    rx = 2,
    ...props
}) => {
    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
            <rect
                width={width}
                height={height}
                fill={color}
                rx={rx}
                ry={rx}      // usually same as rx for uniform rounding
                {...props}
            />
        </svg>
    );
};