import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Text, View } from 'react-native-ui-lib'
import momentTZ from '../../../utils/moment'
import { Colors } from '../../../styles/Colors'

type Props = {
  type: number
  item: CartItem
  onRemove: (id: number) => void
}

const ResumeService = ({ type, item, onRemove }: Props) => {
  const [ViewMore, SetViewMore] = useState(false)

  const formattedDate = item.start_datetime
    ? momentTZ(item.start_datetime).locale('es').format('dddd D [de] MMMM, h:mm A')
    : ''
  const capitalizedDate = formattedDate
    ? formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
    : ''

  return (
    <View
      br-1
      style={{ borderColor: '#a2a2a2', borderWidth: 0.6, position: 'relative' }}
      paddingV-10
      marginT-10
      paddingH-10
    >
      <TouchableOpacity
        onPress={() => onRemove(item.id)}
        style={{
          position: 'absolute',
          top: -20,
          right: -10,
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: '#909090',
          zIndex: 10,
          elevation: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text white>X</Text>
      </TouchableOpacity>

      <View row spread>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text text80BO>
            {item.name}
          </Text>
          {item.pet_name && (
            <Text text90M color={Colors.primaryColor} marginT-2>
              Para: {item.pet_name}
            </Text>
          )}
        </View>
        <Text text80BO>
          {item.price}
        </Text>
      </View>

      <View row spread marginT-5>
        <Text
          text90L
          numberOfLines={1}
        >
          {item.duration_minutes} min
        </Text>

        <Text text90L style={{ flex: 1, textAlign: 'right' }}>
          {capitalizedDate}
        </Text>
      </View>

      <View width={'100%'} marginV-10 height={0.5} style={{ backgroundColor: '#b4b4b4' }} />

      <Text text80BO>
        {type === 2 ? 'Veterinario' : 'Grooming'}
      </Text>
    </View>
  )
}

export default ResumeService

