import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const QR_CACHE_PREFIX = "forja-match:qrcode:v1:";

function hashString(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

function createCacheKey(options) {
  return `${QR_CACHE_PREFIX}${hashString(JSON.stringify(options))}`;
}

function readCachedQRCode(cacheKey) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const cachedValue = window.localStorage.getItem(cacheKey);
    return cachedValue?.startsWith("data:image/png") ? cachedValue : null;
  } catch {
    return null;
  }
}

function saveCachedQRCode(cacheKey, dataUrl) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(cacheKey, dataUrl);
  } catch {
    // Storage can be disabled or full; the live canvas remains a safe fallback.
  }
}

function CachedQRCode({
  value,
  size = 256,
  level = "M",
  marginSize = 0,
  bgColor = "#ffffff",
  fgColor = "#111111",
  alt = "QR Code",
}) {
  const canvasRef = useRef(null);
  const cacheKey = useMemo(
    () => createCacheKey({ value, size, level, marginSize, bgColor, fgColor }),
    [bgColor, fgColor, level, marginSize, size, value],
  );
  const [cachedQRCode, setCachedQRCode] = useState(() => ({
    cacheKey,
    src: readCachedQRCode(cacheKey),
  }));
  const cachedSrc =
    cachedQRCode.cacheKey === cacheKey
      ? cachedQRCode.src
      : readCachedQRCode(cacheKey);

  useEffect(() => {
    if (cachedSrc || !canvasRef.current) {
      return undefined;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      try {
        const dataUrl = canvasRef.current.toDataURL("image/png");
        saveCachedQRCode(cacheKey, dataUrl);
        setCachedQRCode({ cacheKey, src: dataUrl });
      } catch {
        // Canvas export can fail in restricted contexts; rendering still works.
      }
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [cacheKey, cachedSrc]);

  if (cachedSrc) {
    return (
      <img
        src={cachedSrc}
        width={size}
        height={size}
        alt={alt}
        loading="eager"
        decoding="async"
      />
    );
  }

  return (
    <QRCodeCanvas
      ref={canvasRef}
      value={value}
      size={size}
      level={level}
      marginSize={marginSize}
      bgColor={bgColor}
      fgColor={fgColor}
      title={alt}
    />
  );
}

export default CachedQRCode;
