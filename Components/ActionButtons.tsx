import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ActionButtonsProps {
  onActionPress: (action: string) => void;
  swipeDirection: string | null;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onActionPress, swipeDirection }) => {
  const [highlightedAction, setHighlightedAction] = useState<string | null>(swipeDirection);

  useEffect(() => {
    if (swipeDirection) {
      setHighlightedAction(swipeDirection);

      // Reset highlight after a short delay
      const timeout = setTimeout(() => setHighlightedAction(null), 1000); // Adjust the duration as needed
      return () => clearTimeout(timeout); // Cleanup timeout if component unmounts or swipeDirection changes
    }
  }, [swipeDirection]);

  const actions = [
    { name: 'dislike', icon: 'close', color: '#FF3D3D' },
    { name: 'suparlike', icon: 'star', color: '#FFD700' },
    { name: 'like', icon: 'heart', color: '#4CAF50' },
    { name: 'reload', icon: 'refresh-circle', color: '#61A1FF' },
  ];

  const handlePress = (action: string) => (event: GestureResponderEvent) => {
    onActionPress(action);
    setHighlightedAction(action);

    // Reset highlight after a short delay
    const timeout = setTimeout(() => setHighlightedAction(null), 1000); // Adjust the duration as needed
    return () => clearTimeout(timeout);
  };

  const getButtonStyle = (action: { name: string; color: string }) => {
    const isHighlighted = highlightedAction === action.name;
    const showNormal = highlightedAction === null;

    return [
      styles.actionButton,
      isHighlighted && styles.highlightedButton,
      {
        backgroundColor: isHighlighted ? action.color : 'rgba(0, 0, 0, 0.1)',
        opacity: showNormal || isHighlighted ? 1 : 0.1,
      },
    ];
  };

  const getIconColor = (action: { name: string }) => (highlightedAction === action.name ? 'white' : action.color);
  
  const getIconSize = (action: { name: string }) => {
    // console.log('///////1111', action.name);
    const isLargeButton = action.name === 'dislike' || action.name === 'like';
    return highlightedAction === action.name ? (isLargeButton ? 47 : 37) : (isLargeButton ? 45 : 35);
  };


  return (
    <View style={styles.actionButtonsContainer}>
      {actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={getButtonStyle(action)}
          onPress={handlePress(action.name)}
        >
          <Icon name={action.icon} size={getIconSize(action)} color={getIconColor(action)} />
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
    // marginBottom: 60,
  },
  actionButton: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  highlightedButton: {
    borderColor: 'white',
    elevation: 5,
  },
});

export default ActionButtons;
