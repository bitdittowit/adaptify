const getPathLength = (pathElement?: SVGPathElement | null): number => {
    if (!pathElement) {
        return 0;
    }
    return pathElement.getTotalLength();
};

export default getPathLength;
