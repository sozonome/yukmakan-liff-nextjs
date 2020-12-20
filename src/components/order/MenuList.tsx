import { Box, Heading } from "@chakra-ui/react";
import { FormikErrors } from "formik";

import MenuItem from "./MenuItem";

import { MenuFormValueType, MenuItemType } from "./MenuForm";

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
    <Box textColor="white">
      <Box
        as="section"
        id="foods"
        marginY={6}
        borderRadius={12}
        padding={4}
        background="linear-gradient(135deg, rgba(0,181,216,1) 0%, rgba(9,135,160,1) 100%);"
      >
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

      <Box
        as="section"
        id="beverages"
        marginY={6}
        borderRadius={12}
        padding={4}
        background="linear-gradient(135deg, rgba(128,90,213,1) 0%, rgba(151,38,109,1) 100%);"
      >
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
