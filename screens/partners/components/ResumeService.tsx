import React, { useState } from 'react'
import { Text, View, TouchableOpacity } from 'react-native-ui-lib'
import { MaterialCommunityIcons } from "@expo/vector-icons"
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
      style={{
        borderWidth: 1,
        borderColor: Colors.secondGray,
        backgroundColor: Colors.mediumWhite,
        borderRadius: 8,
      }}
      padding-15
      marginB-15
    >
      <View row spread marginB-5 style={{ alignItems: 'flex-start' }}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text text70BO>{item.name}</Text>
          {item.pet_name && (
            <Text text90M color={Colors.primaryColor} marginT-2>
              Para: {item.pet_name}
            </Text>
          )}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => onRemove(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{ marginBottom: 4 }}
          >
            <MaterialCommunityIcons name="close-circle" size={24} color={Colors.danger} />
          </TouchableOpacity>
          <Text text70BO>{item.price}</Text>
        </View>
      </View>

      <View row spread marginB-15 style={{ alignItems: 'flex-start' }}>
        <Text text90 style={{ color: Colors.gray, flex: 1, paddingRight: 10 }}>
          {capitalizedDate || 'Sin fecha asignada'}
        </Text>
        <Text text90 style={{ color: Colors.gray }}>
          {item.duration_minutes} min
        </Text>
      </View>

      <View width={'100%'} height={1} marginB-10 style={{ backgroundColor: Colors.secondGray }} />

      <Text text80>
        {(item as any).category_name || (type === 2 ? 'Veterinario' : 'Grooming')}
      </Text>
    </View>
  )
}

export default ResumeService

