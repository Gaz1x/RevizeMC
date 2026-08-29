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

import buyingLogo from './images/token.png';

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

  /* СОСТОЯНИЯ КОМПОНЕНТА */
  const [tokens, setTokens] = useState<number>(1000);

  const [smoothValue, setSmoothValue] = useState<number>(TOKEN_OPTIONS.indexOf(1000));
  const [isDragging, setIsDragging] = useState(false); 

  // Единое состояние для соглашения с документами
  const [documentsAccepted, setDocumentsAccepted] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  
  const [isProcessing, setIsProcessing] = useState(false);

  // Единая ошибка для документов
  const [submitErrors, setSubmitErrors] = useState({
    username: false,
    email: false,
    documents: false 
  });

  const [isFlashing, setIsFlashing] = useState(false);

  const isDesktop = useBreakpointValue({ base: false, xl: true });

  const rubles = Math.max(0, tokens / 10 );

  /* ЛОГИКА ВАЛИДАЦИИ И ОБРАБОТЧИКИ */
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmitErrors(prev => ({ ...prev, nickname: false })); 
    const value = e.target.value;
    const isValid = /^[a-zA-Z0-9_]*$/.test(value);

    if (isValid && value.length <= 16) {
      setUsername(value);
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

  const handlePayClick = async () => {
    if (isFlashing || isProcessing) return;
    setIsProcessing(true);

    const isUsernameLocalError = username.length < 3;
    const isEmailError = !isEmailValid;
    const isDocumentsError = !documentsAccepted;

    let isUsernameServerError = false;

    // Шаг 1: Если длина ника корректна, проверяем его на сервере
    if (!isUsernameLocalError) {
      try {
        const checkRes = await fetch(`https://api.revizemc.net/check-player/${username}`);
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          if (!checkData.exists) {
            isUsernameServerError = true;
          }
        } else {
          isUsernameServerError = true;
        }
      } catch (error) {
        console.error("Ошибка проверки ника:", error);
        isUsernameServerError = true;
      }
    }

    const finalUsernameError = isUsernameLocalError || isUsernameServerError;

    // Шаг 2: Если есть ошибка - мигаем красным
    if (finalUsernameError || isEmailError || isDocumentsError) {
      setSubmitErrors({
        username: finalUsernameError,
        email: isEmailError,
        documents: isDocumentsError
      });

      setIsFlashing(true);

      setTimeout(() => {
        setSubmitErrors({ username: false, email: false, documents: false });
      }, 300);

      setTimeout(() => {
        setIsFlashing(false);
      }, 600);

      setIsProcessing(false);
      return;
    }

    // Шаг 3: Оплата
    try {
      const purchaseRes = await fetch('https://api.revizemc.net/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          action: tokens
        }),
      });

      if (purchaseRes.ok) {
        console.log("Оплата успешно инициирована!");
        
        // --- ОЧИСТКА ПОЛЕЙ ПОСЛЕ УСПЕХА ---
        setUsername("");
        setEmail("");
        setDocumentsAccepted(false);
        setTokens(1000);
        setSmoothValue(TOKEN_OPTIONS.indexOf(1000));
      } else {
        setSubmitErrors(prev => ({ ...prev, nickname: true }));
        setIsFlashing(true);
        setTimeout(() => setSubmitErrors(prev => ({ ...prev, nickname: false })), 300);
        setTimeout(() => setIsFlashing(false), 600);
      }
    } catch (error) {
      console.error("Сбой оплаты:", error);
      setSubmitErrors(prev => ({ ...prev, nickname: true }));
      setIsFlashing(true);
      setTimeout(() => setSubmitErrors(prev => ({ ...prev, nickname: false })), 300);
      setTimeout(() => setIsFlashing(false), 600);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSliderChange = (val: number) => {
    setSmoothValue(val);
    setTokens(TOKEN_OPTIONS[Math.round(val)]);
  };

  const handleSliderChangeEnd = (val: number) => {
    const snappedIdx = Math.round(val);
    setSmoothValue(snappedIdx);
    setIsDragging(false);
  };

  const handleQuickSelect = (amount: number) => {
    const idx = TOKEN_OPTIONS.indexOf(amount);
    if (idx !== -1) {
      setSmoothValue(idx);
      setTokens(amount);
    }
  };

  /* СТИЛИ */
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
      _focus: { 
        boxShadow: 'none' 
      },
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

  return (
    <VStack
      w="full"
      maxW={{ xl: "800px", base: "370px" }}
      bgGradient="linear(to-t, transparent, rgba(128, 255, 128, 0.15))"
      border="solid #80ff80"
      borderWidth={{ xl: "6px", base: "4px" }}
      borderRadius="25px"
      p={4}
      mt={{xl: "30px", base: "15px"}} 
      spacing={4}
      align="stretch"
      transition="all 0.45s ease-out"
      sx={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* ШАПКА БЛОКА */}
      <HStack 
        alignItems="center" 
        p="0px"
      >
        <Box 
          w={{ xl: "36px", base: "27px" }} 
          h={{ xl: "36px", base: "27px" }}
        >
          <Image 
            src={buyingLogo} 
            alt="Токен" 
            fit="fill" 
            draggable={false} 
            userSelect="none" 
          />    
        </Box>
        <Text 
          fontSize={{ base: "xl", xl: "3xl" }} 
          fontFamily="heading" 
          color="#80ff80" 
          lineHeight="1"
        >
          ПОКУПКА ТОКЕНОВ
        </Text>
      </HStack>

      <Flex 
        direction={{ base: "column", xl: "row" }} 
        gap={4} 
        w="full"
      >
        {/* ЛЕВАЯ КОЛОНКА (Инпуты) */}
        <VStack 
          flex="1" 
          align="flex-start" 
          spacing={3}
        >
          <Input 
            bg={submitErrors.username ? "#592828" : "#285928"} 
            color="white" 
            placeholder="ПСЕВДОНИМ" 
            h="50px" 
            borderRadius="15px" 
            border="solid" 
            borderColor={submitErrors.username ? "#FF8080" : "#80ff80"} 
            borderWidth={{ xl: "6px", base: "4px" }}
            fontSize="lg" 
            w="full" 
            transition="all 0.3s ease-in-out" 
            value={username} 
            onChange={handleUsernameChange}
            _placeholder={{ 
              color: submitErrors.username ? "#FF8080" : "#80ff80", 
              transition: "color 0.3s ease-in-out" 
            }}
            _hover={{ 
              borderColor: submitErrors.username ? "#FF8080" : "#80ff80" 
            }} 
            _focus={{ 
              borderColor: "white", 
              boxShadow: "none" 
            }}
          />
          <Input 
            bg={submitErrors.email ? "#592828" : "#285928"}  
            color="white" 
            placeholder="ПОЧТА" 
            border="solid"
            borderColor={submitErrors.email ? "#FF8080" : "#80ff80"}
            borderWidth={{ xl: "6px", base: "4px" }} 
            h="50px" 
            borderRadius="15px" 
            fontSize="lg" 
            w="full"
            transition="all 0.3s ease-in-out"
            value={email} 
            onChange={handleEmailChange}
            _placeholder={{ 
              color: submitErrors.email ? "#FF8080" : "#80ff80",
              transition: "color 0.3s ease-in-out"
            }}
            _hover={{ 
              borderColor: submitErrors.email ? "#FF8080" : "#80ff80" 
            }}
            _focus={{ 
              borderColor: "white", 
              boxShadow: "none" 
            }}
          />
        </VStack>

        {/* ПРАВАЯ КОЛОНКА (Кнопка оплаты и соглашения) */}
        <VStack 
          flex="1" 
          align="flex-start" 
          spacing={3}
        >
          <Button 
            bg="#80ff80" 
            color="#285928" 
            h="50px" 
            borderRadius="15px"
            border="solid"
            borderColor="#80ff80"
            borderWidth={{ xl: "6px", base: "4px" }}
            fontFamily="heading" 
            fontWeight="bold" 
            fontSize="lg" 
            w="full"
            transition="all 0.2s ease-out" 
            cursor="pointer"
            isLoading={isProcessing}
            loadingText="ОЖИДАНИЕ..."
            onClick={handlePayClick} 
            _hover={{ 
              transform: "scale(0.96)"
            }}
            _active={{ 
              transform: "scale(0.9)" 
            }}
          >
            {rubles.toLocaleString('ru-RU')} рублей
          </Button>

          {/* ЕДИНЫЙ БЛОК СОГЛАШЕНИЙ */}
          <VStack 
            spacing={{xl: "5.5px", base: "10px"}} 
            alignItems="flex-start" 
            w="full" 
          >
            {/* 1 строка: Чекбокс и основной текст */}
            <HStack spacing={3}>
              <Flex w="18px" justify="center" align="center">
                <Checkbox 
                  isChecked={documentsAccepted} 
                  sx={getCheckboxStyles(submitErrors.documents)} 
                  onChange={(e) => {
                    setDocumentsAccepted(e.target.checked);
                    setSubmitErrors(prev => ({ ...prev, documents: false }));
                  }}
                />
              </Flex>
              <Text 
                color="white"
                fontSize={{xl: "11px", base: "12.9px"}} 
                fontFamily="body" 
                lineHeight="1"
                mt="2px"
                cursor="pointer"
                onClick={() => {
                  setDocumentsAccepted(!documentsAccepted);
                  setSubmitErrors(prev => ({ ...prev, documents: false }));
                }}
              >
                ПРИНИМАЮ УСЛОВИЯ ДОКУМЕНТОВ:
              </Text>
            </HStack>

            {/* 2 строка: Точка и Политика конфиденциальности */}
            <HStack spacing={3}>
              <Flex w="18px" justify="center" align="center">
                <Box w="7.5px" h="7.5px" borderRadius="1.5px" bgColor={submitErrors.documents ? "#FF8080" : "#80ff80"} transition="all 0.3s ease-in-out"/>
              </Flex>
              <Text 
                as="span" 
                bgColor={submitErrors.documents ? "#FF8080" : "#80ff80"} 
                bgClip="text" 
                fontSize={{xl: "11.2px", base: "13.05px"}} 
                fontFamily="body"
                lineHeight="1"
                textAlign="justify"
                transition="all 0.3s ease-in-out"
                cursor="pointer"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  window.open('https://www.revizemc.net/privacy-policy.pdf', '_blank'); 
                }} 
                sx={{ 
                  '@media (hover: hover) and (pointer: fine)': { 
                    '&:hover': { 
                      bgColor: "#FFFFFF", 
                    } 
                  } 
                }}
              >
                ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
              </Text>
            </HStack>

            {/* 3 строка: Точка и Пользовательское соглашение */}
            <HStack spacing={3}>
              <Flex w="18px" justify="center" align="center">
                <Box w="7.5px" h="7.5px" borderRadius="1.5px" bgColor={submitErrors.documents ? "#FF8080" : "#80ff80"} transition="all 0.3s ease-in-out"/>
              </Flex>
              <Text 
                as="span" 
                bgColor={submitErrors.documents ? "#FF8080" : "#80ff80"} 
                bgClip="text" 
                fontSize={{xl: "11.4px", base: "13.35px"}} 
                fontFamily="body"
                lineHeight="1"
                transition="all 0.3s ease-in-out"
                textAlign="justify"
                cursor="pointer"
                onClick={(e) => { 
                  e.stopPropagation();
                  window.open('https://www.revizemc.net/terms-of-service.pdf', '_blank');
                }} 
                sx={{ 
                  '@media (hover: hover) and (pointer: fine)': { 
                    '&:hover': { 
                      bgColor: "#FFFFFF", 
                    } 
                  } 
                }}
              >
                ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ
              </Text>
            </HStack>
          </VStack>

        </VStack>
      </Flex>

      {/* БЛОК СЛАЙДЕРА И КНОПОК БЫСТРОГО ВЫБОРА */}
      <Flex 
        direction="column" 
        w="full" 
        mt="-5px"
      >
        <Box 
          order={{ base: 2, xl: 1 }}
          w="full" 
          h={{ xl: "50px", base: "46px" }} 
          border="solid #80ff80" 
          borderWidth={{ xl: "6px", base: "4px" }}
          borderRadius="15px" 
          bg="transparent" 
          px="20px" 
          display="flex" 
          alignItems="center" 
          overflow="hidden"
          bgColor="#285928"
        >
          <Slider
            aria-label="token-slider" 
            value={smoothValue} 
            min={0} 
            max={TOKEN_OPTIONS.length - 1} 
            step={0.01} 
            focusThumbOnChange={false} 
            w="full" 
            role="group"
            onChange={handleSliderChange}
            onChangeStart={() => setIsDragging(true)}
            onChangeEnd={handleSliderChangeEnd}
            sx={{
              WebkitTapHighlightColor: "transparent !important", 
              WebkitUserSelect: "none !important",
              userSelect: "none !important", 
              outline: "none !important", 
              boxShadow: "none !important",
              '.chakra-slider__track': { 
                overflow: 'visible !important', 
                bg: 'transparent !important' 
              }
            }}
          >
            <SliderTrack 
              bg="transparent" 
              h="12px"
            >
              <SliderFilledTrack 
                ml="-10px" 
                bg="white" 
                borderLeftRadius="4px" 
                borderRightRadius="0px"
                transition={isDragging ? "none" : "width 0.2s ease-out"}
              /> 
            </SliderTrack>
            <SliderThumb 
              w="30px" 
              h="30px" 
              bg="transparent" 
              border="none" 
              outline="none" 
              boxShadow="none !important"
              transition={isDragging ? "none" : "left 0.2s ease-out"}
              _focus={{ 
                boxShadow: "none !important", 
                outline: "none !important" 
              }}
              _focusVisible={{ 
                boxShadow: "none !important", 
                outline: "none !important" 
              }}
              _active={{ 
                boxShadow: "none !important", 
                outline: "none !important" 
              }}
              sx={{ 
                WebkitTapHighlightColor: "transparent !important", 
                outline: "none !important" 
              }}
            >
              <Box 
                w="100%" 
                h="100%" 
                borderRadius="6px" 
                bg="#80ff80" 
                transition="all 0.15s ease-in-out" 
                boxShadow="none !important"
                outline="none !important"
                _groupHover={{ 
                  bg: "white", 
                  transform: "scale(0.85)" 
                }}
                _groupActive={{ 
                  bg: "white", 
                  transform: "scale(0.75)" 
                }}
              />
            </SliderThumb>
          </Slider>
        </Box>

        {/* СЕТКА ИЗ 15 КНОПОК */}
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
                onClick={() => handleQuickSelect(val)}
                _hover={{
                  transform: "scale(0.92)",
                  borderColor: !isActive ? "white" : "transparent",
                  color: !isActive ? "white" : "#285928"
                }}
                _active={{
                  transform: "scale(0.85)"
                }}
              >
                <Text 
                  lineHeight="1"
                >
                  {displayVal}
                </Text>
              </Button>
            );
          })}
        </SimpleGrid>

      </Flex>
    </VStack>
  );
};