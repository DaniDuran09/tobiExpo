// import React from "react";
// import {
//   View,
//   Text,
//   Button,
//   StyleSheet,
//   TextInput,
//   FlatList,
//   Dimensions,
//   TouchableWithoutFeedback,
//   Image,
//   Alert,
//   Linking,
//   Modal,
// } from "react-native";
// import { listPet } from "../services";
// import { useDispatch, useSelector } from "react-redux";
// import { generalDataAction, updateData } from "../redux/generalDuck";
// import { Avatar } from "react-native-paper";
// import Loader from "../components/Loader";
// import MultiSlider from "@ptomasroos/react-native-multi-slider";
// import { Camera } from "react-native-vision-camera";
// import ModalCamera from "../components/ModalCamera";
// import { sendTicketTobi } from "../services";
// import BouncyCheckbox from "react-native-bouncy-checkbox";

// const { width, height } = Dimensions.get("window");

// const HeartScreen = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const update = useSelector((store) => store?.general?.update);
//   const { token } = useSelector((store) => store.general.user);
//   const [data, setData] = React.useState([
//     {
//       image: require("../assets/locion.png"),
//     },
//     {
//       image: require("../assets/huesos.png"),
//     },
//     {
//       image: require("../assets/locion.png"),
//     },
//     {
//       image: require("../assets/huesos.png"),
//     },
//   ]);
//   const [sliderOneChanging, setSliderOneChanging] = React.useState(false);
//   const [sliderOneValue, setSliderOneValue] = React.useState([5]);
//   const [imageSource, setImageSource] = React.useState("");
//   const [message, setMessage] = React.useState("");
//   const [activeModal, setActiveModal] = React.useState(false);
//   const [loading, setLoading] = React.useState(false);
//   const [checked, setChecked] = React.useState(false);
//   const [modalSuccess, setModalSuccess] = React.useState(false);
//   const [dataModal, setDataModal] = React.useState([]);

//   const sliderOneValuesChangeStart = () => setSliderOneChanging(true);
//   const sliderOneValuesChange = (values) => setSliderOneValue(values);
//   sliderOneValuesChangeFinish = () => setSliderOneChanging(false);

//   React.useEffect(() => {
//     async function getPermission() {
//       const permission = await Camera.requestCameraPermission();
//       console.log(`camera permission status: ${permission}`);
//       if (permission === "denied") await Linking.openSettings();
//     }
//     getPermission();
//   }, []);

//   const CustomMarker = () => (
//     <View
//       style={{
//         width: 40,
//         height: 40,
//         backgroundColor: "red",
//         borderRadius: 100,
//       }}
//     >
//       <Text style={[styles.text, sliderOneChanging && { color: "red" }]}>
//         {sliderOneValue}
//       </Text>
//     </View>
//   );

//   const savePhoto = (val) => {
//     setImageSource(val.path);
//     setActiveModal(false);
//   };

//   const sendTicket = () => {
//     setLoading(true);
//     const formData = new FormData();
//     formData.append("picture", {
//       uri: `file://${imageSource}`,
//       type: "image/jpeg", // or photo.type
//       name: "image",
//     });
//     formData.append("text_complete", checked);
//     sendTicketTobi(token, formData)
//       .then((response) => {
//         //console.log('response:::::', response.data)
//         setImageSource("");
//         setLoading(false);
//         setModalSuccess(true);
//         setDataModal(response.data);
//         dispatch(updateData(!update));
//         //navigation.navigate('MessageTicket', { message: response?.data })
//       })
//       .catch((err) => {
//         setLoading(false);
//         setImageSource("");
//         Alert.alert("Opps", "error en el servidor");
//       });
//   };

