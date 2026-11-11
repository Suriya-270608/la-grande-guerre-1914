import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  WWI_BOOKS,
  CATEGORY_TABS,
  WWIBook,
  generateCoverSvgDataUrl,
  generateSpineSvgDataUrl,
} from './ww1Data';
import { BOOK_BASE64 } from './ww1Base64Images';

const BLOBS = [
  { cx: 150, cy: 330, delay: 0 },
  { cx: 340, cy: 600, delay: 120 },
  { cx: 250, cy: 120, delay: 220 },
  { cx: 90, cy: 760, delay: 300 },
  { cx: 400, cy: 250, delay: 360 },
  { cx: 260, cy: 860, delay: 420 },
  { cx: 230, cy: 470, delay: 180 },
];

function smoothstep(x: number) {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
}

function B(r: number) {
  if (Math.abs(r) < 1) {
    return (r + Math.sin(Math.PI * r) / Math.PI) / 2;
  }
  return Math.sign(r) * 0.5;
}

export default function App() {
  // Finite 6-book shelf (Book 1 to 6 without looping). Start on Book I (0)
  const scrollRef = useRef<number>(0);
    useEffect(() => {
    const audio = new Audio('/assets/La Marseillaise Instrumental 6 couplets.mp3');
    audio.loop = true;
    audio.volume = 0.35;

    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    });

    let started = false;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.innerText && target.innerText.includes('AUDIO:')) {
        started = true;
        if (audio.paused) {
          audio.play().catch(() => {});
        } else {
          audio.pause();
        }
        return;
      }
      if (!started) {
        started = true;
        audio.play().catch(() => {});
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      audio.pause();
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const targetRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartTRef = useRef<number>(0);
  const hasMovedRef = useRef<boolean>(false);
  const isPointerDownRef = useRef<boolean>(false);

  const hoverVirtualRef = useRef<number>(-1);
  const liftValuesRef = useRef<number[]>(new Array(6).fill(0));

  const mouseRawRef = useRef<{ x: number; y: number }>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const cursorSmoothedRef = useRef<{ x: number; y: number }>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const tiltRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const activeBookIndexRef = useRef<number>(0);
  const [activeBookIndex, setActiveBookIndex] = useState<number>(0);
  const [activeBook, setActiveBook] = useState<WWIBook>(WWI_BOOKS[0]);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [detailTab, setDetailTab] = useState<'narrative' | 'sections' | 'facts'>('narrative');
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const isOpenRef = useRef<boolean>(false);
  const [cursorState, setCursorState] = useState<'default' | 'spine' | 'btn' | 'open'>('default');

  const stageRef = useRef<HTMLDivElement | null>(null);
  const tapeElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const spineShadesRef = useRef<(HTMLDivElement | null)[]>([]);
  const coverShadesRef = useRef<(HTMLDivElement | null)[]>([]);

  const cursorWrapRef = useRef<HTMLDivElement | null>(null);
  const playRingRef = useRef<HTMLButtonElement | null>(null);

  // Caption containers
  const captionTitleMaskRef = useRef<HTMLDivElement | null>(null);
  const captionSubMaskRef = useRef<HTMLDivElement | null>(null);
  const captionYearMaskRef = useRef<HTMLDivElement | null>(null);

  // Category tab elements
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabIndicatorRef = useRef<HTMLDivElement | null>(null);

  // Detail dialog & animation refs
  const detailDialogRef = useRef<HTMLDivElement | null>(null);
  const textLineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const blobCirclesRef = useRef<(SVGCircleElement | null)[]>([]);
  const detailSheetAnimRef = useRef<Animation | null>(null);
  const inkRafRef = useRef<number | null>(null);

  // Geometry
  const geomRef = useRef<{ H: number; ws: number; d: number; gap: number }>({
    H: 300,
    ws: 50,
    d: 158,
    gap: 9,
  });

  const prefersReducedMotionRef = useRef<boolean>(false);

  // Pre-generate SVG Data URLs for the 5 books
  const coverDataUrls = useMemo(() => WWI_BOOKS.map((b) => generateCoverSvgDataUrl(b)), []);
  const spineDataUrls = useMemo(() => WWI_BOOKS.map((b) => generateSpineSvgDataUrl(b)), []);

  // Preload generated SVGs and real photos
  useEffect(() => {
    coverDataUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
    spineDataUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
    WWI_BOOKS.forEach((b) => {
      const img = new Image();
      img.src = b.coverPhotoUrl;
      b.sections.forEach((sec) => {
        if (sec.photoUrl) {
          const sImg = new Image();
          sImg.src = sec.photoUrl;
        }
      });
    });

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mq.matches;
    const onMqChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
    };
    mq.addEventListener('change', onMqChange);
    return () => mq.removeEventListener('change', onMqChange);
  }, [coverDataUrls, spineDataUrls]);

  // Handle ambient historical audio
  const toggleAudio = () => {
    if (!isAudioEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.008;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
        filter.Q.setValueAtTime(1.2, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start();

        setIsAudioEnabled(true);
      } catch {
        setIsAudioEnabled(false);
      }
    } else {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setIsAudioEnabled(false);
    }
  };

  // Update geometry on resize
  const updateGeometry = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMobile = w <= 767;
    const availH = Math.max(180, h - 228);
    const H = isMobile ? Math.min(w * 0.58, availH * 0.72) : Math.min(availH * 0.72, w * 0.28, 280);
    const ws = (H * 142) / 840;
    const d = (H * 474) / 900;
    const gap = H * 0.03;
    geomRef.current = { H, ws, d, gap };

    if (stageRef.current) {
      stageRef.current.style.setProperty('--tape-h', `${H}px`);
      stageRef.current.style.setProperty('--ws', `${ws}px`);
      stageRef.current.style.setProperty('--d', `${d}px`);
    }
    document.documentElement.style.setProperty('--tape-h', `${H}px`);
  }, []);

  useEffect(() => {
    updateGeometry();
    window.addEventListener('resize', updateGeometry);
    return () => window.removeEventListener('resize', updateGeometry);
  }, [updateGeometry]);

  // Update category tab indicator
  const updateTabIndicator = useCallback((book: WWIBook) => {
    const activeTabIndex = CATEGORY_TABS.findIndex((t) => t.label === book.categoryTab);
    if (activeTabIndex >= 0) {
      const targetBtn = tabRefs.current[activeTabIndex];
      if (targetBtn && tabIndicatorRef.current) {
        tabIndicatorRef.current.style.width = `${targetBtn.offsetWidth}px`;
        tabIndicatorRef.current.style.transform = `translateX(${targetBtn.offsetLeft}px)`;
        tabIndicatorRef.current.style.opacity = '1';
      }
    }
  }, []);

  // Initial caption setup
  useEffect(() => {
    const tEl = captionTitleMaskRef.current;
    const sEl = captionSubMaskRef.current;
    const yEl = captionYearMaskRef.current;
    if (tEl) tEl.innerHTML = `<span>${WWI_BOOKS[0].title}</span>`;
    if (sEl) sEl.innerHTML = `<span>${WWI_BOOKS[0].volumeNumber} · ${WWI_BOOKS[0].subtitle}</span>`;
    if (yEl) yEl.innerHTML = `<span>${WWI_BOOKS[0].metaBadge}</span>`;
    updateTabIndicator(WWI_BOOKS[0]);
  }, [updateTabIndicator]);

  // Caption swap animation
  const runCaptionSwap = useCallback(
    (newBook: WWIBook, dir: number) => {
      const isReduced = prefersReducedMotionRef.current;
      const duration = isReduced ? 1 : 650;
      const easing = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

      const swapLine = (container: HTMLDivElement | null, newText: string) => {
        if (!container) return;
        const oldSpans = Array.from(container.querySelectorAll('span'));
        const newSpan = document.createElement('span');
        newSpan.innerText = newText;
        newSpan.style.display = 'block';
        newSpan.style.width = '100%';
        newSpan.style.textAlign = 'center';

        container.appendChild(newSpan);

        oldSpans.forEach((oldSpan) => {
          const anim = oldSpan.animate(
            [
              { transform: 'translateY(0%)' },
              { transform: `translateY(${-dir * 105}%)` },
            ],
            { duration, easing, fill: 'both' }
          );
          anim.onfinish = () => oldSpan.remove();
        });

        newSpan.animate(
          [
            { transform: `translateY(${dir * 105}%)` },
            { transform: 'translateY(0%)' },
          ],
          { duration, easing, fill: 'both' }
        );
      };

      swapLine(captionTitleMaskRef.current, newBook.title);
      swapLine(captionSubMaskRef.current, `${newBook.volumeNumber} · ${newBook.subtitle}`);
      swapLine(captionYearMaskRef.current, newBook.metaBadge);
      updateTabIndicator(newBook);
    },
    [updateTabIndicator]
  );

  // Open detail view
  const openDetail = useCallback(() => {
    if (isOpenRef.current) return;
    isOpenRef.current = true;
    setIsDetailOpen(true);
    setDetailTab('narrative');

    const isReduced = prefersReducedMotionRef.current;
    const detailEl = detailDialogRef.current;
    if (!detailEl) return;

    const activeVirtIdx = Math.round(scrollRef.current);
    const activeTape = tapeElsRef.current[activeVirtIdx];
    const coverFace = activeTape?.querySelector('.cv') as HTMLElement | null;

    let rect: DOMRect;
    if (coverFace) {
      rect = coverFace.getBoundingClientRect();
    } else {
      const W = window.innerWidth;
      const H = geomRef.current.H;
      const d = geomRef.current.d;
      const cyShelf = 104 + (window.innerHeight - 228) * 0.5;
      rect = {
        left: W / 2 - d / 2,
        right: W / 2 + d / 2,
        top: cyShelf - H / 2,
        bottom: cyShelf + H / 2,
        width: d,
        height: H,
      } as DOMRect;
    }

    detailEl.style.visibility = 'visible';
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    detailEl.style.transformOrigin = `${originX}px ${originY}px`;

    const top = rect.top;
    const right = window.innerWidth - rect.right;
    const bottom = window.innerHeight - rect.bottom;
    const left = rect.left;

    if (detailSheetAnimRef.current) {
      detailSheetAnimRef.current.cancel();
    }

    detailSheetAnimRef.current = detailEl.animate(
      [
        {
          clipPath: `inset(${top}px ${right}px ${bottom}px ${left}px round 3px)`,
          transform: 'rotate(-4.5deg)',
        },
        {
          clipPath: 'inset(0px 0px 0px 0px round 0px)',
          transform: 'rotate(0deg)',
        },
      ],
      {
        duration: isReduced ? 1 : 1050,
        easing: 'cubic-bezier(0.76, 0, 0.18, 1)',
        fill: 'both',
      }
    );

    // Text lines rise
    textLineRefs.current.forEach((lineInner, idx) => {
      if (!lineInner) return;
      lineInner.animate(
        [
          { transform: 'translateY(110%)' },
          { transform: 'translateY(0%)' },
        ],
        {
          duration: isReduced ? 1 : 900,
          delay: isReduced ? 0 : 620 + idx * 75,
          easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
          fill: 'both',
        }
      );
    });

    // Reset ink blobs & start ink animation loop
    blobCirclesRef.current.forEach((circle) => {
      if (circle) circle.setAttribute('r', '0');
    });

    if (inkRafRef.current) {
      cancelAnimationFrame(inkRafRef.current);
    }

    const openStartTime = performance.now();
    const runInk = (now: number) => {
      const elapsed = now - openStartTime;
      let anyStillGrowing = false;

      BLOBS.forEach((blob, i) => {
        const circle = blobCirclesRef.current[i];
        if (!circle) return;

        if (isReduced) {
          circle.setAttribute('r', '720');
          return;
        }

        const t = elapsed - 520 - blob.delay;
        if (t <= 0) {
          circle.setAttribute('r', '0');
          anyStillGrowing = true;
        } else {
          const p = Math.min(1, t / 1250);
          const eased = 1 - Math.pow(1 - p, 3);
          const r = eased * 720;
          circle.setAttribute('r', r.toFixed(1));
          if (p < 1) anyStillGrowing = true;
        }
      });

      if (elapsed < 2400 && anyStillGrowing && isOpenRef.current) {
        inkRafRef.current = requestAnimationFrame(runInk);
      }
    };

    inkRafRef.current = requestAnimationFrame(runInk);
  }, []);

  // Close detail view
  const closeDetail = useCallback(() => {
    if (!isOpenRef.current) return;
    const isReduced = prefersReducedMotionRef.current;
    const detailEl = detailDialogRef.current;
    if (!detailEl) return;

    if (inkRafRef.current) {
      cancelAnimationFrame(inkRafRef.current);
    }

    const activeVirtIdx = Math.round(scrollRef.current);
    const activeTape = tapeElsRef.current[activeVirtIdx];
    const coverFace = activeTape?.querySelector('.cv') as HTMLElement | null;

    let rect: DOMRect;
    if (coverFace) {
      rect = coverFace.getBoundingClientRect();
    } else {
      const W = window.innerWidth;
      const H = geomRef.current.H;
      const d = geomRef.current.d;
      rect = {
        left: W / 2 - d / 2,
        right: W / 2 + d / 2,
        top: window.innerHeight / 2 - H / 2,
        bottom: window.innerHeight / 2 + H / 2,
        width: d,
        height: H,
      } as DOMRect;
    }

    const top = rect.top;
    const right = window.innerWidth - rect.right;
    const bottom = window.innerHeight - rect.bottom;
    const left = rect.left;

    const anim = detailEl.animate(
      [
        {
          clipPath: 'inset(0px 0px 0px 0px round 0px)',
          transform: 'rotate(0deg)',
        },
        {
          clipPath: `inset(${top}px ${right}px ${bottom}px ${left}px round 3px)`,
          transform: 'rotate(-4.5deg)',
        },
      ],
      {
        duration: isReduced ? 1 : 850,
        easing: 'cubic-bezier(0.76, 0, 0.18, 1)',
        fill: 'both',
      }
    );

    anim.onfinish = () => {
      detailEl.style.visibility = 'hidden';
      if (detailSheetAnimRef.current) {
        detailSheetAnimRef.current.cancel();
      }
      anim.cancel();
      isOpenRef.current = false;
      setIsDetailOpen(false);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isOpenRef.current) {
          closeDetail();
        }
      } else if (e.key === 'Enter') {
        if (!isOpenRef.current) {
          openDetail();
        }
      } else if (e.key === 'ArrowLeft') {
        if (!isOpenRef.current) {
          targetRef.current = Math.max(0, Math.round(targetRef.current) - 1);
        }
      } else if (e.key === 'ArrowRight') {
        if (!isOpenRef.current) {
          targetRef.current = Math.min(5, Math.round(targetRef.current) + 1);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeDetail, openDetail]);

  // Wheel handling
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout;
    const onWheel = (e: WheelEvent) => {
      if (isOpenRef.current) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const { ws, gap } = geomRef.current;
      targetRef.current = Math.max(0, Math.min(5, targetRef.current + (delta / (ws + gap)) * 0.45));

      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        targetRef.current = Math.max(0, Math.min(5, Math.round(targetRef.current)));
      }, 160);
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      clearTimeout(wheelTimeout);
    };
  }, []);

  // Pointer / Mouse move tracking
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      mouseRawRef.current = { x: e.clientX, y: e.clientY };

      if (isPointerDownRef.current) {
        const dx = e.clientX - dragStartXRef.current;
        if (Math.abs(dx) > 5) {
          hasMovedRef.current = true;
          isDraggingRef.current = true;
        }
        if (isDraggingRef.current) {
          const { ws, gap } = geomRef.current;
          targetRef.current = Math.max(0, Math.min(5, dragStartTRef.current - dx / (ws + gap)));
        }
      }
    };

    const onPointerUp = () => {
      if (isPointerDownRef.current) {
        isPointerDownRef.current = false;
        if (isDraggingRef.current) {
          targetRef.current = Math.max(0, Math.min(5, Math.round(targetRef.current)));
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 50);
        }
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  // Main animation loop for 6 finite books (Book 1, 2, 3, 4, 5, 6 - no looping)
  useEffect(() => {
    let lastTime = performance.now();
    let animId: number;

    const tick = (now: number) => {
      let dt = (now - lastTime) / 1000;
      if (dt > 0.05) dt = 0.05;
      lastTime = now;

      const isReduced = prefersReducedMotionRef.current;
      const W = window.innerWidth;
      const H_screen = window.innerHeight;
      const cyShelf = 104 + (H_screen - 228) * 0.5;
      const { H, ws, d, gap } = geomRef.current;

      let s = scrollRef.current;
      let T = Math.max(0, Math.min(5, targetRef.current));
      targetRef.current = T;
      const k = isReduced ? 1 : isDraggingRef.current ? 18 : 5.2;

      s += (T - s) * (1 - Math.exp(-k * dt));
      if (Math.abs(T - s) < 1e-4) {
        s = T;
      }
      s = Math.max(0, Math.min(5, s));
      scrollRef.current = s;

      // Active book change (strictly 0..5, no modulo looping)
      const currentBookIdx = Math.max(0, Math.min(5, Math.round(s)));
      if (currentBookIdx !== activeBookIndexRef.current) {
        const dir = Math.sign(T - s) || 1;
        activeBookIndexRef.current = currentBookIdx;
        setActiveBookIndex(currentBookIdx);
        const newBook = WWI_BOOKS[currentBookIdx];
        setActiveBook(newBook);
        runCaptionSwap(newBook, dir);
      }

      // Cursor smoothing
      const mx = mouseRawRef.current.x;
      const my = mouseRawRef.current.y;
      let cx = cursorSmoothedRef.current.x;
      let cy = cursorSmoothedRef.current.y;
      cx += (mx - cx) * (1 - Math.exp(-16 * dt));
      cy += (my - cy) * (1 - Math.exp(-16 * dt));
      cursorSmoothedRef.current = { x: cx, y: cy };

      if (cursorWrapRef.current) {
        cursorWrapRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      }

      // Tilt
      const isOnCover =
        Math.abs(mx - W / 2) < 0.55 * d &&
        Math.abs(my - cyShelf) < 0.55 * H &&
        !isOpenRef.current &&
        Math.abs(T - s) < 0.3;

      let tiltYTarget = 0;
      let tiltXTarget = 0;
      if (isOnCover) {
        tiltYTarget = ((mx - W / 2) / (0.55 * d)) * 9;
        tiltXTarget = -((my - cyShelf) / (H / 2)) * 6;
      } else {
        tiltYTarget = ((mx - W / 2) / W) * 5;
        tiltXTarget = 0;
      }

      tiltRef.current.x += (tiltXTarget - tiltRef.current.x) * (1 - Math.exp(-7 * dt));
      tiltRef.current.y += (tiltYTarget - tiltRef.current.y) * (1 - Math.exp(-7 * dt));

      // Cursor state resolution
      if (isOpenRef.current) {
        setCursorState('default');
      } else if (isOnCover) {
        setCursorState('open');
      } else if (hoverVirtualRef.current !== -1) {
        const rHov = hoverVirtualRef.current - s;
        if (Math.abs(rHov) > 0.5) {
          setCursorState('spine');
        } else {
          setCursorState('default');
        }
      } else {
        setCursorState('default');
      }

      // Update 6 books on 3D shelf (in simple finite sequence: 0, 1, 2, 3, 4, 5)
      for (let v = 0; v < 6; v++) {
        const tapeEl = tapeElsRef.current[v];
        if (!tapeEl) continue;

        const r = v - s;
        const x = r * (ws + gap) + (d - ws + 1.6 * gap) * B(r);

        if (Math.abs(x) > W / 2 + 2.5 * d) {
          tapeEl.style.visibility = 'hidden';
          continue;
        }
        tapeEl.style.visibility = 'visible';

        let targetLift = 0;
        if (hoverVirtualRef.current === v && Math.abs(r) > 0.5) {
          targetLift = 1;
        }
        let lift = liftValuesRef.current[v];
        lift += (targetLift - lift) * (1 - Math.exp(-12 * dt));
        liftValuesRef.current[v] = lift;

        const o = smoothstep(Math.max(0, 1 - Math.abs(r)));
        const rotY = -90 * o + tiltRef.current.y * o;
        const rotX = tiltRef.current.x * o;
        const rotZ = -4.5 * o;
        const transZ = o * 0.2 * H;
        const transY = -o * 0.025 * H - lift * 0.045 * H;

        tapeEl.style.transform = `translate3d(${x}px, ${transY}px, ${transZ}px) rotateZ(${rotZ}deg) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        tapeEl.style.zIndex = String(Math.round(100 - Math.abs(r) * 4));

        const spineShade = spineShadesRef.current[v];
        if (spineShade) {
          spineShade.style.opacity = String(o * 0.55);
        }
        const coverShade = coverShadesRef.current[v];
        if (coverShade) {
          coverShade.style.opacity = String((1 - o) * 0.5);
        }
      }

      // Action button ring
      if (playRingRef.current) {
        const ringScale = isOpenRef.current ? 0 : smoothstep(Math.max(0, 1 - Math.abs(T - s) * 3));
        playRingRef.current.style.transform = `scale(${ringScale})`;
        playRingRef.current.style.left = `${W / 2 - 0.5 * d - 6}px`;
        playRingRef.current.style.top = `${cyShelf + 0.36 * H}px`;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [runCaptionSwap]);

  // Pointerdown handling
  const handleShelfPointerDown = (e: React.PointerEvent) => {
    if (isOpenRef.current) return;
    isPointerDownRef.current = true;
    hasMovedRef.current = false;
    isDraggingRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartTRef.current = targetRef.current;
  };

  const handleTapeClick = (v: number) => {
    if (hasMovedRef.current) return;
    const r = v - scrollRef.current;
    if (Math.abs(r) < 0.5) {
      openDetail();
    } else {
      targetRef.current = Math.max(0, Math.min(5, v));
    }
  };

  // Category tab jump
  const handleCategoryTabClick = (tab: (typeof CATEGORY_TABS)[0]) => {
    if (isOpenRef.current) return;
    targetRef.current = Math.max(0, Math.min(5, tab.bookIndex));
  };

  const handlePrev = () => {
    if (isOpenRef.current || activeBookIndexRef.current <= 0) return;
    targetRef.current = Math.max(0, Math.round(targetRef.current) - 1);
  };

  const handleNext = () => {
    if (isOpenRef.current || activeBookIndexRef.current >= 5) return;
    targetRef.current = Math.min(5, Math.round(targetRef.current) + 1);
  };

  const currentPosterDataUrl = coverDataUrls[activeBookIndexRef.current] || coverDataUrls[0];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[var(--paper)] text-[var(--ink)] select-none">
      {/* 1. TOP BAR */}
      <header className="fixed top-0 left-0 right-0 z-30 grid h-[58px] max-md:h-[50px] grid-cols-[1fr_auto_1fr] items-center px-8 max-md:px-4 bg-[var(--paper)]/95 backdrop-blur-xs border-b border-[var(--rule)]/20">
        {/* Left: ARCHIVE BADGE */}
        <div className="flex items-center justify-start gap-3">
          <div className="box lbl text-[10px] max-md:text-[8.5px]">
            6 VOLUMES · 1914–1918
          </div>
          <button
            type="button"
            className={`box lbl text-[9.5px] max-md:text-[8px] hidden sm:inline-flex gap-1.5 transition-colors ${
              isAudioEnabled ? 'bg-[var(--cobalt)] text-white border-[var(--cobalt)]' : 'hover:opacity-75'
            }`}
            onClick={toggleAudio}
            onMouseEnter={() => setCursorState('btn')}
            onMouseLeave={() => setCursorState('default')}
            title="Vintage phonograph background audio"
          >
            <span>{isAudioEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
          </button>
        </div>

        {/* Centre: Header */}
        <div className="flex flex-col items-center justify-center text-[var(--cobalt)] gap-[3px] pointer-events-none">
          <span
            className="text-[20px] max-md:text-[16px] font-bold leading-none tracking-[0.06em]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            « LA GRANDE GUERRE »
          </span>
          <span
            className="lbl text-[8.5px] max-md:text-[7px] leading-none tracking-[0.24em] pl-[0.24em] text-[var(--muted)]"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            FRANCE 1914–1918 · ARCHIVES HISTORIQUES (6 VOLUMES)
          </span>
        </div>

        {/* Right: National record badge */}
        <div className="flex items-center justify-end">
          <span className="lbl text-right max-md:hidden text-[10px] text-[var(--muted)]">
            COLLECTION NATIONALE · 1914–1918
          </span>
        </div>
      </header>

      {/* 2. SIX FOCUSED CATEGORY TABS (Dedicated slot below header) */}
      <nav
        aria-label="6 Archival Volumes"
        className="fixed top-[64px] left-1/2 -translate-x-1/2 z-30 flex items-center max-w-[96vw] overflow-x-auto no-scrollbar py-1"
      >
        <div className="relative flex items-center">
          {/* Sliding Cobalt Indicator */}
          <div
            ref={tabIndicatorRef}
            className="absolute top-0 left-0 h-[23px] bg-[var(--cobalt)] pointer-events-none transition-all"
            style={{
              transition: 'transform 0.6s var(--ease), width 0.6s var(--ease)',
              opacity: 0,
            }}
          />

          {CATEGORY_TABS.map((tab, idx) => {
            const isActive = tab.label === activeBook.categoryTab;
            return (
              <button
                key={tab.label}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                className="relative z-10 box lbl h-[23px] px-[12px] max-md:px-[8px] text-[10px] max-md:text-[8.5px] -ml-[1px] first:ml-0 whitespace-nowrap transition-colors duration-450"
                style={{
                  color: isActive ? '#ffffff' : 'var(--ink)',
                  borderColor: 'var(--rule)',
                }}
                onClick={() => handleCategoryTabClick(tab)}
                onMouseEnter={() => setCursorState('btn')}
                onMouseLeave={() => setCursorState('default')}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. 3D ARCHIVAL SHELF (6 Physical Books - Book 1 to 6 with no looping) */}
      <section
        aria-label="Military war archive shelf"
        className="fixed left-0 w-full z-20 cursor-grab active:cursor-grabbing"
        style={{
          top: '104px',
          height: 'calc(100vh - 228px)',
          perspective: '2200px',
          perspectiveOrigin: '50% 50%',
          touchAction: 'pan-y',
        }}
        onPointerDown={handleShelfPointerDown}
      >
        <div ref={stageRef} className="stage absolute left-1/2 top-1/2 w-0 h-0">
          {WWI_BOOKS.map((book, v) => {
            const spineData = spineDataUrls[v];
            const coverData = coverDataUrls[v];

            return (
              <div
                key={book.id}
                ref={(el) => {
                  tapeElsRef.current[v] = el;
                }}
                className="tape"
                onClick={() => handleTapeClick(v)}
                onPointerEnter={() => {
                  hoverVirtualRef.current = v;
                }}
                onPointerLeave={() => {
                  if (hoverVirtualRef.current === v) {
                    hoverVirtualRef.current = -1;
                  }
                }}
              >
                {/* Spine face */}
                <div
                  className="sp"
                  style={{
                    backgroundImage: `url("${spineData}")`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                  }}
                >
                  <div
                    ref={(el) => {
                      spineShadesRef.current[v] = el;
                    }}
                    className="absolute inset-0 bg-black pointer-events-none rounded-[2px]"
                    style={{ opacity: 0 }}
                  />
                </div>

                {/* Cover face with authentic photograph */}
                <div
                  className="cv relative overflow-hidden"
                  style={{
                    backgroundImage: `url("${coverData}")`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Real historical photo layer */}
                  <div className="absolute left-[13.5%] top-[31.8%] w-[73%] h-[32.5%] overflow-hidden border border-[#141414] shadow-xs pointer-events-none">
                    <img
                      src={BOOK_BASE64[book.id] || book.coverPhotoUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-[#7A5828]/10 mix-blend-multiply pointer-events-none" />
                  </div>
                  <div
                    ref={(el) => {
                      coverShadesRef.current[v] = el;
                    }}
                    className="absolute inset-0 bg-black pointer-events-none rounded-[2px]"
                    style={{ opacity: 0.5 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. ACTION SEAL RING */}
      <button
        ref={playRingRef}
        type="button"
        aria-label="Open book"
        className="fixed z-30 w-[42px] h-[42px] -ml-[21px] -mt-[21px] rounded-full border border-[var(--cobalt)] bg-[rgba(237,235,230,0.85)] flex items-center justify-center text-[var(--cobalt)] transition-transform duration-300 pointer-events-auto shadow-sm"
        onClick={openDetail}
        onMouseEnter={() => setCursorState('btn')}
        onMouseLeave={() => setCursorState('default')}
        title="Open volume"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      </button>

      {/* 5. CAPTION (Cleanly positioned above the footer with zero collision) */}
      <div
        aria-live="polite"
        className="fixed bottom-[38px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-[4px] pointer-events-none max-w-[92vw] w-[720px]"
      >
        {/* Subtitle */}
        <div
          ref={captionSubMaskRef}
          className="relative overflow-hidden h-[15px] w-full flex justify-center text-[var(--cobalt)] lbl font-semibold text-[10.5px] max-md:text-[9px]"
        />

        {/* Title */}
        <div
          ref={captionTitleMaskRef}
          className="relative overflow-hidden h-[34px] max-md:h-[26px] w-full flex justify-center font-serif text-[26px] max-md:text-[20px] leading-none tracking-[-0.01em]"
          style={{ fontFamily: 'var(--font-serif)' }}
        />

        {/* Year / Tag */}
        <div
          ref={captionYearMaskRef}
          className="relative overflow-hidden h-[15px] w-full flex justify-center text-[10.5px] max-md:text-[8.5px] font-medium tracking-[0.08em] text-[var(--muted)]"
          style={{ fontFamily: 'var(--font-sans)' }}
        />
      </div>

      {/* 6. ARROWS (Vertically centered to shelf) */}
      <button
        type="button"
        aria-label="Previous volume"
        disabled={activeBookIndex === 0}
        className={`fixed z-30 w-[44px] h-[44px] flex items-center justify-center text-[var(--ink)] left-[20px] max-md:left-[6px] transition-all ${
          activeBookIndex === 0 ? 'opacity-25 cursor-not-allowed' : 'opacity-100 hover:opacity-70'
        }`}
        style={{
          top: 'calc(104px + (100vh - 228px) / 2 - 22px)',
        }}
        onClick={handlePrev}
        onMouseEnter={() => setCursorState(activeBookIndex === 0 ? 'default' : 'btn')}
        onMouseLeave={() => setCursorState('default')}
      >
        <svg
          width="18"
          height="10"
          viewBox="0 0 18 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M5 1L1 5L5 9" />
          <path d="M1 5L17 5" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Next volume"
        disabled={activeBookIndex === 5}
        className={`fixed z-30 w-[44px] h-[44px] flex items-center justify-center text-[var(--ink)] right-[20px] max-md:right-[6px] transition-all ${
          activeBookIndex === 5 ? 'opacity-25 cursor-not-allowed' : 'opacity-100 hover:opacity-70'
        }`}
        style={{
          top: 'calc(104px + (100vh - 228px) / 2 - 22px)',
        }}
        onClick={handleNext}
        onMouseEnter={() => setCursorState(activeBookIndex === 5 ? 'default' : 'btn')}
        onMouseLeave={() => setCursorState('default')}
      >
        <svg
          width="18"
          height="10"
          viewBox="0 0 18 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M13 1L17 5L13 9" />
          <path d="M1 5L17 5" />
        </svg>
      </button>

      {/* 7. FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 h-[34px] z-30 flex items-center justify-between px-8 max-md:px-4 bg-[var(--paper)]/95 backdrop-blur-xs border-t border-[var(--rule)]/20 text-[var(--ink)] pointer-events-auto">
        <span className="lbl text-[10px] max-md:text-[8px] truncate">
          1914–1918 · ARCHIVES DE LA GUERRE · 6 VOLUMES OFFICIELS
        </span>
        <div className="flex items-center gap-2 text-[10px] max-md:text-[8px] whitespace-nowrap">
          <span className="lbl text-[var(--muted)]">
            SERVICE HISTORIQUE DE LA DÉFENSE
          </span>
          <span className="lbl">/</span>
          <span className="lbl text-[var(--cobalt)]">
            ARCHIVES NATIONALES
          </span>
        </div>
      </footer>

      {/* PAPER GRAIN OVERLAY */}
      <svg
        className="pointer-events-none fixed inset-0 z-40 h-full w-full select-none"
        style={{ mixBlendMode: 'multiply', opacity: 0.55 }}
        aria-hidden="true"
      >
        <filter id="grain-filter" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.45  0 0 0 0 0.42  0 0 0 0 0.38  0 0 0 0.22 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>

      {/* 8. DETAIL VIEW (EXPANDING PAPER SHEET & INK BLOT REVEAL) */}
      <div
        ref={detailDialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={activeBook.title}
        className="fixed inset-0 z-50 overflow-y-auto bg-[var(--sheet)] text-[var(--ink)]"
        style={{
          visibility: 'hidden',
          willChange: 'clip-path, transform',
        }}
      >
        {/* Detail Top Bar */}
        <div className="sticky top-0 left-0 right-0 h-[60px] max-md:h-[52px] flex items-center justify-between px-8 max-md:px-4 z-20 bg-[var(--sheet)]/95 backdrop-blur-xs border-b border-[var(--rule)]/20">
          <button
            type="button"
            className="box lbl hover:opacity-70 transition-opacity text-[10px] max-md:text-[8.5px]"
            onClick={closeDetail}
            onMouseEnter={() => setCursorState('btn')}
            onMouseLeave={() => setCursorState('default')}
          >
            ← RETOUR AUX RAYONS / RETURN
          </button>

          {/* Centred Header */}
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center text-[var(--cobalt)] gap-[2px] pointer-events-none">
            <span
              className="text-[18px] max-md:text-[14px] font-bold leading-none tracking-[0.05em]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              « LA GRANDE GUERRE »
            </span>
            <span
              className="lbl text-[8px] max-md:text-[6.5px] leading-none tracking-[0.24em] pl-[0.24em] text-[var(--muted)]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {activeBook.volumeNumber} · {activeBook.frenchTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="box lbl text-[10px] text-[var(--muted)] border-[var(--rule)]/40 hidden sm:inline-flex">
              VOLUME {activeBook.romanNumeral} OF 6
            </span>
            {activeBook.id === 'entire-story' && (
              <span className="box lbl text-[10px] text-[var(--cobalt)] border-[var(--cobalt)] bg-[var(--cobalt)]/10">
                ⏱ ~5-MIN READ
              </span>
            )}
          </div>
        </div>

        {/* Detail Content Grid */}
        <div className="grid grid-cols-2 max-md:grid-cols-1 items-start gap-[4vw] max-md:gap-[24px] min-h-[calc(100vh-84px)] px-[7vw] pt-[28px] pb-[56px] max-md:px-[20px]">
          {/* Left Column: Book Content */}
          <div className="flex flex-col justify-start max-w-[560px] gap-[18px] max-md:order-2">
            {/* 1. Subtitle */}
            <div className="overflow-hidden">
              <div
                ref={(el) => {
                  textLineRefs.current[0] = el;
                }}
                className="lbl text-[var(--cobalt)] text-[11px] font-semibold tracking-[0.14em]"
              >
                {activeBook.volumeNumber} · {activeBook.subtitle}
              </div>
            </div>

            {/* 2. Grand Title with French Designation */}
            <div className="overflow-hidden">
              <div
                ref={(el) => {
                  textLineRefs.current[1] = el;
                }}
                className="font-serif leading-[1.05] tracking-[-0.02em] text-[clamp(28px,3.6vw,52px)] max-md:text-[26px]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                <div>{activeBook.title}</div>
                <div className="text-[19px] max-md:text-[15px] text-[var(--cobalt)] font-serif italic font-normal mt-1">
                  « {activeBook.frenchTitle} »
                </div>
              </div>
            </div>

            {/* 3. Meta badge */}
            <div className="overflow-hidden">
              <div
                ref={(el) => {
                  textLineRefs.current[2] = el;
                }}
                className="lbl text-[var(--muted)] text-[11px] flex items-center gap-2 flex-wrap"
              >
                <span className="px-2 py-0.5 border border-[var(--rule)]/40 bg-[var(--paper)]">
                  {activeBook.metaBadge}
                </span>
                {activeBook.id === 'entire-story' && (
                  <span className="px-2 py-0.5 border border-[var(--cobalt)] text-[var(--cobalt)] bg-[var(--cobalt)]/10 font-bold">
                    ⏱ READ TIME: &lt; 5 MINUTES
                  </span>
                )}
              </div>
            </div>

            {/* Interactive Book Tabs */}
            <div className="flex items-center gap-1 border-b border-[var(--rule)]/20 pb-1 mt-1">
              <button
                type="button"
                className={`lbl text-[10px] px-3 py-1.5 transition-colors ${
                  detailTab === 'narrative'
                    ? 'border-b-2 border-[var(--cobalt)] text-[var(--cobalt)] font-bold'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
                onClick={() => setDetailTab('narrative')}
              >
                1. OVERVIEW & NARRATIVE
              </button>
              <button
                type="button"
                className={`lbl text-[10px] px-3 py-1.5 transition-colors ${
                  detailTab === 'sections'
                    ? 'border-b-2 border-[var(--cobalt)] text-[var(--cobalt)] font-bold'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
                onClick={() => setDetailTab('sections')}
              >
                {activeBook.id === 'entire-story' ? '2. 5-MINUTE MILESTONES' : '2. CHAPTER TOPICS & PHOTOS'}
              </button>
              <button
                type="button"
                className={`lbl text-[10px] px-3 py-1.5 transition-colors ${
                  detailTab === 'facts'
                    ? 'border-b-2 border-[var(--cobalt)] text-[var(--cobalt)] font-bold'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
                onClick={() => setDetailTab('facts')}
              >
                3. KEY METRICS & FACTS
              </button>
            </div>

            {/* Tab 1: Narrative & Context */}
            {detailTab === 'narrative' && (
              <div className="space-y-4 animate-fade-in">
                {activeBook.id === 'entire-story' && (
                  <div className="flex items-center gap-2.5 p-3 bg-[var(--cobalt)]/10 border border-[var(--cobalt)]/35 rounded-xs">
                    <span className="text-[17px]">⏱</span>
                    <div>
                      <span className="lbl text-[10.5px] text-[var(--cobalt)] font-bold block">
                        FAST-TRACK 5-MINUTE READ · L’HISTOIRE EN 5 MINUTES
                      </span>
                      <span className="text-[12px] font-sans text-[var(--ink)]/80 block mt-0.5">
                        This volume summarizes France’s entire 1914–1918 experience in under 5 minutes. Browse the chapters for minute-by-minute milestones.
                      </span>
                    </div>
                  </div>
                )}

                <div className="overflow-hidden">
                  <div
                    ref={(el) => {
                      textLineRefs.current[3] = el;
                    }}
                    className="font-serif text-[17px] max-md:text-[16px] leading-[1.6] text-[var(--ink)]/90"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {activeBook.synopsis}
                  </div>
                </div>

                {/* Primary Source Quote Box with French Dialogue */}
                <div className="overflow-hidden border-l-2 border-[var(--cobalt)] pl-4 py-2.5 bg-[var(--paper)]/50">
                  <div
                    ref={(el) => {
                      textLineRefs.current[4] = el;
                    }}
                    className="space-y-1.5"
                  >
                    <div
                      className="font-serif italic text-[16px] leading-[1.5] text-[var(--cobalt)] font-medium"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {activeBook.quote}
                    </div>
                    {activeBook.quoteTranslation && (
                      <div className="font-serif text-[13.5px] text-[var(--ink)]/80 italic leading-[1.4]">
                        {activeBook.quoteTranslation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Detailed Topics with Photos */}
            {detailTab === 'sections' && (
              <div className="space-y-3.5 animate-fade-in max-h-[50vh] overflow-y-auto pr-1">
                {activeBook.sections.map((item, idx) => (
                  <div key={idx} className="p-3.5 border border-[var(--rule)]/30 bg-[var(--paper)] flex gap-3.5 items-start">
                    {item.photoUrl && (
                      <img
                        src={item.photoUrl}
                        alt={item.name}
                        className="w-20 h-24 object-cover object-top border border-[var(--rule)]/40 shrink-0 shadow-xs"
                      />
                    )}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="lbl text-[9px] text-[var(--cobalt)] font-semibold">
                          {activeBook.id === 'entire-story' ? `MINUTE ${idx + 1} OF 5` : `TOPIC #${idx + 1}`}
                        </span>
                        {item.frenchPhrase && (
                          <span className="px-1.5 py-0.2 bg-[var(--cobalt)]/10 text-[var(--cobalt)] text-[9.5px] font-serif italic border border-[var(--cobalt)]/25 rounded-xs">
                            {item.frenchPhrase}
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-[17px] font-bold leading-tight text-[var(--ink)]">
                        {item.name}
                      </h4>
                      <p className="font-sans text-[12px] font-medium text-[var(--muted)]">
                        {item.subtitle}
                      </p>
                      <p className="font-serif text-[14px] leading-[1.4] text-[var(--ink)]/85 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Key Facts */}
            {detailTab === 'facts' && (
              <div className="space-y-3 animate-fade-in">
                <div className="p-4 border border-[var(--rule)]/30 bg-[var(--paper)]">
                  <span className="lbl text-[10px] text-[var(--cobalt)] block mb-2">
                    CRITICAL HISTORICAL METRICS
                  </span>
                  <ul className="space-y-2.5">
                    {activeBook.keyFacts.map((fact, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 font-serif text-[15px] leading-[1.4] text-[var(--ink)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--cobalt)] mt-2 shrink-0" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="overflow-hidden pt-2">
              <div
                ref={(el) => {
                  textLineRefs.current[5] = el;
                }}
              >
                <button
                  type="button"
                  className="box lbl h-[44px] px-[22px] text-[var(--cobalt)] border-[var(--cobalt)] hover:bg-[var(--cobalt)] hover:text-white transition-colors"
                  onClick={() => {
                    const btn = textLineRefs.current[5]?.querySelector('button');
                    if (btn) {
                      const prev = btn.innerText;
                      btn.innerText = 'SUMMARY COPIED TO CLIPBOARD';
                      navigator.clipboard?.writeText(
                        `France in WWI: ${activeBook.volumeNumber} - ${activeBook.title}. Summary: ${activeBook.synopsis}`
                      );
                      setTimeout(() => {
                        if (btn) btn.innerText = prev;
                      }, 2500);
                    }
                  }}
                  onMouseEnter={() => setCursorState('btn')}
                  onMouseLeave={() => setCursorState('default')}
                >
                  COPY BOOK SUMMARY & CITATION
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Historical SVG Archival Poster with Real Photo & Ragged Ink Blots */}
          <div className="flex flex-col items-center justify-center max-md:order-1 sticky top-[100px]">
            <svg
              viewBox="0 0 474 900"
              aria-hidden="true"
              className="w-auto h-[min(100%,76vh)] max-md:h-[46svh] max-w-full drop-shadow-xl border border-[var(--rule)]/20"
              style={{ aspectRatio: '474/900' }}
            >
              <defs>
                {/* Ragged bleeding ink filter */}
                <filter id="ink-filter" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.011"
                    numOctaves="3"
                    seed="7"
                    result="noise"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale="120"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>

                <clipPath id="poster-clip">
                  <rect x="0" y="0" width="474" height="900" rx="3" ry="3" />
                </clipPath>

                {/* 7 circles group with ragged bleeding filter */}
                <mask
                  id="ink-mask"
                  maskUnits="userSpaceOnUse"
                  x="-200"
                  y="-200"
                  width="874"
                  height="1300"
                >
                  <g filter="url(#ink-filter)">
                    {BLOBS.map((blob, idx) => (
                      <circle
                        key={idx}
                        ref={(el) => {
                          blobCirclesRef.current[idx] = el;
                        }}
                        cx={blob.cx}
                        cy={blob.cy}
                        r="0"
                        fill="#ffffff"
                      />
                    ))}
                  </g>
                </mask>
              </defs>

              {/* Masked and clipped cover image with real photo */}
              <g clipPath="url(#poster-clip)" mask="url(#ink-mask)">
                <image
                  href={currentPosterDataUrl}
                  x="0"
                  y="0"
                  width="474"
                  height="900"
                  preserveAspectRatio="none"
                />
                {/* Direct photo overlay ensuring zero browser blocking */}
                <image
                  href={BOOK_BASE64[activeBook.id] || activeBook.coverPhotoUrl}
                  x="67"
                  y="290"
                  width="340"
                  height="290"
                  preserveAspectRatio="xMidYMid slice"
                />
              </g>
            </svg>
            <span className="lbl text-[9.5px] text-[var(--muted)] mt-2 text-center max-w-[420px]">
              {activeBook.coverPhotoCaption}
            </span>
          </div>
        </div>
      </div>

      {/* CUSTOM CURSOR */}
      <div
        ref={cursorWrapRef}
        className={`custom-cursor-wrap cursor-state-${cursorState}`}
      >
        <div className="custom-cursor-ring" />
        <div className="custom-cursor-dot" />
        <div className="custom-cursor-label">
          <span>OPEN</span>
          <span>BOOK</span>
        </div>
      </div>
    </div>
  );
}
