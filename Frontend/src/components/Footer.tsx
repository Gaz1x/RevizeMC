import { Flex, Text, Link, useBreakpointValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

export const Footer = () => {
  const isDesktop = useBreakpointValue({ base: false, xl: true });

  const linkStyles = {
    color: "#ffffff80",
    fontFamily: "heading",
    fontWeight: "bold",
    fontSize: { base: "xs", xl: "sm" },
    letterSpacing: "wider",
    transition: "all 0.3s ease-in-out",
    cursor: "pointer",
    _hover: {
      color: "white",
    },
  };

  const currentYear = new Date().getFullYear();

  return (
    <Flex
      w="full"
      maxW={{ xl: "1300px", base: "370px" }}
      bgGradient="linear(to-t, transparent, rgba(153, 217, 255, 0.15))"
      border="solid #80BFFF"
      borderWidth={{ xl: "6px", base: "4px" }}
      borderRadius={"25px"}
      py={4}
      px={4}
      mt={{ xl: "30px", base: "15px" }}
      // mb={{ xl: "30px", base: "15px" }}
      direction={{ base: "column", xl: "row" }}
      justifyContent="space-between"
      alignItems="center"
      gap={{ base: 1, xl: 0 }}
    >
      <Text
        color="white"
        fontFamily="heading"
        fontSize={{ base: "sm", xl: "sm" }}
      >
        © {currentYear} REVIZEMC.NET
      </Text>

      <Flex
        direction={{ base: "column", xl: "row" }}
        alignItems="center"
        gap={{ base: 1, xl: 12 }}
      >
        <Text
          {...linkStyles}
          onClick={(e) => {
            e.stopPropagation();
            window.open(
              "https://www.revizemc.net/terms-of-service.pdf",
              "_blank",
            );
          }}
        >
          ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ
        </Text>

        <Text
          {...linkStyles}
          onClick={(e) => {
            e.stopPropagation();
            window.open(
              "https://www.revizemc.net/privacy-policy.pdf",
              "_blank",
            );
          }}
        >
          ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
        </Text>
      </Flex>

      <Text
        color="white"
        fontFamily="heading"
        fontSize={{ base: "sm", xl: "sm" }}
      >
        ADMIN@REVIZEMC.NET
      </Text>
    </Flex>
  );
};