//   const ModalSuccess = () => {
//     return (
//       <Modal
//         animationType="fade"
//         transparent={true}
//         onRequestClose={() => {}}
//         visible={modalSuccess}
//         style={{ flex: 1 }}
//       >
//         <View
//           style={{
//             width: width,
//             height: height,
//             alignItems: "center",
//             justifyContent: "center",
//             backgroundColor: "rgba(0,0,0,0.4)",
//           }}
//         >
//           <View
//             style={{
//               width: "90%",
//               height: "45%",
//               alignItems: "center",
//               backgroundColor: "white",
//               justifyContent: "space-around",
//               borderRadius: 20,
//             }}
//           >
//             <View
//               style={{
//                 height: "80%",
//                 width: "90%",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <View
//                 style={{
//                   width: "100%",
//                   height: "20%",
//                   justifyContent: "flex-end",
//                   alignItems: "center",
//                 }}
//               >
//                 <Text
//                   style={{ fontWeight: "bold", fontSize: 20, color: "black" }}
//                 >
//                   !Felicidades¡
//                 </Text>
//                 <Text style={{ color: "black" }}>Tu ticket tiene puntos</Text>
//               </View>
//               <View style={{ width: "100%", height: "80%", padding: 10 }}>
//                 <FlatList
//                   // numColumns={3}
//                   keyExtractor={(item, index) => `item-${index}`}
//                   data={dataModal}
//                   ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
//                   renderItem={({ item }) => renderItemModal(item)}
//                 />
//               </View>
//             </View>
//             <View
//               style={{
//                 height: "20%",
//                 width: "90%",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 flexDirection: "row",
//               }}
//             >
//               <TouchableWithoutFeedback onPress={() => setModalSuccess(false)}>
//                 <View
//                   elevation={5}
//                   style={{
//                     height: 40,
//                     width: "90%",
//                     backgroundColor: "#EF4136",
//                     borderRadius: 10,
//                     justifyContent: "center",
//                     marginBottom: 15,
//                     borderWidth: 1,
//                     borderColor: "#CCC",
//                   }}
//                 >
//                   <Text
//                     style={{
//                       textAlign: "center",
//                       fontSize: 16,
//                       color: "white",
//                       fontWeight: "700",
//                     }}
//                   >
//                     Continuar
//                   </Text>
//                 </View>
//               </TouchableWithoutFeedback>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     );
//   };

//   const renderItemModal = (item) => {
//     return (
//       <View
//         elevation={5}
//         style={{
//           width: "97%",
//           height: 70,
//           backgroundColor: "white",
//           marginBottom: 5,
//           justifyContent: "center",
//           marginLeft: 5,
//         }}
//       >
//         <Text
//           style={{
//             fontSize: 14,
//             color: "#EF4136",
//             fontWeight: "500",
//             fontFamily: "Proxima Nova",
//             paddingLeft: 5,
//           }}
//         >
//           {item?.name}
//         </Text>
//         <Text
//           style={{
//             fontSize: 14,
//             color: "black",
//             fontWeight: "700",
//             fontFamily: "Proxima Nova",
//             paddingLeft: 5,
//           }}
//         >{`puntos: ${item?.points}`}</Text>
//       </View>
//     );
//   };

