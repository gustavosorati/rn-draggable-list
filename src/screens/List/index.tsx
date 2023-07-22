import { ScrollView, View, StyleSheet, SafeAreaView } from "react-native";
import { CARDS } from "../../data/cards";
import { MovableCard } from "../../components/MovableCard";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { CARD_HEIGHT } from "../../components/Card";

export function List() {

  const scrollY = useSharedValue(0);
  const cardsPosition = useSharedValue(listToObject(CARDS));

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  function listToObject(list: typeof CARDS) {
    const listOfCards = Object.values(list);

    const object: any = [];

    listOfCards.forEach((card, index) => {
      object[card.id] = index;
    })

    return object;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={[styles.container]}>
      <Animated.ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          height: CARDS.length * CARD_HEIGHT,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {CARDS.map((item) => (
          <MovableCard
            key={item.id}
            data={item}
            scrollY={scrollY}
            cardPosition={cardsPosition}
            cardsCount={CARDS.length}
          />
        ))}
      </Animated.ScrollView>

    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  list: {
    flex: 1,
    paddingHorizontal: 32,
    position: "relative",
    width: "100%"
  }
})
