/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gift,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Book,
  BookOpen,
  Maximize
} from 'lucide-react';
import { AppStage, LetterSlide } from './types';
import { audioSynth } from './utils/audio';
import { FlowerParticles, FlowerParticlesRef } from './components/FlowerParticles';

const LETTER_SLIDES: LetterSlide[] = [
  {
    id: 1,
    text: "Ma, maaf kalau aku belum bisa jadi anak yang Mama banggakan. Tapi percayalah, setiap langkah yang aku perjuangkan selalu ada doa untuk membahagiakan Mama di dalamnya."
  },
  {
    id: 2,
    text: "Semakin aku dewasa, semakin aku sadar... ternyata orang yang paling sering menahan sakit tanpa mengeluh adalah Mama."
  },
  {
    id: 3,
    text: "Dunia boleh menganggapku biasa saja, tapi di mata Mama aku selalu berharga. Terima kasih sudah mencintaiku bahkan saat aku sulit mencintai diriku sendiri."
  },
  {
    id: 4,
    text: "Kalau suatu hari nanti aku berhasil, itu bukan karena aku hebat. Itu karena ada doa Mama yang tak pernah berhenti mengiringi langkahku."
  },
  {
    id: 5,
    text: "Mama mengajariku arti cinta tanpa syarat. Cinta yang tetap ada, bahkan ketika aku sering mengecewakan."
  },
  {
    id: 6,
    text: "Aku mungkin sering diam, tapi bukan berarti aku tidak peduli. Di setiap sujudku, selalu ada doa agar Mama diberi umur panjang, kesehatan, dan kebahagiaan."
  },
  {
    id: 7,
    text: "Tak ada pelukan yang lebih menenangkan selain pelukan Mama. Tempat pulang terbaik, bahkan ketika dunia terasa begitu melelahkan."
  },
  {
    id: 8,
    text: "Jika surga benar-benar ada di bawah telapak kaki ibu, maka aku ingin menghabiskan hidupku untuk menjadi alasan Mama tersenyum."
  },
  {
    id: 9,
    text: "Aku tidak bisa mengulang waktu untuk menghapus semua kesalahanku. Tapi aku masih punya hari ini untuk belajar menjadi anak yang lebih baik bagi Mama."
  },
  {
    id: 10,
    text: "Terima kasih, Ma... karena tetap menjadi rumah, meski aku sering datang membawa lelah, tangis, dan kegagalan. ❤️"
  },
  {
    id: 11,
    text: "Dew",
    isClosing: true
  }
];

const PHOTO_PAGES = [
  {
    page: 1,
    title: "Momen Bahagia Mama",
    photos: [
      "https://i.postimg.cc/mkLvyhtb/IMG-20260718-WA0105.jpg",
      "https://i.postimg.cc/7LBtrX6Z/IMG-20260718-WA0086.jpg"
    ]
  },
  {
    page: 2,
    title: "Tawa dan Senyuman Mama",
    photos: [
      "https://i.postimg.cc/ZKk7mWT9/IMG-20260718-WA0072.jpg",
      "https://i.postimg.cc/Y0Qx0xph/IMG-20260718-WA0068.jpg"
    ]
  },
  {
    page: 3,
    title: "Cinta yang Tak Pernah Padam",
    photos: [
      "https://i.postimg.cc/dtqCGF6b/IMG-20240927-WA0000.jpg",
      "https://i.postimg.cc/j5b2K6kk/IMG-20240930-WA0023.jpg"
    ]
  },
  {
    page: 4,
    title: "Kebersamaan Penuh Kehangatan",
    photos: [
      "https://i.postimg.cc/155gfH5X/IMG-20240930-WA0022.jpg",
      "https://i.postimg.cc/bw9vzSk9/IMG-20260718-WA0129.jpg"
    ]
  },
  {
    page: 5,
    title: "Sinar Kasih Sayang",
    photos: [
      "https://i.postimg.cc/VNsk5sFq/IMG-20260718-WA0125.jpg",
      "https://i.postimg.cc/j5LqQ8mj/IMG-20260718-WA0140.jpg"
    ]
  },
  {
    page: 6,
    title: "Keindahan yang Sederhana",
    photos: [
      "https://i.postimg.cc/3NGKzk3B/IMG-20260718-WA0121.jpg",
      "https://i.postimg.cc/02g5D0fP/IMG-20260718-WA0123.jpg"
    ]
  },
  {
    page: 7,
    title: "Pelukan Hangat Mama",
    photos: [
      "https://i.postimg.cc/L82H04wB/IMG-20260718-WA0133.jpg",
      "https://i.postimg.cc/bwyh9CS1/IMG-20260718-WA0132.jpg"
    ]
  },
  {
    page: 8,
    title: "Malaikat Tanpa Sayap",
    photos: [
      "https://i.postimg.cc/jjCYGDX5/IMG-20260718-WA0122.jpg",
      "https://i.postimg.cc/QxbLCQYV/IMG-20260718-WA0119.jpg"
    ]
  },
  {
    page: 9,
    title: "Kedamaian di Sisi Mama",
    photos: [
      "https://i.postimg.cc/wB1nwSqr/IMG-20260718-WA0116.jpg",
      "https://i.postimg.cc/0yBBKcYZ/IMG-20251231-WA0008.jpg"
    ]
  },
  {
    page: 10,
    title: "Selamanya Bersama Mama",
    photos: [
      "https://i.postimg.cc/C5SPpt0S/IMG-20251231-WA0007.jpg",
      "https://i.postimg.cc/26fTnJVw/IMG-20260718-WA0111.jpg"
    ]
  }
];

