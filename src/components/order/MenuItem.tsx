import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

import { convertToPriceText } from "../../helpers/convertToPriceText";

import { Menu } from "../../types/menu";

type MenuItemProps = {
  item: Menu;
};

const MenuItem = ({ item }: MenuItemProps) => {
  return (
    <Flex marginY={2}>
      <Box>
        <Text fontSize="lg" fontWeight="bold">
          {item.name}
        </Text>

        <Text>{convertToPriceText(item.price)}</Text>
      </Box>

      <Flex marginLeft="auto" alignItems="center">
        <Button size="sm" colorScheme="teal" hidden={false}>
          <AiOutlineMinus />
        </Button>

        <Text marginX={2} fontWeight="bold" fontSize="lg">
          0
        </Text>

        <Button size="sm" colorScheme="orange" hidden={false}>
          <AiOutlinePlus />
        </Button>
      </Flex>
    </Flex>
  );
};

export default MenuItem;
