"use client";
import dynamic from "next/dynamic";
import BootScreen from "./boot-screen";

// three.js and drei only run in the browser; until the chunk arrives the boot
// screen shows at 0 %.
const DeskExperience = dynamic(() => import("./desk-experience"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-[60]">
      <BootScreen language="ENG" progress={0} loaded={0} total={0} ready={false} onEnter={() => {}} />
    </div>
  ),
});

export default function DeskClient() {
  return <DeskExperience />;
}
