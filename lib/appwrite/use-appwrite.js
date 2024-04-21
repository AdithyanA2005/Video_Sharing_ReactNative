import { useState, useEffect } from "react";
import { Alert } from "react-native";

export default function useAppwrite(fn) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fn();
      setData(response);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const refetch = () => fetchData();

  useEffect(() => {
    fetchData();
  }, []);

  return { data, refetch, isLoading };
}
