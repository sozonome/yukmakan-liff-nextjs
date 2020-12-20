import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { BsPlus } from "react-icons/bs";
import { BiMinus } from "react-icons/bi";

import { convertToPriceText } from "../../helpers/convertToPriceText";

import { OrderedItemType } from "./MenuForm";
import { OrderMenuListProps } from "./MenuList";

type MenuItemProps = {
  item: OrderedItemType;
  index: number;
  setFieldValue: OrderMenuListProps["setFieldValue"];
};

const MenuItem = ({ item, setFieldValue, index }: MenuItemProps) => {
  return (
    <Flex marginY={2}>
      <Box>
        <Text fontSize="lg" fontWeight="bold">
          {item.name}
        </Text>

        <Text>{convertToPriceText(item.price)}</Text>
      </Box>

      <Flex marginLeft="auto" alignItems="center">
        <Button
          size="sm"
          colorScheme="teal"
          hidden={item.qty === 0}
          onClick={() => setFieldValue(`items[${index}].qty`, item.qty - 1)}
        >
          <BiMinus />
        </Button>

        <Text
          marginX={2}
          fontWeight="bold"
          fontSize="lg"
          hidden={item.qty === 0}
        >
          {item.qty}
        </Text>

        <Button
          size="sm"
          colorScheme="orange"
          onClick={() => setFieldValue(`items[${index}].qty`, item.qty + 1)}
        >
          <BsPlus />
        </Button>
      </Flex>
    </Flex>
  );
};

export default MenuItem;
