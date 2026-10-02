import { initAnalytics } from "./analytics";
import { initMenu } from "./menu";
import { initTabs } from "./tabs";
import { initAssistant } from "./assistant/ui";
import { initContact } from "./contact";
import { initLightbox } from "./lightbox";
import { initExperience } from "./experience";
import { initDaySync, initNavigator } from "./navigator";
import { initArch, initHeader, initMaps, initPointer, initRailAndPause, initReveal, initViz } from "./viz";

document.documentElement.classList.add("js");

const safely = (name: string, fn: () => void): void => {
  // One failing enhancement must not take down the others; the page still works without JS.
  try { fn(); } catch (err) { if (location.hostname === "localhost") console.warn(`[kx] ${name} failed`, err); }
};

safely("analytics", initAnalytics);
safely("menu", initMenu);
safely("tabs", initTabs);
safely("assistant", initAssistant);
safely("contact", initContact);
safely("lightbox", initLightbox);
safely("viz", initViz);
safely("reveal", initReveal);
safely("maps", initMaps);
safely("header", initHeader);
safely("pointer", initPointer);
safely("rail", initRailAndPause);
safely("arch", initArch);
safely("experience", initExperience);
safely("navigator", initNavigator);
safely("day-sync", initDaySync);
