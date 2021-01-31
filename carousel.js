import React, { useCallback, memo, useRef, useState } from "react";
import {
  FlatList,
  View,
  Dimensions,
  Text,
  StyleSheet,
  Image,
} from "react-native";

var image;
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const styles = StyleSheet.create({
  slide: {
    height: windowHeight,
    width: windowWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  slideImage: { width: windowWidth * 0.9, height: windowHeight * 0.4 },
  slideTitle: { fontSize: 24 , width: windowWidth * 0.8, marginTop: 8},
  slideSubtitle: { fontSize: 12, width: windowWidth * 0.8, marginTop: 2},

  pagination: {
    position: "absolute",
    bottom: 8,
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  paginationDotActive: { backgroundColor: "lightblue" },
  paginationDotInactive: { backgroundColor: "gray" },

  carousel: { flex: 1 },
});


const slideList = [{
  id:1,
  image:`https://picsum.photos/1440/2842?random=1`,
  title:`Acne`,
  description:`Rosacea (say "roh-ZAY-sha") is a skin disease that causes redness and pimples on your nose, cheeks, chin, and forehead. The redness may come and go. People sometimes call rosacea "adult acne" because it can cause outbreaks that look like acne. It can also cause burning and soreness in the eyes and eyelids.
  `,
  causes: `For acne-like breakouts, your immune system seems to overreact to a bacteria called Bacillus oleronius. A type of bacteria called H. pylori and a common mite called demodex are linked to rosacea.
  `,
  symptoms:`Development of dry, red, inflamed patches of skin; pustules and papules
  `,
  cure:`Brimonidine (Mirvaso) and oxymetazoline (Rhofade) cut down redness for about 12 hours by shrinking your blood vessels. Azelaic acid and metronidazole can help with redness and bumps, but they take 3 to 6 weeks to work.
  `,
  prevention: `Everyone is different, but some common triggers are a cold wind that blows on your face or eating spicy foods. Others might include sunlight, stress, red wine, drugs, and exercise.
  `
}]

// const slideList = Array.from({ length: 5}).map((_, i) => {
//   return {
//     id: i,
//     image: `https://picsum.photos/1440/2842?random=${i}`,
//     title: `DESCRIPTION`,
//     subtitle: ` Rosacea (say "roh-ZAY-sha") is a skin disease that causes redness and pimples on your nose, cheeks, chin, and forehead. The redness may come and go. People sometimes call rosacea "adult acne" because it can cause outbreaks that look like acne. It can also cause burning and soreness in the eyes and eyelids.`,
//   };
// });

const Slide = memo(function Slide({ data }) {
  return (
    <View style={styles.slide}>
      <Image source={{ uri: data.image }} style={styles.slideImage}></Image>
      <Text style={styles.slideTitle}>{data.title}</Text>
      <Text style={styles.slideSubtitle}>{data.description}</Text>
      <Text style={styles.slideSubtitle}>{data.causes}</Text>
      <Text style={styles.slideSubtitle}>{data.symptoms}</Text>
      <Text style={styles.slideSubtitle}>{data.cure}</Text>
      <Text style={styles.slideSubtitle}>{data.prevention}</Text>
    </View>
  );
});

function Pagination({ index }) {
  return (
    <View style={styles.pagination} pointerEvents="none">
      {slideList.map((_, i) => {
        console.log(i)
        return (
          <View
            key={i}
            style={[
              styles.paginationDot,
              index === i
                ? styles.paginationDotActive
                : styles.paginationDotInactive,
            ]}
          />
        );
      })}
    </View>
  );
}

export default function Carousel({p}) {
  console.log(p)
  const [index, setIndex] = useState(0);
  const indexRef = useRef(index);
  indexRef.current = index;
  const onScroll = useCallback((event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);

    const distance = Math.abs(roundIndex - index);

    // Prevent one pixel triggering setIndex in the middle
    // of the transition. With this we have to scroll a bit
    // more to trigger the index change.
    const isNoMansLand = 0.4 < distance;

    if (roundIndex !== indexRef.current && !isNoMansLand) {
      setIndex(roundIndex);
    }
  }, []);

  const flatListOptimizationProps = {
    initialNumToRender: 0,
    maxToRenderPerBatch: 1,
    removeClippedSubviews: true,
    scrollEventThrottle: 16,
    windowSize: 2,
    keyExtractor: useCallback(s => String(s.id), []),
    getItemLayout: useCallback(
      (_, index) => ({
        index,
        length: windowWidth,
        offset: index * windowWidth,
      }),
      []
    ),
  };

  const renderItem = useCallback(function renderItem({ item }) {
    return <Slide data={item} />;
  }, []);

  return (
    <>
      <FlatList
        data={slideList}
        style={styles.carousel}
        renderItem={renderItem}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={onScroll}
        {...flatListOptimizationProps}
      />
      <Pagination index={index}></Pagination>
    </>
  );
}
