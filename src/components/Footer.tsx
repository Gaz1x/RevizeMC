  import {
    Text,
    VStack,
    Button,
    SimpleGrid,
    Flex,
    HStack,
    Divider,
    Box,
    Image
  } from '@chakra-ui/react';

  import telegram from "./images/whiteTelegram.png";

  export const Footer = () => {
    return (
      <Flex
        w="full"
        maxW={{ xl: "1300px", base: "370px" }}
        bgGradient="linear(to-t, transparent, rgba(153, 217, 255, 0.15))"
        border="solid #80BFFF"
        borderWidth={{ xl: "6px", base: "4px" }}
        borderRadius={{ xl: "25px", base: "20px" }}
        p={4} 
        mt="15px"
        mb="15px" 
        align="center"
        transition="all 0.45s ease-out"
      >
        {/* Адаптивная сетка: 1 колонка на мобилках, 3 колонки на ПК */}
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={4} w="full">
          
          {/* КОЛОНКА 1: Бренд и копирайт */}
          <VStack align={{ base: "center", xl: "flex-start" }} spacing={2} textAlign={{ base: "center", xl: "left" }}>
            <Text 
              fontSize={{ base: "2xl", xl: "3xl" }} 
              fontFamily="heading" 
              color="#80BFFF"
              lineHeight="1"
            >
              REVIZEMC.NET
            </Text>
            <Text 
              fontSize="13.5px" 
              fontFamily="heading" 
              color="whiteAlpha.800" 
              lineHeight="1"
            >
              Неофициальный сервер. <br/>Minecraft © Mojang Studios.
            </Text>
            <Text 
              fontSize="10px" 
              fontFamily="heading" 
              color="rgba(255,255,255, 0.5)"
            >
              Сайт разработан gaz1xx и overshweps
            </Text>
          </VStack>

          <Divider 
            display={{ base: "block", lg: "none" }} 
            borderColor="#80BFFF" 
            borderBottomWidth="4px" 
            borderRadius="2px"
            opacity={"1"}
          />

          {/* КОЛОНКА 2: Документы и авторы */}
          <VStack align={"center"} justify={"center"} spacing={2} textAlign={{ base: "center", xl: "left" }}>
            <Text 
              fontSize={{xl: "13.5px", base: "10px"}} 
              fontFamily="heading" 
              color="#80BFFF"
              lineHeight="1"
              cursor="pointer"
              transition="all 0.2s ease-out"
              _hover={{ color: "white", transform: "scale(0.98)" }} 
              _active={{ transform: "scale(0.95)" }}
            >
              Пользовательское соглашение
            </Text>
            
            <Text 
              fontSize={{xl: "13.5px", base: "10px"}}
              fontFamily="heading" 
              color="#80BFFF"
              lineHeight="1"
              cursor="pointer"
              transition="all 0.2s ease-out"
              _hover={{ color: "white", transform: "scale(0.98)" }}
              _active={{ transform: "scale(0.95)" }}
            >
              Обработка персональных данных
            </Text>
          </VStack>

          {/* Разделитель 2 (Виден только на мобильных устройствах) */}
          <Divider 
            display={{ base: "block", lg: "none" }} 
            borderColor="#80BFFF" 
            borderBottomWidth="4px" 
            borderRadius="2px" 
            opacity={"1"}
          />

          {/* КОЛОНКА 3: Соцсети */}
          <VStack align={{ base: "center", xl: "flex-end" }} spacing={2}>
            <Text 
              fontSize={{ base: "2xl", xl: "3xl" }} 
              fontFamily="heading" 
              color="#80BFFF"
              lineHeight="1"
            >
              ПОДДЕРЖКА
            </Text>
            <HStack>
              <Button
                as="a"
                href="https://discord.gg/SJpQDQcJvG" 
                target="_blank"
                w={{ base: "full", xl: "118px" }}
                bg="transparent" color="white" h="30px" borderRadius="9px"
                border="#80BFFF solid"
                borderWidth={{ xl: "6px", base: "4px" }}
                fontFamily="heading" fontWeight="bold"
                fontSize="13.5px" 
                transition="all 0.2s ease-out" cursor="pointer"
                _hover={{ transform: "scale(0.96)", borderColor: "white" }}
                _active={{ transform: "scale(0.9)" }}
              >
                DISCORD
              </Button>

              <Button
                as="a"
                href="https://t.me/revizemc" 
                target="_blank"
                w={{ base: "full", xl: "118px" }}
                bg="transparent" color="white" h="30px" borderRadius="9px"
                border="#80BFFF solid"
                borderWidth={{ xl: "6px", base: "4px" }}
                fontFamily="heading" fontWeight="bold"
                fontSize="13.5px"
                transition="all 0.2s ease-out" cursor="pointer"
                _hover={{ transform: "scale(0.96)", borderColor: "white" }}
                _active={{ transform: "scale(0.9)" }}
              >
                TELEGRAM
              </Button>
            </HStack>

            <HStack   role="group" cursor="pointer" transition="all 0.2s ease-in-out" _hover={{ opacity: 1, transform: "scale(0.98)" }} _active={{ transform: "scale(0.95)" }}          as="a"
          href="https://t.me/overshweps" 
          target="_blank">
              <Box w={"15px"} h={"15px"}>
                <Image
                  src={telegram}
                  alt="Логотип"
                  fit="fill"
                  draggable={false} 
                  userSelect="none"
                  opacity={0.5}
                  _groupHover={{ opacity: 1 }}
                />
              </Box>
              <Text
                fontSize="10px" 
                fontFamily="heading" 
                color="white"
                opacity={0.5}
                _groupHover={{ opacity: 1 }}     
              >
                АДМИНИСТРАТОР: @overshweps
              </Text>
            </HStack>
          </VStack>

        </SimpleGrid>
      </Flex>
    );
  };