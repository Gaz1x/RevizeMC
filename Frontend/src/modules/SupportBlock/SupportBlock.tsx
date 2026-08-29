import {
  Box,
  Text,
  Button,
  SimpleGrid,
  HStack,
  Image,
  Flex
} from '@chakra-ui/react';

import image from "./images/support.png";

export const SupportBlock = () => {
  return (
    <Flex
      direction={{ base: "column", xl: "row" }}
      w="full"
      maxW={{ xl: "1300px", base: "370px" }}
      bgGradient="linear(to-t, transparent, rgba(153, 217, 255, 0.15))"
      border="solid #80BFFF"
      borderWidth={{ xl: "6px", base: "4px" }}
      borderRadius="25px"
      p={4} 
      mt="15px"
      gap={4}
      justify="space-between"
      transition="all 0.45s ease-out"
    >
      {/* ЛЕВАЯ ЧАСТЬ: ИКОНКА И ЗАГОЛОВОК */}
      <HStack 
        alignItems="center" 
        p="0px"
      >
        <Box 
          w={{ xl: "36px", base: "27px" }} 
          h={{ xl: "36px", base: "27px" }}
        >
          <Image
            src={image}
            alt="Логотип"
            fit="fill"
            draggable={false} 
            userSelect="none"
          />
        </Box>

        <Text 
          fontSize={{ base: "xl", xl: "3xl" }} 
          fontFamily="heading" 
          color="#80BFFF"
          lineHeight="1"
        >
          ПОДДЕРЖКА
        </Text>
      </HStack>

      {/* ПРАВАЯ ЧАСТЬ: СЕТКА КНОПОК */}
      <SimpleGrid 
        columns={{ base: 1, xl: 2 }} 
        spacing={4} 
        w="full" 
        maxW="1300px"
      >
        {/* КНОПКА DISCORD */}
        <Button
          as="a"
          href="https://discord.gg/SJpQDQcJvG" 
          target="_blank"
          w="full"
          bg="transparent" 
          color="white" 
          h="36px" 
          borderRadius="10px"
          border="#80BFFF solid"
          borderWidth={{ xl: "6px", base: "4px" }}
          fontFamily="heading" 
          fontWeight="bold" 
          fontSize="lg"
          transition="all 0.2s ease-out" 
          cursor="pointer"
          _hover={{ 
            transform: "scale(0.96)", 
            borderColor: "white" 
          }}
          _active={{ 
            transform: "scale(0.9)" 
          }}
        >
          DISCORD
        </Button>

        {/* КНОПКА TELEGRAM */}
        <Button
          as="a"
          href="https://t.me/revizemc" 
          target="_blank"
          w="full"
          bg="transparent" 
          color="white" 
          h="36px" 
          borderRadius="10px"
          border="#80BFFF solid"
          borderWidth={{ xl: "6px", base: "4px" }}
          fontFamily="heading" 
          fontWeight="bold" 
          fontSize="lg"
          transition="all 0.2s ease-out" 
          cursor="pointer"
          _hover={{ 
            transform: "scale(0.96)", 
            borderColor: "white" 
          }}
          _active={{ 
            transform: "scale(0.9)" 
          }}
        >
          TELEGRAM
        </Button>
      </SimpleGrid>
    </Flex>
  );
};