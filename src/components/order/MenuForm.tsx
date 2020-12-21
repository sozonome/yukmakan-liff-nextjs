import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLiff } from "react-liff";
import { FaLine } from "react-icons/fa";

import MenuList, { OrderMenuListProps } from "./MenuList";
import OrderSummary, { OrderSummaryProps } from "./OrderSummary";
import MenuItem from "./MenuItem";

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
  const [displayName, setDisplayName] = useState<string>("");
  const [profileImg, setProfileImg] = useState<string>("");

  const [orderedItems, setOrderedItems] = useState<OrderedItemType[]>([]);
  const [totalFoodQty, setTotalFoodQty] = useState<number>(0);
  const [totalBeverageQty, setTotalBeverageQty] = useState<number>(0);
  const [totalOrderValue, setTotalOrderValue] = useState<number>(0);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { error, liff, isLoggedIn, ready } = useLiff();

  useEffect(() => {
    if (!isLoggedIn) return;

    (async () => {
      const profile = await liff.getProfile();
      setDisplayName(profile.displayName);
      if (profile.pictureUrl) {
        setProfileImg(profile.pictureUrl);
      }
    })();
  }, [liff, isLoggedIn]);

  const { values, handleSubmit, setFieldValue, dirty, resetForm } = useFormik<
    MenuFormValueType
  >({
    initialValues: INITIAL_VALUES,
    onSubmit: () => {
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
        liff
          .sendMessages([
            {
              type: "text",
              text: messageTemplate,
            },
          ])
          .then(() => {
            liff.closeWindow();
          });
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

  useEffect(() => {
    const orderedItems = values.items.filter((item) => item.qty > 0);
    setOrderedItems(orderedItems);
    setTotalFoodQty(countQtyByType(orderedItems, MenuItemType.food));
    setTotalBeverageQty(countQtyByType(orderedItems, MenuItemType.beverage));
    const totalOrderValue = orderedItems.reduce(
      (prev, curr) => prev + curr.price * curr.qty,
      0
    );
    setTotalOrderValue(totalOrderValue);
  }, [values]);

  const orderMenuListProps: OrderMenuListProps = {
    values,
    setFieldValue,
  };

  const orderSummaryProps: OrderSummaryProps = {
    values,
    onOpen,
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
          colorScheme="green"
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
        <Flex alignItems="center">
          {profileImg && (
            <Box marginRight={2}>
              <Avatar src={profileImg} />
            </Box>
          )}
          <Box>
            <Text>
              Halo <b>{displayName}</b>! Yuk pesan makanan di bawah ini
            </Text>
          </Box>
        </Flex>
      )}
      <MenuList {...orderMenuListProps} />
      {values.items.filter((item) => item.qty > 0).length > 0 ? (
        <OrderSummary {...orderSummaryProps} />
      ) : null}

      <Box marginY={4}>
        {liff.isInClient() ? (
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
            marginBottom={4}
          >
            Buka di Browser Eksternal
          </Button>
        ) : null}

        {liff.isLoggedIn() && (
          <Button isFullWidth onClick={() => liff.logout()}>
            Logout
          </Button>
        )}
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sudah Yakin dengan Pesanan Anda?</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {totalFoodQty > 0 && (
              <Box marginBottom={6}>
                <Text fontSize="lg">{totalFoodQty} makanan:</Text>
                {orderedItems
                  .filter((item) => item.type === MenuItemType.food)
                  .map((food, index) => (
                    <MenuItem item={food} key={index} />
                  ))}
              </Box>
            )}
            {totalBeverageQty > 0 && (
              <Box>
                <Text fontSize="lg">{totalBeverageQty} minuman:</Text>
                {orderedItems
                  .filter((item) => item.type === MenuItemType.beverage)
                  .map((beverage, index) => (
                    <MenuItem item={beverage} key={index} />
                  ))}
              </Box>
            )}

            <Heading fontSize="xl" textAlign="right">
              Total: {convertToPriceText(totalOrderValue)}
            </Heading>
          </ModalBody>

          <ModalFooter>
            <Text fontWeight="bold" onClick={onClose} marginRight={4}>
              Kembali
            </Text>
            <Button colorScheme="green" onClick={() => handleSubmit()}>
              Pesan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MenuForm;
