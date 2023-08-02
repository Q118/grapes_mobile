import { TextInput, TextInputProps, View } from "react-native";
import { Text, Button } from "react-native-rapi-ui";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MyMap, MyNumMap } from "./constants";

type FormRowWrapperProps = {
    label: string;
    onChangeText: (text: string) => void;
    onButtonPress: () => void;
    /** value for the textInput */
    inputValue: string;
}

const HELP_TEXT: MyMap = { 'Display Name': "How your name appears in the global feed.", 'Email': "Requires email confirmation for changes to take effect.", 'Password': '' };
const maxLength: MyNumMap = { 'Display Name': 8, 'Email': undefined, 'Password': 12, };


/**
 * @description wrapper component for a form row containing, label, input, helpText, and save button
 * mainly used in account screen but can be used elsewhere
 */
export function FormRowWrapper({ label, onChangeText, onButtonPress, inputValue, }: FormRowWrapperProps) {

    const saveButtonProps: any = {
        color: '#a8e4a0', size: "sm",
        textStyle: { color: '#2E3944' },
        style: {
            alignSelf: 'flex-end', 
            ...label !== 'Password' ? { marginTop: 20 } : { marginTop: 0 },
        },
        leftContent: <MaterialCommunityIcons name="content-save-check-outline" size={25} color="#2E3944" />,
    };

    const textInputProps: TextInputProps | Readonly<TextInputProps> = {
        autoCapitalize: "none", autoComplete: "off", autoCorrect: false,
        style: {
            color: "#cb9de2", backgroundColor: "#4E1E66", height: 50, borderRadius: 10,
            paddingHorizontal: 10, marginTop: 15, borderColor: '#cb9de2', borderWidth: 1,
        },
        selectionColor: '#cb9de2', placeholderTextColor: '#cb9de2',
    };

    return (
        <View key={label}>
            <Text style={{ color: '#a8e4a0', }}>{label}</Text>
            <TextInput placeholder={`Enter your ${label}`} {...textInputProps} value={inputValue} 
                onChangeText={onChangeText} key={`${label}-input`}
                secureTextEntry={label !== 'Password' ? false : true}
                keyboardType={label === 'Email' ? 'email-address' : 'default'}
                maxLength={maxLength[label]}
            />
            <Text size="sm" italic={true} style={{ color: '#cb9de2', marginTop: 5 }}>{HELP_TEXT[label]}</Text>
            <Button {...saveButtonProps} text={`Save ${label}`} key={`${label}-save`} onPress={onButtonPress} />
        </View>
    )
}



