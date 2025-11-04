type FooterProps = {
  noMargin?: boolean;
  className?: string;
};

export default function Footer({ noMargin = false, className = "" }: FooterProps) {
  const mtClass = noMargin ? "mt-0" : "mt-12";
  return (
    <footer className={`${mtClass} border-t border-brand-200 bg-white ${className}`}>
      <div className="mx-auto max-w-6xl px-4 py-8 text-cocoa-800">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p>© {new Date().getFullYear()} Darwaza. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-600">Privacy</a>
            <a href="#" className="hover:text-brand-600">Terms</a>
            <a href="#" className="hover:text-brand-600">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}