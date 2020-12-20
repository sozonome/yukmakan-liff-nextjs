import { useFormik } from "formik";
import { beverages } from "../../constants/beverages";
import { foods } from "../../constants/foods";
import { Menu } from "../../types/menu";

import MenuList, { OrderMenuListProps } from "./MenuList";
import OrderSummary, { OrderSummaryProps } from "./OrderSummary";

export enum MenuItemType {
  food = "food",
  beverage = "beverage",
}

export type OrderedItemType = Menu & {
  qty: number;
  type: MenuItemType;
};

export type MenuFormValueType = {
  customer_name: string;
  items: Array<OrderedItemType>;
};

const INITIAL_VALUES: MenuFormValueType = {
  customer_name: "",
  items: [
    ...foods.map((food) => ({
      ...food,
      qty: 0,
      type: MenuItemType.food,
    })),
    ...beverages.map((beverage) => ({
      ...beverage,
      qty: 0,
      type: MenuItemType.beverage,
    })),
  ],
};

const MenuForm = () => {
  const { values, handleSubmit, setFieldValue, dirty, resetForm } = useFormik<
    MenuFormValueType
  >({
    initialValues: INITIAL_VALUES,
    onSubmit: (formValues: MenuFormValueType) => {
      console.log({ formValues });
    },
  });

  const orderMenuListProps: OrderMenuListProps = {
    values,
    setFieldValue,
  };

  const orderSummaryProps: OrderSummaryProps = {
    values,
    handleSubmit,
  };

  return (
    <>
      <MenuList {...orderMenuListProps} />
      {values.items.filter((item) => item.qty > 0).length > 0 ? (
        <OrderSummary {...orderSummaryProps} />
      ) : null}
    </>
  );
};

export default MenuForm;
