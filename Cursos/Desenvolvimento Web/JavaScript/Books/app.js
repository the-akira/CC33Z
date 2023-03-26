let books = JSON.parse(localStorage.getItem('books')) || [];

const bookList = document.getElementById('book-list');

let myLibrary = [];

function Book(id, title, author, cover) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.cover = cover;
}

function addBookToLibrary(title, author, cover) {
  let book = new Book(Date.now(), title, author, cover);
  myLibrary.unshift(book);
  localStorage.setItem("library", JSON.stringify(myLibrary));
  renderBooks();
}

function renderBooks(books = myLibrary, pageIndex = 0, pageSize = 3) {
  let bookList = document.getElementById("book-list");
  bookList.innerHTML = "";

  let startIndex = pageIndex * pageSize;
  let endIndex = startIndex + pageSize;
  let pageBooks = books.slice(startIndex, endIndex);

  let h1 = document.querySelector(".main-title-books")
  h1.innerHTML = `Books (${myLibrary.length})`;

  for (let i = 0; i < pageBooks.length; i++) {
    let book = pageBooks[i];
    let bookDiv = document.createElement("div");
    bookDiv.classList.add("book");

    let title = document.createElement("h2");
    title.textContent = book.title;
    bookDiv.appendChild(title);

    let author = document.createElement("p");
    author.innerHTML = `<b>Author</b>: ${book.author}`;
    bookDiv.appendChild(author);

    let cover = document.createElement("img");
    cover.src = book.cover;
    bookDiv.appendChild(cover);

    let editButton = document.createElement("button");
    editButton.textContent = "Edit";

    editButton.addEventListener("click", () => {
      showEditForm(book, pageIndex, pageSize);
    });
    bookDiv.appendChild(editButton);
    editButton.classList.add("edit-button");

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");

    deleteButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to remove the book?") == true) {
        deleteBook(book.id, pageIndex, pageSize);
      }
    });
    bookDiv.appendChild(deleteButton);

    bookList.appendChild(bookDiv);
  }

  paginate(books, pageIndex, pageSize);
}

function deleteBook(id, pageIndex, pageSize) {
  myLibrary = myLibrary.filter((book) => book.id !== id);
  localStorage.setItem("library", JSON.stringify(myLibrary));
  let books = myLibrary;
  let pageCount = Math.ceil(books.length / pageSize);
  let maxPageIndex = Math.max(pageCount - 1, 0);

  if (pageIndex > maxPageIndex) {
    pageIndex = maxPageIndex;
  }

  renderBooks(books, pageIndex, pageSize);
}

function searchBooks() {
  let searchInput = document.getElementById("search-input");
  let searchTerm = searchInput.value.toLowerCase();

  let filteredBooks = myLibrary.filter((book) => {
    return (
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm)
    );
  });

  renderBooks(filteredBooks);
}

let searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", searchBooks);

function paginate(books, pageIndex = 0, pageSize = 3, maxPages = 5) {
  let pageCount = Math.ceil(books.length / pageSize);
  let paginationDiv = document.getElementById("pagination");
  paginationDiv.innerHTML = "";

  let startIndex = Math.max(0, pageIndex - Math.floor(maxPages / 2));
  let endIndex = Math.min(pageCount, startIndex + maxPages);

  if (startIndex > 0) {
    let firstPageLink = document.createElement("a");
    firstPageLink.textContent = "First";
    firstPageLink.addEventListener("click", () => {
      renderBooks(books, 0, pageSize);
    });
    paginationDiv.appendChild(firstPageLink);
  }

  for (let i = startIndex; i < endIndex; i++) {
    let pageLink = document.createElement("a");
    pageLink.textContent = i + 1;
    pageLink.addEventListener("click", () => {
      renderBooks(books, i, pageSize);
    });

    if (i === pageIndex) {
      pageLink.classList.add("active");
    }

    paginationDiv.appendChild(pageLink);
  }

  if (endIndex < pageCount) {
    let lastPageLink = document.createElement("a");
    lastPageLink.textContent = "Last";
    lastPageLink.addEventListener("click", () => {
      renderBooks(books, pageCount - 1, pageSize);
    });
    paginationDiv.appendChild(lastPageLink);
  }
}

