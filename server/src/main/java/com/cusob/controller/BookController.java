package com.cusob.controller;

import com.cusob.dto.BookDto;
import com.cusob.result.Result;
import com.cusob.service.BookService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/book")
public class BookController {

    @Autowired
    private BookService bookService;

    @ApiOperation("book a demo")
    @PostMapping("save")
    public Result bookDemo(@RequestBody BookDto bookDto){
        bookService.bookDemo(bookDto);
        return Result.ok();
    }
}
