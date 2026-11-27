import { useWindowDimensions } from "react-native";

export function useDimension(){

    const { width, height } = useWindowDimensions();

    return { width, height};
}