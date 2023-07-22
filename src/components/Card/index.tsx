import { Text, View, StyleSheet } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { HEIGHT, MARGINBOTTOM, styles } from "./styles";

export const CARD_HEIGHT = HEIGHT + MARGINBOTTOM;

export interface ICard {
  id: number;
  title: string;
}

interface Props {
  data: ICard;
}

export function Card({
  data,
}: Props) {
  return (
    <View style={styles.container}>
      <Text>{data.title}</Text>

      <Icon name="drag-indicator" size={32} color="#eee" />
    </View>
  )
}

