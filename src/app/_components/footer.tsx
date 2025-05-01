import Container from "@/app/_components/container";
import { EXAMPLE_PATH } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-700 dark:bg-[#162124]">
      <Container>
        <div className="py-28 text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight flex items-center">
          Fully Sport News
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
