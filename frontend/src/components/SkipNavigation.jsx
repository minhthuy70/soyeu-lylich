import './SkipNavigation.css';

export default function SkipNavigation() {
  const handleSkip = (e) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      id="skip-to-main"
      href="#main-content"
      className="skip-link"
      onClick={handleSkip}
    >
      Skip to main content
    </a>
  );
}
