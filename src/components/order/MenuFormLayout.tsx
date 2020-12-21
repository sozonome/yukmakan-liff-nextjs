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
  Skeleton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { OpenWindowParams } from "@line/liff/dist/lib/client/openWindow";
import { FormikErrors } from "formik";

import MenuItem from "./MenuItem";
import MenuList, { OrderMenuListProps } from "./MenuList";
import OrderSummary, { OrderSummaryProps } from "./OrderSummary";

import { convertToPriceText } from "../../helpers/convertToPriceText";

import {
  MenuFormValueType,
  MenuItemType,
  OrderedItemType,
} from "./MenuFormContainer";

export type MenuFormLayoutProps = {
  ready: boolean;
  displayName: string;
  profileImg: string;
  isInClient: boolean;
  isLoggedIn: boolean;

  orderedItems: Array<OrderedItemType>;
  totalFoodQty: number;
  totalBeverageQty: number;
  totalOrderValue: number;

  values: MenuFormValueType;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void> | Promise<FormikErrors<MenuFormValueType>>;
  handleSubmit: () => void;

  logout: () => void;
  openWindow: (params: OpenWindowParams) => void;
};

const MenuFormLayout = ({
  ready,
  displayName,
  profileImg,
  isInClient,
  isLoggedIn,
  orderedItems,
  totalFoodQty,
  totalBeverageQty,
  totalOrderValue,
  values,
  setFieldValue,
  handleSubmit,
  logout,
  openWindow,
}: MenuFormLayoutProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const orderMenuListProps: OrderMenuListProps = {
    ready,
    values,
    setFieldValue,
  };

  const orderSummaryProps: OrderSummaryProps = {
    values,
    onOpen,
  };

  return (
    <Box>
      <Skeleton
        isLoaded={
          ready &&
          profileImg &&
          profileImg.length >= 0 &&
          displayName &&
          displayName.length >= 0
        }
        height={12}
      >
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
      </Skeleton>

      <MenuList {...orderMenuListProps} />

      {values.items.filter((item) => item.qty > 0).length > 0 ? (
        <OrderSummary {...orderSummaryProps} />
      ) : null}

      <Box marginY={4}>
        {isInClient ? (
          <Button
            isFullWidth
            colorScheme="orange"
            textAlign="center"
            fontStyle="underline"
            onClick={() =>
              openWindow({
                url: "https://yukmakan-order-line.sznm.dev/",
              })
            }
            marginBottom={4}
          >
            Buka di Browser Eksternal
          </Button>
        ) : null}

        {isLoggedIn && (
          <Button isFullWidth onClick={() => logout()}>
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
                    <MenuItem item={food} key={index} ready={ready} />
                  ))}
              </Box>
            )}
            {totalBeverageQty > 0 && (
              <Box>
                <Text fontSize="lg">{totalBeverageQty} minuman:</Text>
                {orderedItems
                  .filter((item) => item.type === MenuItemType.beverage)
                  .map((beverage, index) => (
                    <MenuItem item={beverage} key={index} ready={ready} />
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

export default MenuFormLayout;
