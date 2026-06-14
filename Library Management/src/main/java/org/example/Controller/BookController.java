package org.example.Controller;

import org.example.Entity.Book;
import org.example.Service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    private BookService bookService;

    // USER, MANAGER, ADMIN
    @GetMapping("/view")
    @PreAuthorize("hasAnyRole('USER','MANAGER','ADMIN')")
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    // MANAGER only
    @PostMapping("/add")
    @PreAuthorize("hasRole('MANAGER')")
    public Book addBook(@RequestBody Book book) {
        return bookService.addBook(book);
    }

    // ADMIN only
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return "Book deleted successfully";
    }
}