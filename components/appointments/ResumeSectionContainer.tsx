import { ReactNode } from "react"
import { View, Text } from "react-native-ui-lib"

type Pros = {
    title: string,
    children: ReactNode
}
const ResumeSectionContainer = ({ title, children }: Pros) => {
    return (
        <View>
            <View marginB-20>
                <Text text70BO>{title}</Text>
                <View marginT-10 row centerV gap-8 width={"70%"} style={{flexWrap:"wrap"}}>
                   {children}
                </View>
            </View>
        </View>
    )
}
export default ResumeSectionContainer