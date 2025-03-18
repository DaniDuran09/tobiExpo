import { NavigationProp } from '@react-navigation/native';


interface Appointment {
  date_service: string;
  appointment_status: string;
  appointment_pet_services: {
    appointment_time: {
      start_time: string;
    };
  }[];
}
