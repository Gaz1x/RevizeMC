import {
  Box,
  Text,
  VStack,
  Button,
  SimpleGrid,
  HStack
} from '@chakra-ui/react';

export const SupportBlock = () => {
  return (
    <VStack
      w="full"
      maxW={{ xl: "518px", base: "370px" }}
      bgGradient="linear(to-t, transparent, rgba(153, 217, 255, 0.15))"
      border="solid #80BFFF"
      borderWidth={{ xl: "6px", base: "4px" }}
      borderRadius="30px"
      p={4} // Внутренние отступы
      mt="30px"
      spacing={3}
      align="center" // Центрируем весь контент внутри
      transition="all 0.45s ease-out"
    >
        <Text 
          fontSize={{ base: "xl", xl: "3xl" }} 
          fontFamily="heading" 
          color="#80BFFF"
          lineHeight={"1"}
        >
            ПОДДЕРЖКА
        </Text>

      {/* Сетка кнопок: 1 колонка на мобилках, 2 колонки на ПК */}
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={4} w="full" maxW="600px" mt={2}>
        
        {/* Кнопка DISCORD (Контурная) */}
        <Button
          as="a"
          href="https://discord.gg/SJpQDQcJvG" // Замени на свою ссылку
          target="_blank"
          w="full"
            bg="#80bFFF" color="#1B2D3F" h="50px" borderRadius="18px"
            fontFamily="heading" fontWeight="bold" fontSize="lg"
            transition="all 0.2s ease-out" cursor={"pointer"}
            _hover={{ transform: "scale(0.99)", color: "white" }}
            _active={{ transform: "scale(0.97)" }}
        >
          DISCORD
        </Button>

        <Button
          as="a"
          href="https://t.me/revizemc" // Замени на свою ссылку
          target="_blank"
                    w="full"
            bg="#80bFFF" color="#1B2D3F" h="50px" borderRadius="18px"
            fontFamily="heading" fontWeight="bold" fontSize="lg"
            transition="all 0.2s ease-out" cursor={"pointer"}
            _hover={{ transform: "scale(0.99)", color: "white" }}
            _active={{ transform: "scale(0.97)" }}
        >
          TELEGRAM
        </Button>

      </SimpleGrid>
    </VStack>
  );
};