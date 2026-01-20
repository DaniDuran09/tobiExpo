import { Text, TouchableOpacity, View } from "react-native-ui-lib"

type ServiceProps = ServiceItem & {
    addToLocalCart: (item: CartItem) => void;
};

type ServiceItem = {
    id: number;
    name: string;
    price: string;
    duration_minutes: string;
};

const Service = ({
    id,
    name,
    price,
    duration_minutes,
    addToLocalCart,
}: ServiceProps) => {
    return (
        <View>
            <View width={'100%'} height={50} marginT-10 row spread paddingH-15>
                <Text flex>{name}</Text>
                <View marginH-20 style={{ alignItems: 'flex-end' }}>
                    <Text>{price}</Text>
                    <Text text90T grey40>{duration_minutes} min</Text>
                </View>
                <TouchableOpacity bg-black style={{ height: 30, width: 70, justifyContent: 'center', alignItems: 'center', borderRadius: 50 }}
                    onPress={() =>
                        addToLocalCart({
                            id,
                            service_id: id,
                            name,
                            price,
                            duration_minutes,
                            pet_id: 1,
                            start_datetime: new Date().toISOString(),
                        })
                    }

                >
                    <Text white>Añadir</Text>
                </TouchableOpacity>
            </View>
            <View width={'100%'} height={1} style={{ backgroundColor: '#b1b1b1' }} />
        </View>

    )
}

export default Service;