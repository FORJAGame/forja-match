import { games } from "../data/games";

const CACHE_MESSAGE = "CACHE_ASSETS";

function normalizeLocalAssetUrl(assetUrl) {
  if (!assetUrl || typeof window === "undefined") {
    return null;
  }

  const url = new URL(assetUrl, window.location.origin);

  if (url.origin !== window.location.origin) {
    return null;
  }

  return url.pathname;
}

function uniqueUrls(urls) {
  return [...new Set(urls.filter(Boolean))];
}

export const forjaAssetUrls = uniqueUrls([
  "/FORJAmatch.glb",
  "/forja_match_logo.png",
  "/favicon.svg",
  "/icons.svg",
  ...games.map((game) => normalizeLocalAssetUrl(game.image)),
]);

function preloadImage(url) {
  const image = new Image();
  image.decoding = "async";
  image.src = url;
}

export function preloadForjaAssets() {
  if (typeof window === "undefined") {
    return;
  }

  forjaAssetUrls
    .filter((url) => /\.(avif|jpe?g|png|svg|webp)$/i.test(url))
    .forEach(preloadImage);
}

export async function registerAssetCache() {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !("caches" in window)
  ) {
    preloadForjaAssets();
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    const worker = registration.active || navigator.serviceWorker.controller;
    worker?.postMessage({
      type: CACHE_MESSAGE,
      urls: forjaAssetUrls,
    });

    preloadForjaAssets();
  } catch (error) {
    console.warn("Não foi possível ativar o cache local de assets:", error);
    preloadForjaAssets();
  }
}
