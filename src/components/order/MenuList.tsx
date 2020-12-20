import { Box, Heading } from "@chakra-ui/react";

import MenuItem from "./MenuItem";

import { MenuFormValueType, MenuItemType } from "./MenuForm";
import { FormikErrors } from "formik";

export type OrderMenuListProps = {
  values: MenuFormValueType;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void> | Promise<FormikErrors<MenuFormValueType>>;
};

const MenuList = ({ values, setFieldValue }: OrderMenuListProps) => {
  return (
    <Box>
      <Box as="section" id="foods" marginY={6}>
        <Heading as="h2" size="xl" marginBottom={4}>
          Makanan
        </Heading>

        {values.items
          .filter((item) => item.type === MenuItemType.food)
          .map((food, index) => (
            <MenuItem
              item={food}
              key={index}
              index={index}
              setFieldValue={setFieldValue}
            />
          ))}
      </Box>

      <Box as="section" id="beverages" marginY={6}>
        <Heading as="h2" size="xl">
          Minuman
        </Heading>

        {values.items
          .filter((item) => item.type === MenuItemType.beverage)
          .map((beverage, index) => (
            <MenuItem
              index={
                values.items.filter((item) => item.type === MenuItemType.food)
                  .length + index
              }
              item={beverage}
              key={index}
              setFieldValue={setFieldValue}
            />
          ))}
      </Box>
    </Box>
  );
};

export default MenuList;
