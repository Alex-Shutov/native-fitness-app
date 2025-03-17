import React from 'react';
import { Path } from 'react-native-svg';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');


const Fog = () => {
  return (
    <Path
      d={`M0,${height} L${width},${height} L${width},${height * 0.7} L0,${height * 0.7} Z`}
      fill="url(#fog)"
    />
  );
};

export default Fog;