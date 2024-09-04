import React, { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from 'react'


interface FormatBottomSheet {
    bottomSheetId: string | null
    setBottomSheetId?: Dispatch<SetStateAction<string>>
    openBottomSheet: (id: string) => void
    closeBottomSheet: () => void
}
export const ContextBottomSheet = createContext<FormatBottomSheet>({} as FormatBottomSheet);

export default function BottomSheetProvider({ children }: PropsWithChildren) {
    const [bottomSheetId, setBottomSheetId] = useState<string | null>(null)

    function openBottomSheet(id: string) {
        setBottomSheetId(id)
    }

    function closeBottomSheet() {
        setBottomSheetId(null)
    }

    return (
        <ContextBottomSheet.Provider value={{
            bottomSheetId,
            openBottomSheet,
            closeBottomSheet
        }}>
            {children}
        </ContextBottomSheet.Provider>
    )
}
