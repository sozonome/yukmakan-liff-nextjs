import { FormEvent } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import { convertToPriceText } from "../../helpers/convertToPriceText";
import { MenuFormValueType } from "./MenuForm";

export type OrderSummaryProps = {
  values: MenuFormValueType;
  handleSubmit: (e?: FormEvent<HTMLFormElement>) => void;
};

const OrderSummary = ({ values, handleSubmit }: OrderSummaryProps) => {
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

      <Text>{convertToPriceText(totalOrderValue)}</Text>
    </Box>
  );
};

export default OrderSummary;
