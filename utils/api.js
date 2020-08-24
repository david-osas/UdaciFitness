import AsyncStorage from '@react-native-community/async-storage'
import { CALENDAR_STORAGE_KEY } from './_calendar'


export function submitEntry({entry, key}){

  return AsyncStorage.mergeItem(CALENDAR_STORAGE_KEY, JSON.stringify({
    [key]: entry,
  }))
}

export async function removeEntry(key){

  let response = await AsyncStorage.getItem(CALENDAR_STORAGE_KEY)
  let result = JSON.parse(response)
  result[key] = undefined
  delete result[key]
  AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(result))
}
