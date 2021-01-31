import React, { useCallback, memo, useRef, useState } from "react";
import {
  FlatList,
  View,
  Dimensions,
  Text,
  StyleSheet,
  Image,
  Button
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
  image:`https://cdn-b.medlife.com/2018/10/Acne-skin-condition.jpg`,
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
},
{
  id:2,
  image:`data:image/jpeg;base64,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`,
  title:`Vasculitis`,
  description:`It is considered a common banner for the group of diseases that are caused by the inflammation of your blood vessels. This includes your veins, capillaries, and arteries
  `,
  causes: `The trigger could be a disease of your immune system, an allergic reaction, infection, or an autoimmune disorder. Another cause could be cancer, especially the ones that particularly affect your blood cells like lymphoma or leukemia.

  `,
  symptoms:`loss of appetite, Weight loss, Tiredness and fatigue, Muscle pain, Having clusters of small dots, Spots, Rashes on skin.

  `,
  cure:`How vasculitis is treated depends on the organs that are affected when you are diagnosed. The standard treatment that is used is corticosteroid medications.

  `,
  prevention: `There is no way to prevent most forms of vasculitis. If a medication caused vasculitis, you may be able to prevent another case of vasculitis by avoiding that drug.

  `
},
{
  id:3,
  image:`https://d3hcoe79thio2n.cloudfront.net/wp-content/uploads/2017/09/urticaria-hives.jpg`,
  title:`Urticaria Hives`,
  description:`Hives, also called urticaria, are circumscribed swellings on the skin that often are itchy. Often they are pink or red, but they don't have to be. Hives happen when the cells in the skin called mast cells release histamine, a chemical that causes tiny blood vessels (capillaries) to leak fluid.

  `,
  causes: `Medications, such as antibiotics (especially penicillin and sulfa), aspirin and ibuprofen, insect stings or bites, Blood transfusions, Bacterial infections, Viral infections, Pet dander, Pollen, Some plants

  `,
  symptoms:`Raised itchy bumps, either red or skin-colored, “Blanching” (when pressed, the center of a red hive turns white).

  `,
  cure:`a lotion such as Sarna and an antihistamine. you may be given a prescription medication such as cyproheptadine (Periactin), azatadine (Optimine) or hydroxyzine (Atarax or Vistaril).

  `,
  prevention: `You can prevent hives by identifying and avoiding the particular circumstance or substance that triggered your skin reaction. Keep an antihistamine in your medicine cabinet and take it the first signs of hives or itching. 

  `
},
{
  id:4,
  image:`https://www.windsordermatology.com/wp-content/uploads/2018/11/Unknown.jpeg`,
  title:`Eczema`,
  description:`eczema is a condition that makes your skin red and itchy. It's common in children but can occur at any age. It is long lasting (chronic) and tends to flare periodically. It may be accompanied by asthma or hay fever.
  `,
  causes: `Healthy skin helps retain moisture and protects you from bacteria, irritants and allergens. Eczema is related to a gene variation that affects the skin's ability to provide this protection. In some children, food allergies may play a role in causing eczema.

  `,
  symptoms:` Dry skin, Itching, which may be severe, especially at night, Thickened, cracked, scaly skin, Raw, sensitive, swollen skin from scratching.

  `,
  cure:`No cure has been found for atopic dermatitis. But treatments and self-care measures can relieve itching and prevent new outbreaks. 

  `,
  prevention: `Moisturize your skin at least twice a day, Take shorter baths or showers, Use only gentle soaps, Dry yourself carefully.
  `
}
]

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
        console.log()
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
      <Button title="Go Back">Go Back</Button>
    </>
  );
}
