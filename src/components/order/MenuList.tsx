import { Box, Heading } from "@chakra-ui/react";

import MenuItem from "./MenuItem";

import { beverages } from "../../constants/beverages";
import { foods } from "../../constants/foods";

const MenuList = () => {
  return (
    <Box>
      <Box as="section" id="foods" marginY={6}>
        <Heading as="h2" size="xl" marginBottom={4}>
          Makanan
        </Heading>

        {foods.map((food, index) => (
          <MenuItem item={food} key={index} />
        ))}
      </Box>

      <Box as="section" id="beverages" marginY={6}>
        <Heading as="h2" size="xl">
          Minuman
        </Heading>

        {beverages.map((beverage, index) => (
          <MenuItem item={beverage} key={index} />
        ))}
      </Box>
    </Box>
  );
};

export default MenuList;
