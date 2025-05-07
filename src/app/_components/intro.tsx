import { CMS_NAME } from "@/lib/constants";
import { ThemeSwitcher } from "./theme-switcher";

export function Intro() {
  return (
    <section className="flex-col md:flex-row flex items-center  md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-5xl  md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
        Fully.
      </h1>
      <div className="mt-4 md:mt-0">
        <ThemeSwitcher />
      </div>
    </section>
  );
}
