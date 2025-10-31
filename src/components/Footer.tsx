export default function Footer() {
  return (
    <footer className="mt-12 border-t border-brand-200 bg-white">
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