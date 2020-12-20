import { FormEvent } from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

import { convertToPriceText } from "../../helpers/convertToPriceText";
import { countQtyByType } from "../../helpers/countQtyByType";

import { MenuFormValueType, MenuItemType } from "./MenuForm";

export type OrderSummaryProps = {
  values: MenuFormValueType;
  handleSubmit: (e?: FormEvent<HTMLFormElement>) => void;
};

const OrderSummary = ({ values, handleSubmit }: OrderSummaryProps) => {
  const totalFoodQty = countQtyByType(values.items, MenuItemType.food);
  const totalBeverageQty = countQtyByType(values.items, MenuItemType.beverage);

  const totalOrderValue = values.items.reduce(
    (prev, curr) => prev + curr.qty * curr.price,
    0
  );

  return (
    <Box>
      <Box as="hr" marginY={2} />
      <Heading size="lg" fontWeight="semibold">
        Ringkasan
      </Heading>

      <Flex>
        <Box>
          <Text>
            {totalFoodQty > 0 && `${totalFoodQty} makanan`}{" "}
            {totalFoodQty > 0 && totalBeverageQty > 0 && ` dan `}{" "}
            {totalBeverageQty > 0 && `${totalBeverageQty} minuman`}{" "}
          </Text>

          <Text>Total: {convertToPriceText(totalOrderValue)}</Text>
        </Box>

        <Box marginLeft="auto">
          <Button colorScheme="green" onClick={() => handleSubmit()}>
            Pesan Sekarang
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default OrderSummary;
