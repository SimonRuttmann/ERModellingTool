package com.databaseModeling.Server.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class Controller {

    @GetMapping("/*")
    public String doSthm() {
        return "hallo";
    }

    @GetMapping("/index.html")
    public ModelAndView doSthm2() {
        ModelAndView m = new ModelAndView();
        m.setViewName("index.html");
        return m;
    }


}

