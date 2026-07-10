import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  Input,
  Image,
  Checkbox, 
  transition
} from '@chakra-ui/react';
import { useState } from 'react';

import token from './images/token.png';

const TOKEN_OPTIONS = [
  100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
  1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000,
  6000, 7000, 8000, 9000, 10000, 15000, 20000, 25000,
  30000, 35000, 40000, 45000, 50000, 60000, 70000,
  80000, 90000, 100000
];

const POPULAR_DOMAINS = [
  'gmail.com',
  'mail.ru',
  'yandex.ru',
  'bk.ru',
  'inbox.ru',
  'list.ru',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com'
];

export const BuyingZone = () => {
  const [tokens, setTokens] = useState<number>(1000);
  const [indexes, setIndex] = useState<number>(TOKEN_OPTIONS.indexOf(1000));
  
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [ofertaAccepted, setOfertaAccepted] = useState(false);

  const [shakeOferta, setShakeOferta] = useState(false);
  const [shakeRules, setShakeRules] = useState(false);

  const rubles = Math.max(0, tokens / 2 - 0.01);

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isValid = /^[a-zA-Z0-9_]*$/.test(value);
    if (isValid && value.length <= 16) {
        setNickname(value);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const validEmailChars = /^[a-zA-Z0-9._+@-]*$/;
    if (!validEmailChars.test(value)) return;

    const parts = value.split('@');
    
    if (parts.length > 2) return;

    const localPart = parts[0];
    
    if (localPart.length > 64) return;

    if (/^[.\-_]/.test(localPart)) return;

    if (/[.\-_]{2,}/.test(localPart)) return;

    setEmail(value);
  };

  const emailParts = email.split('@');
  const localPartFinal = emailParts[0];
  const domainFinal = emailParts[1];

  const isEmailValid = 
    emailParts.length === 2 && 
    localPartFinal.length > 0 && 
    !/[.\-_]$/.test(localPartFinal) && 
    POPULAR_DOMAINS.includes(domainFinal);

  const isButtonDisabled = 
    !rulesAccepted || 
    !ofertaAccepted || 
    nickname.length < 3 || 
    !isEmailValid;

  const handlePayClick = () => {
    if (!ofertaAccepted) {
      setShakeOferta(true);
      setTimeout(() => setShakeOferta(false), 300);
    }

    if (!rulesAccepted) {
      setShakeRules(true);
      setTimeout(() => setShakeRules(false), 300);
    }

    if (isButtonDisabled) {
      return;
    }

    console.log("Оплата успешна!");
  };

  const getCheckboxStyles = (isShaking: boolean) => ({
    '.chakra-checkbox__control': {
      bg: 'transparent',
      border: '3px solid',
      borderColor: isShaking ? 'white' : '#80bFFF',
      borderRadius: '5px',
      transition: "all 0.45s ease-in-out",
      'svg': {
        display: 'none',
      },
      _checked: {
        bg: '#80bFFF',
        borderColor: '#80bFFF',
        color: 'transparent',
        transform: "scale(1.2)"
      },
      _focus: {
        boxShadow: 'none',
      },
    }
  });

  return (
    <VStack
      w="full"
      maxW={{xl: "1036px", base: "380px"}}
      bg="transparent"
      border="solid #80BFFF"
      borderWidth={{xl: "6px", base: "4px"}}
      borderRadius="38px"
      p={{ base: 4, xl: 4 }}
      mt={{ xl: "156px", base: "108px" }}
      spacing={4}
      align="stretch"
      transition="all 0.45s ease-out"
    >
      <Text 
        fontSize={{ base: "xl", xl: "3xl" }} 
        fontFamily="heading" 
        fontWeight="bold" 
        textTransform="uppercase" 
        textAlign="center"
        letterSpacing="wide"
        color="#80BFFF"
      >
        ПОПОЛНЕНИЕ СЧЁТА
      </Text>

      <Flex direction={{ base: "column", xl: "row" }} gap={4} w="full">
        
        {/* Левая колонка */}
        <VStack flex="1" align="flex-start" spacing={3}>
          <Input 
            bg="transparent" 
            color="white" 
            placeholder="ПСЕВДОНИМ" 
            _placeholder={{ color: "gray.400" }}
            h="50px" 
            borderRadius="20px" 
            border="solid #80BFFF"
            borderWidth={{xl: "6px", base: "4px"}}
            fontFamily="body"
            fontSize="lg"
            w="full"
            _hover={{ borderColor: "#80BFFF" }}
            _focus={{
              borderColor: "white",
              boxShadow: "none"
            }}
            value={nickname}
            onChange={handleNicknameChange}
          />

          <Input 
            bg="transparent" 
            color="white" 
            placeholder="ПОЧТА" 
            border={email.length > 0 && !isEmailValid ? "solid #FF8080" : "solid #80BFFF"}
            borderWidth={{xl: "6px", base: "4px"}}
            _placeholder={{ color: "gray.400" }}
            h="50px" 
            borderRadius="20px" 
            fontFamily="body"
            fontSize="lg"
            w="full"
            _hover={{ borderColor: email.length > 0 && !isEmailValid ? "#FF8080" : "#80BFFF" }}
            _focus={{
              borderColor: "white",
              boxShadow: "none"
            }}
            value={email}
            onChange={handleEmailChange}
          />
        </VStack>

        {/* Правая колонка */}
        <VStack flex="1" align="flex-start" spacing={3}>
          <Button 
            bg="#80bFFF" 
            color="#3D5E7D" 
            h="50px" 
            borderRadius="20px"
            fontFamily="heading"
            fontWeight="bold"
            fontSize="lg"
            w="full"
            transition="all 0.2s ease-out"
            onClick={handlePayClick}
            cursor={"pointer"}
            _hover={{ 
              transform: "scale(0.99)", 
              color: "white"
            }}
            _active={{ transform: "scale(0.97)" }}
          >
            ПОПОЛНИТЬ
          </Button>
          
          <HStack spacing={3}>
            <Checkbox 
              isChecked={ofertaAccepted}
              onChange={(e) => setOfertaAccepted(e.target.checked)}
              sx={getCheckboxStyles(shakeOferta)}
              transition="all 0.3s ease-out"     
              transform={shakeOferta ? "scale(1.15)" : "scale(1)"}
            />
            <Text color="gray.300" fontSize="sm" fontFamily="body">
              СОГЛАСЕН С <Text as="span" 
                          bgColor="#80bFFF"
                          bgClip="text"
                          cursor="pointer"
                          onClick={() => {}}
                          transition="all 0.45s ease-out"
                          sx={{
                            '@media (hover: hover) and (pointer: fine)': {
                              '&:hover': {
                                bgColor: "#FFFFFF",
                              }
                            }
                          }}
                          >ДОГОВОРОМ</Text>
            </Text>
          </HStack>

          <HStack spacing={3}>
            <Checkbox 
              isChecked={rulesAccepted}
              onChange={(e) => setRulesAccepted(e.target.checked)}
              sx={getCheckboxStyles(shakeRules)}
              transition="all 0.3s ease-out"     
              transform={shakeRules ? "scale(1.15)" : "scale(1)"}
            />
            <Text color="gray.300" fontSize="sm" fontFamily="body">
              СОГЛАСЕН С <Text as="span" 
                          bgColor="#80bFFF"
                          bgClip="text"
                          cursor="pointer"
                          onClick={() => {}}
                          transition="all 0.45s ease-out"
                          sx={{
                            '@media (hover: hover) and (pointer: fine)': {
                              '&:hover': {
                                bgColor: "#FFFFFF",
                              }
                            }
                          }}>ПРАВИЛАМИ</Text>
            </Text>
          </HStack>
        </VStack>
      </Flex>

      {/* ОБНОВЛЕННЫЙ БЛОК СЛАЙДЕРА */}
      <Box w="full" mt={0}>
        
        {/* Капсула-обертка для слайдера */}
        <Box 
          w="full" 
          h={{ xl: "64px", base: "58px" }} 
          border="solid #80BFFF" 
          borderWidth={{xl: "6px", base: "4px"}}
          borderRadius="20px" 
          bg="transparent" 
          px="27px" 
          display="flex"
          alignItems="center"
        >
          <Slider
            aria-label="token-slider"
            value={indexes}
            min={0}
            max={TOKEN_OPTIONS.length - 1}
            step={1}
            onChange={(val) => { 
              setIndex(val); 
              setTokens(TOKEN_OPTIONS[val]);
            }}
            focusThumbOnChange={false}
            w="full"
          >
            <SliderTrack bg="transparent" h="full">
              <SliderFilledTrack bg="transparent" /> 
            </SliderTrack>
            
            {/* НЕВИДИМЫЙ КОНТЕЙНЕР БЕГУНКА */}
            <SliderThumb 
              w={"38px"} 
              h={"38px"} 
              bg="transparent" 
              border="none" // На всякий случай обнуляем бордер
              outline="none" // Убираем стандартную обводку браузера
              
              // Глобально убиваем черную обводку (focus-ring)
              _focus={{ boxShadow: "none", outline: "none" }}
              _focusVisible={{ boxShadow: "none", outline: "none" }}
              _active={{ boxShadow: "none", outline: "none" }}
              
              sx={{
                '&:active .visual-thumb': {
                  transform: "scale(0.89)",
                  bg: "white", // Делаем бегунок белым при нажатии
                  boxShadow: "none",
                }
              }}
            >
              {/* ВИДИМАЯ ЧАСТЬ БЕГУНКА */}
              <Box
                className="visual-thumb"
                w="100%"
                h="100%"
                borderRadius="12px"
                bg="#80bFFF"
                // Изменили transition на "all", чтобы цвет тоже менялся плавно
                transition="all 0.2s ease-in-out" 
              />
            </SliderThumb>
          </Slider>
        </Box>

        <Flex w="full" justifyContent="space-between" mt={4}>
          <HStack alignItems="center" p="0px">
            <Text fontSize={{base:"lg", xl: "2xl"}} fontWeight="bold" fontFamily="heading" lineHeight="1ew" color="white">
                {tokens < 1000 ? `${tokens}` : `${Math.trunc(tokens / 1000)} ${tokens / 1000 === Math.trunc(tokens / 1000) ? "000" : "500"}`}
            </Text>
            <Box w={{xl:"30px", base: "25px"}} h={{xl:"30px", base: "25px"}}>
                <Image
                    src={token}
                    alt="Токен"
                    fit="fill"
                    draggable={false} 
                    userSelect="none"
                />    
            </Box>
          </HStack>
          <Text fontSize={{base:"lg", xl:"2xl"}} fontWeight="bold" fontFamily="heading" lineHeight="1ew" color="white">
            {rubles.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽
          </Text>
        </Flex>
      </Box>

    </VStack>
  );
};  