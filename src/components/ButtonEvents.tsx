import * as React from 'react';
import { FAB, Portal, PaperProvider } from 'react-native-paper';
import { colorPrimary } from '../style/ColorPalette';
import { useNavigation } from '@react-navigation/native';

const ButtonEvents = () => {
    const [state, setState] = React.useState({ open: false });
    const navigate:any = useNavigation()
    const onStateChange = ({ open }) => setState({ open });

    const { open } = state;

    return (
        <PaperProvider>
            <Portal>
                <FAB.Group
                    open={open}
                    visible
                    backdropColor='#f2f2f0'
                    color={colorPrimary}
                    icon={open ? 'calendar-today' : 'plus'}
                    actions={[

                        {
                            icon: 'bell',
                            label: 'Meus evento',
                            onPress: () =>  navigate.navigate("MyAgenda"),
                        },
                        {
                            icon: 'plus',
                            label: 'Criar evento',
                            onPress: () =>  navigate.navigate("AddEventScreen"),
                        },
                    ]}
                    onStateChange={onStateChange}
                    onPress={() => {
                        if (open) {
                            // do something if the speed dial is open
                        }
                    }}
                />
            </Portal>
        </PaperProvider>
    );
};

export default ButtonEvents;