import React, {useState, useEffect} from 'react'
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native'
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
import {white, purple} from '../utils/colors'

function SubmitBtn({onPress}){
  return(
    <TouchableOpacity
      style = {Platform.OS == 'ios'? styles.iosSubmitBtn: styles.androidSubmitBtn}
      onPress = {onPress}>
      <Text style = {styles.submitBtnText}>SUBMIT</Text>
    </TouchableOpacity>
  )
}

function AddEntry(props){
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
      <View style={styles.center}>
        <Ionicons
          name= {Platform.OS === 'ios'? 'ios-happy': 'md-happy'}
          size= {100}
        />
        <Text>You already logged your information for today</Text>
        <TextButton style={{padding: 10}} onPress={reset}>
          Reset
        </TextButton>
      </View>
    )
  }

  return (
    <View style = {styles.container}>
      <DateHeader date={(new Date()).toLocaleDateString()}/>
      {
        Object.keys(info).map((key) => {
          const {getIcon, type, ...rest} = info[key]
          const value = details[key]

          return(
            <View key={key} style={styles.row}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white,
  },
  row:{
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
    marginLeft: 30,
  },
})

export default AddEntry
