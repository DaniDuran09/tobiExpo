import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import DatePicker from 'react-native-date-picker';
import {Colors} from '../../../styles/Colors';
import {Dropdown} from 'react-native-element-dropdown';
import {useNavigation} from '@react-navigation/native';
import ApiFetcher from '../../../modules/ApiFetcher';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Loading from '../../../components/Loading';
import {formatDateToDDMMYYYY} from '../../../utils/scripts';
import Toast from 'react-native-toast-message';
import EmptyVaccines from '../../../components/vaccines/EmptyVaccines';
import { Checkbox, Text } from 'react-native-ui-lib';

const SelectVaccines = props => {
  const {petId, onSaveVaccines} = props;
  const apiFetcher = new ApiFetcher();
  const navigation = useNavigation();
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectPartner, setSelectPartner] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [vaccines, setVaccines] = useState([]);
  const [brands, setBrands] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    getVaccines();
  }, []);

  const getVaccines = async () => {
    setLoading(true);
    try {
      const response = await apiFetcher.getVaccines(petId);
      if (response.code == 200) {
        const newVaccines = response.data.vaccines.map(vaccine => ({
          ...vaccine,
          isChecked: false,
          description: vaccine.description
            ? vaccine.description.split(', ').map(desc => desc.trim())
            : [],
        }));
        setVaccines(newVaccines);
        const data = response.data.vaccine_brands.map(vaccine => ({
          label: vaccine,
          value: vaccine,
        }));
        setBrands(data);
      }
    } catch (error) {
      console.log('Error: ', error);
    } finally {
      setLoading(false);
    }
  };

  const openDatePicker = id => {
    setVaccines(
      vaccines.map(vaccine =>
        vaccine.id === id ? {...vaccine, open: true} : vaccine,
      ),
    );
  };

  const setDate = (id, date) => {
    setVaccines(
      vaccines.map(vaccine =>
        vaccine.id === id ? {...vaccine, date: date, open: false} : vaccine,
      ),
    );
  };

  const insertVaccine = async data => {
    const response = await apiFetcher.saveVaccine(data);
    console.log('Response: ', response);
  };

  const save = async () => {
    setSaveLoading(true);
    const checkedVaccines = vaccines.filter(vaccine => vaccine.isChecked);

    if (checkedVaccines.length === 0) {
      if (onSaveVaccines) {
        onSaveVaccines();
      }
      return;
    }

    let allVaccinesInserted = true;

    for (const vaccine of checkedVaccines) {
      if (
        vaccine.application_day === undefined ||
        vaccine.brand === undefined
      ) {
        Toast.show({
          type: 'error',
          text1: 'Datos incompletos',
          text2: `Completa todos los datos de las vacunas seleccionadas`,
        });
        allVaccinesInserted = false;
        break;
      } else {
        const data = {
          pet_id: petId,
          vaccine_id: vaccine.id,
          application_day: vaccine.application_day,
          dose: vaccine.dose,
          brand: vaccine.brand,
        };
        try {
          console.log('La data a mandar: ', data);
          await insertVaccine(data);
          Toast.show({
            type: 'success',
            text1: 'Vacunas guardadas',
            text2: `Se guardaron las vacunas con éxito`,
          });
        } catch (error) {
          console.error('Error inserting vaccine: ', error);
          Toast.show({
            type: 'error',
            text1: 'Error al guardar las vacunas',
            text2: `Ha ocurrido un problema, inténtelo de neuvo más tarde`,
          });
          allVaccinesInserted = false;
        } finally {
          setLoading(false);
        }
      }
    }

    if (allVaccinesInserted && onSaveVaccines) {
      onSaveVaccines();
    }
  };

  const handleSelectPartner = name => {
    setSelectPartner(name);
    navigation.goBack();
    navigation.goBack();
  };

  return (
    <>
      {loading ? (
        <Loading
          textColor={Colors.primaryColor}
          backgroundColorProp={Colors.white}
        />
      ) : (
        <View style={styles.containerSelectSection}>
          {vaccines.length > 0 ?
          <>
          <Text text70>
            1. Selecciona las vacunas que tiene tu mascota
          </Text>
          <View style={styles.containerVaccinesSections}>
            
            <Image
              source={require('../../../assets/vaccines.png')}
              style={styles.vaccinesImage}
            />
            <View>
              {vaccines.map(vaccine => (
                <View key={vaccine.id} style={styles.vaccine}>
                  <View style={{marginTop: 5}}>
                  
                    {/* <BouncyCheckbox
                      value={true}
                      size={20}
                      fillColor="#EF4136"
                      iconStyle={{borderColor: Colors.primaryColor}}
                      innerIconStyle={{borderWidth: 2}}
                      isChecked={vaccine.isChecked}
                      onPress={checked => {
                        setVaccines(
                          vaccines.map(v =>
                            v.id === vaccine.id
                              ? {...v, isChecked: checked}
                              : v,
                          ),
                        );
                      }}
                    /> */}
                    {/* <Checkbox value={false} onValueChange={() => console.log('value changed')}/> */}
                  </View>
                  <View>
                    <Text style={styles.vaccineName}>{vaccine.name}</Text>
                    {vaccine?.description?.length > 0 &&
                      vaccine?.description?.map((subVaccine, index) => (
                        <Text key={index}>· {subVaccine}</Text>
                      ))}

                    <TouchableOpacity
                      disabled={!vaccine.isChecked}
                      style={[
                        styles.dateButton,
                        !vaccine.isChecked && {opacity: 0.5},
                      ]}
                      onPress={() => openDatePicker(vaccine.id)}>
                      <Text style={styles.dateText}>
                        {vaccine.application_day
                          ? vaccine?.application_day
                          : 'Fecha de aplicación'}
                      </Text>
                    </TouchableOpacity>
                    {/* <DatePicker
                      modal
                      open={vaccine.open}
                      date={vaccine.date || new Date()}
                      onConfirm={date => {
                        setVaccines(
                          vaccines.map(v =>
                            v.id === vaccine.id
                              ? {
                                  ...v,
                                  application_day: formatDateToDDMMYYYY(date),
                                }
                              : v,
                          ),
                        );
                      }}
                      onCancel={() =>
                        setVaccines(
                          vaccines.map(v =>
                            v.id === vaccine.id ? {...v, open: false} : v,
                          ),
                        )
                      }
                      locale={'es'}
                      mode={'date'}
                      maximumDate={new Date()}
                      title={'Fecha de aplicación'}
                    /> */}
                    <TouchableOpacity
                      disabled={!vaccine.isChecked}
                      style={[
                        styles.dateButton,
                        !vaccine.isChecked && {opacity: 0.5},
                      ]}
                      onPress={() => {}}>
                      <Dropdown
                        disable={!vaccine.isChecked}
                        style={[
                          styles.dropdown,
                          isFocus && {borderColor: 'blue'},
                        ]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        iconStyle={styles.iconStyle}
                        data={brands}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Marca' : '...'}
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                          setVaccines(
                            vaccines.map(v =>
                              v.id === vaccine.id
                                ? {...v, brand: item.value}
                                : v,
                            ),
                          );
                          setIsFocus(false);
                        }}
                      />
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() =>
                      navigation.navigate('SelectPartner', {
                        action: handleSelectPartner,
                      })
                    }>
                    <Text style={styles.dateText}>
                      {`Aplicado por ${selectPartner}`}
                    </Text>
                  </TouchableOpacity> */}
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={save}>
              {saveLoading ? (
                <ActivityIndicator size="large" color={Colors.primaryColor} />
              ) : (
                <Text style={styles.textButton}>Confirmar</Text>
              )}
            </TouchableOpacity>
          </View>
          </>
          :
          <EmptyVaccines/>
          }
        </View>
      )}
    </>
  );
};

export default SelectVaccines;

const styles = StyleSheet.create({
  containerSelectSection: {
    marginTop: '10%',
  },
  containerVaccinesSections: {
    marginTop: '5%',
    backgroundColor: Colors.lightBlue,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  vaccinesImage: {
    height: 30,
    width: 30,
    marginTop: 10,
    marginLeft: 10,
  },
  vaccine: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
    marginLeft: 10,
  },
  vaccineName: {
    fontSize: 18,
    fontWeight: '600',
  },
  dateButton: {
    backgroundColor: Colors.white,
    width: '75%',
    padding: 8,
    marginTop: '4%',
  },
  dateText: {
    color: Colors.gray,
  },
  buttonContainer: {
    marginTop: '10%',
  },
  button: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    borderColor: Colors.primaryColor,
  },
  textButton: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryColor,
  },
});
