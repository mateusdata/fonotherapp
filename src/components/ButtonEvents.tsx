import * as React from 'react';
import { FAB, Portal, PaperProvider } from 'react-native-paper';
import { colorPrimary } from '../constants/ColorPalette';
import { useNavigation } from '@react-navigation/native';
import { vibrateFeedbackWarning } from '../utils/vibrateFeedbackWarning';

const ButtonEvents = () => {
    const [state, setState] = React.useState({ open: false });
    const navigate:any = useNavigation();
    const onStateChange = ({ open }) => {
        vibrateFeedbackWarning()
        setState({ open })
    };

    const { open } = state;

    return (
        <PaperProvider >
            <Portal >
                <FAB.Group
                    open={open}
                    visible
                    backdropColor={true ? '#F3F4F6' : 'white'}
                    fabStyle={{
                        backgroundColor: colorPrimary
                    }}
                    color={"white"}
                    icon={open ? 'calendar-today' : 'plus'}
                    actions={[
                        {
                            icon: 'bell',
                            label: 'Meus eventos',
                            onPress: () => navigate.navigate("MyAgenda"),
                            color: "white", 
                            style: { backgroundColor: colorPrimary }, 
                            labelTextColor: "black" 
                        },
                        {
                            icon: 'plus',
                            label: 'Criar evento',
                            onPress: () => navigate.navigate("AddEventScreen"),
                            color: "white", 
                            style: { backgroundColor: colorPrimary }, 
                            labelTextColor: "black" 
                        },
                    ]}
                    onStateChange={onStateChange}
                    onPress={() => {
                        if (open) {
                            
                        }
                    }}
                />
            </Portal>
        </PaperProvider>
    );
};

export default ButtonEvents;
