import { ReactElement, ReactNode } from "react";
import { View } from "react-native-ui-lib";
import Header from "./Header";
import { Colors } from "../../../styles/Colors"; 

export default function Layout({ children, footer }: { children: ReactNode, footer?: ReactElement }) {
    return (
        <View flex backgroundColor={Colors.danger} style={{ padding: "10%" }}>
            <View>
                <Header />
                {children}
            </View>
            {footer}
        </View>
    )
}