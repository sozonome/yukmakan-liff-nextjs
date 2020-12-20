import { Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLiff } from "react-liff";
import { FaLine } from "react-icons/fa";
import { beverages } from "../../constants/beverages";
import { foods } from "../../constants/foods";
import { convertToPriceText } from "../../helpers/convertToPriceText";
import { countQtyByType } from "../../helpers/countQtyByType";
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
  const [displayName, setDisplayName] = useState("");
  const toast = useToast();
  const { error, liff, isLoggedIn, ready } = useLiff();

  useEffect(() => {
    if (!isLoggedIn) return;

    async () => {
      await liff.getProfile().then((profile) => {
        console.log(profile);
        setDisplayName(profile.displayName);
      });
    };
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

      const messageTemplate = `Hai ${displayName},\nTerima kasih telah memesan makanan, berikut adalah review pesanannya:\n\n${
        totalFoodQty > 0 ? `\n* ${totalFoodQty} Makanan` : ""
      }${
        totalBeverageQty > 0 ? `\n* ${totalBeverageQty} Minuman` : ""
      }\n\nTotal : ${convertToPriceText(
        totalOrderValue
      )}\nPesanan Anda akan segera diproses dan akan diberitahu jika sudah bisa diambil.\n\nMohon ditunggu ya!`;

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
                url: "https://liff.line.me/1655424639-rqawGn7X",
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
