import React from 'react';
import { View, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ActionButtonsProps {
  onActionPress: (action: string) => void; 
  swipeDirection: string | null;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onActionPress, swipeDirection }) => {

  const actions = [
    { name: 'dislike', icon: 'close', color: '#FF3D3D' },
    { name: 'suparlike', icon: 'star', color: '#FFD700' },
    { name: 'like', icon: 'heart', color: '#4CAF50' },
    { name: 'reload', icon: 'refresh-circle', color: '#61A1FF' },
  ];

  const handlePress = (action: string) => (event: GestureResponderEvent) => {
    onActionPress(action);
  };

  const getButtonStyle = (action: { name: string; color: string }) => {
    const isLargeButton = action.name === 'dislike' || action.name === 'like';
    return [
      styles.actionButton,
      isLargeButton ? styles.largeActionButton : {},
      { backgroundColor: swipeDirection === action.name ? action.color : 'rgba(255,54,190,0.2)', borderColor: swipeDirection === action.name ? 'white' : action.color },
    ];
  };

  const getIconSize = (action: { name: string }) => {
    const isLargeButton = action.name === 'dislike' || action.name === 'like';
    return swipeDirection === action.name ? (isLargeButton ? 45 : 35) : (isLargeButton ? 40 : 30);
  };

  return (
    <View style={styles.actionButtonsContainer}>
      {actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={getButtonStyle(action)}
          onPress={handlePress(action.name)}
        >
          <Icon name={action.icon} size={getIconSize(action)} color={swipeDirection === action.name ? 'white' : action.color} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end', 
    elevation: 10,
    padding: 10,
    marginBottom:60
  },
  actionButton: {
    width: 45,
    height: 45,
    borderRadius: 30,
    marginHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  largeActionButton: {
    width: 52,
    height: 52,
    borderRadius: 35,
  },
});

export default ActionButtons;
