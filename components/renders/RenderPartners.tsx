import React from "react";
import { TouchableOpacity, View, Text } from "react-native-ui-lib";
import { AnimatedImage, LoaderScreen } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

const RenderPartners = ({
  item,
  goToMoreInfo,
  onSelectSlot,
}: {
  item: any;
  goToMoreInfo: (item: any) => void;
  onSelectSlot?: (item: any, slot: string, date: string) => void;
}) => {
  const { name, type_partner, picture, description, address, next_availability_snippet } = item;

  return (
    <TouchableOpacity onPress={() => goToMoreInfo(item)}>
      <View
        padding-15
        bg-white
        marginB-10
        br10
        style={{
          shadowColor: Colors.gray,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <View row spread>
          <View>
            <AnimatedImage
              source={{ uri: picture || "" }}
              height={70}
              width={70}
              borderRadius={10}
              loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
              animationDuration={500}
              resizeMode="cover"
            />
          </View>
          <View width="75%" paddingL-15>
            <Text text60BO>{name}</Text>
            {description ? (
              <Text text90 marginT-5 color={Colors.gray} numberOfLines={2}>
                {description}
              </Text>
            ) : null}
          </View>
        </View>

        {address ? (
          <View row centerV marginT-10>
            <MaterialCommunityIcons name="map-marker-outline" size={16} color={Colors.black} />
            <Text text90 marginL-5 color={Colors.gray} numberOfLines={1}>
              {address}
            </Text>
          </View>
        ) : null}

        {next_availability_snippet && (
          <View marginT-10 padding-15 style={{ backgroundColor: "#F5F5F5", borderRadius: 10 }}>
            <View row centerV marginB-10>
              <MaterialCommunityIcons name="calendar-blank-outline" size={16} color={Colors.black} />
              <Text text90 marginL-5 color={Colors.gray}>
                Próxima fecha: {moment(next_availability_snippet.date).calendar(null, {
                  sameDay: '[Hoy] D [de] MMMM',
                  nextDay: '[Mañana] D [de] MMMM',
                  nextWeek: 'D [de] MMMM',
                  lastDay: '[Ayer] D [de] MMMM',
                  lastWeek: 'D [de] MMMM',
                  sameElse: 'D [de] MMMM'
                })}
              </Text>
            </View>
            <View row centerV>
              {next_availability_snippet.slots?.map((slot: string, idx: number) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (onSelectSlot) {
                      onSelectSlot(item, slot, next_availability_snippet.date);
                    } else {
                      goToMoreInfo(item);
                    }
                  }}
                  style={{ backgroundColor: "#DDF1FF", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 5, marginRight: 8 }}
                >
                  <Text text90 style={{ color: "#000" }}>{slot}</Text>
                </TouchableOpacity>
              ))}
              {next_availability_snippet.has_more && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => goToMoreInfo(item)}
                  row
                  centerV
                  style={{ backgroundColor: "#DDF1FF", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 5 }}
                >
                  <Text text90 style={{ color: "#000", marginRight: 4 }}>ver más</Text>
                  <MaterialCommunityIcons name="chevron-right" size={14} color="#000" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default RenderPartners;
