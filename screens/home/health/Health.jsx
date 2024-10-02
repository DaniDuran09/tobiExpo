import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../../../styles/Colors';
import SelectVaccines from './SelectVaccines';
import InformationView from './InformationView';
import vaccineImage from '../../../assets/vet-option1.png';
import dewormingImage from '../../../assets/vet-option2.png';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import despa from '../../../assets/despa-black.png';
import DatePicker from 'react-native-date-picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import ChallengeModal from '../../../components/ChallengeModal';
import FinishScreen from './FinishScreen';
import {Dropdown} from 'react-native-element-dropdown';

const Health = (props) => {
  const {pet} = props
  const [vaccineVisible, setVaccineVisible] = useState(false);
  const [deworming, setDeworming] = useState(false);
  const [dewormingVisible, setDewormingVisible] = useState(false);
  const [date, setDate] = React.useState(new Date());
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({
    date: '',
  });
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [challengeVisible, setChallengeVisible] = useState(false);
  const [finishScreen, setFinishScreen] = useState(false);

  const brand = [
    {label: 'Item 1', value: '1'},
    {label: 'Item 2', value: '2'},
    {label: 'Item 3', value: '3'},
    {label: 'Item 4', value: '4'},
    {label: 'Item 5', value: '5'},
    {label: 'Item 6', value: '6'},
    {label: 'Item 7', value: '7'},
    {label: 'Item 8', value: '8'},
  ];

  const closeModalChallenge = () => {
    setFinishScreen(true);
    setChallengeVisible(false);
  };

  const nextStep = () => {
    // setDeworming(true);
    setFinishScreen(true);
    setChallengeVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1, padding: 5}}>
      <View style={styles.container}>
        {!finishScreen ? (
          <>
            {!deworming ? (
              <View>
                {!vaccineVisible ? (
                  <InformationView
                    image={vaccineImage}
                    text={
                      'Te ayudamos a tener tu mascota sana. Completa el esquema de salud para darle seguimiento. '
                    }
                    type={'vacunas'}
                    changeVisible={setVaccineVisible}
                  />
                ) : (
                  <SelectVaccines petId={pet.id} onSaveVaccines={nextStep}/>
                )}
                {/* {vaccineVisible && (
                  
                )} */}
              </View>
            ) : (
              <View>
                {!dewormingVisible ? (
                  <InformationView
                    image={dewormingImage}
                    text={
                      'La desparasitación es esencial para reducir los parásitos internos y externos de tu mascota. Completa el registro para darle seguimiento.'
                    }
                    type={'desparacitación'}
                    changeVisible={setDewormingVisible}
                  />
                ) : (
                  <View style={styles.containerSelectSection}>
                    <Text style={styles.selectText}>
                      1. ¿Con que frecuencia desparasitas a tu mascota?
                    </Text>
                    <View style={styles.containerVaccinesSections}>
                      <Image
                        source={despa}
                        style={styles.vaccinesImage}
                        resizeMode="contain"
                      />
                      <View>
                        <View style={styles.vaccine}>
                          <TouchableOpacity onPress={() => {}}>
                            <Icon
                              name="crop-square"
                              size={25}
                              color={Colors.gray}
                            />
                          </TouchableOpacity>
                          <View>
                            <Text style={styles.vaccineName}>Mensual</Text>
                          </View>
                        </View>
                        <View style={styles.vaccine}>
                          <TouchableOpacity onPress={() => {}}>
                            <Icon
                              name="crop-square"
                              size={25}
                              color={Colors.gray}
                            />
                          </TouchableOpacity>
                          <View>
                            <Text style={styles.vaccineName}>Trimestral</Text>
                          </View>
                        </View>
                        <View style={styles.vaccine}>
                          <TouchableOpacity onPress={() => {}}>
                            <Icon
                              name="crop-square"
                              size={25}
                              color={Colors.gray}
                            />
                          </TouchableOpacity>
                          <View>
                            <Text style={styles.vaccineName}>
                              No lo he desparasitado
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.selectText}>
                      2. ¿Cuándo fue la última desparasitación de tu mascota?
                    </Text>
                    <TouchableOpacity
                      style={styles.textInput}
                      onPress={() => setOpen(true)}>
                      {/* <DatePicker
                        modal
                        open={open}
                        date={date}
                        onConfirm={date => {
                          setOpen(false);
                        }}
                        onCancel={() => {
                          setOpen(false);
                        }}
                        locale={'es'}
                        mode={'date'}
                        title={'Elegir fecha'}
                      /> */}
                      <Text style={styles.vaccineName}>
                        {data.date === ''
                          ? 'Elegir fecha'
                          : `${data?.date.toLocaleDateString('es-us')}`}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.selectText}>3. ¿Qué tipo?</Text>
                    <View style={styles.containerVaccinesSections}>
                      <View style={styles.vaccinesImage} />
                      <View>
                        <View style={styles.vaccine}>
                          <TouchableOpacity onPress={() => {}}>
                            <Icon
                              name="crop-square"
                              size={25}
                              color={Colors.gray}
                            />
                          </TouchableOpacity>
                          <View>
                            <Text style={styles.vaccineName}>Interna</Text>

                            <Dropdown
                              style={[
                                styles.dateButton,
                                isFocus && {borderColor: 'blue'},
                              ]}
                              placeholderStyle={styles.placeholderStyle}
                              selectedTextStyle={styles.selectedTextStyle}
                              iconStyle={styles.iconStyle}
                              data={brand}
                              maxHeight={300}
                              labelField="label"
                              valueField="value"
                              placeholder={!isFocus ? 'Marca' : '...'}
                              value={value}
                              onFocus={() => setIsFocus(true)}
                              onBlur={() => setIsFocus(false)}
                              onChange={item => {
                                setValue(item.value);
                                setIsFocus(false);
                              }}
                              // renderLeftIcon={() => (
                              //   <AntDesign
                              //     style={styles.icon}
                              //     color={isFocus ? 'blue' : 'black'}
                              //     name="Safety"
                              //     size={20}
                              //   />
                              // )}
                            />

                            <TouchableOpacity
                              style={styles.dateButton}
                              onPress={() => {}}>
                              <Text style={styles.dateText}>Aplicado por</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={styles.vaccine}>
                          <TouchableOpacity onPress={() => {}}>
                            <Icon
                              name="crop-square"
                              size={25}
                              color={Colors.gray}
                            />
                          </TouchableOpacity>
                          <View>
                            <Text style={styles.vaccineName}>Externa</Text>
                           
                              <Dropdown
                                style={[
                                  styles.dateButton,
                                  isFocus && {borderColor: 'blue'},
                                ]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                iconStyle={styles.iconStyle}
                                data={brand}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus ? 'Marca' : '...'}
                                value={value}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                  setValue(item.value);
                                  setIsFocus(false);
                                }}
                                // renderLeftIcon={() => (
                                //   <AntDesign
                                //     style={styles.icon}
                                //     color={isFocus ? 'blue' : 'black'}
                                //     name="Safety"
                                //     size={20}
                                //   />
                                // )}
                              />
                            <TouchableOpacity
                              style={styles.dateButton}
                              onPress={() => {}}>
                              <Text style={styles.dateText}>Aplicado por</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => setChallengeVisible(true)}>
                        <Text style={styles.textButton}>Confirmar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

            <ChallengeModal
              closeModalChallenge={closeModalChallenge}
              challengeVisible={challengeVisible}
              text={
                '¡Muy bien! El esquema de salud de tu mascota está completo.'
              }
            />
          </>
        ) : (
          <FinishScreen />
        )}
      </View>
    </ScrollView>
  );
};

export default Health;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  selectText: {
    fontSize: 14,
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
  mainContent: {
    flexGrow: 1,
  },

  containerSelectSection: {
    marginTop: '10%',
  },
  containerVaccinesSections: {
    marginTop: '5%',
    backgroundColor: Colors.lightBlue,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
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
    fontSize: 16,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: Colors.lightBlue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
    borderRadius: 4,
    height: 60,
    marginTop: '5%',
    marginBottom: '5%',
  },
  dateButton: {
    backgroundColor: Colors.white,
    width: 100,
    padding: 8,
    marginTop: '4%',
  },
});
