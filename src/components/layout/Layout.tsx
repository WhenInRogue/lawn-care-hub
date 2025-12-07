import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import HelpButton from "@/components/common/HelpButton";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">{children}</div>
      <HelpButton />
    </div>
  );
};

export default Layout;
