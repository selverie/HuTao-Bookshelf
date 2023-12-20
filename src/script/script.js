const booksKey = "books";
let books = JSON.parse(localStorage.getItem(booksKey)) || [];

function searchByTitle() {
  const searchInput = document.getElementById("searchTitle");
  const searchTerm = searchInput.value.toLowerCase();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm)
  );
  const unfinishedBooksContainer = document.getElementById("unfinishedBooks");
  const finishedBooksContainer = document.getElementById("finishedBooks");

  unfinishedBooksContainer.innerHTML = "";
  finishedBooksContainer.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      finishedBooksContainer.appendChild(bookElement);
    } else {
      unfinishedBooksContainer.appendChild(bookElement);
    }
  });
}

function saveBooks() {
  localStorage.setItem(booksKey, JSON.stringify(books));
}

function renderBooks() {
  const unfinishedBooksContainer = document.getElementById("unfinishedBooks");
  const finishedBooksContainer = document.getElementById("finishedBooks");

  unfinishedBooksContainer.innerHTML = "";
  finishedBooksContainer.innerHTML = "";

  books.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      finishedBooksContainer.appendChild(bookElement);
    } else {
      unfinishedBooksContainer.appendChild(bookElement);
    }
  });

  saveBooks();
}

function createBookElement(book) {
  const bookElement = document.createElement("div");
  bookElement.classList.add("book");

  const shelfType = book.isComplete ? "Belum Selesai" : "Selesai";

  bookElement.innerHTML = `
<span> <strong> ${book.title} </strong> <br> Penulis : ${book.author} <br> Tahun : ${book.year}</span>
<span>
  <button onclick="toggleShelf(${book.id})">${shelfType}</button>
  <button onclick="showEditBookForm(${book.id})">Edit</button>
  <button onclick="showDeleteConfirmation(${book.id})">Hapus</button>
</span>
`;

  return bookElement;
}

function toggleShelf(bookId) {
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books[index].isComplete = !books[index].isComplete;
    renderBooks();
  }
}

function showPopup(formId) {
  document.getElementById("backdrop").style.display = "block";

  const popups = document.querySelectorAll(".popup");

  popups.forEach((popup) => {
    popup.style.display = "none";
  });

  document.getElementById(formId).style.display = "block";
}

function addBook(event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const isComplete = document.getElementById("isComplete").checked;

  const newBook = {
    id: +new Date(),
    title,
    author,
    year: parseInt(year),
    isComplete,
  };

  books.push(newBook);
  renderBooks();

  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("year").value = "";
  document.getElementById("isComplete").checked = false;

  hidePopup("addBookForm");
}

function moveToUnfinishedShelf(bookId) {
  moveBookToShelf(bookId, false);
}

function moveToFinishedShelf(bookId) {
  moveBookToShelf(bookId, true);
}

function moveBookToShelf(bookId, isComplete) {
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books[index].isComplete = isComplete;
    renderBooks();
  }
}

function showDeleteConfirmation(bookId) {
  const deleteConfirmationPopup = document.getElementById("deleteConfirmation");
  deleteConfirmationPopup.style.display = "block";
  deleteConfirmationPopup.dataset.bookId = bookId;

  document.getElementById("backdrop").style.display = "block";
}

function deleteBookConfirmed() {
  const bookId = document.getElementById("deleteConfirmation").dataset.bookId;
  const index = books.findIndex((book) => book.id == bookId);
  if (index !== -1) {
    books.splice(index, 1);
    renderBooks();
    hidePopup("deleteConfirmation");
  }
}

function hidePopup(popupId) {
  document.getElementById("backdrop").style.display = "none";
  document.getElementById(popupId).style.display = "none";
}

function showEditBookForm(bookId) {
  const bookToEdit = books.find((book) => book.id === bookId);
  if (bookToEdit) {
    document.getElementById("editBookId").value = bookToEdit.id;
    document.getElementById("editTitle").value = bookToEdit.title;
    document.getElementById("editAuthor").value = bookToEdit.author;
    document.getElementById("editYear").value = bookToEdit.year;
    document.getElementById("editIsComplete").checked = bookToEdit.isComplete;
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("editBookForm").style.display = "block";
  }
}

function editBook(event) {
  event.preventDefault();

  const editBookId = document.getElementById("editBookId").value;
  const editTitle = document.getElementById("editTitle").value;
  const editAuthor = document.getElementById("editAuthor").value;
  const editYear = document.getElementById("editYear").value;
  const editIsComplete = document.getElementById("editIsComplete").checked;

  const index = books.findIndex((book) => book.id == editBookId);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      title: editTitle,
      author: editAuthor,
      year: parseInt(editYear),
      isComplete: editIsComplete,
    };

    renderBooks();

    document.getElementById("backdrop").style.display = "none";
    document.getElementById("editBookForm").style.display = "none";
  }
}

renderBooks();
