import { ScrollView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../styles/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import ApiFetcher from "../../modules/ApiFetcher";
import { Text, View, TouchableOpacity } from "react-native-ui-lib";
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
  const dispatch = useDispatch();
  const apiFetcher = new ApiFetcher();

  const [isLoading, setIsLoading] = useState(true);

  const [item, setItem] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<any>(null);

  const [cart, setCart] = useState<number | null>(null);
  const [localCart, setLocalCart] = useState<any[]>([]);

  const [currentService, setCurrentService] = useState<any>(null);
  const [availableDays, setAvailableDays] = useState<any>({});
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [globalCart, setGlobalCart] = useState<any[]>([]);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [showServices, setShowServices] = useState(true);

  const addDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };
  const toRFC3339 = (slotValue: string) => {
    const raw = slotValue.split("...")[0].trim();
    const [date, time, tz] = raw.split(" ");

    if (tz === "UTC") {
      return `${date}T${time}.000Z`;
    }

    const formattedOffset = tz.slice(0, 3) + ":" + tz.slice(3);
    return `${date}T${time}.000${formattedOffset}`;
  };



  useEffect(() => {
    dispatch(clearAppointments());
    loadInitialData();
  }, []);

  useEffect(() => {
    if (item?.partner?.id) {
      createCart();
    }
  }, [item]);

  useEffect(() => {
    if (!cart || !selectedPet || !currentService) return;
    getCalendar();
  }, [cart, selectedPet, currentService]);

  const loadInitialData = async () => {
    try {
      const [partnerRes, petsRes] = await Promise.all([
        apiFetcher.getPartnersById(id),
        apiFetcher.getPets(),
      ]);

      setItem(partnerRes.data);
      setPets(petsRes.data);
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo cargar la información",
      });
      navigation.goBack();
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
    const today = new Date();
    const date = today.toISOString().slice(0, 10);
    const date_to = addDays(today, 2);

    const payload = {
      service_id: currentService.id,
      pet_id: selectedPet.id,
      cart_id: cart,
      date,
      date_to,
    };

    const res = await apiFetcher.getAvailabilityAgenda(
      item.partner.id,
      payload,
      timezone
    );

    console.log("AGENDA", res.data);
    setAvailableDays(res.data);
  };

  const getGlobalCart = async () => {
    const res = await apiFetcher.getCart(cart);
    console.log("GLOBAL CART:", res.data);

    const normalized = res.data.items.map((it: any) => ({
      uuid: it.id.toString(),
      id: it.id,
      name: it.service?.name,
      price: it.price_total,
      duration_minutes: it.duration_minutes,
      start_datetime: it.datetime_range?.start,
    }));

    setGlobalCart(normalized);
  };

  useEffect(() => {
    if (cart) {
      getGlobalCart();
    }
  },[cart]);


  const removeGlobalItem = async (cartId: any, item_id: number) => {
    const response = await apiFetcher.removeItemFromCart(cartId, item_id);
    console.log("eliminar producto : ", response)
  }

  const addItemToCart = async () => {
    if (!selectedSlot || !selectedPet || !currentService || !cart) return;

    const start_datetime = toRFC3339(selectedSlot.value);

    const res = await apiFetcher.addItemToCart(
      cart,
      {
        pet_id: selectedPet.id,
        service_id: currentService.id,
        start_datetime,
      },
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    setLocalCart(prev => [
      ...prev,
      {
        uuid: Date.now().toString(),
        ...currentService,
        pet_id: selectedPet.id,
        start_datetime,
      },
    ]);

    setCurrentService(null);
    setSelectedSlot(null);
    setShowServices(true);
  };


  if (isLoading) {
    return <Loading backgroundColorProp={Colors.white} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
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
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
        />

        <Text text60H marginT-20>
          {item?.partner?.name}
        </Text>

        <FlatList
          data={globalCart}
          renderItem={({ item }) => (
            <ResumeService
              item={item}
              type={type}
              onRemove={id => {
                console.log("CART ID:", cart, "ITEM ID:", id);
                removeGlobalItem(cart, id);
              }}

            />
          )}
          keyExtractor={item => item.id.toString()}
        />

        {localCart.length > 0 && (
          <>
            {// global cart
            }
            {//carrito local
            }
            <FlatList
              data={localCart}
              renderItem={({ item }) => (
                <ResumeService
                  item={item}
                  type={type}
                  onRemove={uuid =>
                    setLocalCart(prev => prev.filter(i => i.uuid !== uuid))
                  }
                />
              )}
              keyExtractor={item => item.uuid}
            />
          </>

        )}

        {selectedPet && showServices && (
          <FlatList
            data={item?.services || []}
            renderItem={({ item }) => (
              <Service
                {...item}
                addToLocalCart={() => {
                  setCurrentService(item);
                  setShowServices(false);
                }}
              />
            )}
            keyExtractor={item => item.id.toString()}
          />
        )}

        {selectedPet && currentService && (
          <CalendarComponent
            agenda={availableDays}
            selectedSlot={selectedSlot}
            onSelect={setSelectedSlot}
          />
        )}

        {selectedPet && currentService && selectedSlot && (
          <>
            <TouchableOpacity onPress={addItemToCart}>
              <Text text70BL style={{ color: Colors.primaryColor }}>
                + Añadir otro servicio
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              bg-red30
              br100
              center
              style={{ height: 50, marginTop: 20 }}
              onPress={async () => {
                try {
                  if (currentService && selectedSlot) {
                    await addItemToCart();
                    navigation.navigate("Resume", { cart });
                  }
                } catch (error) {
                  console.log(error)
                }
              }}
            >
              <Text white text60L>Continuar</Text>
            </TouchableOpacity>

          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PartnersGeneralInfo;
