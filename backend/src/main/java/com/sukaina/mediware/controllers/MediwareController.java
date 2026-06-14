package com.sukaina.mediware.controllers;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class MediwareController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, Mediware!";
    }

}
