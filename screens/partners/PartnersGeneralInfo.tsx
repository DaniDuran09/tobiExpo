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
import CalendarComponent from "./components/CalendarComponent";

const PartnersGeneralInfo = () => {
  const { params } = useRoute<any>();
  const { id, type } = params;
  const navigation = useNavigation<any>();
  const apiFetcher = new ApiFetcher();
  const dispatch = useDispatch();

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState<any>(null);

  const [item, setItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [cart, setCart] = useState<number | null>(null);
  const [localCart, setLocalCart] = useState<any[]>([]);

  const [showServices, setShowServices] = useState(false);
  const [currentService, setCurrentService] = useState<any>(null);

  const [availableDays, setAvailableDays] = useState<any>({});
  const [selectedSlot, setSelectedSlot] = useState<{
    label: string;
    value: string;
  } | null>(null);

  useEffect(() => {
    dispatch(clearAppointments());
    getPartnerInfo();
  }, []);

  useEffect(() => {
    if (item?.partner?.id) createCart();
  }, [item]);

  useEffect(() => {
    if (!cart || !selectedPet || !currentService) return;
    getCalendar();
  }, [cart, selectedPet, currentService]);

  const getPartnerInfo = async () => {
    try {
      const res = await apiFetcher.getPartnersById(id);
      setItem(res.data);
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo cargar el partner",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createCart = async () => {
    const res = await apiFetcher.createCart({
      partner_id: item.partner.id,
    });
    setCart(res.data.id);
  };

  const getCalendar = async () => {
    const payload = {
      service_id: currentService.id,
      pet_id: selectedPet,
      cart_id: cart,
    };
    const res = await apiFetcher.getAvailabilityAgenda(item.partner.id, payload);
    setAvailableDays(res.data);
  };

  const fetchPets = async () => {
    try {
      const res = await apiFetcher.getPets();
      setPets(res.data);
    } catch {
      navigation.goBack();
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPets();
    }, [])
  );

  const getCartTotal = (cart: CartItem[]) => {
  return cart.reduce((total, item) => {
    const price = Number(item.price.replace(/[^0-9.]/g, ""));
    return total + (isNaN(price) ? 0 : price);
  }, 0);
};
const total = getCartTotal(localCart);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      {isLoading && <Loading backgroundColorProp={Colors.white} />}

      <ScrollView style={{ padding: 10 }}>
        <FlatList
          data={pets}
          horizontal
          renderItem={({ item }) => (
            <RenderPets
              pet={item}
              selectedPet={selectedPet}
              handleSelectPet={setSelectedPet}
            />
          )}
          keyExtractor={(item:{id:number}) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
        />

        {!selectedPet && (
          <>

            <View marginT-10 width="100%" height={0.2} bg-black />

            <Text center text80BO >selecciona una mascota</Text>
          </>
        )}

        <View marginT-10 width="100%" height={0.2} bg-black />

        <Text text60H marginT-20>{item?.partner?.name}</Text>

        {/* NEW VERSION */}

        {selectedPet && localCart.length > 0 && (
          <FlatList
            data={localCart}
            renderItem={({ item }) => (
              <ResumeService
                item={item}
                type={type}
                onRemove={(id) =>
                  setLocalCart(prev => prev.filter(s => s.id !== id))
                }
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}

        {selectedPet && showServices && (
          <FlatList
            data={item?.services || []}
            renderItem={({ item }) => (
              <Service
                id={item.id}
                name={item.name}
                price={item.price}
                duration_minutes={item.duration_minutes}
                addToLocalCart={(service) => {
                  setCurrentService(service);
                  setShowServices(false);
                }}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}

        {selectedPet && currentService && Object.keys(availableDays).length > 0 && (
          <CalendarComponent
            agenda={availableDays}
            onSelect={(slot) => setSelectedSlot(slot)}
          />
        )}

        {selectedPet && currentService && selectedSlot && (
          <TouchableOpacity
            style={{ height: 40, justifyContent: "center", marginBottom: 40 }}
            onPress={() => {
              setLocalCart(prev => [
                ...prev,
                {
                  ...currentService,
                  pet_id: selectedPet,
                  start_datetime: selectedSlot.value,
                },
              ]);
              setCurrentService(null);
              setSelectedSlot(null);
              setShowServices(true);
            }}
          >
            <Text text70BL style={{color:Colors.primaryColor}}>+ Añadir otro servicio</Text>
          </TouchableOpacity>
        )}

        {!showServices && selectedPet && !currentService && (
          <TouchableOpacity
            style={{ height: 40, justifyContent: "center" }}
            onPress={() => setShowServices(true)}
          >
            <Text text70BL style={{color:Colors.primaryColor}}>+ Añadir servicio</Text>
          </TouchableOpacity>
        )}
          <Text>{total}</Text>
        {/* OLD VERSION */}
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