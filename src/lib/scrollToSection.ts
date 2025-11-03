export function scrollToSection(id: string, offset = 120) {
  if (typeof window === "undefined") return;

  if (window.location.pathname === "/") {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  } else {
    window.location.href = `/#${id}`;
  }
}