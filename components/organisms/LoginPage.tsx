import Image from "next/image";
import { Title } from "../atoms/Title";
import { Logo } from "../atoms/Logo";
import { LoginForm } from "../molecules/LoginForm";
import svgIcon from "../../assets/login-aside.svg";

export const LoginPage: React.FC = () => (
  <div className="flex h-full w-full grow bg-gray-50">
    <aside className="w-full h-full bg-[#3042FB] text-white px-12 py-5">
      <Image src={svgIcon} alt="My SVG" width={200} height={200} />
    </aside>
    <main className="flex grow">
      <div className="w-full flex flex-start">
        <Logo />
      </div>
      <Title text="Enter password to connect to the validator dashboards" />
      <LoginForm />
    </main>
  </div>
);
