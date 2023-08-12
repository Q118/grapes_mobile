import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { KeyboardAvoidingView, Platform, ScrollView, Button, Text, View } from "react-native";
import { HomeFormWrapper } from "../../utils/HomeFormWrapper";
import { useHeaderHeight } from '@react-navigation/elements';
import Loading from "../../utils/Loading";
import { useAuthContext } from "../../contexts/AuthProvider";
import { HomeService } from "../../services/HomeService";
import { my_styles } from "../../styles/my";
import { Grape, GrapeDayLetter, Home_Grape } from "../../types";
import { resToHomeGrape } from "../../utils";
import { GrapeIcons } from "../../utils/Icons";





// type HomeComponentProps = {
//     grape: Home_Grape;
//     setGrape: (grape: Home_Grape) => void;
//     loading: boolean;
// };


// TODO use "refreshControl" prop for refreshing in global dood. for <ScrollView>

// this bout to temp be all the bottomEditor and stuff combin and myGraoe and all combined

export default function HomeComponent() {


    const height = useHeaderHeight();


    const { sessionUser } = useAuthContext();
    const [ selectedLetter, setSelectedLetter ] = useState<GrapeDayLetter | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ isError, setIsError ] = useState<boolean>(false);

    // const [ grape, setGrape ] = useState<Home_Grape | null>(null);
    const [ grapeFormState, setGrapeFormState ] = useState<Home_Grape | null>(null);
    // * memoize the fetchData function so that it only runs when the sessionUser changes or when the screen is re-focused
    useFocusEffect(
        React.useCallback(() => {
            fetchData().then(() => setIsLoading(false));
            return () => {
                setSelectedLetter(null);
            };
        }, [ sessionUser ])
    );
    async function fetchData() {
        try {
            if (sessionUser == null || sessionUser == undefined) return;
            const response = await HomeService.getOrCreateToday(sessionUser!.user_uid);
            if (response !== null) setGrapeFormState(resToHomeGrape(response));
            // else setIsError(true); //? do we need this?
        } catch (error) {
            setIsLoading(false);
            console.error('Error fetching data:', error);
            setIsError(true);
        }
    }
    const iconProps = { letter: selectedLetter?.letter || '', color: "#a8e4a0", size: 35 };

    const handleSaveLetter = () => {
        // setGrapeFormState(formState);
        console.log("handleSaveLetter");
    };

    // TODo modulate and make more dynamic

    // !! PU here!! I got th UX-logic done. now i need to hook back up api and stuff

    // why is it not scrolling into view when press in>??? is it bc of the keyboardavoidingview??? no bc i use that in Account.tsx.. so what could be sifferent? it works in Account?? 
    // it works in Account bc i use a ScrollView there. so i need to use a ScrollView here too. but i need to make sure it doesnt scroll when keyboard is up. so i need to use a KeyboardAvoidingView too. so i need to use both. so i need to make sure they work together.


    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} enabled
            style={{ flex: 1, paddingHorizontal: 20 }} keyboardVerticalOffset={height + 125}
        >
            {isLoading ? <Loading /> : isError ? (<View style={my_styles.main_container}>
                <Text style={my_styles.date_title}>Internal Server Error</Text>
                <Text style={my_styles.date_title}>Please try again later</Text>
            </View>) : grapeFormState && (
                <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#2E3944", marginTop: 20, paddingBottom: 40 }}
                // automaticallyAdjustContentInsets={false}
                >
                    <View style={{ marginBottom: 20, borderColor: '#4E1E66', borderWidth: 2, backgroundColor: "#3d4b59", borderRadius: 10 }}>
                        <Button color="#a8e4a0" title='Logout' onPress={() => console.log('da')} />
                    </View>
                    <HomeFormWrapper
                        label="G" inputValue={grapeFormState.g} key="g"
                        setFormState={setGrapeFormState} formState={grapeFormState}
                        onButtonPress={() => handleSaveLetter()}
                    />
                    <HomeFormWrapper
                        label="R" inputValue={grapeFormState.r} key="r"
                        setFormState={setGrapeFormState}
                        formState={grapeFormState}
                        onButtonPress={() => handleSaveLetter()}
                    />
                    <HomeFormWrapper
                        label="A" inputValue={grapeFormState.a} key="a"
                        setFormState={setGrapeFormState}
                        formState={grapeFormState}
                        onButtonPress={() => handleSaveLetter()}
                    />
                    <HomeFormWrapper
                        label="P" inputValue={grapeFormState.p} key="p"
                        setFormState={setGrapeFormState}
                        formState={grapeFormState}
                        onButtonPress={() => handleSaveLetter()}
                    />
                    <HomeFormWrapper
                        label="E"
                        inputValue={grapeFormState.e}
                        key="e"
                        setFormState={setGrapeFormState}
                        formState={grapeFormState}
                        onButtonPress={() => handleSaveLetter()}
                    />
                    <HomeFormWrapper
                        label="S" inputValue={grapeFormState.s} key="s"
                        setFormState={setGrapeFormState}
                        formState={grapeFormState}
                        onButtonPress={() => handleSaveLetter()}
                    />

                </ScrollView>
            )}
        </KeyboardAvoidingView>


    );
}
