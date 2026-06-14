package org.example.Service;

import org.example.Entity.Book;
import org.example.Repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    // View books (ALL ROLES)
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // Add book (MANAGER)
    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    // Delete book (ADMIN)
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
}