//   const renderItem = (item) => {
//     return (
//       <View style={{ width: 120, height: 150 }}>
//         <Image
//           source={item.image}
//           style={{ height: "100%", width: "100%" }}
//           resizeMode={"cover"}
//         />
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Loader active={loading} />
//       <ModalCamera active={activeModal} takePhoto={(val) => savePhoto(val)} />
//       <ModalSuccess />
//       <View
//         style={{
//           width: width / 1.1,
//           height: "25%",
//           justifyContent: "flex-end",
//           alignItems: "flex-start",
//           paddingHorizontal: 10,
//           paddingVertical: 20,
//         }}
//       >
//         <Text
//           style={{
//             fontSize: 18,
//             color: "#000",
//             fontWeight: "bold",
//             bottom: 30,
//           }}
//         >
//           Programa de lealtad Tobi
//         </Text>
//         <View
//           style={{ width: "100%", alignItems: "center", paddingBottom: 20 }}
//         >
//           <MultiSlider
//             onValuesChangeStart={sliderOneValuesChangeStart}
//             onValuesChange={sliderOneValuesChange}
//             onValuesChangeFinish={sliderOneValuesChangeFinish}
//             selectedStyle={{
//               backgroundColor: "#EF4136",
//             }}
//             unselectedStyle={{
//               backgroundColor: "silver",
//             }}
//             values={[5]}
//             containerStyle={{
//               height: 40,
//             }}
//             trackStyle={{
//               height: 10,
//               backgroundColor: "blue",
//             }}
//             touchDimensions={{
//               height: 40,
//               width: 40,
//               borderRadius: 20,
//               slipDisplacement: 40,
//             }}
//             customMarker={CustomMarker}
//             //xcustomLabel={CustomLabel}
//             sliderLength={280}
//           />
//         </View>
//         <View
//           style={{
//             width: "100%",
//             alignItems: "center",
//             flexDirection: "row",
//             justifyContent: "space-around",
//           }}
//         >
//           <Image
//             source={require("../assets/lock.png")}
//             style={{ height: 20, width: 20 }}
//             resizeMode={"contain"}
//           />
//           <Text style={{ fontSize: 18, color: "#000", fontWeight: "200" }}>
//             Bronce
//           </Text>
//           <Image
//             source={require("../assets/lock.png")}
//             style={{ height: 20, width: 20 }}
//             resizeMode={"contain"}
//           />
//           <Text style={{ fontSize: 18, color: "#000", fontWeight: "200" }}>
//             Plata
//           </Text>
//           <Image
//             source={require("../assets/lock.png")}
//             style={{ height: 20, width: 20 }}
//             resizeMode={"contain"}
//           />
//           <Text style={{ fontSize: 18, color: "#000", fontWeight: "200" }}>
//             Oro
//           </Text>
//         </View>
//       </View>
//       <View
//         style={{
//           width: width / 1.1,
//           height: "28%",
//           alignItems: "center",
//           justifyContent: "space-around",
//         }}
//       >
//         <View style={{ width: "100%", alignItems: "center" }}>
//           <Text style={{ fontSize: 16, color: "grey", fontWeight: "bold" }}>
//             No olvides escanear los tickets de compra
//           </Text>
//           <Text style={{ fontSize: 16, color: "grey", fontWeight: "bold" }}>
//             para generar más puntos de lealtad
//           </Text>
//         </View>
//         {imageSource === "" ? (
//           <TouchableWithoutFeedback onPress={() => setActiveModal(true)}>
//             <View
//               style={{
//                 height: 50,
//                 width: "90%",
//                 backgroundColor: "#EF4136",
//                 borderRadius: 30,
//                 justifyContent: "center",
//               }}
//             >
//               <Text
//                 style={{
//                   textAlign: "center",
//                   fontSize: 16,
//                   color: "white",
//                   fontWeight: "700",
//                 }}
//               >
//                 Escanear ticket
//               </Text>
//             </View>
//           </TouchableWithoutFeedback>
//         ) : (
//           <TouchableWithoutFeedback onPress={sendTicket}>
//             <View
//               style={{
//                 height: 50,
//                 width: "90%",
//                 backgroundColor: "#EF4136",
//                 borderRadius: 30,
//                 justifyContent: "center",
//               }}
//             >
//               <Text
//                 style={{
//                   textAlign: "center",
//                   fontSize: 16,
//                   color: "white",
//                   fontWeight: "700",
//                 }}
//               >
//                 Enviar ticket
//               </Text>
//             </View>
//           </TouchableWithoutFeedback>
//         )}
//         {/* <View style={{ flexDirection: 'row', bottom: 12 }}>
//                     <BouncyCheckbox size={20} onPress={(isChecked) => setChecked(isChecked)} />
//                     <Text style={{ fontSize: 14, color: 'grey', fontWeight: 'bold' }}>Texto Completo</Text>
//                 </View> */}
//       </View>
//       <View style={{ width: width / 1.1, height: "12%", alignItems: "center" }}>
//         <Text style={{ fontSize: 16, color: "grey", fontWeight: "bold" }}>
//           Créditos disponibles para compras:
//         </Text>
//         <Text style={{ fontSize: 32, color: "#FA6650", fontWeight: "bold" }}>
//           $1,000
//         </Text>
//       </View>
//       <View style={{ width: width / 1.1, height: "35%", alignItems: "center" }}>
//         <View
//           style={{
//             width: "100%",
//             height: "15%",
//             alignItems: "center",
//             flexDirection: "row",
//           }}
//         >
//           <Image
//             source={require("../assets/left.png")}
//             style={{ height: 20, width: 20 }}
//             resizeMode={"contain"}
//           />
//           <Text style={{ fontSize: 16, color: "black", fontWeight: "bold" }}>
//             Recompensas disponibles
//           </Text>
//         </View>
//         <FlatList
//           // numColumns={3}
//           keyExtractor={(item, index) => `item-${index}`}
//           data={data}
//           horizontal
//           ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
//           renderItem={({ item }) => renderItem(item)}
//         />
//       </View>
//     </View>
//   );
// };

// export default HeartScreen;

// const styles = StyleSheet.create({
//   container: {
//     height: height,
//     width: width,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "white",
//   },
//   text: {
//     alignSelf: "center",
//     paddingVertical: 20,
//   },
//   textInput: {
//     flex: 1,
//     paddingLeft: 10,
//   },
//   elevation: {
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     shadowColor: "#000000",
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     shadowOffset: {
//       height: 1,
//       width: 1,
//     },
//   },
// });

// {
//   /* <FlatList
//           // numColumns={3}
//           keyExtractor={(item, index) => `item-${index}`}
//           data={data}
//           ItemSeparatorComponent={() => (
//             <View style={{ height: 10 }} />
//           )}
//           refreshControl={<RefreshControl
//             //refreshing={this.state.isFetching}
//             onRefresh={() => fetchDta()}
//             tintColor="#55D0DC"
//             title="Loading..."
//             titleColor="black"
//             colors={['black', 'black', 'black']}
//             progressBackgroundColor="white"
//           />
//           }
//           renderItem={({ item }) => renderItem(item)}
//         /> */
// }
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const HeartScreen = () => {
  return (
    <View>
      <Text>HeartScreen</Text>
    </View>
  )
}

export default HeartScreen

const styles = StyleSheet.create({})