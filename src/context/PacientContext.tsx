import React, { Dispatch, PropsWithChildren, SetStateAction, createContext, useState } from 'react'
import { View } from 'react-native'

interface FormatPacinet {
    pac_id:number | null,
    setPac_id:  Dispatch<SetStateAction<number|null>>
    pacient: Pacient | null;
    setPacient: Dispatch<SetStateAction<Pacient | null>>
}
interface Pacient {
    birthday: string;
    cpf: string;
    created_at: string;
    name: string;
    last_name: string;
    per_id: number;
    updated_at: string;
    status: string;
 
}

export const ContextPacient = createContext<FormatPacinet>({} as FormatPacinet);

const PacientContext:React.FC<PropsWithChildren> = ({children}) => {
    const [pac_id, setPac_id] = useState<number| null>(null);
    const [pacient, setPacient] = useState<Pacient | null>(null);
  return (
    <ContextPacient.Provider value={{pac_id, setPac_id, pacient, setPacient}}>
      {children}
    </ContextPacient.Provider>
  )
}

export default PacientContext
