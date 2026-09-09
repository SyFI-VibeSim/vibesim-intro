import { prepareHero, warmHeroImages } from "./heroImages";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
/* Layering, in the order it has to load: the reset flattens the browser
   defaults, the tokens define the scales, base styles the elements and the
   page frame, and each section's module comes after via its own component.
   A module rule frequently overrides a base rule at the same specificity, so
   this order is the thing that decides those, not an accident of the graph. */
import "./styles/reset.css";
import "./styles/tokens.css";
import "./styles/base.css";

const initialPage = location.pathname.endsWith("features.html")
  ? "features"
  : location.pathname.endsWith("architecture.html")
    ? "architecture"
    : "overview";
const heroReady = prepareHero(initialPage, location.search);
warmHeroImages();
heroReady.then(() =>
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>,
  ),
);