const ImageWithFallback: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoading(false);
    }
  }, [src]);

  return (
    <div className="w-full h-full relative bg-stone-200/50 flex items-center justify-center">
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-[#d4af37] animate-spin opacity-50" style={{ animationDuration: '3s' }} />
        </div>
      )}
      {error ? (
        <div className="text-center p-2">
          <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-1" />
          <span className="text-[10px] text-stone-500 font-sans tracking-wider uppercase">Gagal memuat foto</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
          loading="lazy"
          onLoad={() => setLoading(false)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState<AppStage>(AppStage.GIFT);
  const [countdown, setCountdown] = useState(3);
  const [isMuted, setIsMuted] = useState(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);
  const [pinErrorMessage, setPinErrorMessage] = useState<string>('');
  const [shakePin, setShakePin] = useState<boolean>(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentBookPage, setCurrentBookPage] = useState<number>(0);
  const [isGiftOpened, setIsGiftOpened] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const particlesRef = useRef<FlowerParticlesRef | null>(null);

  // Auto-play synth track toggle
  const toggleMusic = () => {
    audioSynth.playClick();
    const playing = audioSynth.toggle();
    setIsMuted(!playing);
  };

  const handleFullscreen = () => {
    audioSynth.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Start music automatically when user interacts with gift
  const handleGiftClick = (e: React.MouseEvent) => {
    if (isGiftOpened) return;
    setIsGiftOpened(true);

    // Audio & flower splash triggers
    audioSynth.playMagicChime();
    audioSynth.start(); // Initiates background loop
    setIsMuted(false);

    if (particlesRef.current) {
      // Multiple bursts for "byurrrrr" flower splash effect
      particlesRef.current.triggerBurst(e.clientX, e.clientY);
      setTimeout(() => particlesRef.current?.triggerBurst(window.innerWidth / 4, window.innerHeight / 2), 200);
      setTimeout(() => particlesRef.current?.triggerBurst((window.innerWidth * 3) / 4, window.innerHeight / 2), 400);
    }

    // Smooth transition into countdown
    setStage(AppStage.BURST);
    setTimeout(() => {
      setStage(AppStage.COUNTDOWN);
    }, 1500);
  };

  // Countdown timer handler (3 -> 2 -> 1)
  useEffect(() => {
    if (stage === AppStage.COUNTDOWN) {
      setCountdown(3);
      audioSynth.playCountdownTick();

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 3) {
            audioSynth.playCountdownTick();
            return 2;
          } else if (prev === 2) {
            audioSynth.playCountdownTick();
            return 1;
          } else {
            clearInterval(timer);
            // Transition to Greeting slide after 1 second of showing '1'
            setTimeout(() => {
              setStage(AppStage.GREETING);
            }, 800);
            return prev; // Hold on 1
          }
        });
      }, 1200);

      return () => clearInterval(timer);
    }
  }, [stage]);

  // PIN keypad button press
  const handleKeypadPress = (key: string) => {
    audioSynth.playClick();
    if (pinError) return; // Prevent input while error message is shaking/showing

    if (key === 'Hapus') {
      setPinInput((prev) => prev.slice(0, -1));
    } else if (pinInput.length < 4) {
      const nextPin = pinInput + key;
      setPinInput(nextPin);

      // Auto check when pin reaches 4 digits
      if (nextPin.length === 4) {
        if (nextPin === '1907') {
          // Success!
          setTimeout(() => {
            audioSynth.playCorrectPin();
            setStage(AppStage.LETTER);
            // Little flower celebration
            particlesRef.current?.triggerBurst();
          }, 300);
        } else {
          // Failure
          setTimeout(() => {
            audioSynth.playWrongPin();
            setPinError(true);
            setShakePin(true);
            setPinErrorMessage('Kode PIN salah, Ma... Coba masukkan tanggal lahir Mama (DDMM) ❤️');
            
            // Auto reset after 1.8 seconds to allow typing again
            setTimeout(() => {
              setPinInput('');
              setPinError(false);
              setShakePin(false);
              setPinErrorMessage('');
            }, 2000);
          }, 350);
        }
      }
    }
  };

  // Trigger hearts and flowers on ending click
  const handleEndingHeartClick = (e: React.MouseEvent) => {
    audioSynth.playMagicChime();
    if (particlesRef.current) {
      particlesRef.current.triggerBurst(e.clientX, e.clientY);
      particlesRef.current.triggerBurst(e.clientX - 50, e.clientY + 50);
      particlesRef.current.triggerBurst(e.clientX + 50, e.clientY - 50);
    }
  };

  const handleNextSlide = () => {
    audioSynth.playClick();
    if (currentSlideIndex < LETTER_SLIDES.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
      // Sparkle burst when moving forward
      if (Math.random() < 0.5 && particlesRef.current) {
        particlesRef.current.triggerBurst();
      }
    }
  };

  const handlePrevSlide = () => {
    audioSynth.playClick();
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    audioSynth.playClick();
    setStage(AppStage.GIFT);
    setIsGiftOpened(false);
    setPinInput('');
    setCurrentSlideIndex(0);
    setCurrentBookPage(0);
    setCountdown(3);
  };

  // Determine dynamic left/right labels based on current stage/page
  const getPageIndicatorText = () => {
    switch (stage) {
      case AppStage.GIFT: return 'STAGE 01';
      case AppStage.BURST: return 'TRANSITION';
      case AppStage.COUNTDOWN: return 'COUNTDOWN';
      case AppStage.GREETING: return 'GREETING';
      case AppStage.PIN: return 'SECURED PIN';
      case AppStage.LETTER: return `PAGE ${currentSlideIndex + 1} / ${LETTER_SLIDES.length}`;
      case AppStage.BOOK_COVER: return 'ALBUM COVER';
      case AppStage.BOOK: return `ALBUM ${currentBookPage + 1} / 10`;
      default: return 'PAGE 01';
    }
  };

  return (
    <div id="card-root" className="relative w-full min-h-[100dvh] overflow-x-hidden overflow-y-auto bg-[#2a0101] text-[#f5f5dc] font-serif flex flex-col items-center p-0 border-[12px] md:border-[16px] border-[#3a0202] select-none">
      
      {/* Decorative Sophisticated Gold Corners */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 w-24 h-24 md:w-32 md:h-32 border-t-2 border-l-2 border-[#d4af37] opacity-60 pointer-events-none z-10" />
      <div className="absolute top-4 right-4 md:top-8 md:right-8 w-24 h-24 md:w-32 md:h-32 border-t-2 border-r-2 border-[#d4af37] opacity-60 pointer-events-none z-10" />
      <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 w-24 h-24 md:w-32 md:h-32 border-b-2 border-l-2 border-[#d4af37] opacity-60 pointer-events-none z-10" />
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-24 h-24 md:w-32 md:h-32 border-b-2 border-r-2 border-[#d4af37] opacity-60 pointer-events-none z-10" />

      {/* Sophisticated Dark background sparkle grid pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10 z-0" 
        style={{ 
          backgroundImage: 'radial-gradient(#d4af37 0.5px, transparent 0.5px)', 
          backgroundSize: '30px 30px' 
        }} 
      />

      {/* Sophisticated Dark side indicators */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 flex flex-col items-start pointer-events-none z-10 hidden sm:flex">
        <span className="text-[#d4af37] text-[10px] tracking-[0.4em] uppercase mb-2">Anniversary</span>
        <div className="w-12 h-[1px] bg-[#d4af37] opacity-55"></div>
      </div>

      <div className="absolute top-6 right-16 md:top-10 md:right-20 flex flex-col items-end pointer-events-none z-10">
        <span className="text-[#d4af37] text-[10px] tracking-[0.4em] uppercase mb-2">Volume 01</span>
        <div className="w-16 h-[1px] bg-[#d4af37]"></div>
      </div>

      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 flex flex-col items-start pointer-events-none z-10">
        <div className="text-[#d4af37] text-[10px] tracking-[0.4em] mb-2 uppercase">{getPageIndicatorText()}</div>
        <div className="w-20 h-[1px] bg-[#d4af37] opacity-30"></div>
      </div>

      {/* Floating Canvas Particle Layer */}
      <FlowerParticles ref={particlesRef} isActive={true} />

      <div className="absolute top-6 right-6 z-50 flex space-x-3">
        {/* Fullscreen Controller floating widget */}
        {stage === AppStage.GIFT && (
          <button
            onClick={handleFullscreen}
            className="p-3 bg-[#2a0101] border border-[#d4af37] text-[#d4af37] hover:bg-[#3a0202] rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center animate-pulse-slow"
            title="Layar Penuh"
          >
            <Maximize className="w-5 h-5" />
          </button>
        )}

        {/* Music Controller floating widget */}
        <button
          id="btn-music-toggle"
          onClick={toggleMusic}
          className="p-3 bg-[#2a0101] border border-[#d4af37] text-[#d4af37] hover:bg-[#3a0202] rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
          title={isMuted ? 'Aktifkan Musik' : 'Matikan Musik'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              className="flex items-center justify-center"
            >
              <Volume2 className="w-5 h-5 text-[#d4af37]" />
            </motion.div>
          )}
        </button>
      </div>

      {/* Dynamic Screen App Stages */}
      <div className={`relative w-full ${stage === AppStage.BOOK ? 'max-w-4xl' : 'max-w-lg'} px-4 md:px-6 min-h-full py-24 md:py-20 pb-32 md:pb-32 flex flex-col my-auto z-40 transition-all duration-500`}>
        <AnimatePresence mode="wait">
          
          {/* Stage 1: GIFT */}
          {stage === AppStage.GIFT && (
            <motion.div
              key="stage-gift"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center text-center space-y-8 animate-fade-in"
            >
              <div className="space-y-4">
                <h1 className="text-[#d4af37] text-xs md:text-sm tracking-[0.5em] uppercase mb-4 opacity-80 font-sans">
                  Happy Birthday Mama Tercinta
                </h1>
                <motion.h2
                  className="font-cursive text-5xl md:text-6xl text-[#f5f5dc] tracking-wide"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Halo Mama Sayang...
                </motion.h2>
              </div>

              {/* High-Fidelity Interactive SVG Gift Box */}
              <motion.div
                className="relative cursor-pointer transition-transform duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGiftClick}
              >
                {/* Light gold aura pulse */}
                <div className="absolute inset-0 bg-[#d4af37]/10 rounded-full blur-3xl w-48 h-48 -m-4 animate-slow-pulse" />
                
                <svg
                  id="gift-box-svg"
                  className="w-48 h-48 mx-auto filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.7)]"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Subtle Box Shadow */}
                  <ellipse cx="100" cy="175" rx="50" ry="10" fill="#000" opacity="0.4" />
                  
                  {/* Box Body */}
                  <rect x="40" y="80" width="120" height="90" rx="6" fill="#3a0202" stroke="#d4af37" strokeWidth="3"/>
                  
                  {/* Gold Ribbons */}
                  <rect x="90" y="80" width="20" height="90" fill="#d4af37" opacity="0.95"/>
                  <rect x="40" y="115" width="120" height="20" fill="#d4af37" opacity="0.95"/>
                  
                  {/* Lid */}
                  <rect x="34" y="52" width="132" height="28" rx="4" fill="#5c0606" stroke="#d4af37" strokeWidth="3"/>
                  <rect x="90" y="52" width="20" height="28" fill="#d4af37" opacity="0.95"/>

                  {/* Shading/Depth accents */}
                  <path d="M40 80 H90 V170 H40 Z" fill="rgba(0,0,0,0.15)" />
                  <path d="M34 52 H90 V80 H34 Z" fill="rgba(0,0,0,0.15)" />

                  {/* Left Loop Bow */}
                  <path d="M100 52 C70 12, 38 42, 100 52 Z" fill="#d4af37" stroke="#b3922e" strokeWidth="2.5"/>
                  <path d="M100 52 C82 28, 58 42, 100 52 Z" fill="#b3922e"/>

                  {/* Right Loop Bow */}
                  <path d="M100 52 C130 12, 162 42, 100 52 Z" fill="#d4af37" stroke="#b3922e" strokeWidth="2.5"/>
                  <path d="M100 52 C118 28, 142 42, 100 52 Z" fill="#b3922e"/>

                  {/* Center Ribbon Knot */}
                  <rect x="88" y="44" width="24" height="16" rx="4" fill="#d4af37" stroke="#ffd700" strokeWidth="1"/>

                  {/* Hanging Gift Tag */}
                  <g transform="translate(115, 88) rotate(35)">
                    <path d="M0 0 L32 0 L26 16 L-6 16 Z" fill="#f5f5dc" stroke="#d4af37" strokeWidth="1" />
                    <circle cx="5" cy="8" r="1.5" fill="#3a0202" />
                    <text x="10" y="11" fill="#3a0202" fontSize="7" fontWeight="bold" fontFamily="sans-serif">For Mom</text>
                  </g>
                </svg>
              </motion.div>

              <motion.button
                id="btn-click-prompt"
                onClick={handleGiftClick}
                className="px-8 py-3 bg-transparent hover:bg-[#d4af37]/10 text-[#d4af37] font-serif font-medium rounded-full shadow-lg border border-[#d4af37] transition-all duration-300 transform animate-slow-pulse flex items-center space-x-3 text-xs uppercase tracking-[0.2em]"
              >
                <Gift className="w-4 h-4" />
                <span>Ketuk Kado Spesial 🎁</span>
              </motion.button>
            </motion.div>
          )}

          {/* Stage 2: BURST Transition */}
          {stage === AppStage.BURST && (
            <motion.div
              key="stage-burst"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0.8, rotate: -20 }}
                animate={{ scale: [1, 2.5, 0], rotate: [0, 45, 90], opacity: [1, 1, 0] }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              >
                <Gift className="w-24 h-24 text-[#d4af37]" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-cursive text-5xl text-[#d4af37] tracking-wider"
              >
                Byurrrrr! 🌸✨
              </motion.p>
            </motion.div>
          )}

          {/* Stage 3: COUNTDOWN */}
          {stage === AppStage.COUNTDOWN && (
            <motion.div
              key="stage-countdown"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <div className="text-[#d4af37] font-light text-xs md:text-sm tracking-[0.4em] mb-4 uppercase">
                Mempersiapkan Kejutan...
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={countdown}
                  initial={{ opacity: 0, scale: 0.2, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 2, rotate: 45 }}
                  transition={{ duration: 0.3 }}
                  className="font-serif text-[120px] font-bold text-[#d4af37] leading-none drop-shadow-[0_4px_15px_rgba(212,175,55,0.3)]"
                >
                  {countdown}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* Stage 4: GREETING (Happy Birthday Mama ku tercinta) */}
          {stage === AppStage.GREETING && (
            <motion.div
              key="stage-greeting"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center text-center space-y-10"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block bg-[#3a0202]/80 border border-[#d4af37]/60 px-5 py-2 rounded-full text-[10px] text-[#d4af37] tracking-[0.3em] uppercase font-sans"
                >
                  ✨ Momen Istimewa Mama ✨
                </motion.div>
                
                <h2 className="font-serif text-3xl md:text-4xl font-light text-[#d4af37] tracking-wider leading-relaxed">
                  HAPPY BIRTHDAY <br />
                  <span className="font-cursive text-5xl md:text-6xl text-[#f5f5dc] block mt-2 font-normal">
                    Mama Ku Tercinta
                  </span>
                </h2>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-[#f5f5dc]/70 font-sans font-light max-w-sm mx-auto text-xs md:text-sm leading-relaxed"
                >
                  Sebuah coretan tulisan kecil penuh kasih dari lubuk hatiku terdalam, teruntuk orang yang paling berharga dalam hidupku... ❤️
                </motion.div>
              </div>

              {/* Heart Beat Button */}
              <motion.button
                id="btn-open-pin"
                onClick={() => {
                  audioSynth.playClick();
                  setStage(AppStage.PIN);
                }}
                className="group relative px-8 py-4 bg-[#3a0202] hover:bg-[#5c0606] text-[#d4af37] font-semibold rounded-full border border-[#d4af37] shadow-xl transition-all duration-300 transform active:scale-95 flex items-center space-x-3 overflow-hidden text-xs tracking-[0.2em] uppercase"
                whileHover={{ scale: 1.03 }}
              >
                {/* Glowing light streak */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Lock className="w-4 h-4 text-[#d4af37] group-hover:hidden" />
                <Unlock className="w-4 h-4 text-[#d4af37] hidden group-hover:block" />
                <span>Buka Surat Dari Dew ✨</span>
              </motion.button>
            </motion.div>
          )}

          {/* Stage 5: MINIMALIST PIN */}
          {stage === AppStage.PIN && (
            <motion.div
              key="stage-pin"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-6"
            >
              {/* Sophisticated Header */}
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-[#3a0202] border border-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-2 text-[#d4af37]">
                  <Lock className="w-5 h-5 animate-pulse" />
                </div>
                <h3 className="font-serif text-lg tracking-wider text-[#d4af37] uppercase">
                  Surat Pengaman Kode
                </h3>
                <p className="text-[#f5f5dc]/60 text-xs max-w-xs mx-auto leading-relaxed font-sans font-light">
                  Silakan masukkan tanggal lahir Mama (DDMM) untuk membukanya.
                </p>
              </div>

              {/* Sophisticated Badge Visualizer matching Sophisticated Dark template */}
              <motion.div
                animate={shakePin ? 'shake' : 'normal'}
                variants={shakePin ? {
                  shake: {
                    x: [0, -12, 12, -12, 12, -8, 8, 0],
                    transition: { duration: 0.5 }
                  },
                  normal: { x: 0 }
                } : undefined}
                className="px-6 py-2 border border-[#d4af37] rounded-full bg-transparent flex items-center space-x-3 my-2"
              >
                <div className="flex space-x-1.5">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        pinInput.length > idx
                          ? pinError
                            ? 'bg-[#991b1b] shadow-[0_0_8px_#f43f5e]'
                            : 'bg-[#d4af37] shadow-[0_0_10px_#ffd700]'
                          : 'bg-[#d4af37]/20 border border-[#d4af37]/40'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-[#d4af37] tracking-[0.2em] uppercase font-sans font-medium">Pin Secured</span>
              </motion.div>

              {/* Error message slot */}
              <div className="h-4 text-center">
                <AnimatePresence>
                  {pinErrorMessage && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-red-400 text-xs flex items-center justify-center space-x-1.5 font-sans"
                    >
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{pinErrorMessage}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Minimalist Tactile Numeric Pad */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleKeypadPress(num)}
                    disabled={pinError}
                    className="h-14 bg-[#3a0202]/40 hover:bg-[#3a0202]/80 active:bg-[#5c0606]/60 text-[#f5f5dc] border border-[#d4af37]/30 hover:border-[#d4af37] font-serif text-lg font-light rounded-xl flex items-center justify-center transition-all shadow-md active:scale-90"
                  >
                    {num}
                  </button>
                ))}
                {/* Backspace */}
                <button
                  onClick={() => handleKeypadPress('Hapus')}
                  disabled={pinError}
                  className="h-14 bg-black/40 hover:bg-black/70 text-[#f5f5dc]/70 text-[11px] uppercase tracking-wider font-sans font-light rounded-xl flex items-center justify-center transition-all border border-[#d4af37]/15 active:scale-90"
                >
                  Hapus
                </button>
                {/* Zero */}
                <button
                  onClick={() => handleKeypadPress('0')}
                  disabled={pinError}
                  className="h-14 bg-[#3a0202]/40 hover:bg-[#3a0202]/80 active:bg-[#5c0606]/60 text-[#f5f5dc] border border-[#d4af37]/30 hover:border-[#d4af37] font-serif text-lg font-light rounded-xl flex items-center justify-center transition-all shadow-md active:scale-90"
                >
                  0
                </button>
                {/* Status Pad */}
                <div className="h-14 bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-xl flex items-center justify-center text-[#d4af37] text-xs">
                  <Heart className="w-4 h-4 text-[#d4af37] animate-pulse" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Stage 6: THE HEARTFELT LETTERS (11 Slides) */}
          {stage === AppStage.LETTER && (
            <motion.div
              key="stage-letters"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="w-full flex flex-col items-center justify-center space-y-6"
            >
              
              {/* Progress counter pill */}
              <div className="flex items-center space-x-2 text-[#d4af37] text-[10px] tracking-[0.25em] font-sans uppercase bg-[#3a0202]/80 border border-[#d4af37]/40 px-4 py-1.5 rounded-full shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
                <span>Halaman {currentSlideIndex + 1} dari {LETTER_SLIDES.length}</span>
              </div>

              {/* Letter Card Frame (Sophisticated Dark Cream Card) */}
              <div className="relative w-full bg-[#fdfbf7] text-[#3a0202] p-8 md:p-10 rounded-2xl border-4 border-double border-[#d4af37] shadow-[0_20px_40px_rgba(0,0,0,0.85)] flex flex-col justify-between min-h-[380px] max-h-[460px] overflow-y-auto">
                
                {/* Elegant subtle inner borders */}
                <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-[#d4af37]" />
                <div className="absolute top-2 right-2 w-6 h-6 border-t border-r border-[#d4af37]" />
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b border-l border-[#d4af37]" />
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-[#d4af37]" />

                {/* Card Header Design (Wax Seal / Envelope representation) */}
                <div className="w-full flex justify-between items-center border-b border-[#3a0202]/10 pb-3 mb-4">
                  <span className="font-serif italic text-[10px] tracking-[0.3em] text-[#d4af37] font-bold uppercase">Spesial Untuk Mama</span>
                  <div className="w-2.5 h-2.5 bg-[#3a0202] rounded-full" />
                </div>

                {/* Slide content container */}
                <div className="flex-grow flex flex-col justify-center items-center relative py-4">
                  <AnimatePresence mode="wait">
                    
                    {/* Normal Letter Slides (1 to 10) */}
                    {!LETTER_SLIDES[currentSlideIndex].isClosing ? (
                      <motion.div
                        key={currentSlideIndex}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4 }}
                        className="text-center space-y-4"
                      >
                        {/* Sophisticated Dark Quote Icons */}
                        <div className="font-serif text-5xl text-[#d4af37]/30 leading-none h-6 select-none">“</div>
                        
                        <p className="font-serif text-lg md:text-xl font-light leading-relaxed tracking-wide italic text-[#3a0202] px-2">
                          {LETTER_SLIDES[currentSlideIndex].text}
                        </p>
                        
                        <div className="font-serif text-5xl text-[#d4af37]/30 leading-none h-6 select-none text-right">”</div>
                      </motion.div>
                    ) : (
                      
                      /* Closing Slide 11: "Dew" signature */
                      <motion.div
                        key="closing-signature"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center space-y-5 flex flex-col items-center justify-center w-full"
                      >
                        <p className="font-serif italic text-[#3a0202]/60 text-xs tracking-[0.15em] uppercase">
                          Tertanda dengan penuh sayang,
                        </p>
                        
                        {/* Grand cursive signature name */}
                        <motion.h1
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.8 }}
                          className="font-cursive text-7xl md:text-8xl text-[#3a0202] leading-none select-none drop-shadow-sm font-semibold py-2"
                        >
                          Dew
                        </motion.h1>

                        {/* Interactive Heart Burst Trigger */}
                        <motion.div
                          className="relative mt-2 cursor-pointer group"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleEndingHeartClick}
                        >
                          {/* Pulsing glow ring */}
                          <div className="absolute inset-0 bg-[#3a0202]/10 rounded-full blur-xl w-20 h-20 -m-3 animate-slow-pulse" />
                          <div className="w-14 h-14 bg-[#3a0202] hover:bg-[#5c0606] rounded-full border border-[#d4af37] flex items-center justify-center shadow-lg relative z-10 transition-colors">
                            <Heart className="w-7 h-7 text-[#ffd700] fill-[#ffd700] animate-pulse" />
                          </div>
                        </motion.div>

                        <p className="text-[#3a0202] font-sans font-medium text-[10px] tracking-widest animate-pulse max-w-xs uppercase mt-2">
                          Ketuk hati untuk memberi pelukan & bunga ke Mama! ❤️🌸
                        </p>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            audioSynth.playMagicChime();
                            setStage(AppStage.BOOK_COVER);
                            particlesRef.current?.triggerBurst();
                          }}
                          className="mt-4 px-6 py-2.5 bg-[#d4af37] hover:bg-[#ffd700] text-[#3a0202] rounded-full font-serif font-medium text-xs tracking-wider shadow-lg flex items-center space-x-2 border border-white/20 transition-all duration-300"
                        >
                          <span>Kirim Buku Album Foto 📖</span>
                        </motion.button>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>

                {/* Slides Progress Bar indicator */}
                <div className="w-full bg-[#3a0202]/10 h-[2px] rounded-full mt-4 overflow-hidden">
                  <div
                    className="bg-[#d4af37] h-full transition-all duration-300"
                    style={{ width: `${((currentSlideIndex + 1) / LETTER_SLIDES.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Navigation buttons bar */}
              <div className="flex items-center justify-between w-full pt-2">
                
                {/* Back button */}
                <button
                  id="btn-slide-prev"
                  onClick={handlePrevSlide}
                  disabled={currentSlideIndex === 0}
                  className={`px-5 py-3 rounded-full border border-[#d4af37]/40 flex items-center space-x-2 text-[10px] uppercase tracking-widest font-sans font-medium shadow-md active:scale-95 transition-all ${
                    currentSlideIndex === 0
                      ? 'opacity-30 cursor-not-allowed text-stone-500'
                      : 'bg-[#3a0202] hover:bg-[#5c0606] text-[#d4af37] hover:border-[#d4af37]'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Kembali</span>
                </button>

                {/* Restart/Reply button (Only shown at the end to read again) */}
                {currentSlideIndex === LETTER_SLIDES.length - 1 ? (
                  <button
                    id="btn-slide-restart"
                    onClick={handleRestart}
                    className="px-5 py-3 bg-[#d4af37] hover:bg-[#ffd700] text-[#3a0202] rounded-full font-semibold text-[10px] uppercase tracking-widest shadow-lg flex items-center space-x-2 border border-white/20 active:scale-95 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Mulai Lagi</span>
                  </button>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-[#d4af37]/30 flex items-center justify-center bg-transparent">
                    <Heart className="w-2 h-2 text-[#d4af37]" />
                  </div>
                )}

                {/* Next/Lanjut button */}
                <button
                  id="btn-slide-next"
                  onClick={handleNextSlide}
                  disabled={currentSlideIndex === LETTER_SLIDES.length - 1}
                  className={`px-5 py-3 rounded-full flex items-center space-x-2 text-[10px] uppercase tracking-widest font-sans font-medium shadow-md active:scale-95 transition-all ${
                    currentSlideIndex === LETTER_SLIDES.length - 1
                      ? 'opacity-30 cursor-not-allowed bg-stone-800 text-stone-500 border border-stone-700'
                      : 'bg-[#d4af37] hover:bg-[#ffd700] text-[#3a0202] border border-[#d4af37]'
                  }`}
                >
                  <span>Lanjut</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

              </div>

            </motion.div>
          )}

          {/* Stage 6.5: THE PHOTO BOOK COVER (Closed Book) */}
          {stage === AppStage.BOOK_COVER && (
            <motion.div
              key="stage-book-cover"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center text-center space-y-8 w-full"
            >
              <div className="space-y-3">
                <span className="text-[#d4af37] text-xs tracking-[0.4em] uppercase mb-1 opacity-95 font-sans font-semibold flex items-center justify-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                  Spesial Untuk Mama Tercinta
                  <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                </span>
                <motion.h2
                  className="font-cursive text-5xl md:text-6xl text-[#f5f5dc] tracking-wide"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Buku Album Kenangan
                </motion.h2>
              </div>

              {/* High-Fidelity Interactive SVG Closed Book Cover */}
              <motion.div
                className="relative cursor-pointer transition-transform duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e: MouseEvent) => {
                  audioSynth.playMagicChime();
                  audioSynth.start();
                  setIsMuted(false);
                  if (particlesRef.current) {
                    particlesRef.current.triggerBurst(e.clientX, e.clientY);
                    setTimeout(() => particlesRef.current?.triggerBurst(window.innerWidth / 4, window.innerHeight / 2), 200);
                    setTimeout(() => particlesRef.current?.triggerBurst((window.innerWidth * 3) / 4, window.innerHeight / 2), 400);
                  }
                  // Transition to main book pages spread
                  setStage(AppStage.BOOK);
                  setCurrentBookPage(0);
                }}
              >
                {/* Gold aura pulse */}
                <div className="absolute inset-0 bg-[#d4af37]/15 rounded-full blur-3xl w-56 h-56 -m-4 animate-slow-pulse mx-auto" />
                
                <svg
                  id="book-cover-svg"
                  className="w-48 h-60 mx-auto filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.95)]"
                  viewBox="0 0 200 260"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Spine back shadow */}
                  <rect x="25" y="10" width="150" height="240" rx="8" fill="#1f0101" />
                  {/* Leather cover book base */}
                  <rect x="30" y="12" width="140" height="236" rx="6" fill="#3a0202" stroke="#d4af37" strokeWidth="3" />
                  
                  {/* Gold corner ornaments */}
                  <path d="M42 22 H34 V30" stroke="#d4af37" strokeWidth="2.5" fill="none" />
                  <path d="M158 22 H166 V30" stroke="#d4af37" strokeWidth="2.5" fill="none" />
                  <path d="M42 238 H34 V230" stroke="#d4af37" strokeWidth="2.5" fill="none" />
                  <path d="M158 238 H166 V230" stroke="#d4af37" strokeWidth="2.5" fill="none" />
                  
                  {/* Gold heart emblem with frame */}
                  <rect x="55" y="75" width="90" height="110" rx="4" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="3,3" fill="none" />
                  <circle cx="100" cy="130" r="28" fill="#5c0606" stroke="#d4af37" strokeWidth="2" />
                  
                  {/* Heart symbol inside */}
                  <path d="M100 138 C94 133, 86 127, 86 119 C86 113, 91 108, 97 108 C100 108, 103 111, 105 113 C107 111, 110 108, 113 108 C119 108, 124 113, 124 119 C124 127, 116 133, 110 138 Z" fill="#d4af37" transform="scale(0.8) translate(25, 23)" />
                  
                  {/* Typography on cover */}
                  <text x="100" y="55" fill="#f5f5dc" fontSize="12" fontFamily="serif" textAnchor="middle" letterSpacing="3px" fontWeight="bold">ALBUM</text>
                  <text x="100" y="206" fill="#d4af37" fontSize="10" fontFamily="sans-serif" textAnchor="middle" letterSpacing="4px" fontWeight="600">KENANGAN</text>
                  <text x="100" y="222" fill="#f5f5dc" fontSize="8" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1px" opacity="0.8">TERINDAH MAMA</text>
                </svg>
              </motion.div>

              <div className="space-y-3">
                <p className="text-[#f5f5dc]/75 font-serif text-xs md:text-sm max-w-xs mx-auto leading-relaxed italic">
                  Ada rangkaian foto kebersamaan kita yang dirangkai penuh cinta di dalam album ini, Ma...
                </p>
                <p className="text-[#d4af37] font-sans text-xs tracking-widest animate-pulse font-semibold uppercase">
                  Ketuk buku untuk membuka album 📖
                </p>
              </div>
            </motion.div>
          )}

          {/* Stage 7: THE PHOTO BOOK (10 Pages, 2 Frames per Page) */}
          {stage === AppStage.BOOK && (
            <motion.div
              key="stage-book"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="w-full flex flex-col items-center justify-center space-y-5 px-2 md:px-0"
            >
              
              {/* Progress counter pill */}
              <div className="flex items-center space-x-2 text-[#d4af37] text-[10px] tracking-[0.25em] font-sans uppercase bg-[#3a0202]/80 border border-[#d4af37]/40 px-4 py-1.5 rounded-full shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
                <span>Lembar Foto {currentBookPage + 1} dari {PHOTO_PAGES.length}</span>
              </div>

              {/* The Interactive Book Container */}
              <div className="relative w-full max-w-4xl bg-[#fdfbf7] text-[#3a0202] p-6 md:p-8 rounded-2xl border-4 border-double border-[#d4af37] shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col justify-between min-h-[460px] md:min-h-[520px] overflow-hidden">
                
                {/* Elegant subtle inner borders */}
                <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-[#d4af37] pointer-events-none" />
                <div className="absolute top-2 right-2 w-6 h-6 border-t border-r border-[#d4af37] pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b border-l border-[#d4af37] pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-[#d4af37] pointer-events-none" />

                {/* Left/Right open book spine divider line (desktop only) */}
                <div className="hidden md:block absolute top-4 bottom-4 left-1/2 w-[2px] bg-gradient-to-b from-transparent via-stone-300 to-transparent shadow-inner z-10 -ml-[1px]" />

                {/* Book Header (Page Title) */}
                <div className="w-full flex justify-between items-center border-b border-[#3a0202]/10 pb-3 mb-4 z-10">
                  <span className="font-serif italic text-xs tracking-[0.2em] text-[#d4af37] font-bold uppercase">
                    {PHOTO_PAGES[currentBookPage].title}
                  </span>
                  <span className="font-serif italic text-xs text-[#3a0202]/60 tracking-wider font-semibold">
                    HAL {PHOTO_PAGES[currentBookPage].page}
                  </span>
                </div>

                {/* Main Spread Viewport with motion page turns */}
                <div className="flex-grow flex flex-col justify-center items-center relative py-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentBookPage}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center"
                    >
                      {/* Frame 1 (Left Page / Top Mobile) */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative bg-white p-3 pb-5 rounded shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-stone-200/80 transform md:-rotate-1 hover:rotate-0 transition-transform duration-300 max-w-[260px] md:max-w-[280px] w-full">
                          {/* Antique photo corners */}
                          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]" />
                          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#d4af37]" />
                          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#d4af37]" />
                          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#d4af37]" />
                          
                          <div className="w-full aspect-[4/3] bg-stone-100 overflow-hidden rounded-sm relative flex items-center justify-center">
                            <ImageWithFallback key={PHOTO_PAGES[currentBookPage].photos[0]} src={PHOTO_PAGES[currentBookPage].photos[0]} alt="Foto Mama 1" />
                          </div>
                        </div>
                      </div>

                      {/* Frame 2 (Right Page / Bottom Mobile) */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative bg-white p-3 pb-5 rounded shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-stone-200/80 transform md:rotate-1 hover:rotate-0 transition-transform duration-300 max-w-[260px] md:max-w-[280px] w-full">
                          {/* Antique photo corners */}
                          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]" />
                          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#d4af37]" />
                          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#d4af37]" />
                          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#d4af37]" />

                          <div className="w-full aspect-[4/3] bg-stone-100 overflow-hidden rounded-sm relative flex items-center justify-center">
                            <ImageWithFallback key={PHOTO_PAGES[currentBookPage].photos[1]} src={PHOTO_PAGES[currentBookPage].photos[1]} alt="Foto Mama 2" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Progress bar inside book */}
                <div className="w-full bg-[#3a0202]/10 h-[2px] rounded-full mt-4 overflow-hidden">
                  <div
                    className="bg-[#d4af37] h-full transition-all duration-300"
                    style={{ width: `${((currentBookPage + 1) / PHOTO_PAGES.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Navigation buttons bar below the book */}
              <div className="flex items-center justify-between w-full pt-2">
                {/* Back button to previous page or previous stage (book cover) */}
                <button
                  onClick={() => {
                    audioSynth.playClick();
                    if (currentBookPage > 0) {
                      setCurrentBookPage((prev) => prev - 1);
                    } else {
                      // Go back to the book cover
                      setStage(AppStage.BOOK_COVER);
                    }
                  }}
                  className="px-5 py-3 bg-[#3a0202] hover:bg-[#5c0606] text-[#d4af37] border border-[#d4af37]/40 rounded-full flex items-center space-x-2 text-[10px] uppercase tracking-widest font-sans font-medium shadow-md active:scale-95 transition-all animate-fade-in"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>{currentBookPage > 0 ? "Sebelumnya" : "Tutup Album"}</span>
                </button>

                {/* Restart / Mulai Lagi button */}
                <button
                  onClick={handleRestart}
                  className="px-5 py-3 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 rounded-full font-semibold text-[10px] uppercase tracking-widest shadow-md flex items-center space-x-2 active:scale-95 transition-all animate-fade-in"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Dari Awal</span>
                </button>

                {/* Next button to next page or celebration finish */}
                <button
                  onClick={() => {
                    audioSynth.playClick();
                    if (currentBookPage < PHOTO_PAGES.length - 1) {
                      setCurrentBookPage((prev) => prev + 1);
                      if (Math.random() < 0.6 && particlesRef.current) {
                        particlesRef.current.triggerBurst();
                      }
                    } else {
                      // Final page celebration! Trigger lots of flowers/hearts!
                      if (particlesRef.current) {
                        particlesRef.current.triggerBurst();
                        setTimeout(() => particlesRef.current?.triggerBurst(), 300);
                        setTimeout(() => particlesRef.current?.triggerBurst(), 600);
                      }
                      audioSynth.playMagicChime();
                      // Move to the final letter stage
                      setStage(AppStage.FINAL_LETTER_COVER);
                    }
                  }}
                  className="px-5 py-3 bg-[#d4af37] hover:bg-[#ffd700] text-[#3a0202] border border-[#d4af37] rounded-full flex items-center space-x-2 text-[10px] uppercase tracking-widest font-sans font-medium shadow-md active:scale-95 transition-all animate-fade-in"
                >
                  <span>{currentBookPage < PHOTO_PAGES.length - 1 ? "Berikutnya" : "Selesai ❤️"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </motion.div>
          )}
          
          {/* Stage 8: FINAL LETTER COVER */}
          {stage === AppStage.FINAL_LETTER_COVER && (
            <motion.div
              key="stage-final-letter-cover"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="space-y-4">
                <span className="text-[#d4af37] text-xs tracking-[0.4em] uppercase mb-1 opacity-95 font-sans font-semibold flex items-center justify-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                  Masih ada satu lagi...
                  <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                </span>
                <motion.h2
                  className="font-cursive text-5xl md:text-6xl text-[#f5f5dc] tracking-wide"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Surat Terakhir
                </motion.h2>
              </div>

              <motion.div
                className="relative cursor-pointer transition-transform duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e: MouseEvent) => {
                  audioSynth.playClick();
                  if (particlesRef.current) {
                    particlesRef.current.triggerBurst(e.clientX, e.clientY);
                  }
                  setStage(AppStage.FINAL_LETTER);
                }}
              >
                {/* Minimalist Envelope Icon */}
                <div className="absolute inset-0 bg-[#d4af37]/10 rounded-full blur-3xl w-40 h-40 -m-8 animate-slow-pulse" />
                <svg
                  width="180"
                  height="120"
                  viewBox="0 0 180 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]"
                >
                  <rect x="5" y="5" width="170" height="110" rx="6" fill="#fdfbf7" stroke="#d4af37" strokeWidth="4"/>
                  {/* Flap lines */}
                  <path d="M5 5 L90 65 L175 5" stroke="#d4af37" strokeWidth="4" strokeLinejoin="round"/>
                  <path d="M5 115 L70 70" stroke="#d4af37" strokeWidth="4" strokeLinejoin="round"/>
                  <path d="M175 115 L110 70" stroke="#d4af37" strokeWidth="4" strokeLinejoin="round"/>
                  {/* Heart Seal */}
                  <circle cx="90" cy="65" r="16" fill="#991b1b" stroke="#d4af37" strokeWidth="2"/>
                  <path d="M90 73.5 C90 73.5 83 67 83 61.5 C83 58 85.5 56 88 56 C89.5 56 90 57.5 90 57.5 C90 57.5 90.5 56 92 56 C94.5 56 97 58 97 61.5 C97 67 90 73.5 90 73.5 Z" fill="#fdfbf7"/>
                </svg>
              </motion.div>

              <motion.button
                onClick={() => {
                  audioSynth.playClick();
                  setStage(AppStage.FINAL_LETTER);
                }}
                className="px-8 py-3 bg-[#3a0202] hover:bg-[#5c0606] text-[#d4af37] border border-[#d4af37] font-serif font-medium rounded-full shadow-xl transition-all duration-300 transform active:scale-95 flex items-center space-x-3 text-xs uppercase tracking-[0.2em] animate-pulse-slow"
              >
                <span>Buka Surat</span>
                <Heart className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          )}

          {/* Stage 9: FINAL LETTER CONTENT */}
          {stage === AppStage.FINAL_LETTER && (
             <motion.div
             key="stage-final-letter-content"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             transition={{ duration: 0.8 }}
             className="w-full flex flex-col items-center justify-center space-y-6"
           >
             
             {/* Elegant letter container */}
             <div className="relative w-full bg-[#fdfbf7] text-[#3a0202] p-6 md:p-10 rounded-xl border-2 border-[#d4af37] shadow-[0_20px_40px_rgba(0,0,0,0.85)] flex flex-col min-h-[450px] max-h-[70vh] overflow-hidden">
               
               {/* Elegant subtle inner borders */}
               <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-[#d4af37]/60" />
               <div className="absolute top-2 right-2 w-6 h-6 border-t border-r border-[#d4af37]/60" />
               <div className="absolute bottom-2 left-2 w-6 h-6 border-b border-l border-[#d4af37]/60" />
               <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-[#d4af37]/60" />
               
               {/* Fixed Header */}
               <div className="w-full flex flex-col items-center border-b border-[#d4af37]/30 pb-4 mb-4 z-10 shrink-0 bg-[#fdfbf7]">
                  <h3 className="font-cursive text-3xl md:text-4xl text-[#3a0202]">Untuk Mama... ❤️</h3>
               </div>

               {/* Scrollable Content */}
               <div className="flex-grow overflow-y-auto px-2 md:px-4 space-y-5 custom-scrollbar pb-10 font-serif font-light text-sm md:text-base leading-relaxed tracking-wide text-justify text-[#3a0202]/90">
                 
                 <p>Mama adalah wanita terhebat di hidupku.</p>
                 
                 <p>Mama telah melewati begitu banyak hal sendirian, namun tetap mampu bertahan dan membesarkan kelima anakmu dengan penuh kasih sayang. Padahal di balik senyuman itu, aku tahu Mama juga sedang hancur. Mama selalu menyembunyikan lukamu sendiri, agar kami tidak ikut merasakannya.</p>

                 <p>Meski dunia berkali-kali bersikap jahat kepada Mama, Mama tidak pernah berubah menjadi orang yang penuh kebencian. Mama tetap menjadi sosok yang lembut, penuh perhatian, penuh kasih sayang, dan penuh cinta. Mama selalu menjadi pelindung kami, sekaligus tempat pulang yang paling aman dan paling nyaman.</p>

                 <p>Ma... tolong hidup lebih lama, ya.</p>

                 <p>Langkah kakiku terasa begitu berat jika tidak ada doa-doamu yang menyertai. Aku bukan siapa-siapa tanpa Mama. Terima kasih karena telah melahirkanku, merawatku dengan penuh cinta, dan membesarkanku dengan kasih sayang yang tak pernah berkurang.</p>

                 <p>Maaf... sampai hari ini aku belum bisa membahagiakan Mama. Tapi percayalah, membahagiakan Mama akan selalu menjadi keinginan terbesarku sepanjang hidupku.</p>

                 <p>Ma... jasa Mama tidak akan pernah bisa kubalas. Bahkan jika aku mampu memberikan seluruh dunia beserta isinya, itu tidak akan pernah sebanding dengan setitik pun pengorbanan dan kasih sayang yang telah Mama berikan kepadaku.</p>

                 <p>Terima kasih telah menjadi mama terbaik di hidupku.</p>

                 <p>Dan jika memang ada kehidupan lain nanti, aku hanya punya satu permintaan kepada Tuhan...</p>

                 <p className="font-medium italic">Izinkan aku tetap menjadi anak Mama.</p>
                 
                 <p className="font-medium italic">Menjadi putri kecil Mama.</p>
                 
                 <p className="font-medium italic">Hari ini, besok, dan selamanya.</p>

                 <p className="font-cursive text-2xl md:text-3xl pt-4 font-normal">Aku sayang Mama. 🤍</p>
               </div>

                {/* Fade out mask at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#fdfbf7] to-transparent pointer-events-none" />

             </div>
             
             {/* Finish button */}
             <button
                onClick={() => {
                  audioSynth.playMagicChime();
                  setStage(AppStage.CAKE);
                  if (particlesRef.current) {
                    particlesRef.current.triggerBurst();
                  }
                }}
                className="px-8 py-3 bg-[#d4af37] hover:bg-[#ffd700] text-[#3a0202] rounded-full font-serif font-medium text-xs tracking-wider shadow-lg flex items-center justify-center space-x-2 border border-white/20 transition-all duration-300 w-full max-w-xs mx-auto"
              >
                <span>Tutup Surat</span>
                <Heart className="w-3.5 h-3.5" />
              </button>
           </motion.div>
          )}

          {/* Stage 10: CAKE & CLOSING */}
          {stage === AppStage.CAKE && (
             <motion.div
             key="stage-cake"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 1.5 }}
             className="flex flex-col items-center justify-center text-center w-full relative h-full py-8"
           >
              {/* Background glow for the cake */}
              <div className="absolute top-1/4 bg-[#d4af37]/10 rounded-full blur-[80px] w-64 h-64 pointer-events-none" />
              
              <div className="flex-1 flex flex-col items-center justify-center space-y-12 max-w-md w-full relative z-10">
                
                {/* High-Fidelity SVG Cake */}
                <motion.div 
                  className="relative mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  <svg
                    width="220"
                    height="200"
                    viewBox="0 0 200 220"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] mx-auto"
                  >
                    {/* Plate */}
                    <ellipse cx="100" cy="180" rx="90" ry="25" fill="#2a0101" stroke="#d4af37" strokeWidth="3"/>
                    <ellipse cx="100" cy="177" rx="80" ry="20" fill="#3a0202"/>
                    
                    {/* Bottom Layer */}
                    <path d="M30 170 Q100 195 170 170 L170 110 Q100 135 30 110 Z" fill="#fdfbf7"/>
                    {/* Bottom Layer Shading */}
                    <path d="M170 110 L170 170 Q100 195 30 170 L30 160 Q100 185 170 160 Z" fill="#e6e1d6"/>
                    <ellipse cx="100" cy="110" rx="70" ry="20" fill="#fff5ea"/>
                    
                    {/* Top Layer */}
                    <path d="M50 110 Q100 128 150 110 L150 70 Q100 88 50 70 Z" fill="#fdfbf7"/>
                    {/* Top Layer Shading */}
                    <path d="M150 70 L150 110 Q100 128 50 110 L50 102 Q100 120 150 102 Z" fill="#e6e1d6"/>
                    <ellipse cx="100" cy="70" rx="50" ry="14" fill="#fff5ea"/>
                    
                    {/* Drip Details on Bottom Layer */}
                    <path d="M30 110 Q40 120 50 110 Q60 130 70 110 Q85 125 100 110 Q115 130 130 110 Q145 120 155 110 Q162.5 125 170 110" fill="#991b1b"/>
                    
                    {/* Drip Details on Top Layer */}
                    <path d="M50 70 Q60 85 70 70 Q80 80 90 70 Q100 85 110 70 Q125 80 135 70 Q142.5 80 150 70" fill="#991b1b"/>
                    
                    {/* Frosting Swirls Bottom */}
                    <circle cx="45" cy="177" r="6" fill="#fff5ea" stroke="#e6e1d6" strokeWidth="1"/>
                    <circle cx="65" cy="183" r="6" fill="#fff5ea" stroke="#e6e1d6" strokeWidth="1"/>
                    <circle cx="85" cy="186" r="6" fill="#fff5ea" stroke="#e6e1d6" strokeWidth="1"/>
                    <circle cx="100" cy="187" r="6" fill="#fff5ea" stroke="#e6e1d6" strokeWidth="1"/>
                    <circle cx="115" cy="186" r="6" fill="#fff5ea" stroke="#e6e1d6" strokeWidth="1"/>
                    <circle cx="135" cy="183" r="6" fill="#fff5ea" stroke="#e6e1d6" strokeWidth="1"/>
                    <circle cx="155" cy="177" r="6" fill="#fff5ea" stroke="#e6e1d6" strokeWidth="1"/>
                    
                    {/* Frosting Swirls Top */}
                    <circle cx="60" cy="118" r="5" fill="#fff5ea" stroke="#e6e1d6" strokeWidth="1"/>
                    <circle cx="80" cy="123" r="5" fill="#fff5ea" stroke="#e6e1d6" strokeWidth="1"/>
                    <circle cx="100" cy="124" r="5" fill="#fff5ea" stroke="#e6e1d6" strokeWidth="1"/>
                    <circle cx="120" cy="123" r="5" fill="#fff5ea" stroke="#e6e1d6" strokeWidth="1"/>
                    <circle cx="140" cy="118" r="5" fill="#fff5ea" stroke="#e6e1d6" strokeWidth="1"/>

                    {/* Candles */}
                    <g transform="translate(0, -10)">
                      {/* Left Candle */}
                      <rect x="70" y="45" width="6" height="30" rx="2" fill="#d4af37"/>
                      <path d="M70 50 L76 55 M70 60 L76 65 M70 70 L76 75" stroke="#fdfbf7" strokeWidth="1.5"/>
                      {/* Flame Left */}
                      <path d="M73 45 Q70 38 73 30 Q76 38 73 45 Z" fill="#ff9900" className="animate-pulse origin-bottom"/>
                      <path d="M73 42 Q71.5 38 73 34 Q74.5 38 73 42 Z" fill="#ffe066" className="animate-pulse origin-bottom"/>
                      
                      {/* Center Candle */}
                      <rect x="97" y="40" width="6" height="35" rx="2" fill="#d4af37"/>
                      <path d="M97 45 L103 50 M97 55 L103 60 M97 65 L103 70" stroke="#fdfbf7" strokeWidth="1.5"/>
                      {/* Flame Center */}
                      <path d="M100 40 Q97 33 100 25 Q103 33 100 40 Z" fill="#ff9900" className="animate-pulse origin-bottom"/>
                      <path d="M100 37 Q98.5 33 100 29 Q101.5 33 100 37 Z" fill="#ffe066" className="animate-pulse origin-bottom"/>
                      
                      {/* Right Candle */}
                      <rect x="124" y="45" width="6" height="30" rx="2" fill="#d4af37"/>
                      <path d="M124 50 L130 55 M124 60 L130 65 M124 70 L130 75" stroke="#fdfbf7" strokeWidth="1.5"/>
                      {/* Flame Right */}
                      <path d="M127 45 Q124 38 127 30 Q130 38 127 45 Z" fill="#ff9900" className="animate-pulse origin-bottom"/>
                      <path d="M127 42 Q125.5 38 127 34 Q128.5 38 127 42 Z" fill="#ffe066" className="animate-pulse origin-bottom"/>
                    </g>
                  </svg>
                </motion.div>

                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1.2 }}
                    className="font-serif font-light text-sm md:text-base leading-relaxed tracking-wide text-center space-y-4 text-[#f5f5dc]/90"
                  >
                    <p className="font-medium text-[#d4af37]">Apa itu rumah?</p>
                    <p>Bagiku, rumah bukanlah sebuah tempat.</p>
                    <p className="font-cursive text-3xl md:text-4xl text-[#f5f5dc] py-1">Rumah adalah Mama.</p>
                    <p>Di pelukanmulah aku merasa paling aman.</p>
                    <p>Di sisimu, aku merasa diterima, dicintai, dan dimengerti tanpa perlu banyak kata.</p>
                    <p>Selama masih ada Mama, sejauh apa pun aku pergi, aku selalu tahu ke mana aku harus pulang.</p>
                    <p>Karena rumah yang sesungguhnya... <span className="font-medium text-[#d4af37] italic">adalah Mama. 🤍</span></p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3, duration: 1.5 }}
                    className="pt-6 border-t border-[#d4af37]/20 flex flex-col items-center space-y-6"
                  >
                    <div className="space-y-2">
                      <p className="font-cursive text-2xl md:text-3xl text-[#d4af37] tracking-wider mb-2">Happy birthday mama...</p>
                      <p className="font-sans text-[10px] uppercase tracking-widest text-[#f5f5dc]/70">
                        dari Dewinda Nurdiana Sarif, anak mama 🥺❤
                      </p>
                    </div>

                    <button
                      onClick={handleRestart}
                      className="px-6 py-2.5 bg-transparent hover:bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/50 hover:border-[#d4af37] rounded-full flex items-center space-x-2 text-[10px] uppercase tracking-widest font-sans font-medium transition-all duration-300 mt-4 shadow-lg active:scale-95"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Ulang Dari Awal</span>
                    </button>
                  </motion.div>
                </div>
              </div>
           </motion.div>
          )}

        </AnimatePresence>
      </div>



    </div>
  );
}
