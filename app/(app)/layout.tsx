import type { Metadata } from "next";
import LayoutContent from "../LayoutContent";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <LayoutContent>{children}</LayoutContent>;
}
