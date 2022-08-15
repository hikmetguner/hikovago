export interface RegistrationDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    roles: string[];
    clientURI: string;
}
