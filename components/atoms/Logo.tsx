import Image from "next/image";
import logo from "../../assets/black-logo.svg";

type LogoProps = {
  className?: string;
};

export const Logo: React.FC<LogoProps> = ({ className }) => (
  <Image className={className || "w-32"} src={logo} alt="Shardeum Logo" />
);
