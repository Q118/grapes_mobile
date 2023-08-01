import React from 'react';
import Toast, { ToastShowParams } from 'react-native-toast-message';
import { GlobalService } from './GlobalService';
import { GrapeDayLetter } from '../types';

const toastProps: ToastShowParams = { position: 'top', visibilityTime: 4000, };

/**
 * @class ShareService
 * @description handles all the logic for sharing a grape activity
 */
export class ShareService {

    static handleSharePress(
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        sessionUser: any,
        grape_day_letter: GrapeDayLetter,
    ) {
        const globalService = new GlobalService();
        const toShare = { ...grape_day_letter, user_name: sessionUser!.display_name };
        globalService.addRow(toShare).then((res) => {
            return Toast.show({
                type: 'success',
                text1: 'Shared to the Global feed!',
                text2: 'Go check it out!',
                ...toastProps,
            });
        }).catch((err: any) => {
            console.error(err);
            setLoading(false);
            return Toast.show({
                type: 'error',
                text1: 'Error sharing to the Global feed!',
                text2: 'Try again later',
                ...toastProps,
            });
        }).finally(() => setLoading(false));
    }



}