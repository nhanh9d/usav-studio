import Image from "next/image";
import logoNavy from "../../public/images/logo-navy.png";
import logoWhite from "../../public/images/logo-white.png";

// Both marks are rendered and CSS shows the one that matches the active theme.
export default function Logo({ priority = false }: { priority?: boolean }) {
  return (
    <>
      <Image src={logoWhite} alt="USAV Studio" priority={priority} className="h-8 w-auto light:hidden" />
      <Image src={logoNavy} alt="USAV Studio" priority={priority} className="hidden h-8 w-auto light:block" />
    </>
  );
}
