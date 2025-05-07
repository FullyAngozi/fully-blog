import Container from "@/app/_components/container";
import { EXAMPLE_PATH } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-700 dark:bg-[#162124]">
      <Container>
  <div className="py-28 px-4 text-center flex flex-col items-center justify-center text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight">
    <p className="">Fully Finance Chronicle</p>
    <p className="text-base md:text-xl font-mono leading-relaxed mt-4 max-w-xl text-neutral-600 dark:text-neutral-400">
      A blog exploring finance, culture, and the stories shaping our economic world.
    </p>
  </div>
</Container>

    </footer>
  );
}

export default Footer;
