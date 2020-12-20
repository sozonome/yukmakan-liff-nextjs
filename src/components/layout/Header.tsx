import { Flex, Heading, Box, Image } from "@chakra-ui/react";

import AccessibleLink from "../AccessibleLink";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <Flex
      as="header"
      width="full"
      align="center"
      borderRadius={12}
      padding={4}
      textColor="white"
      background="linear-gradient(135deg, rgba(246,173,85,1) 0%, rgba(221,107,32,1) 100%);"
    >
      <AccessibleLink href="/">
        <Heading as="h1" display="flex" alignItems="center">
          <Image src="/take-away.png" height={8} marginRight={2} /> YukMakan!
        </Heading>
      </AccessibleLink>

      <Box marginLeft="auto">
        <ThemeToggle />
      </Box>
    </Flex>
  );
};

export default Header;
