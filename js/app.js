// Book Class: Represent a book
class Book {
    constructor(title, author, publicationDate, isbn) {
        this.title = title;
        this.author = author;
        this.publicationDate = publicationDate;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI tasks
class UI {
    static displayBooks() {
        const bookList = Store.getBooks();
        bookList.forEach(book => UI.addBookToList(book));
    }
    static addBookToList(book) {
        const bookList = document.querySelector('#book-list');
        const tr = document.createElement('tr');
        tr.classList.add('list-row');
        tr.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.publicationDate}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete-button delete">X</a></td>
        `;
        bookList.appendChild(tr);
    }
    static removeBook(element) {
        if(element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
        }
    }
    static displayAlert(type, msg) {
        const form = document.querySelector('#book-form');
        const div = document.createElement('div');
        div.classList.add(type);
        div.innerHTML = `
            <p>${msg}</p>
        `;
        form.parentElement.insertBefore(div, form);
        setTimeout(() => {
            form.parentElement.removeChild(div);
        }, 3000);
    }
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#date').value = '';
        document.querySelector('#isbn').value = '';
    }
}
// Store Class: Handle storing App data
class Store {
    static getBooks() {
        let bookList;
        if (localStorage.getItem('bookList') === null) {
            bookList = [];
        } else {
            bookList = JSON.parse(localStorage.getItem('bookList'));
        }
        return bookList;
    }
    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('bookList', JSON.stringify(books));
    }
    static removeBook(isbn) {
        const books = Store.getBooks();
        let newBooks = books.filter((book) => book.isbn !== isbn);
        localStorage.setItem('bookList', JSON.stringify(newBooks));
    }
}

// Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add book to list
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent default behaviour of form submitting
    e.preventDefault();
    // Collecting data from inputs
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const publicationDate = document.querySelector('#date').value;
    const isbn = document.querySelector('#isbn').value;
    // Validate
    const books = Store.getBooks();
    let isbnUnique = true;
    books.forEach((book) => {
       if (book.isbn === isbn) {
           isbnUnique = false;
       }
    });
    if (title === '' || author === '' || publicationDate === '' || isbn === '') {
        UI.displayAlert('error', 'Please fill all fields before submitting!');
    } else if (!isbnUnique) {
        UI.displayAlert('error', 'ISBN number already exist on list. Input correct value and try again.');
    } else {
        // Instantiate a book
        const book = new Book(title, author, publicationDate, isbn);
        // Add book to list
        UI.addBookToList(book);
        // Add book to Store
        Store.addBook(book);
        // Show alert
        UI.displayAlert('success', 'Book successfully added to list.');
        // Clear input fields
        UI.clearFields();
    }
});

// Event: Remove book from list
document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.removeBook(e.target);
    UI.displayAlert('success', 'Book successfully removed from list.');
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});
