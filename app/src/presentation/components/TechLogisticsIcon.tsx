import React from 'react';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Polygon,
  Circle,
  Path,
} from 'react-native-svg';

interface Props {
  height?: string | number;
  width?: string | number;
}

export const TechLogisticsIcon = ({ height, width }: Props) => {
  const ASPECT_RATIO = 92 / 112;

  let finalHeight = 112;
  let finalWidth = 92;

  if (height && !width) {
    finalHeight = Number(height);
    finalWidth = finalHeight * ASPECT_RATIO;
  } else if (width && !height) {
    finalWidth = Number(width);
    finalHeight = finalWidth / ASPECT_RATIO;
  } else if (height && width) {
    finalHeight = Number(height);
    finalWidth = Number(width);
  }

  return (
    <Svg
      height={finalHeight}
      preserveAspectRatio="xMidYMid meet"
      viewBox="14 4 92 112"
      width={finalWidth}
    >
      <Defs>
        <LinearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
          <Stop offset="0%" stopColor="#34D399" />
          <Stop offset="100%" stopColor="#047857" />
        </LinearGradient>

        <LinearGradient id="g2" x1="0" x2="1" y1="0" y2="1">
          <Stop offset="0%" stopColor="#6EE7B7" />
          <Stop offset="100%" stopColor="#10B981" />
        </LinearGradient>
      </Defs>

      <Polygon
        fill="none"
        opacity="0.18"
        points="60,5 105,30 105,90 60,115 15,90 15,30"
        stroke="#047857"
        strokeWidth="2"
      />

      <Circle cx="35" cy="45" fill="url(#g1)" r="5" />
      <Circle cx="75" cy="30" fill="url(#g1)" r="5" />
      <Circle cx="85" cy="75" fill="url(#g1)" r="5" />
      <Circle cx="45" cy="90" fill="url(#g1)" r="5" />

      <Path
        d="M35 45 L75 30 L85 75 L45 90 Z"
        fill="none"
        stroke="url(#g1)"
        strokeWidth="2.5"
      />

      <Path
        d="M20 70 C40 40, 70 110, 100 60"
        fill="none"
        stroke="url(#g2)"
        strokeLinecap="round"
        strokeWidth="4"
      />

      <Polygon fill="#10B981" points="100,60 92,58 96,68" />

      <Circle cx="60" cy="60" fill="#34D399" r="6" />
    </Svg>
  );
};
