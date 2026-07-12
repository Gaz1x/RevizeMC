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
  SimpleGrid
} from '@chakra-ui/react';
import { useState } from 'react';

import token from './images/token.png';
import buyingLogo from './images/buyingLogo.png';
import ruble from './images/ruble.png';

const TOKEN_OPTIONS = [
  100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
  1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000,
  6000, 7000, 8000, 9000, 10000,
  15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 
  60000, 70000, 80000, 90000, 100000
];

const POPULAR_DOMAINS = [
  'gmail.com', 'mail.ru', 'yandex.ru', 'bk.ru', 'inbox.ru',
  'list.ru', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'
];

export const BuyingZone = () => {
  const [tokens, setTokens] = useState<number>(1000);
  
  const [smoothValue, setSmoothValue] = useState<number>(
    (TOKEN_OPTIONS.indexOf(1000) / (TOKEN_OPTIONS.length - 1)) * 100
  );

  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [ofertaAccepted, setOfertaAccepted] = useState(false);
  
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");

  // Состояние для временной "вспышки" ошибок
  const [submitErrors, setSubmitErrors] = useState({
    nickname: false,
    email: false,
    oferta: false,
    rules: false
  });

  const [isFlashing, setIsFlashing] = useState(false);
  
  const rubles = Math.max(0, tokens / 2 - 0.01);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmitErrors(prev => ({ ...prev, nickname: false })); 
    const value = e.target.value;
    const isValid = /^[a-zA-Z0-9_]*$/.test(value);
    if (isValid && value.length <= 16) {
        setNickname(value);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmitErrors(prev => ({ ...prev, email: false }));
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

  const isFormValid = rulesAccepted && ofertaAccepted && nickname.length >= 3 && isEmailValid;

const handlePayClick = () => {
    // 1. Если анимация ошибки уже идет — просто игнорируем новые клики
    if (isFlashing) return;

    const isNicknameError = nickname.length < 3;
    const isEmailError = !isEmailValid;
    const isOfertaError = !ofertaAccepted;
    const isRulesError = !rulesAccepted;

    // 2. Если всё правильно заполнено — пропускаем логику ошибок и идем к оплате
    if (!isNicknameError && !isEmailError && !isOfertaError && !isRulesError) {
      console.log("Оплата успешна!");
      return;
    }

    // 3. Зажигаем красным те поля, где есть ошибка, и СТАВИМ БЛОКИРОВКУ
    setSubmitErrors({
      nickname: isNicknameError,
      email: isEmailError,
      oferta: isOfertaError,
      rules: isRulesError
    });
    setIsFlashing(true); // Заблокировали кнопку

    // 4. Убираем красный цвет ровно через 1 секунду и СНИМАЕМ БЛОКИРОВКУ
    setTimeout(() => {
      setSubmitErrors({
        nickname: false,
        email: false,
        oferta: false,
        rules: false
      });
    }, 300);

    setTimeout(() => {
      setIsFlashing(false);
    }, 600)
  };

  const getCheckboxStyles = (hasError: boolean) => ({
    '.chakra-checkbox__control': {
      bg: '#1B2D3F',
      border: '3px solid',
      borderColor: hasError ? '#FF8080' : '#80bFFF',
      borderRadius: '5px',
      transition: "all 0.3s ease-in-out", // Плавный переход цвета
      'svg': { display: 'none' },
      _checked: {
        bg: '#80bFFF',
        borderColor: '#80bFFF',
        color: 'transparent',
        transform: "scale(1.2)"
      },
      _focus: { boxShadow: 'none' },
      '@media (hover: hover) and (pointer: fine)': {
        '&:hover': {
          borderColor: hasError ? '#FF8080' : '#FFFFFF',
        },
        '&[data-checked]:hover': {
          borderColor: '#80bFFF',
          bg: '#80bFFF',
        },
        '&:active': {
          bg: "transparent"
        },
      },
    }
  });

  const handleSliderChange = (val: number) => {
    setSmoothValue(val);
    const maxIdx = TOKEN_OPTIONS.length - 1;
    const targetIdx = Math.round((val / 100) * maxIdx);
    setTokens(TOKEN_OPTIONS[targetIdx]);
  };

  const handleQuickSelect = (amount: number) => {
    const idx = TOKEN_OPTIONS.indexOf(amount);
    if (idx !== -1) {
      setSmoothValue((idx / (TOKEN_OPTIONS.length - 1)) * 100);
      setTokens(amount);
    }
  };

  // Читаем состояния ошибок из объекта
  const ofertaError = submitErrors.oferta;
  const rulesError = submitErrors.rules;
  const nicknameError = submitErrors.nickname;
  const emailError = submitErrors.email;

  return (
    <VStack
      w="full"
      maxW={{xl: "1036px", base: "370px"}}
      bgGradient="linear(to-t, transparent, rgba(153, 217, 255, 0.15))"
      border="solid #80BFFF"
      borderWidth={{xl: "6px", base: "4px"}}
      borderRadius="30px"
      p={4}
      mt="15px"
      spacing={4}
      align="stretch"
      transition="all 0.45s ease-out"
      sx={{ WebkitTapHighlightColor: "transparent" }}
    >
      <HStack alignItems="center" p="0px">
        <Box w={{xl: "36px", base: "27px"}} h={{xl: "36px", base: "27px"}}>
          <Image src={buyingLogo} alt="Токен" fit="fill" draggable={false} userSelect="none" />    
        </Box>
        <Text fontSize={{ base: "xl", xl: "3xl" }} fontFamily="heading" color="#80BFFF" lineHeight={"1"}>
          ПОКУПКА ТОКЕНОВ
        </Text>
      </HStack>

      <Flex direction={{ base: "column", xl: "row" }} gap={4} w="full">
        {/* Левая колонка */}
        <VStack flex="1" align="flex-start" spacing={3}>
          <Input 
            bg="#1B2D3F" 
            color="white" 
            placeholder="ПСЕвДОНИМ" 
            _placeholder={{ color: "#80BFFF" }}
            h="50px" 
            borderRadius="18px" 
            border="solid" 
            borderColor={nicknameError ? "#FF8080" : "#80BFFF"} 
            borderWidth={{xl: "6px", base: "4px"}}
            fontSize="lg" 
            w="full" 
            transition="border-color 0.3s ease-in-out" // Плавное загорание и затухание
            _hover={{ borderColor: nicknameError ? "#FF8080" : "#80BFFF" }} 
            _focus={{ borderColor: "white", boxShadow: "none" }}
            value={nickname} 
            onChange={handleNicknameChange}
          />
          <Input 
            bg="#1B2D3F" 
            color="white" 
            placeholder="ПОЧТА" 
            border="solid"
            borderColor={emailError ? "#FF8080" : "#80BFFF"}
            borderWidth={{xl: "6px", base: "4px"}} 
            _placeholder={{ color: "#80BFFF" }}
            h="50px" 
            borderRadius="18px" 
            fontSize="lg" 
            w="full"
            transition="border-color 0.3s ease-in-out" // Плавное загорание и затухание
            _hover={{ borderColor: emailError ? "#FF8080" : "#80BFFF" }}
            _focus={{ borderColor: "white", boxShadow: "none" }}
            value={email} 
            onChange={handleEmailChange}
          />
        </VStack>

        {/* Правая колонка */}
        <VStack flex="1" align="flex-start" spacing={3}>
          <Button 
            bg={"#80BFFF"} 
            color={"#1B2D3F"} 
            h="50px" 
            borderRadius="18px"
            border="solid"
            borderColor="#80BFFF"
            borderWidth={{xl: "6px", base: "4px"}}
            fontFamily="heading" 
            fontWeight="bold" 
            fontSize="lg" 
            w="full"
            transition="all 0.2s ease-out" 
            onClick={handlePayClick} 
            cursor={"pointer"}
            _hover={{ 
              transform: "scale(0.99)", 
              color: "white",
            }}
            _active={{ transform: "scale(0.97)" }}
          >
              {rubles.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} рублей
          </Button>
          
          <VStack spacing={3} mt={"3px"}>
            <HStack spacing={3}>
              <Checkbox 
                isChecked={ofertaAccepted} 
                onChange={(e) => {
                  setOfertaAccepted(e.target.checked);
                  setSubmitErrors(prev => ({ ...prev, oferta: false }));
                }} 
                sx={getCheckboxStyles(ofertaError)} 
              />
              <Text 
                color="white" 
                fontSize="sm" 
                fontFamily="body" 
                cursor="pointer" 
                lineHeight={"1"}
                onClick={() => {
                  setOfertaAccepted(!ofertaAccepted);
                  setSubmitErrors(prev => ({ ...prev, oferta: false }));
                }} 
              >
                СОГЛАСЕН С <Text as="span" bgColor="#80bFFF" bgClip="text" cursor="pointer" lineHeight={"1"}
                            onClick={(e) => { e.stopPropagation(); }} transition="all 0.2s ease-out"
                            sx={{ '@media (hover: hover) and (pointer: fine)': { '&:hover': { bgColor: "#FFFFFF", transform: "scale(0.99)" } } }}>ДОГОВОРОМ</Text>
              </Text>
            </HStack>
            <HStack spacing={3}>
              <Checkbox 
                isChecked={rulesAccepted} 
                onChange={(e) => {
                  setRulesAccepted(e.target.checked);
                  setSubmitErrors(prev => ({ ...prev, rules: false }));
                }} 
                sx={getCheckboxStyles(rulesError)} 
              />
              <Text 
                color="white" 
                fontSize="sm" 
                fontFamily="body" 
                cursor="pointer" 
                lineHeight={"1"} 
                onClick={() => {
                  setRulesAccepted(!rulesAccepted);
                  setSubmitErrors(prev => ({ ...prev, rules: false }));
                }}
              >
                СОГЛАСЕН С <Text as="span" bgColor="#80bFFF" bgClip="text" cursor="pointer" lineHeight={"1"}
                            onClick={(e) => { e.stopPropagation(); }} transition="all 0.45s ease-out"
                            sx={{ '@media (hover: hover) and (pointer: fine)': { '&:hover': { bgColor: "#FFFFFF", transform: "scale(0.99)" } } }}>ПРАВИЛАМИ</Text>
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Flex>

      {/* БЛОК СЛАЙДЕРА И КНОПОК */}
      <Flex direction="column" w="full" mt="-5px">
        
        <Box 
          order={{ base: 2, xl: 1 }}
          w="full" h={{xl :"50px", base: "46px"}} border="solid #80BFFF" borderWidth={{xl: "6px", base: "4px"}}
          borderRadius="18px" bg="transparent" px="20px" display="flex" alignItems="center" overflow="hidden"
          bgColor="#1B2D3F"
        >
          <Slider
            aria-label="token-slider" value={smoothValue} min={0} max={100} step={0.1} 
            onChange={handleSliderChange} focusThumbOnChange={false} w="full" role="group"
            sx={{
              WebkitTapHighlightColor: "transparent !important", WebkitUserSelect: "none !important",
              userSelect: "none !important", outline: "none !important", boxShadow: "none !important",
              '.chakra-slider__track': { overflow: 'visible !important', bg: 'transparent !important' }
            }}
          >
            <SliderTrack bg="transparent" h="12px">
              <SliderFilledTrack ml="-10px" bg="white" borderLeftRadius="4px" borderRightRadius="0px" /> 
            </SliderTrack>
            <SliderThumb 
              w="30px" h="30px" bg="transparent" border="none" outline="none" boxShadow="none !important"
              _focus={{ boxShadow: "none !important", outline: "none !important" }}
              _focusVisible={{ boxShadow: "none !important", outline: "none !important" }}
              _active={{ boxShadow: "none !important", outline: "none !important" }}
              sx={{ WebkitTapHighlightColor: "transparent !important", outline: "none !important" }}
            >
              <Box w="100%" h="100%" borderRadius="10px" bg="#80bFFF" transition="all 0.15s ease-in-out" 
                boxShadow="none !important" outline="none !important"
                _groupHover={{ bg: "white", transform: "scale(0.85)" }}
                _groupActive={{ bg: "white", transform: "scale(0.75)" }}
              />
            </SliderThumb>
          </Slider>
        </Box>

        {/* СЕТКА ИЗ 36 КНОПОК */}
        <SimpleGrid 
          order={{ base: 1, xl: 2 }}
          columns={{ base: 6, xl: 12 }} 
          spacing={{ base: 1.5, xl: 2 }} 
          mt={{ base: 0, xl: 3 }}
          mb={{ base: 3, xl: 0 }}
          w="full"
        >
          {TOKEN_OPTIONS.map((val) => {
            const isActive = tokens === val; 
            const displayVal = val >= 1000 ? `${val / 1000}К` : val;
            
            return (
              <Button
                key={val}
                onClick={() => handleQuickSelect(val)}
                bg={isActive ? "#80BFFF" : "#1B2D3F"}
                color={isActive ? "#1B2D3F" : "white"}
                border="solid #80BFFF"
                borderWidth={{ xl: "6px", base: "4px" }} 
                h={{ xl: "40px", base: "35px" }} 
                borderRadius={{ xl: "12px", base: "8px" }}
                fontFamily="heading"
                fontSize={{ xl: "13px", base: "10px" }} 
                p={0}
                transition="all 0.2s ease-out"
                _hover={{
                  transform: "scale(0.92)",
                  borderColor: !isActive ? "white" : "transparent",
                  color: !isActive ? "white" : "#1B2D3F"
                }}
                _active={{
                  transform: "scale(0.85)"
                }}
              >
                <Text lineHeight="1">{displayVal}</Text>
              </Button>
            );
          })}
        </SimpleGrid>

      </Flex>
    </VStack>
  );
};