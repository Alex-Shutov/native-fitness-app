import {useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const usePhoneStorage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const storeData = async (key, value) => {
        setLoading(true);
        setError(null);
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
            return true;
        } catch (e) {
            setError(e.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const getData = async (key) => {
        setLoading(true);
        setError(null);
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            setError(e.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const removeData = async (key) => {
        setLoading(true);
        setError(null);
        try {
            await AsyncStorage.removeItem(key);
            return true;
        } catch (e) {
            setError(e.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const clearAll = async () => {
        setLoading(true);
        setError(null);
        try {
            await AsyncStorage.clear();
            return true;
        } catch (e) {
            setError(e.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        storeData,
        getData,
        removeData,
        clearAll,
        loading,
        error,
    };
};

export default usePhoneStorage;