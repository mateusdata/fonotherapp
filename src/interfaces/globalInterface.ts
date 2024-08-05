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
    first_name: string;
    chewing_complaint: string;
    education: string;
    status: string;
    person?: {
        last_name: string;
        cpf: string;
        birthday: string ;
        gender: string;
        per_id?: string;
        use_id?: string;
        created_at?: string;
        updated_at: string
        first_name: string;

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
                    questions:[
                        {
                            que_id:number;
                            name:string;
                            alternatives:any;
                            answer:{
                                qua_id: number;
                                alternative:number;
                            }
                        }
                    ]
                }
            ]
        },

    ]
}

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

export interface ContextProps {
    user: FormatUser| null;
    setUser: Dispatch<SetStateAction<FormatUser| null>>;
    logOut: () => any;
    logado: any,
    loadingAuth: boolean;
    setLoadingAuth: Dispatch<SetStateAction<boolean>>;
    

}
