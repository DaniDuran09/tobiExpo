import { Colors } from "./Colors";

export const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 1,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: Colors.primaryColor, // Cambia a color primario cuando está activo
    stepStrokeWidth: 1,
    stepStrokeFinishedColor: Colors.primaryColor, // Color primario cuando está completado
    stepStrokeUnFinishedColor: Colors.black, // Negro cuando no está completado
    separatorFinishedColor: Colors.primaryColor, // Color primario para el separador completado
    separatorUnFinishedColor: Colors.black, // Negro para el separador no completado
    stepIndicatorFinishedColor: Colors.primaryColor, // Color primario para el indicador completado
    stepIndicatorUnFinishedColor: Colors.black, // Negro para el indicador no completado
    stepIndicatorCurrentColor: Colors.primaryColor, // Color primario para el indicador actual
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: Colors.primaryColor, // Negro para el texto del indicador actual
    stepIndicatorLabelFinishedColor: Colors.primaryColor, // Color primario para el texto del indicador completado
    stepIndicatorLabelUnFinishedColor: Colors.black, // Negro para el texto del indicador no completado
    labelColor: Colors.black,
    labelSize: 13,
    currentStepLabelColor: Colors.primaryColor, // Color primario para la etiqueta actual
  };
