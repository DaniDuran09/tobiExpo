// RenderPartners/RenderPartners.tsx
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { AnimatedImage, LoaderScreen } from 'react-native-ui-lib';
import { Colors } from '../../styles/Colors';
const RenderPartners = ({ item, goToMoreInfo }: { item: Partner; goToMoreInfo: (item: Partner) => void }) => (
  <TouchableOpacity style={styles.item} onPress={() => goToMoreInfo(item)}>
    <View style={styles.leftSection}>
      <Text style={styles.itemTitle}>{item.name}</Text>
      <Text style={styles.itemDescription}>{item.type_partner.name}</Text>
    </View>
    <View style={styles.rightSection}>
      <AnimatedImage
        source={{ uri: item.picture || '' }} // Usa '' como fallback si picture es null
        style={styles.imageItem}
        loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
        animationDuration={500}
        resizeMode="contain"
      />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  item: {
    height: 130,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    alignItems: "center",
    shadowColor: Colors.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginBottom: 10,
    elevation: 5,
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: "600",
  },
  leftSection: {
    width: "50%",
  },
  imageItem: {
    height: 90,
    width: 90,
    borderRadius: 11,
  },
  rightSection: {
    paddingRight: 15,
  },
  itemDescription: {
    fontSize: 15,
    marginTop: 5,
    color: Colors.gray,
  },
});

export default RenderPartners;
