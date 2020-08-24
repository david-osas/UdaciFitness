import React, {useState, useEffect} from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {useDispatch, useSelector} from 'react-redux'
import { getMetricMetaInfo, timeToString } from '../utils/helpers'
import UdaciSlider from './UdaciSlider'
import UdaciSteppers from './UdaciSteppers'
import DateHeader from './DateHeader'
import TextButton from './TextButton'
import {submitEntry, removeEntry} from '../utils/api'
import {addEntry} from '../actions/index'
import {getDailyReminderValue} from '../utils/helpers'
import AsyncStorage from '@react-native-community/async-storage'

function SubmitBtn({onPress}){
  return(
    <TouchableOpacity
      onPress = {onPress}>
      <Text>SUBMIT</Text>
    </TouchableOpacity>
  )
}

function AddEntry(props){
  //AsyncStorage.clear()
  const dispatch = useDispatch()
  const state = useSelector(state => state)
  const initial = { run: 0, bike: 0, swim: 0, sleep: 0, eat: 0,}
  let [details, setDetails] = useState(initial)
  let [alreadyLogged, setLogged] = useState(false)


  useEffect(() => {
    let key = timeToString()
    if(state[key] && typeof state[key].today === 'undefined'){
      setLogged(true)
    }else{
      setLogged(false)
    }
  },[state])

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

    dispatch(addEntry({
      [key]: entry
    }))

    setDetails(initial)
    submitEntry({key, entry})
  }

  function reset(){
    const key = timeToString()

    dispatch(addEntry({
      [key]: getDailyReminderValue()
    }))
    removeEntry(key)
  }

  const info = getMetricMetaInfo()

  if(alreadyLogged){
    return(
      <View>
        <Ionicons
          name='ios-happy'
          size= {100}
        />
        <Text>You already logged your information for today</Text>
        <TextButton onPress={reset}>
          Reset
        </TextButton>
      </View>
    )
  }

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
