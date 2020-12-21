import { Box, Button, Flex, Skeleton, Text } from "@chakra-ui/react";
import { BsPlus } from "react-icons/bs";
import { BiMinus } from "react-icons/bi";

import { convertToPriceText } from "../../helpers/convertToPriceText";

import { OrderedItemType } from "./MenuFormContainer";
import { OrderMenuListProps } from "./MenuList";

type MenuItemProps = {
  item: OrderedItemType;
  index?: number;
  setFieldValue?: OrderMenuListProps["setFieldValue"];
  ready: boolean;
};

const MenuItem = ({ item, ready, index, setFieldValue }: MenuItemProps) => {
  return (
    <Skeleton isLoaded={ready}>
      <Flex marginY={2}>
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            {item.name}
          </Text>
          <Text>{convertToPriceText(item.price)}</Text>
        </Box>

        <Flex marginLeft="auto" alignItems="center">
          {setFieldValue && (
            <Button
              size="sm"
              colorScheme="yellow"
              hidden={item.qty === 0}
              onClick={() => setFieldValue(`items[${index}].qty`, item.qty - 1)}
            >
              <BiMinus />
            </Button>
          )}

          <Text
            marginX={2}
            fontWeight={setFieldValue && "bold"}
            fontSize="lg"
            hidden={item.qty === 0}
          >
            {!setFieldValue && `*`}
            {item.qty}
            {!setFieldValue && ` =`}
          </Text>

          {!setFieldValue && (
            <Text marginLeft={2}>
              {convertToPriceText(item.price * item.qty)}
            </Text>
          )}

          {setFieldValue && (
            <Button
              size="sm"
              colorScheme="orange"
              onClick={() => setFieldValue(`items[${index}].qty`, item.qty + 1)}
            >
              <BsPlus />
            </Button>
          )}
        </Flex>
      </Flex>
    </Skeleton>
  );
};

export default MenuItem;
