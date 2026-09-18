import {
  Flex,
  Text,
  Link,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

export const Footer = () => {
  const isDesktop = useBreakpointValue({ base: false, xl: true });

  // Общий стиль для ссылок с плавной анимацией наведения
  const linkStyles = {
    color: "#ffffff80", // Слегка приглушенный белый цвет (серый)
    fontFamily: "heading",
    fontWeight: "bold",
    fontSize: { base: "xs", xl: "sm" },
    letterSpacing: "wider",
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
    _hover: {
      color: "white",
      transform: "scale(0.98)",
    },
    _active: {
      transform: "scale(0.95)",
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
      // Закругление в виде таблетки для ПК и обычное для телефонов
      borderRadius={{ xl: "25px", base: "25px" }} 
      py={4}
      px={4}
      mt={{ xl: "30px", base: "15px" }}
      mb={{ xl: "30px", base: "15px" }} // Отступ снизу страницы
      direction={{ base: "column", xl: "row" }}
      justifyContent="space-between"
      alignItems="center"
      gap={{ base: 4, xl: 0 }}
      transition="all 0.45s ease-out"
    >
      {/* ЛЕВАЯ ЧАСТЬ: Копирайт */}
      <Text
        color="white"
        fontFamily="heading"
        fontWeight="bold"
        fontSize={{ base: "sm", xl: "md" }}
      >
        © {currentYear} REVIZEMC.NET
      </Text>

      {/* ЦЕНТРАЛЬНАЯ ЧАСТЬ: Документы */}
      <Flex 
        direction={{ base: "column", xl: "row" }} 
        alignItems="center" 
        gap={{ base: 3, xl: 10 }}
      >
<Text 
          {...linkStyles}
          onClick={(e) => {
            e.stopPropagation();
            window.open(
              "https://www.revizemc.net/terms-of-service.pdf",
              "_blank"
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
              "_blank"
            );
          }}
        >
          ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
        </Text>
      </Flex>

      {/* ПРАВАЯ ЧАСТЬ: Почта */}
      <Text 
        {...linkStyles}
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = "mailto:admin@revizemc.net";
        }}
      >
        ADMIN@REVIZEMC.NET
      </Text>
    </Flex>
  );
};