import React, { useContext } from "react";
import { View } from "react-native";
import GridItem from "./GridItem";
import { Styles } from "../Styling/Styles";
import { AppContext } from "./AppContextProvider";

export default function Grid({ itemsArr, onItemTap }) {
  const { theme } = useContext(AppContext);
  return (
    <View style={[Styles.gridContainer, { ...theme.backgroundView }]}>
      {itemsArr.map((item) => {
        return (
          <GridItem
            style={{
              width: "44%",
              height: 160,
              marginTop: "4%",
              marginLeft: "4%",
              shadowOffset: { width: 3, height: 3 },
              shadowColor: "black",
              shadowOpacity: 0.3,
              shadowRadius: 4,
            }}
            imageURL={item.strCategoryThumb}
            itemName={item.strCategory}
            itemObj={item}
            key={item.idCategory}
            onTap={onItemTap}
          />
        );
      })}
    </View>
  );
}
