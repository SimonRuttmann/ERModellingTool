package com.databaseModeling.Server.controller;

import com.databaseModeling.Server.model.ErTreeGraphFactory;
import com.databaseModeling.Server.model.relationalModel.TableManager;
import com.databaseModeling.Server.services.transformation.implementation.CardinalityResolverService;
import com.databaseModeling.Server.services.transformation.implementation.TransformAttributesService;
import com.databaseModeling.Server.services.transformation.implementation.TransformWeakTypesService;
import com.databaseModeling.Server.services.transformation.interfaces.ICardinalityResolverService;
import com.databaseModeling.Server.model.ValidationResult;
import com.databaseModeling.Server.services.transformation.interfaces.ITransformAttributesService;
import com.databaseModeling.Server.services.transformation.interfaces.ITransformWeakTypesService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;

@RestController
public class Controller {

    @GetMapping("/test")
    @CrossOrigin(origins = {"http://localhost:8080", "http://localhost:3000"})
    public String doSthm() {
        System.out.println("received");
        return "hallo";
    }

    @GetMapping("/index.html")
    public ModelAndView doSthm2() {
        ModelAndView m = new ModelAndView();
        m.setViewName("index.html");
        return m;
    }


    @PostMapping("/convert/relational")
    @CrossOrigin(origins = {"http://localhost:8080", "http://localhost:3000"})
    public ConceptionalModelDto convertToRelational(
            @RequestBody ConceptionalModelDto type)
    {
        //Idee für später Node Abstrakte klasse implementiert INode, Edge Abstrakte klasse implementiert IEdge
        //Graph <N,E> mit extends Inode extends IEdge
        //Graph <Element, Association>


        var validationResult = new ValidationResult();

        //Create graph
        var graph = ErTreeGraphFactory.createGraph(type.getDrawBoardContent());

        //Resolve associations
        ICardinalityResolverService cardinalityResolverService = new CardinalityResolverService();
        cardinalityResolverService.ResolveCardinalities(graph, new ValidationResult());

        //TRANSFORMATION

        //Transform attributes by object references
        ITransformAttributesService transformAttributesService = new TransformAttributesService();
        transformAttributesService.transformAttributes(graph);

        var tables = TableManager.getTableRegister();
       // transformAttributesService.generateAttributeTableKeys(graph);
        var tablesNew = TableManager.getTableRegister();
            //Transform weak entities by object reference
            ITransformWeakTypesService weakTypesService = new TransformWeakTypesService();
            weakTypesService.transformWeakTypes(graph);

                //Transform one to one

                //Transform one to 0,one

                //Transform 0,one to 0,one

                //Transform many to one

                //Transform many to many


            //Create and cascade primary keys of weak entities
            weakTypesService.generateIdentifyingPrimaryKeys(graph);

        //Create and cascade primary keys of attributes
        transformAttributesService.generateAttributeTableKeys(graph);




        return null;
    }

}

