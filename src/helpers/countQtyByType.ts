import { MenuItemType, OrderedItemType } from "../components/order/MenuForm";

export const countQtyByType = (
  items: OrderedItemType[],
  type: MenuItemType
) => {
  return items
    .filter((item) => item.type === type && item.qty > 0)
    .reduce((prev, curr) => prev + curr.qty, 0);
};
