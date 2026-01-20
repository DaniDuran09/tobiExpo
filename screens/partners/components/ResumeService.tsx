import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Text, View } from 'react-native-ui-lib'

type Props = {
  type: number
  item: CartItem
  onRemove: (id: number) => void
}

const ResumeService = ({ type, item, onRemove }: Props) => {
  const [ViewMore, SetViewMore] = useState(false)

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
        <Text text80BO>
          {item.name}
        </Text>
        <Text text80BO>
          {item.price}
        </Text>
      </View>

      <View row spread marginT-5>
        <TouchableOpacity
          onPress={() => SetViewMore(!ViewMore)}
          style={{ width: '70%' }}
        >
          <Text
            text90L
            numberOfLines={!ViewMore ? 1 : undefined}
          >
            {item.duration_minutes} minutos
          </Text>
        </TouchableOpacity>

        <Text text90L>
          {item.start_datetime}
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
