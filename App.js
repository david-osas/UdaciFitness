import React from 'react';
import { View, TouchableHighlight, TouchableOpacity,
  TouchableNativeFeedback, TouchableWithoutFeedback, StyleSheet} from 'react-native'
import AddEntry from './components/AddEntry'

export default function App() {
  return (
    <View>
      <AddEntry/>
    </View>
  );
}
