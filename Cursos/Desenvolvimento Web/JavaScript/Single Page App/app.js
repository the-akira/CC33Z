function showPage(pageId) {
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.style.display = 'none');

  // Show the selected page
  const page = document.getElementById(pageId);
  page.style.display = 'block';
}

// Show the home page by default
showPage('home');