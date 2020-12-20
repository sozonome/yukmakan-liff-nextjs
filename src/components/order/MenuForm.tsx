import { Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLiff } from "react-liff";
import { FaLine } from "react-icons/fa";

import MenuList, { OrderMenuListProps } from "./MenuList";
import OrderSummary, { OrderSummaryProps } from "./OrderSummary";

import { beverages } from "../../constants/beverages";
import { foods } from "../../constants/foods";
import { convertToPriceText } from "../../helpers/convertToPriceText";
import { countQtyByType } from "../../helpers/countQtyByType";

import { Menu } from "../../types/menu";

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
  const [displayName, setDisplayName] = useState("");
  const toast = useToast();
  const { error, liff, isLoggedIn, ready } = useLiff();

  useEffect(() => {
    if (!isLoggedIn) return;

    (async () => {
      const profile = await liff.getProfile();
      setDisplayName(profile.displayName);
    })();
  }, [liff, isLoggedIn]);

  const { values, handleSubmit, setFieldValue, dirty, resetForm } = useFormik<
    MenuFormValueType
  >({
    initialValues: INITIAL_VALUES,
    onSubmit: (formValues: MenuFormValueType) => {
      const orderedItems = formValues.items.filter((item) => item.qty > 0);
      const totalFoodQty = countQtyByType(formValues.items, MenuItemType.food);
      const totalBeverageQty = countQtyByType(
        formValues.items,
        MenuItemType.beverage
      );

      const totalOrderValue = orderedItems.reduce(
        (prev, curr) => prev + curr.price * curr.qty,
        0
      );

      const messageTemplate = `Hai ${displayName},\nTerima kasih telah memesan makanan di YukMakan!, berikut adalah review pesanannya:\n${
        totalFoodQty > 0 ? `\n* ${totalFoodQty} Makanan:` : ""
      }${
        totalFoodQty > 0
          ? orderedItems
              .filter((item) => item.type === MenuItemType.food)
              .map(
                (food) =>
                  `\n${food.name} (${convertToPriceText(food.price)}) * ${
                    food.qty
                  }`
              ) + "\n"
          : null
      }${totalBeverageQty > 0 ? `\n* ${totalBeverageQty} Minuman` : ""}${
        totalBeverageQty > 0
          ? orderedItems
              .filter((item) => item.type === MenuItemType.beverage)
              .map(
                (beverage) =>
                  `\n${beverage.name}(${convertToPriceText(beverage.price)}) *${
                    beverage.qty
                  }`
              ) + "\n"
          : null
      }\n\nTotal : ${convertToPriceText(
        totalOrderValue
      )}\n\nPesanan Anda akan segera diproses dan akan diberitahu jika sudah bisa diambil.\n\nMohon ditunggu ya!`;

      if (liff.isInClient()) {
        liff.sendMessages([
          {
            type: "text",
            text: messageTemplate,
          },
        ]);

        liff.closeWindow();
      } else {
        toast({
          title: "Mohon Maaf",
          description:
            "Anda sedang membuka halaman ini di browser eksternal. Pemesanan hanya dapat dilakukan jika anda membuka halaman ini melalui aplikasi LINE.",
          status: "warning",
          duration: 15000,
          isClosable: true,
          position: "top",
        });
      }
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

  if (error) {
    return <Text>Something is Wrong</Text>;
  }

  if (!ready) {
    return <Text>Loading...</Text>;
  }

  if (!isLoggedIn) {
    return (
      <Flex alignItems="center" height="30vh">
        <Button
          isFullWidth
          size="lg"
          leftIcon={<FaLine fontSize="2rem" />}
          onClick={() => liff.login()}
        >
          Login
        </Button>
      </Flex>
    );
  }

  return (
    <Box>
      {displayName && (
        <Text>
          Halo <b>{displayName}</b>! Yuk pesan makanan di bawah ini
        </Text>
      )}
      <MenuList {...orderMenuListProps} />
      {values.items.filter((item) => item.qty > 0).length > 0 ? (
        <OrderSummary {...orderSummaryProps} />
      ) : null}

      {liff.isInClient() ? (
        <Box marginY={4}>
          <Button
            isFullWidth
            colorScheme="orange"
            textAlign="center"
            fontStyle="underline"
            onClick={() =>
              liff.openWindow({
                url: "https://yukmakan-order-line.sznm.dev/",
              })
            }
          >
            Buka di external Browser
          </Button>
        </Box>
      ) : null}

      {liff.isLoggedIn() && (
        <Button isFullWidth onClick={() => liff.logout()}>
          Logout
        </Button>
      )}
    </Box>
  );
};

export default MenuForm;
