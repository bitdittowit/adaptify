const getPathLength = (
  pathElement: SVGPathElement,
): number => {
  if (!pathElement) return 0;
  return pathElement.getTotalLength();
};

export default getPathLength;
