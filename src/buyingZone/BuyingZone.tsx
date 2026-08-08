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
  SimpleGrid,
  useBreakpointValue
} from '@chakra-ui/react';
import { useState } from 'react';

import token from './images/token.png';
import buyingLogo from './images/greenToken.png';
import ruble from './images/ruble.png';

const TOKEN_OPTIONS = [
  1000, 2000, 3000, 4000, 5000,
  10000, 20000, 30000, 40000, 50000,
  100000, 200000, 300000, 400000, 500000
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

  const [submitErrors, setSubmitErrors] = useState({
    nickname: false,
    email: false,
    oferta: false,
    rules: false
  });

  const [isFlashing, setIsFlashing] = useState(false);
  
  const rubles = Math.max(0, tokens / 10 - 0.01);

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
    if (isFlashing) return;

    const isNicknameError = nickname.length < 3;
    const isEmailError = !isEmailValid;
    const isOfertaError = !ofertaAccepted;
    const isRulesError = !rulesAccepted;

    if (!isNicknameError && !isEmailError && !isOfertaError && !isRulesError) {
      console.log("Оплата успешна!");
      return;
    }

    setSubmitErrors({
      nickname: isNicknameError,
      email: isEmailError,
      oferta: isOfertaError,
      rules: isRulesError
    });
    setIsFlashing(true);

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
      bg: hasError ? "#592828" : '#285928',
      border: '3px solid',
      borderColor: hasError ? '#FF8080' : '#80ff80',
      borderRadius: '5px',
      transition: "all 0.3s ease-in-out",
      'svg': { display: 'none' },
      _checked: {
        bg: '#80ff80',
        borderColor: '#80ff80',
        color: 'transparent',
        transform: "scale(1.2)"
      },
      _focus: { boxShadow: 'none' },
      '@media (hover: hover) and (pointer: fine)': {
        '&:hover': {
          borderColor: hasError ? '#FF8080' : '#FFFFFF',
        },
        '&[data-checked]:hover': {
          borderColor: '#80ff80',
          bg: '#80ff80',
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

  const ofertaError = submitErrors.oferta;
  const rulesError = submitErrors.rules;
  const nicknameError = submitErrors.nickname;
  const emailError = submitErrors.email;

  const isDesktop = useBreakpointValue({ base: false, xl: true });
  
    
  return (
    <VStack
      w="full"
      maxW={{xl: "800px", base: "370px"}}
      bgGradient="linear(to-t, transparent, rgba(128, 255, 128, 0.15))"
      border="solid #80ff80"
      borderWidth={{xl: "6px", base: "4px"}}
      borderRadius="25px"
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
        <Text fontSize={{ base: "xl", xl: "3xl" }} fontFamily="heading" color="#80ff80" lineHeight={"1"}>
          ПОКУПКА ТОКЕНОВ
        </Text>
      </HStack>

      <Flex direction={{ base: "column", xl: "row" }} gap={4} w="full">
        {/* Левая колонка */}
        <VStack flex="1" align="flex-start" spacing={3}>
          <Input 
            bg= {nicknameError ? "#592828" : "#285928"} 
            color="white" 
            placeholder="ПСЕВДОНИМ" 
            // ИЗМЕНЕНИЕ: Меняем цвет плейсхолдера при ошибке
            _placeholder={{ 
              color: nicknameError ? "#FF8080" : "#80ff80", 
              transition: "color 0.3s ease-in-out" 
            }}
            h="50px" 
            borderRadius="15px" 
            border="solid" 
            borderColor={nicknameError ? "#FF8080" : "#80ff80"} 
            borderWidth={{xl: "6px", base: "4px"}}
            fontSize="lg" 
            w="full" 
            transition="all 0.3s ease-in-out" // Изменили с border-color на all
            _hover={{ borderColor: nicknameError ? "#FF8080" : "#80ff80" }} 
            _focus={{ borderColor: "white", boxShadow: "none" }}
            value={nickname} 
            onChange={handleNicknameChange}
          />
          <Input 
            bg= {emailError ? "#592828" : "#285928"}  
            color="white" 
            placeholder="ПОЧТА" 
            border="solid"
            borderColor={emailError ? "#FF8080" : "#80ff80"}
            borderWidth={{xl: "6px", base: "4px"}} 
            // ИЗМЕНЕНИЕ: Меняем цвет плейсхолдера при ошибке
            _placeholder={{ 
              color: emailError ? "#FF8080" : "#80ff80",
              transition: "color 0.3s ease-in-out"
            }}
            h="50px" 
            borderRadius="15px" 
            fontSize="lg" 
            w="full"
            transition="all 0.3s ease-in-out" // Изменили с border-color на all
            _hover={{ borderColor: emailError ? "#FF8080" : "#80ff80" }}
            _focus={{ borderColor: "white", boxShadow: "none" }}
            value={email} 
            onChange={handleEmailChange}
          />
        </VStack>

        {/* Правая колонка */}
        <VStack flex="1" align="flex-start" spacing={3}>
          <Button 
            bg={"#80ff80"} 
            color={"#285928"} 
            h="50px" 
            borderRadius="15px"
            border="solid"
            borderColor="#80ff80"
            borderWidth={{xl: "6px", base: "4px"}}
            fontFamily="heading" 
            fontWeight="bold" 
            fontSize="lg" 
            w="full"
            transition="all 0.2s ease-out" 
            onClick={handlePayClick} 
            cursor={"pointer"}
            _hover={{ 
              transform: "scale(0.96)"
            }}
            _active={{ transform: "scale(0.9)" }}
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
                // ИЗМЕНЕНИЕ: Меняем цвет текста при ошибке и добавляем анимацию
                // color={ofertaError ? "#FF8080" : "white"}
                // transition="color 0.3s ease-in-out"
                color={"white"}

                fontSize="sm" 
                fontFamily="body" 
                cursor="pointer" 
                lineHeight={"1"}
                onClick={() => {
                  setOfertaAccepted(!ofertaAccepted);
                  setSubmitErrors(prev => ({ ...prev, oferta: false }));
                }} 
              >
                СОГЛАСЕН С <Text as="span" bgColor="#80ff80" bgClip="text" cursor="pointer" lineHeight={"1"}
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
                // ИЗМЕНЕНИЕ: Меняем цвет текста при ошибке и добавляем анимацию
                // color={rulesError ? "#FF8080" : "white"}
                // transition="color 0.3s ease-in-out"
                color={"white"}
                fontSize="sm" 
                fontFamily="body" 
                cursor="pointer" 
                lineHeight={"1"} 
                onClick={() => {
                  setRulesAccepted(!rulesAccepted);
                  setSubmitErrors(prev => ({ ...prev, rules: false }));
                }}
              >
                СОГЛАСЕН С <Text as="span" bgColor="#80ff80" bgClip="text" cursor="pointer" lineHeight={"1"}
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
          w="full" h={{xl :"50px", base: "46px"}} border="solid #80ff80" borderWidth={{xl: "6px", base: "4px"}}
          borderRadius="15px" bg="transparent" px="20px" display="flex" alignItems="center" overflow="hidden"
          bgColor="#285928"
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
              <Box w="100%" h="100%" borderRadius="6px" bg="#80ff80" transition="all 0.15s ease-in-out" 
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
          columns={{ base: 5, xl: 5 }} 
          spacing={{ base: 1.5, xl: 2 }} 
          mt={{ base: 0, xl: 3 }}
          mb={{ base: 3, xl: 0 }}
          w="full"
        >
          {TOKEN_OPTIONS.map((val) => {
            const isActive = tokens === val; 
            
            const displayVal = isDesktop ? `${val / 1000} 000` : `${val / 1000}K`;
            return (
              <Button
                key={val}
                onClick={() => handleQuickSelect(val)}
                bg={isActive ? "#80ff80" : "#285928"}
                color={isActive ? "#285928" : "white"}
                border="solid #80ff80"
                borderWidth={{ xl: "6px", base: "4px" }} 
                h={{ xl: "50px", base: "35px" }} 
                borderRadius={{ xl: "15px", base: "10px" }}
                fontFamily="heading"
                fontSize={{ xl: "16px", base: "10px" }} 
                p={0}
                transition="all 0.2s ease-out"
                _hover={{
                  transform: "scale(0.92)",
                  borderColor: !isActive ? "white" : "transparent",
                  color: !isActive ? "white" : "#285928"
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