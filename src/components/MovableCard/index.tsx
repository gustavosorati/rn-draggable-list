import Animated, { SharedValue, runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { CARD_HEIGHT, Card, ICard } from "../Card";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useState } from "react";
import { styles } from "./styles";
import { Platform } from "react-native";


interface Props {
  data: ICard;
  cardPosition?: SharedValue<number[]>;
  scrollY: SharedValue<number>;
  cardsCount?: number;
}

export function MovableCard({ data, cardPosition, scrollY, cardsCount }: Props) {
  const [moving, setMoving] = useState(false);
  const top = useSharedValue(cardPosition.value[data.id] * CARD_HEIGHT);

  useAnimatedReaction(() =>
    cardPosition.value[data.id],
    (currentPosition, previousPosition) =>  {
      if(currentPosition !== previousPosition) {
        if(!moving) {
          top.value = withSpring(currentPosition * CARD_HEIGHT);
        }
      }
    }, [moving]
  )

  function objectMove(positions: number[], from: number, to: number) {
    "worklet";
    const newPositions = Object.assign({}, positions);

    for(const id in positions) {
      if(positions[id] === from) {
        newPositions[id] = to;
      }

      if(positions[id] === to) {
        newPositions[id] = from;
      }
    }

    return newPositions;
  }

  const longPressGesture = Gesture
    .LongPress()
    .onStart(() => {
      runOnJS(setMoving)(true);
    })
    .minDuration(200);

  const panGesture = Gesture
    .Pan()
    .manualActivation(true)
    .onTouchesMove((_, state) => {
      moving ? state.activate() : state.fail();
    })
    .onUpdate((event) => {
      const positionY = event.absoluteY + scrollY.value;
      top.value = positionY;

      if(Platform.OS === "ios") {
        top.value = positionY - CARD_HEIGHT;
      }

      const startPositionList = 0;
      const finalPositionList = cardsCount - 1;
      const currentPostion = Math.floor(positionY / CARD_HEIGHT);

      console.log(positionY)

      "worklet";
      const newPosition = Math.max(startPositionList, Math.min(currentPostion, finalPositionList))

      if(newPosition !== cardPosition.value[data.id]) {
        cardPosition.value = objectMove(
          cardPosition.value,
          cardPosition.value[data.id],
          newPosition
        )
      }

    })
    .onFinalize(() => {
      const newPosition = cardPosition.value[data.id] * CARD_HEIGHT;
      top.value = withSpring(newPosition);
      runOnJS(setMoving)(false);
    })
    .simultaneousWithExternalGesture(longPressGesture)

    const animatedStyle = useAnimatedStyle(() => {
      return {
        top: top.value - CARD_HEIGHT,
        opacity: moving ? 1 : 0.4,
        zIndex: moving ? 1 : 0,
      }
    }, [moving]);

    const composedGestures = Gesture.Race(
      longPressGesture,
      panGesture,
    );

    console.log(CARD_HEIGHT)
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <GestureDetector gesture={composedGestures}>
        <Card
          data={data}
        />
      </GestureDetector>
    </Animated.View>
  )
}
