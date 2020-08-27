import React from 'react';
import { View } from 'react-native'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import reducer from './reducers/index'
import AddEntry from './components/AddEntry'

export default function App() {
  return (
    <Provider store={createStore(reducer)}>
      <View style={{flex: 1}}>
        <AddEntry/>
      </View>
    </Provider>
  );
}
