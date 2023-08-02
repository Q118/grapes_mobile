import { AuthError, PostgrestError } from "@supabase/supabase-js";
import { supabase, User } from "../initSupabase";


/**
 * @class AccountService - services cruding the authenticated user's account configuration
 * ! to handle any errors in here, just throw an Error if there is one and then 
 * in the calling function, catch it and handle it there
 */
export class AccountService {

    private changeEmail = async (emailVal: string): Promise<User|AuthError|null> => {
        // const { user, error } = await supabase.auth.update({
        //     email: emailVal,
        // });
        const {
            data: { user },
            error,
        } = await supabase.auth.updateUser({ email: emailVal })
        if (error) return error;
        return user;
    };

    private changePassword = async (passwordVal: string): Promise<User|AuthError|null> => {
        // const { user, error } = await supabase.auth.update({
        //     password: passwordVal, // will just keep the old one if unchanged
        // });
        const {
            data: { user },
            error,
        } = await supabase.auth.updateUser({ password: passwordVal })
        if (error) return error;
        return user;
    };

    private changeDisplayName = async (displayVal: string): Promise<User|PostgrestError|null> => {
        // const user_id = supabase.auth.session()?.user?.id;
        const user_id = (await supabase.auth.getSession()).data.session?.user?.id;
        if (user_id) {
            const { data, error } = await supabase
                .from('user_names')
                .upsert({ id: user_id, user_name: displayVal })
                .select();
            // console.log("data: ", data);
            if (error) return error;
            return data ? data[ 0 ] : null;
        }
        return null;
    };

    changeConfig = async (configVal: string = "", configKey: string): Promise<User | null | AuthError | PostgrestError> => {
        try {

            if (configVal.length === 0) throw new Error("Cannot send an empty value");
            if (configVal === '********' && configKey === 'password') throw new Error("Password value not changed!");
            let retVal: User | null | AuthError | PostgrestError = null;
            switch (configKey) {
                case "email":
                    retVal = await this.changeEmail(configVal);
                    break;
                case "password":
                    retVal = await this.changePassword(configVal);
                    break;
                case "display":
                    retVal = await this.changeDisplayName(configVal);
                    break;
            }
            return retVal;
        } catch (error: any) {
            console.error(error);
            throw new Error(error);
        }

    };



}