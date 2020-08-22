import React, {useState} from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Slider from '@react-native-community/slider'
import { getMetricMetaInfo, timeToString } from '../utils/helpers'
import UdaciSlider from './UdaciSlider'
import UdaciSteppers from './UdaciSteppers'
import DateHeader from './DateHeader'

function SubmitBtn({onPress}){
  return(
    <TouchableOpacity
      onPress = {onPress}>
      <Text>SUBMIT</Text>
    </TouchableOpacity>
  )
}

function AddEntry(){
  const initial = { run: 0, bike: 0, swim: 0, sleep: 0, eat: 0,}
  let [details, setDetails] = useState(initial)

  function increment(metric){
    const {max, step} = getMetricMetaInfo(metric)
    setDetails((details) => {
      const count = details[metric] + step

      return {
        ...details,
        [metric]: count > max? max: count,
      }
    })
  }

  function decrement(metric){
    setDetails((details) => {
      const count = details[metric] - getMetricMetaInfo(metric).step

      return {
        ...details,
        [metric]: count < 0? 0: count,
      }
    })
  }

  function slide(metric, value){
    setDetails({
      ...details,
      [metric]: value,
    })
  }

  function submit(){
    const key = timeToString()
    const entry = details

    setDetails(initial)
  }

  const info = getMetricMetaInfo()

  return (
    <View>
      <DateHeader date={(new Date()).toLocaleDateString()}/>
      {
        Object.keys(info).map((key) => {
          const {getIcon, type, ...rest} = info[key]
          const value = details[key]

          return(
            <View key={key}>
              {getIcon()}
              {type === 'slider'
                ? <UdaciSlider
                    value = {value}
                    onChange = {(value) => slide(key, value)}
                    {...rest}/>
                : <UdaciSteppers
                    value = {value}
                    onIncrement = {() => increment(key)}
                    onDecrement = {() => decrement(key)}
                    {...rest}/>}
            </View>
          )
        })
      }
      <SubmitBtn onPress={submit}/>
    </View>
  )
}

export default AddEntry
