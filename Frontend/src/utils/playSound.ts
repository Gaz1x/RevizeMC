import clickSound from "../assets/sounds/click.ogg";
import successSound from "../assets/sounds/success.ogg";
import errorSound from "../assets/sounds/error.ogg";

/*
 * Звуки интерфейса.
 *
 * Основной путь — Web Audio API: каждый звук декодируется в AudioBuffer
 * один раз, а воспроизведение создаёт лёгкий BufferSource. Это даёт
 * мгновенный повторный запуск (предыдущий тик гасится за несколько
 * миллисекунд), точный питч и отсутствие наложения.
 *
 * Если Web Audio или декодирование недоступны (например, старый Safari
 * без Ogg Vorbis), работает старый вариант на HTMLAudioElement
 * с предзагруженным пулом.
 */

type SoundName = "click" | "success" | "error";

const SOUND_SOURCES: Record<SoundName, string> = {
  click: clickSound,
  success: successSound,
  error: errorSound,
};

/*
 * Клик должен быть тише вердиктов проверки: он звучит постоянно,
 * а success/error — только в значимые моменты.
 */
const SOUND_VOLUMES: Record<SoundName, number> = {
  click: 0.35,
  success: 0.5,
  error: 0.45,
};

const MUTE_STORAGE_KEY = "revizemc:sound-muted";

/* Для HTMLAudio-фолбэка: быстрые клики по кнопкам не обрывают друг друга. */
const POOL_SIZE = 3;

/* Сколько копий одного звука может звучать одновременно в Web Audio. */
const MAX_WEB_AUDIO_VOICES = 3;

/*
 * Слайдер: тик срабатывает на каждую ступеньку, но не чаще, чем раз
 * в 32 мс — быстрый drag не превращается в сплошной «зззз».
 */
const SLIDER_TICK_MIN_INTERVAL = 32;

/* Разброс высоты: от -1 до +1 полутона. */
const SLIDER_TICK_RANGE_SEMITONES = 1;

/*
 * Крошечный WAV из одних нулей. Нужен только для разблокировки
 * воспроизведения на iOS: там первый play() обязан произойти
 * внутри жеста пользователя.
 */
const SILENT_WAV =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";

type PitchAudio = HTMLAudioElement & {
  mozPreservesPitch?: boolean;
  webkitPreservesPitch?: boolean;
};

type AudioSessionLike = { type: string };

const pools = new Map<SoundName, HTMLAudioElement[]>();
const audioBuffers = new Map<SoundName, AudioBuffer>();
const loadStates = new Map<SoundName, "loading" | "ready" | "failed">();
const activeVoices: Record<SoundName, number> = {
  click: 0,
  success: 0,
  error: 0,
};

let audioContext: AudioContext | null = null;
let isWebAudioDisabled = false;

let isMuted = readMuted();
let isUnlocked = false;

let lastSliderTickAt = 0;
let currentSliderTick: {
  source: AudioBufferSourceNode;
  gain: GainNode;
} | null = null;

let fallbackSliderAudio: PitchAudio | null = null;

function readMuted(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(MUTE_STORAGE_KEY) === "1";
  } catch {
    /* Приватный режим может запрещать localStorage. */
    return false;
  }
}

/*
 * Audio Session API (Safari 16.4+). Режим ambient означает «смешивать
 * с другим аудио», а не забирать аудиосессию целиком — тогда звук
 * на сайте не ставит на паузу видео из PiP/другого приложения.
 */
function initAudioSession() {
  if (typeof navigator === "undefined") return;

  const session = (
    navigator as Navigator & { audioSession?: AudioSessionLike }
  ).audioSession;

  if (!session) return;

  try {
    session.type = "ambient";
  } catch {
    /* Браузер не разрешил сменить тип сессии. */
  }
}

