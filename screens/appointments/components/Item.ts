export interface Pet {
    id: number;
    name: string;
    picture: string;
    display_name?: string;
}

export interface Service {
    id: number;
    name: string;
    description: string;
    picture: string;
    price: string;
    price_total: string;
}

export interface Address {
    id: number;
    city: string;
    country_code: string;
    number: string;
    postal_code: string;
    state: string;
    street: string;
}

export interface Partner {
    id: number;
    name: string;
    picture: string;
    email: string;
    phone: string;
    description: string;
    latitude: string;
    longitude: string;
    address?: string;
    addresses?: Address[];
}

export interface AppointmentTime {
    start_time: string;
    end_time: string;
}

export interface AppointmentPetService {
    pet: Pet;
    service: Service;
    user: any; // Specialist
    appointment_time: AppointmentTime;
}

export interface Appointment {
    id: number;
    name: string;
    date_service: string | null;
    appointment_status: string;
    payment_status: string;
    partner: Partner;
    appointment_pet_services: AppointmentPetService[];
    appointment_time: AppointmentTime;
}

export interface Visit {
    id: number;
    expected_start_time: string;
    expected_end_time: string;
    status: string;
    checked_in_at: string | null;
    checkin_available: boolean;
    appointments: Appointment[];
}