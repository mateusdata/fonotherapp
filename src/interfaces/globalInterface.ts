import { Dispatch, SetStateAction } from "react";

export interface LoginInterface {
    email: string;
    senha: string;
}
export interface FormatPacient {
    pac_id: number;
    current_food_intake_method: string;
    base_diseases: string;
    consultation_reason: string;
    food_profile: string;
    name: string;
    chewing_complaint: string;
    education: string;
    status: string;
    person?: {
        last_name: string;
        cpf: string;
        birthday: string;
        gender: string;
        per_id?: string;
        use_id?: string;
        created_at?: string;
        updated_at: string
        name: string;

    },
    questionnaires: [
        {
            qus_id: number;
            name: string;
            purpose: string;
            sections: [
                {
                    qhs_id: number;
                    qus_id: number;
                    name: string;
                    questions: [
                        {
                            que_id: number;
                            name: string;
                            alternatives: any;
                            answer: {
                                qua_id: number;
                                alternative: number;
                            }
                        }
                    ]
                }
            ]
        },

    ]
}
/*
export interface FormatUser {
    token: string;
    email: string;
    usu_id: number;
    doc_id: number;
    nick_name: string;
    gov_license: string;
    phone: string;
    ddd: string;
    number: string
    photo: string;
    nomeGoogle: string
}
*/

export interface ContextProps {
    user: FormatUser | null;
    setUser: Dispatch<SetStateAction<FormatUser | null>>;
    logOut: () => any;
    loadingAuth: boolean;
    setLoadingAuth: Dispatch<SetStateAction<boolean>>;
    accessToken: string 
    setAccessToken:  Dispatch<SetStateAction<string >>;


}

//interface do token
  


//interface do usuario  

interface PhoneNumber {
    pho_id: number;
    per_id: number;
    ddi: string;
    ddd: string;
    number: string;
    status: string;
    verified: boolean;
    last_contact: string | null;
    created_at: string;
    updated_at: string;
}

interface Address {
    add_id: number;
    per_id: number;
    city: string;
    state: string;
    status: string;
    country: string;
    line1: string;
    line2: string | null;
    postal_code: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

interface Person {
    per_id: number;
    use_id: number;
    name: string;
    last_name: string | null;
    cpf: string | null;
    birthday: string | null;
    created_at: string | null;
    updated_at: string | null;
    phone_numbers: PhoneNumber[];
    addresses: Address[];
}

interface Doctor {
    doc_id: number;
    use_id: number;
    gov_license: string;
    created_at: string;
    updated_at: string;
}

export interface FormatUser {
    use_id: number;
    nick_name: string;
    email: string;
    has_plan: boolean;
    recover_password: boolean;
    verification_code: string;
    expiration_date: string;
    status: string;
    created_at: string;
    updated_at: string;
    doctor: Doctor;
    person: Person;
}

