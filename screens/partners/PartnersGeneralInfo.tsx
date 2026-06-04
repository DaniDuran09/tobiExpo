import { ScrollView, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Colors } from "../../styles/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
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
  const [isAdding, setIsAdding] = useState(false);
  const [calendarOffset, setCalendarOffset] = useState(0); // días de avance desde hoy
  const CALENDAR_WINDOW = 3; // días que se muestran por página

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



  useFocusEffect(
    useCallback(() => {
      // Resetear estado al navegar con nuevos params
      setItem(null);
      setPets([]);
      setSelectedPet(null);
      setCart(null);
      setLocalCart([]);
      setCurrentService(null);
      setSelectedSlot(null);
      setGlobalCart([]);
      setAvailableDays({});
      setShowServices(true);
      setCalendarOffset(0);
      setIsLoading(true);
      dispatch(clearAppointments());
      loadInitialData();
    }, [params.id, params.serviceId, params.petId, params.q])
  );

  useEffect(() => {
    if (item?.partner?.id) {
      createCart();
    }
  }, [item]);

  useEffect(() => {
    if (!cart || !selectedPet || !currentService) return;
    getCalendar(calendarOffset);
  }, [cart, selectedPet, currentService]);

  const loadInitialData = async () => {
    try {
      const [partnerRes, petsRes] = await Promise.all([
        apiFetcher.getPartnersById(id),
        apiFetcher.getPets(),
      ]);

      setItem(partnerRes.data);
      setPets(petsRes.data);

      if (params.petId) {
        const p = petsRes.data.find((pet: any) => pet.id == params.petId);
        if (p) setSelectedPet(p);
      }

      let s = null;
      if (params.service_catalog_id || params.vaccine_id || params.catalog_code) {
        try {
          const servicesRes = await apiFetcher.getPartnerServices(id, {
            service_catalog_id: params.service_catalog_id,
            vaccine_id: params.vaccine_id,
            catalog_code: params.catalog_code
          });
          if (servicesRes && servicesRes.data && servicesRes.data.length > 0) {
            s = servicesRes.data[0];
          }
        } catch (e) {
          console.log("Error fetching specific services:", e);
        }
      } else if (params.serviceId) {
        s = partnerRes.data?.services?.find((serv: any) => serv.id == params.serviceId);
      }

      if (!s && params.q) {
        const normalizeString = (str: string) => {
          return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
        };

        const services = partnerRes.data?.services || [];
        const qNorm = normalizeString(params.q);

        s = services.find((serv: any) => serv.name && normalizeString(serv.name) === qNorm);

        if (!s) {
          s = services.find((serv: any) => {
            if (!serv.name) return false;
            const nameNorm = normalizeString(serv.name);
            return nameNorm.includes(qNorm) || qNorm.includes(nameNorm);
          });
        }

        if (!s) {
          s = services.find((serv: any) => {
            if (!serv.name) return false;
            const nameNorm = normalizeString(serv.name);
            const prefixLen = Math.min(nameNorm.length, qNorm.length, 8);
            if (prefixLen >= 5) {
              return nameNorm.substring(0, prefixLen) === qNorm.substring(0, prefixLen);
            }
            return false;
          });
        }
      }

      if (s) {
        setCurrentService(s);
        setShowServices(false);
      }
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

  const getCalendar = async (offset = 0) => {
    const today = new Date();
    const from = new Date(today);
    from.setDate(from.getDate() + offset);
    const date = from.toISOString().slice(0, 10);
    const date_to = addDays(from, CALENDAR_WINDOW - 1);

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

  const handleNextDays = () => {
    const newOffset = calendarOffset + CALENDAR_WINDOW;
    setCalendarOffset(newOffset);
    setSelectedSlot(null);
    getCalendar(newOffset);
  };

  const handlePrevDays = () => {
    const newOffset = Math.max(0, calendarOffset - CALENDAR_WINDOW);
    setCalendarOffset(newOffset);
    setSelectedSlot(null);
    getCalendar(newOffset);
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
      pet_name: it.pet?.name || "Sin mascota",
    }));

    setGlobalCart(normalized);
  };

  useEffect(() => {
    if (cart) {
      getGlobalCart();
    }
  }, [cart]);


  const removeGlobalItem = async (cartId: any, item_id: number) => {
    try {
      await apiFetcher.removeItemFromCart(cartId, item_id);
      await getGlobalCart();
    } catch (error) {
      console.log("Error al eliminar:", error);
    }
  };


  const addItemToCart = async () => {
    if (!selectedSlot || !selectedPet || !currentService || !cart) return;
    setIsAdding(true);

    const start_datetime = toRFC3339(selectedSlot.value);

    try {
      await apiFetcher.addItemToCart(
        cart,
        {
          pet_id: selectedPet.id,
          service_id: currentService.id,
          start_datetime,
        },
        Intl.DateTimeFormat().resolvedOptions().timeZone
      );
      await getGlobalCart();
      setCurrentService(null);
      setSelectedSlot(null);
      setShowServices(true);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.message || "No se pudo añadir el servicio",
      });
      throw error;
    } finally {
      setIsAdding(false);
    }
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
            onLoadMore={handleNextDays}
            onLoadPrev={handlePrevDays}
            canGoPrev={calendarOffset > 0}
            onCancel={() => {
              setCurrentService(null);
              setSelectedSlot(null);
              setShowServices(true);
            }}
          />
        )}

        {(selectedPet && currentService && selectedSlot || globalCart.length >= 0) && (
          <>
            <TouchableOpacity
              disabled={isAdding}
              onPress={async () => {
                try {
                  if (!selectedPet) {
                    Toast.show({
                      type: "error",
                      text1: "Error",
                      text2: "Selecciona una mascota",
                    });
                    return;
                  }

                  await addItemToCart();
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              <Text text70BL style={{ color: Colors.primaryColor }}>
                + Añadir otro servicio
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              bg-red30
              br100
              center
              disabled={isAdding}
              style={{ height: 50, marginTop: 20 }}
              onPress={async () => {
                try {
                  // Si el usuario está agregando un servicio nuevo
                  if (currentService && selectedSlot) {
                    await addItemToCart();
                    navigation.setParams({
                      petId: undefined,
                      serviceId: undefined,
                      q: undefined,
                      service_catalog_id: undefined,
                      vaccine_id: undefined,
                      catalog_code: undefined
                    });
                    navigation.navigate("Resume", { cart });
                    return;
                  }

                  // Si ya tiene servicios en el carrito
                  if (globalCart.length > 0) {
                    navigation.setParams({
                      petId: undefined,
                      serviceId: undefined,
                      q: undefined,
                      service_catalog_id: undefined,
                      vaccine_id: undefined,
                      catalog_code: undefined
                    });
                    navigation.navigate("Resume", { cart });
                    return;
                  }

                  Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Agrega al menos un servicio",
                  });
                } catch (error) {
                  console.log(error);
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