function getAudioContext(): AudioContext | null {
  if (isWebAudioDisabled || typeof window === "undefined") return null;

  if (audioContext) return audioContext;

  try {
    const AudioContextConstructor =
      window.AudioContext ??
      (
        window as unknown as {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (!AudioContextConstructor) {
      isWebAudioDisabled = true;
      return null;
    }

    audioContext = new AudioContextConstructor();
    return audioContext;
  } catch {
    isWebAudioDisabled = true;
    return null;
  }
}

function loadWebAudioSound(name: SoundName) {
  if (loadStates.has(name)) return;

  const context = getAudioContext();

  if (!context) return;

  loadStates.set(name, "loading");

  void fetch(SOUND_SOURCES[name])
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Не удалось загрузить звук ${name}`);
      }

      return response.arrayBuffer();
    })
    .then((data) => context.decodeAudioData(data))
    .then((buffer) => {
      audioBuffers.set(name, buffer);
      loadStates.set(name, "ready");
    })
    .catch((error) => {
      loadStates.set(name, "failed");

      /*
       * Это не ошибка приложения: просто останемся на HTMLAudio.
       * В консоль не пишем, чтобы не шуметь при каждом старте.
       */
      if (process.env.NODE_ENV === "development") {
        console.warn(`Web Audio не смог декодировать ${name}:`, error);
      }
    });
}

function playWebAudio(name: SoundName): boolean {
  const context = getAudioContext();
  const buffer = audioBuffers.get(name);

  if (!context || !buffer) return false;

  if (activeVoices[name] >= MAX_WEB_AUDIO_VOICES) return true;

  if (context.state === "suspended") {
    void context.resume().catch(() => {});
  }

  const source = context.createBufferSource();
  source.buffer = buffer;

  const gain = context.createGain();
  gain.gain.value = SOUND_VOLUMES[name];

  source.connect(gain);
  gain.connect(context.destination);

  activeVoices[name] += 1;

  const release = () => {
    activeVoices[name] = Math.max(0, activeVoices[name] - 1);

    try {
      source.disconnect();
    } catch {}

    try {
      gain.disconnect();
    } catch {}
  };

  source.onended = release;

  try {
    source.start();
  } catch {
    release();
    return false;
  }

  return true;
}

function getPool(name: SoundName): HTMLAudioElement[] {
  let pool = pools.get(name);

  if (!pool) {
    pool = Array.from({ length: POOL_SIZE }, () => {
      const audio = new Audio(SOUND_SOURCES[name]);
      audio.preload = "auto";
      audio.volume = SOUND_VOLUMES[name];

      return audio;
    });

    pools.set(name, pool);
  }

  return pool;
}

function playFallback(name: SoundName) {
  const pool = getPool(name);
  const audio = pool.find((item) => item.paused || item.ended) ?? pool[0];

  try {
    audio.currentTime = 0;
  } catch {
    /* Safari бросает InvalidStateError, пока не загружены метаданные. */
  }

  void audio.play().catch(() => {
    /* NotAllowedError — звук заблокирован, это не ошибка приложения. */
  });
}

function play(name: SoundName) {
  if (isMuted) return;

  if (playWebAudio(name)) return;

  playFallback(name);
}

export const playClickSound = () => play("click");
export const playSuccessSound = () => play("success");
export const playErrorSound = () => play("error");

function getFallbackSliderAudio(): PitchAudio {
  if (!fallbackSliderAudio) {
    const audio = new Audio(SOUND_SOURCES.click) as PitchAudio;

    audio.preload = "auto";
    audio.volume = SOUND_VOLUMES.click;

    /*
     * По умолчанию браузер сохраняет высоту тона и меняет только
     * скорость. Нам нужен обратный эффект — «плёнка»: выше позиция,
     * выше и короче клик.
     */
    audio.preservesPitch = false;
    audio.mozPreservesPitch = false;
    audio.webkitPreservesPitch = false;

    fallbackSliderAudio = audio;
  }

  return fallbackSliderAudio;
}

function playSliderTickFallback(rate: number) {
  const audio = getFallbackSliderAudio();

  /*
   * HTMLAudio не умеет мгновенно перезапускаться без наложения:
   * сначала явно останавливаем предыдущий тик.
   */
  audio.pause();
  audio.playbackRate = rate;

  try {
    audio.currentTime = 0;
  } catch {
    /* Метаданные ещё не загружены. */
  }

  void audio.play().catch(() => {});
}

function playSliderTickWebAudio(rate: number): boolean {
  const context = getAudioContext();
  const buffer = audioBuffers.get("click");

  if (!context || !buffer) return false;

  if (context.state === "suspended") {
    void context.resume().catch(() => {});
  }

  const now = context.currentTime;

  /*
   * Гасим предыдущий тик за ~5 мс и останавливаем его. Новый стартует
   * сразу же, поэтому нет ни «кд», ни наложения.
   */
  if (currentSliderTick) {
    const previous = currentSliderTick;
    currentSliderTick = null;

    try {
      previous.gain.gain.cancelScheduledValues(now);
      previous.gain.gain.setValueAtTime(previous.gain.gain.value, now);
      previous.gain.gain.linearRampToValueAtTime(0, now + 0.005);
      previous.source.stop(now + 0.01);
    } catch {
      /* Источник уже остановлен. */
    }
  }

  const source = context.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = rate;

  const gain = context.createGain();
  gain.gain.value = SOUND_VOLUMES.click;

  source.connect(gain);
  gain.connect(context.destination);

  const release = () => {
    if (currentSliderTick?.source === source) {
      currentSliderTick = null;
    }

    try {
      source.disconnect();
    } catch {}

    try {
      gain.disconnect();
    } catch {}
  };

  source.onended = release;

  try {
    source.start(now);
  } catch {
    release();
    return false;
  }

  currentSliderTick = { source, gain };

  return true;
}

/*
 * position — доля от 0 до 1 (индекс ступеньки / (количество - 1)).
 * 0 — нижний край слайдера, 1 — верхний.
 */
export function playSliderTick(position: number) {
  if (isMuted) return;

  const now = performance.now();

  if (now - lastSliderTickAt < SLIDER_TICK_MIN_INTERVAL) return;

  lastSliderTickAt = now;

  const clamped = Math.min(1, Math.max(0, position));
  const semitones = (clamped - 0.5) * SLIDER_TICK_RANGE_SEMITONES * 2;
  const rate = 2 ** (semitones / 12);

  if (!playSliderTickWebAudio(rate)) {
    playSliderTickFallback(rate);
  }
}

/*
 * Вызывается на каждом pointerdown: resume нужен, если браузер
 * приостановил AudioContext (переключение вкладки, блокировка экрана).
 * Беззвучный HTMLAudio разблокируется только один раз.
 */
export function unlockSounds() {
  initAudioSession();

  const context = getAudioContext();

  if (context && context.state === "suspended") {
    void context.resume().catch(() => {});
  }

  if (isUnlocked) return;

  isUnlocked = true;

  const audio = new Audio(SILENT_WAV);
  audio.volume = 0;

  void audio.play().catch(() => {});
}

export function isSoundMuted() {
  return isMuted;
}

export function setSoundMuted(value: boolean) {
  isMuted = value;

  try {
    window.localStorage.setItem(MUTE_STORAGE_KEY, value ? "1" : "0");
  } catch {
    /* localStorage недоступен — настройка проживёт до перезагрузки. */
  }
}

if (typeof window !== "undefined") {
  initAudioSession();

  (Object.keys(SOUND_SOURCES) as SoundName[]).forEach(loadWebAudioSound);
}
