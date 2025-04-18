import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import RangeSlider from 'rn-range-slider';

type SetValues = {
  low: number,
  high: number,
  setLow: (value: any) => void,
  setHigh: (value: any) => void
};
const RangeSliderFor = ({ low, high, setLow, setHigh }: SetValues) => {
  const renderThumb = () => <View style={{backgroundColor:'transparent', borderRadius:50, height:50, width:50, justifyContent:'center', alignItems:'center',}}><View style={styles.thumb} /></View>;
  const renderRail = () => <View style={styles.rail} />;
  const renderRailSelected = () => <View style={styles.railSelected} />;
  const renderLabel = useCallback((value: any) => <Text style={styles.label}>{value}</Text>, []);
  const renderNotch = () => <View style={styles.notch} />;
  const handleValueChange = (low: number, high: number) => {
    setLow(low);
    setHigh(high);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <RangeSlider
        style={styles.slider}
        min={18}
        max={80}
        step={1}
        floatingLabel
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        renderLabel={renderLabel}
        renderNotch={renderNotch}
        onValueChanged={handleValueChange}
        low={low}
        high={high}
      />
      <Text style={{ color: '#272423', fontSize: 20, fontWeight: '700', fontFamily: 'georgia', marginTop: -20 }}>Age Range: {low} - {high}</Text>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    width: 280,
    height: 80,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f52d70', // Changed to Dodger Blue
  },
  rail: {
    flex: 1,
    height: 5,
    borderRadius: 4,
    backgroundColor: '#D3D3D3', // Changed to Light Gray
  },
  railSelected: {
    height: 4,
    backgroundColor: '#f52d70', // Changed to Dodger Blue
    borderRadius: 2,
  },
  label: {
    backgroundColor: '#f52d70', // Changed to Dodger Blue
    color: 'white',
    padding: 5,
    borderRadius: 5,
  },
  notch: {
    width: 8,
    height: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#f52d70', // Changed to Dodger Blue
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 8,
  },
};

export default RangeSliderFor;
