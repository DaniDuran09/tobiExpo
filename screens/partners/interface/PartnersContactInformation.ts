export interface PartnersContactInformationProps{
    partner:{
        latitude:string
        longitude:string
        name:string
        description:string
        phone:string
    }
    handleDirections:()=>void
}
