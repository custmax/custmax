package com.cusob.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.dto.BookDto;
import com.cusob.entity.Book;

public interface BookService extends IService<Book> {

    /**
     * book a demo
     * @param bookDto
     */
    void bookDemo(BookDto bookDto);

    /**
     * email Notify
     * @param book
     */
    void emailNotify(Book book);
}
