import LocaleSwitcher from "@/components/language-switcher";

export default function Header() {
  return (
    <header className="p-6 border-b border-b-gray-60 mb-4">
      <nav className="container flex items-center justify-between">
        <ul className="flex gap-x-8">
          <li>Lorem</li>
          <li>Ipsum</li>
        </ul>
        <LocaleSwitcher />
      </nav>
    </header>
  );
}
