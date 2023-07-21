import { ApiError, PostgrestError } from "@supabase/supabase-js";
import { supabase, User } from "../../../initSupabase";

// !!!!!!!PU HERE https://supabase.com/docs/reference/javascript/v1/auth-update
// * we need to use my newly created table for the userNames so youll need to change this and other things around to accomodate and then also for the GLobalService and for the GLobal screen and ya. still use auth for email and pw tho
// so youll need to change in here, in the global service, and in the global screen, and in the Account screen.
//! User metadata: It's generally better to store user data in a table within your public schema (i.e., public.users).
//! Use the update() method if you have data which rarely changes or is specific only to the logged in user.

/**
 * @class AccountService
 * services cruding the authenticated user's account configuration
 * ! to handle any errors in here, just throw an Error if there is one and then 
 * in the calling function, catch it and handle it there
 */
export class AccountService {

    private changeEmail = async (emailVal: string) => {
        const { user, error } = await supabase.auth.update({
            email: emailVal,
        });
        if (error) return error;
        return user;
    };

    private changePassword = async (passwordVal: string) => {
        const { user, error } = await supabase.auth.update({
            password: passwordVal, // will just keep the old one if unchanged
        });
        if (error) return error;
        return user;
    };

    // !! PU here!! okay finally got this working for this particular update and yayyyy had to rls the table and then it worked. 
    // * so now i can change all throughtout the app how the reading and stuff of the displayNames happen

    private changeDisplayName = async (displayVal: string) => {
        const user_id = supabase.auth.session()?.user?.id;
        if (user_id) {
            const { data, error } = await supabase
                .from('user_names')
                .update({ user_name: displayVal })
                .match({ id: user_id })
            // console.log('data: ', data);
            // if (error) console.log(error);
            if (error) return error;
            return data[ 0 ];
        }
        return null;
    };

    changeConfig = async (configVal: string = "", configKey: string): Promise<User | null | ApiError | PostgrestError> => {
        // console.log('hello! ', configVal, configKey);
        try {
            // TODO: more reasons that the value is no good.. maybe not unique or too short.. etc
            if (configVal.length === 0) throw new Error("Cannot send an empty value");
            if (configVal === '********' && configKey === 'password') throw new Error("Password value not changed!");
            switch (configKey) {
                case "email":
                    return await this.changeEmail(configVal);
                case "password":
                    return await this.changePassword(configVal);
                case "display":
                    return await this.changeDisplayName(configVal);
                default:
                    return null;
            }
        } catch (error: any) {
            console.error(error);
            throw new Error(error);
        }

    };



}