import { ScrollView, Share, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Colors } from "../../styles/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import ApiFetcher from "../../modules/ApiFetcher";
import { Text, View, Image, TouchableOpacity } from "react-native-ui-lib";
import { clearAppointments } from "../../redux/slice/appointmentSlice";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import Loading from "../../components/Loading";
import { RenderPets } from "../../components/renders/RenderPets";
import ResumeService from "./components/ResumeService";
import Service from "./components/Service";
import CalendarComponent from "./components/Calendar";

const PartnersGeneralInfo = () => {
  const { params } = useRoute<any>()
  const { id, type } = params
  //type 2 = veterinaria
  //type 3 = grooming
  const navigation = useNavigation<any>();

  const apiFetcher = new ApiFetcher();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [pets, stePets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const handleSelectPet = (pet: any) => setSelectedPet(pet);
  const [showServices, setShowServices] = useState(false);
  const [localCart, setLocalCart] = useState<CartItem[]>([])
  const [currentId, setCurrentId] = useState(null);
  const [cart, setCart] = useState(0);
  const [availableDays, setAvailableDays] = useState([])
  const [isChoising, setIsChoising] = useState<boolean>(false);
  const [item, setItem] = useState<PartnerGeneralInfo>({
    services: [],
    users: [],
    partner: {
      picture: null,
      latitude: "0",
      longitude: "0",
      name: "",
      id: "",
      partnerId: "",
      description: "",
      phone: "",
      type_partner: {
        id: 0,
        name: ""
      }
    },
    address: {
      state: "",
      city: "",
      street: ""
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showActionSheet, setShowActionSheet] = useState<boolean>(false);

  const services = item.services
  const users = item.users
  const partner = item.partner

  const partnerLocation = `${item?.address?.state}, ${item?.address?.city} ${item?.address?.street}`;

  useEffect(() => {
    dispatch(clearAppointments());
    getPartnerInfo();
  }, []);

  useEffect(() => {
    if (!partner?.id) return
    createCart();
  }, [partner])

  const fetchCart = async () => {
    setIsLoading(true)
    try {

    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCalendar = async () => {
    setIsLoading(true)
    try {
      if (!currentId) return
      const payload = {
        "service_id": currentId,
        "pet_id": selectedPet,
        "cart_id": cart
      }
      const response = await apiFetcher.getAvailabilityAgenda(partner.id, payload);
      setAvailableDays(response.data['2026-01-23'].available)
      console.log('-----------', response)
      console.log('-----------', response.data['2026-01-23'].available)

    } catch (error) {
      console.log('-----------', error)
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!partner?.id) return
    getCalendar();
  }, [localCart, partner])

  const createCart = async () => {
    setIsLoading(true)
    try {
      const payload = {
        "partner_id": partner.id,
      }
      console.log("partner id", partner.id)
      const create = await apiFetcher.createCart(payload)
      console.log("intentar crear un carro", create.data.id);
      setCart(create.data.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false)
    }
  }

  const addToLocalCart = (service: CartItem) => {
    setCurrentId(service.id)
    setLocalCart(prev => [...prev, service]);
    setShowServices(false);
  }
  const removeFromLocalCart = (id: number) => {
    setLocalCart(prev => prev.filter(item => item.id !== id))
  }


  const getPartnerInfo = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const partner = await apiFetcher.getPartnersById(id);
      console.log(JSON.stringify(partner.data, null, " "));
      if (partner.code == 200 || partner.code == 201) setItem(partner.data);
    } catch (error) {
      console.log("Error: ", error);
      Toast.show({
        type: "error",
        text1: "Ha ocurrido un error",
        text2: "Inténtelo de nuevo más tarde",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shareInfo = async (url: string): Promise<void> => {
    try {
      const result = await Share.share({
        message: `Mira este lugar para nuestras mascotas: ${url}`,
        title: "Tobi",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Ha ocurrido un error",
        text2: "Inténtelo de nuevo más tarde",
      });
    }
  };

  const handleDirections = (): void => {
    setShowActionSheet(true);
  };

  const fetchPets = async () => {
    setLoading(true);
    try {
      const response = await apiFetcher.getPets();
      stePets(response.data);
    } catch (error) {
      console.error("Error: ", error);
      Toast.show({
        type: "error",
        text1: "Ocurrió un error",
        text2: `No pudimos acceder a tus mascotas, inténtalo de nuevo más tarde`,
      });
      navigation.goBack()
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPets();
      return () => { };
    }, [])
  );
  console.log(pets)


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      {isLoading && (
        <Loading
          textColor={Colors.primaryColor}
          backgroundColorProp={Colors.white}
        />
      )}
      <ScrollView style={{ padding: 10 }}>
        <FlatList
          data={pets}
          horizontal={true}
          renderItem={({ item }) => (
            <RenderPets
              pet={item}
              selectedPet={selectedPet}
              handleSelectPet={handleSelectPet}
            />
          )}
          keyExtractor={(item: { id: number }) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
        />
        {/*NEW VERSION */}
        <View marginT-10 width={'100%'} height={0.2} bg-black />

        <View >
          <Text text60H marginT-20 >{partner.name} </Text>
        </View>
        {!showServices ? (
          <View>
            <Text text70L marginV-10 >Calendario </Text>
            <FlatList
              data={localCart}
              renderItem={({ item }) => (
                <ResumeService
                  item={item}
                  type={type}
                  onRemove={removeFromLocalCart}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
            />

          </View>
        ) :
          <FlatList
            data={services}
            renderItem={({ item }) => (
              <Service
                id={item.id}
                name={item.name}
                price={item.price}
                duration_minutes={item.duration_minutes}
                addToLocalCart={addToLocalCart}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        }

        {availableDays && (
          <CalendarComponent agenda={availableDays} />
        )
        }
        {isChoising == false ? (
          <TouchableOpacity
            style={{ width: '100%', height: 30, justifyContent: 'center', marginBottom: 50 }}
            onPress={() => {
              setShowServices(!showServices)
              setIsChoising(true)
            }}
          >
            <Text>
              {showServices == false ? '+ Añadir otro servicio' : 'Cancelar'}
            </Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}

        {/**/}

        {/*OLD VERSION*/}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PartnersGeneralInfo;

/* 
        <View row spread>
          {!isLoading && (
            <Image
              source={{ uri: partner.picture }}
              height={90}
              width={90}
              style={{ borderRadius: 11 }}
              resizeMode="cover"
            />
          )}
          <TouchableOpacity onPress={() => shareInfo(partner.latitude)}>
            <Image
              source={require("../../assets/share.png")}
              width={25}
              height={25}
              marginR-15
            />
          </TouchableOpacity>
        </View>
        <View
          marginT-15
          paddingB-40
          style={{ borderBottomColor: Colors.gray, borderBottomWidth: 0.5 }}
        >
          <Text text40H>{partner.name}</Text>
          <Text text70 marginT-5 color={Colors.gray}>
            {partnerLocation}
          </Text>
        </View>
        <View
          marginT-15
          paddingB-50
          style={{ borderBottomColor: Colors.gray, borderBottomWidth: 0.5 }}
        >
          <Text text60BO>Servicios</Text>
          <ServicesOptionsList
            services={services}
            partnerLocation={partnerLocation}
            users={users}
            partnerId={partner.id}
          />
        </View>
        <View
          marginT-15
          paddingB-20
          style={{ borderBottomColor: Colors.gray, borderBottomWidth: 0.5 }}
        >
          <Text text60BO>{type == 2 ? "Especialistas" : "Estilistas"}</Text>
          <View
            style={
              users.length != 0
                ? {
                  margin: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }
                : {}
            }
          >
            <FlatList
              data={users}
              horizontal={true}
              renderItem={({ item }) => (
                <UserItem
                  onPress={() =>
                    navigation.navigate("ListPartners", {
                      partnerId: partner.id,
                      partners: users,
                      services: services,
                      partnerLocation: partnerLocation,
                    })
                  }
                  picture={{ uri: item.picture }}
                  name={item.display_name}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View marginT-10 center>
                  <Text text70 marginT-5 color={Colors.gray}>
                    No hay {type == 2 ? "especialistas" : "estilistas"}{" "}
                    disponibles
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
        <PartnersContactInformation
          partner={partner}
          handleDirections={handleDirections}
        />
        <OpenDirectionMap
          latitude={item?.partner?.latitude}
          longitude={item?.partner?.longitude}
          setShowActionSheet={setShowActionSheet}
          showActionSheet={showActionSheet}
        />
*/