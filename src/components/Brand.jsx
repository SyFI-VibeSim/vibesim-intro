import logo from "../servingstudio-symbol.svg";
import s from "./Brand.module.css";

/* Used twice: in the header and again in the footer, which sizes it down. A
   caller styles it by passing a class rather than by reaching in with a
   descendant selector, since module scoping makes its class name unaddressable
   from outside. */
export function Brand({ className = "" }) {
  return (
    <a
      className={`${s.brand} ${className}`}
      href={import.meta.env.BASE_URL}
      aria-label="ServingStudio home"
    >
      <img src={logo} alt="" />
      <span>ServingStudio</span>
    </a>
  );
}
