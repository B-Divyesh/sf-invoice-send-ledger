const savedTheme = localStorage.getItem('sdl-theme');
if (savedTheme === 'light' || savedTheme === 'dark') document.documentElement.dataset.theme = savedTheme;
document.querySelector('#theme-button')?.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'light' : 'dark';
  localStorage.setItem('sdl-theme', dark ? 'light' : 'dark');
});
addEventListener('DOMContentLoaded', () => {
  document.querySelector('h1')?.focus();
  const announcer = document.querySelector('#route-announcer');
  if (announcer) announcer.textContent = `${document.title} loaded.`;
});
