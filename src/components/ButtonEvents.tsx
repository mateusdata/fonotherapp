import * as React from 'react';
import { FAB, Portal, PaperProvider } from 'react-native-paper';
import { colorPrimary } from '../style/ColorPalette';
import { useNavigation } from '@react-navigation/native';

const ButtonEvents = () => {
    const [state, setState] = React.useState({ open: false });
    const navigate:any = useNavigation();
    const onStateChange = ({ open }) => setState({ open });

    const { open } = state;

    return (
        <PaperProvider>
            <Portal>
                <FAB.Group
                    open={open}
                    visible
                    backdropColor={true ? '#f2f2f0' : 'white'}
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