let form = document.getElementById("book-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  let title = form.elements.title.value;
  let author = form.elements.author.value;
  let cover = form.elements.cover.value;
  addBookToLibrary(title, author, cover);
  form.reset();
});

if (localStorage.getItem("library")) {
  myLibrary = JSON.parse(localStorage.getItem("library"));
  renderBooks();
}

let exportButton = document.getElementById("export-button");
exportButton.addEventListener("click", exportBooks);

function exportBooks() {
  let csvContent = "data:text/csv;charset=utf-8,\n";

  csvContent += "Title,Author,Cover\n";

  myLibrary.forEach((book) => {
    csvContent += `${book.title},${book.author},${book.cover}\n`;
  });

  let csvBlob = new Blob([csvContent], { type: "text/csv" });
  let csvURL = URL.createObjectURL(csvBlob);

  let link = document.createElement("a");
  link.href = csvURL;
  link.download = "books.csv";
  document.body.appendChild(link);
  link.click();

  URL.revokeObjectURL(csvURL);
}

function exportBooksAsJSON() {
  let dataStr = JSON.stringify(myLibrary);
  let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

  let exportFileDefaultName = 'books.json';

  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

function exportBooksAsYAML() {
  let dataStr = jsyaml.dump(myLibrary);
  let dataUri = 'data:application/yaml;charset=utf-8,' + encodeURIComponent(dataStr);

  let exportFileDefaultName = 'books.yaml';

  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

function editBook(id, title, author, cover) {
  let book = myLibrary.find((book) => book.id === id);
  if (book) {
    book.title = title;
    book.author = author;
    book.cover = cover;
    localStorage.setItem("library", JSON.stringify(myLibrary));
  }
}

let isEditing = false;

function showEditForm(book, pageIndex, pageSize) {
  if (isEditing) {
    return;
  }

  isEditing = true;

  let form = document.createElement("form");

  let header = document.createElement("h2");
  header.innerHTML = "Edit Book";
  form.appendChild(header);

  let titleLabel = document.createElement("label");
  titleLabel.innerHTML = "Title:";
  form.appendChild(titleLabel);

  let titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.name = "title";
  titleInput.value = book.title;
  form.appendChild(titleInput);

  let authorLabel = document.createElement("label");
  authorLabel.innerHTML = "Author:";
  form.appendChild(authorLabel);

  let authorInput = document.createElement("input");
  authorInput.type = "text";
  authorInput.name = "author";
  authorInput.value = book.author;
  form.appendChild(authorInput);

  let coverLabel = document.createElement("label");
  coverLabel.innerHTML = "Cover URL:";
  form.appendChild(coverLabel);

  let coverInput = document.createElement("input");
  coverInput.type = "text";
  coverInput.name = "cover";
  coverInput.value = book.cover;
  form.appendChild(coverInput);

  let saveButton = document.createElement("button");
  saveButton.type = "submit";
  saveButton.textContent = "Save";
  saveButton.classList.add("save-button");
  form.appendChild(saveButton);

  let cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.classList.add("cancel-button");
  form.appendChild(cancelButton);

  let container = document.createElement("div");
  container.appendChild(form);

  let overlay = document.createElement("div");
  overlay.classList.add("overlay");
  overlay.appendChild(container);

  const editForm = document.getElementById("edit-form");
  editForm.appendChild(overlay);

  editForm.scrollIntoView();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let title = titleInput.value.trim();
    let author = authorInput.value.trim();
    let cover = coverInput.value.trim();
    if (title && author && cover) {
      editBook(book.id, title, author, cover);

      myLibrary = myLibrary.filter((book) => book.id == book.id);
      let books = myLibrary;
      let pageCount = Math.ceil(books.length / pageSize);
      let maxPageIndex = Math.max(pageCount - 1, 0);

      if (pageIndex > maxPageIndex) {
        pageIndex = maxPageIndex;
      }

      renderBooks(books, pageIndex, pageSize);
      overlay.remove();
      isEditing = false;
    }
  });

  cancelButton.addEventListener("click", () => {
    overlay.remove();
    isEditing = false;
  });
}