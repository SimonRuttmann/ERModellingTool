package com.databaseModeling.Server.controller;

import com.databaseModeling.Server.dto.ConceptionalModelDto;
import com.databaseModeling.Server.dto.RelationalModelDto;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class Controller {


    @GetMapping("/index.html")
    @CrossOrigin(origins = {"http://localhost:8080", "http://localhost:3000"})
    public ModelAndView index() {

        ModelAndView m = new ModelAndView();
        m.setViewName("index.html");

        return m;
    }


    /**
     * Endpoint to convert an entity relationship model to a relational model
     * @param type The entity relationship model
     * @return The relational model
     */
    @PostMapping("/convert/relational")
    @CrossOrigin(origins = {"http://localhost:8080", "http://localhost:3000"})
    public RelationalModelDto convertToRelational(
            @RequestBody ConceptionalModelDto type)
    {

        System.out.println(type);

        ErToRelationalModelTransformer transformer = new ErToRelationalModelTransformer();
        return transformer.transform(type);

    }

    /**
     * Endpoint to generate sql from a relational model
     * @param type The relational model
     * @return The generated sql
     */
    @PostMapping("/convert/sql")
    @CrossOrigin(origins = {"http://localhost:8080", "http://localhost:3000"})
    public String convertToSql(
            @RequestBody RelationalModelDto type)
    {

        System.out.println(type);

        RelationalModelToSqlTranslator sqlTranslator = new RelationalModelToSqlTranslator();
        return sqlTranslator.translate(type);
    }


}

