import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import BackHeaders from '@/components/layouts/BackHeaders'
import { Entypo, EvilIcons } from '@expo/vector-icons'

type Props = {
  kamarberapa:String,
}

const detailkost = () => {
  const [kamar, setkamar] = useState(true);

  const KamarStatus:React.FC<Props> = ({kamarberapa}) =>{
    if(kamar === true){
      return(
        <Text className='text-base font-bold text-blue-600'>{kamarberapa}</Text>
      )
    } else{
      return(
        <Text className='text-base font-bold'>{kamarberapa}</Text>
      )
    }
  }

  return (
    <SafeAreaProvider>
      <BackHeaders judul={'Detail Kost'} aksi={''}/>
      <View className='flex-1 bg-gray-200'>
        <View>
          <View className='flex flex-col px-2 pb-1 pt-3 divide-y divide-slate-700'>
              <View className='p-3 flex-row justify-between'>
                <KamarStatus kamarberapa={'Kamar 1'}/>
                <View className='flex-row'>
                  <View className='mx-2'>
                    <Entypo name="edit" size={20} color="black" />
                  </View>
                  <View className='mx-2'>
                    <EvilIcons name="trash" size={20} color="black" />
                  </View>
                </View>
              </View>
              <View className='p-3 flex-row justify-between'>
                <Text className='text-base font-bold'>Kamar 2</Text>
                <View className='flex-row'>
                  <View className='mx-2'>
                    <Entypo name="edit" size={20} color="black" />
                  </View>
                  <View className='mx-2'>
                    <EvilIcons name="trash" size={20} color="black" />
                  </View>
                </View>
              </View>
              <View className='p-3 flex-row justify-between'>
                <Text className='text-base font-bold'>Kamar 3</Text>
                <View className='flex-row'>
                  <View className='mx-2'>
                    <Entypo name="edit" size={20} color="black" />
                  </View>
                  <View className='mx-2'>
                    <EvilIcons name="trash" size={20} color="black" />
                  </View>
                </View>
              </View>
              <View className='p-3 flex-row justify-between'>
                <Text className='text-base font-bold'>Kamar 4</Text>
                <View className='flex-row'>
                  <View className='mx-2'>
                    <Entypo name="edit" size={20} color="black" />
                  </View>
                  <View className='mx-2'>
                    <EvilIcons name="trash" size={20} color="black" />
                  </View>
                </View>
              </View>
            </View>
        </View>
      </View>
    </SafeAreaProvider>
  )
}

export default detailkost