import React from "react";
import { StyleSheet, View, Switch, TouchableWithoutFeedback, Text, Alert } from "react-native";
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import { useDispatch, useSelector } from 'react-redux';
import { createCard } from "../services";
import { updateData } from "../redux/generalDuck";

const s = StyleSheet.create({
    switch: {
        alignSelf: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    container: {
        backgroundColor: "#F5F5F5",
        marginTop: 60,
    },
    label: {
        color: "black",
        fontSize: 12,
    },
    input: {
        fontSize: 16,
        color: "black",
    },
});

const CreateCard = ({ navigation }) => {

    const dispatch = useDispatch()
    const { token } = useSelector(store => store.general.user)
    const update = useSelector(store => store?.general?.update)
    const [loading, setLoading] = React.useState(false)
    const [state, setState] = React.useState({
        data: {}
    })

    const _onChange = (formData) => setState({ data: formData });
    const _onFocus = (field) => null;
    const _submit = () => {
        setLoading(true)
        const { valid, values } = state.data
        if (valid) {
            const date = values.expiry.split('/');
            const card_number = values.number.replace(/ /g, "")
            const payload = {
                card_number: card_number,
                month: parseInt(date[0]),
                year: parseInt(date[1]),
                cvv: values.cvc,
                brand: values.type
            }
            createCard(token, payload)
                .then((response) => {
                    
                    dispatch(updateData(!update))
                    setLoading(false)
                    navigation.goBack()

                })
                .catch((err) => {
                    setLoading(false)
                    console.log('err', err.response)
                    Alert.alert('Sucedio un error!', 'El servicio no esta disponible', [
                        { text: 'OK', onPress: () => null },
                    ]);
                })
        } else {
            Alert.alert('Tobi', 'Debes llenar todos los campos', [
                { text: 'OK', onPress: () => null },
            ]);
        }

    }

    return (
        <View style={s.container}>
            
            <CreditCardInput
                autoFocus
                cardImageFront={require('../assets/cardColor.png')}
                requiresName
                requiresCVC
                requiresPostalCode={false}

                labelStyle={s.label}
                inputStyle={s.input}
                validColor={"black"}
                invalidColor={"red"}
                placeholderColor={"darkgray"}

                onFocus={_onFocus}
                onChange={_onChange} />
            <View style={{ width: '100%', alignItems: 'center', paddingTop: 50 }}>
                <TouchableWithoutFeedback onPress={_submit}>
                    <View style={{ height: 50, width: '80%', backgroundColor: '#EF4136', borderRadius: 10, justifyContent: 'center', marginBottom: 20 }}>
                        <Text style={{ textAlign: 'center', fontSize: 16, color: 'white', fontWeight: '700' }}>Siguiente</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>

        </View>
    );
}

export default CreateCard