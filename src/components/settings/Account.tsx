import React, { useState, useEffect } from "react";
import { ScrollView, KeyboardAvoidingView, Platform, Alert, Button, View, Linking } from "react-native";
import { useHeaderHeight } from '@react-navigation/elements';
import { supabase } from '../../initSupabase';
import { useAuthContext, AuthUser } from "../../contexts/AuthProvider";
import { AccountService } from "../../services/AccountService";
import Loading from "../../utils/Loading";
import { FormRowWrapper } from "../../utils/FormRowWrapper";
import { MyMap } from "../../utils/constants";
import { FormState } from "../../types";

// !! PU around here and make that confirm new password appearence work better


// TODO rework the keybiard avoiding logic noiw that we have bottom nav.

async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (!error) alert("Signed out!");
    if (error) alert(error.message);
};

const support_url = "https://grapes-admin.vercel.app/?emailupdate?id=";


export function Account() {
    const { sessionUser, setSessionUser } = useAuthContext();
    const [ loading, setLoading ] = useState<boolean>(false);
    const height = useHeaderHeight();
    const defaultFormState: FormState = {
        display: sessionUser?.display_name || sessionUser?.email || "",
        email: sessionUser?.email || "",
        password: "********",
    };
    const [ formState, setFormState ] = useState<FormState>(defaultFormState);

    useEffect(() => { setFormState(defaultFormState); }, [ sessionUser ]);

    const showConfirmDialog = (key: string) => Alert.alert("Are you sure?",
        `Are you sure you want to permanetly change your ${key === 'display' ? 'display name' : key}?`, [
        { text: "Cancel", style: "cancel", onPress: () => handleCancelClick(key) },
        {
            text: "OK", onPress: () => {
                setLoading(true);
                handleConfirmChange(key).finally(() => setLoading(false));
            }
        },
    ]);

    const showConfirmLogout = () => Alert.alert("Are you sure?",
        "Are you sure you want to sign out of your account?", [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: async () => await handleLogout() },
    ]);


    function handleCancelClick(key: string) {
        if (key === 'email') return setFormState({ ...formState, email: sessionUser!.email });
        if (key === 'password') return setFormState({ ...formState, password: "********" });
        if (key === 'display') return setFormState({ ...formState, display: sessionUser!.display_name });
    };


    async function handleConfirmChange(key: string) {
        const displayKey: string = key === 'display' ? 'display name' : key;
        if (formState[ key ] && formState[ key ]!.length < 6) return alert(`${displayKey} must be at least 6 characters.`);
        try {
            const accountService = new AccountService();
            const user = await accountService.changeConfig(formState[ key ], key);
            if (user) {
                const userString: string = JSON.stringify(user);
                const _user = JSON.parse(userString);
                if ((_user.message && _user.message.includes('unique constraint')) && key === 'display') {
                    handleCancelClick(key); // reset the value back
                    return alert(`Display Name already exists, please choose another.`);
                }
                if (key === 'email') setSessionUser!({ ...sessionUser, email: formState.email } as AuthUser);
                if (key === 'display') setSessionUser!({ ...sessionUser, display_name: formState.display } as AuthUser);
                return alert(`${displayKey} updated!`);
            }
            else if (user == null) {
                handleCancelClick(key);
                return alert(`Error updating ${displayKey}.`);
            }
        } catch (error: any) {
            alert(`Error updating ${displayKey}: ${error.message}`);
            return handleCancelClick(key);
        }
    };

    const confirmEmailChange = () => Alert.alert("Are you sure?",
        "This will direct you to an external webpage to enter your new email value. Your current session will be logged out.", [
        { text: "Cancel", style: "cancel", onPress: () => handleCancelClick('email') },
        { text: "Take me there", onPress: async () => await handleEmailChange() },
    ]);

    const handleEmailChange = async () => {
        setLoading(true);
        if (sessionUser && sessionUser.user_uid) {
            await Linking.openURL(support_url + sessionUser.user_uid);
            // then log them out so they can verify their new email
            setLoading(false);
            await handleLogout();
        }
        return setLoading(false);
    };

    // const renderConfirmNewPW = () => <FormRowWrapper label="Confirm New Password" inputValue={formState.password} key="confirm" />;


    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} enabled
            style={{ flex: 1, paddingHorizontal: 20 }} keyboardVerticalOffset={height + 200}
        >
            {loading ? <Loading /> : (
                <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#2E3944", marginTop: 20, paddingBottom: 40 }} >
                    <View style={{ marginBottom: 20, borderColor: '#4E1E66', borderWidth: 2, backgroundColor: "#3d4b59", borderRadius: 10 }}>
                        <Button color="#a8e4a0" title='Logout' onPress={() => showConfirmLogout()} />
                    </View>
                    <FormRowWrapper label="Display Name" inputValue={formState.display}
                        onChangeText={(text) => setFormState({ ...formState, display: text })}
                        onButtonPress={() => showConfirmDialog('display')} key="display"
                        btnText="Save Display Name"
                    />
                    <FormRowWrapper label="Email" inputValue={formState.email}
                        onChangeText={(text) => setFormState({ ...formState, email: text })}
                        onButtonPress={() => confirmEmailChange()}
                        key="email" btnText="Change Email"
                    />
                    <FormRowWrapper label="Password" inputValue={formState.password}
                        onChangeText={(text) => setFormState({ ...formState, password: text })}
                        onButtonPress={() => showConfirmDialog('password')} key="password" btnText="Save New Password"
                    />
                </ScrollView>
            )}
        </KeyboardAvoidingView>
    )
}
