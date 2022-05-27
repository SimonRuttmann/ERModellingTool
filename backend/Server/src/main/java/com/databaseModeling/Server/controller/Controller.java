package com.databaseModeling.Server.controller;

import com.databaseModeling.Server.model.ErTreeGraphFactory;
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
        System.out.println(type.getProjectType());
        System.out.println(type.getProjectName());
        System.out.println(type.getProjectVersion());

        ConceptionalModelDto conceptionalModelDto = new ConceptionalModelDto();
        conceptionalModelDto.setProjectName("projectNameValue");
        conceptionalModelDto.setProjectType("typeValue");
        conceptionalModelDto.setProjectVersion("1.1.1.1");

        ConceptionalModelDto.DrawBoardContent drawBoardContent = new ConceptionalModelDto.DrawBoardContent();
        ConceptionalModelDto.DrawBoardContent.Element element0 = new ConceptionalModelDto.DrawBoardContent.Element();
        ConceptionalModelDto.DrawBoardContent.Element element1 = new ConceptionalModelDto.DrawBoardContent.Element();
        ConceptionalModelDto.DrawBoardContent.Element element2 = new ConceptionalModelDto.DrawBoardContent.Element();
        ConceptionalModelDto.DrawBoardContent.Connection connection0 = new ConceptionalModelDto.DrawBoardContent.Connection();
        ConceptionalModelDto.DrawBoardContent.Connection connection1 = new ConceptionalModelDto.DrawBoardContent.Connection();
        ConceptionalModelDto.DrawBoardContent.Connection connection2 = new ConceptionalModelDto.DrawBoardContent.Connection();

        element0.setId("Id0");
        element0.setDisplayName("Element0");
        element0.setX("500");
        element0.setY("500");
        element0.setHeight("100");
        element0.setWidth("200");

        element1.setId("Id1");
        element1.setDisplayName("Element1");
        element1.setX("500");
        element1.setY("500");
        element1.setHeight("100");
        element1.setWidth("200");

        element2.setId("Id2");
        element2.setDisplayName("Element2");
        element2.setX("500");
        element2.setY("500");
        element2.setHeight("100");
        element2.setWidth("200");

        connection0.setId("IdCon0");
        connection0.setStart("StartId");
        connection0.setEnd("EndId");
        connection0.setMin("1");
        connection0.setMax("N");

        connection1.setId("IdCon1");
        connection1.setStart("StartId");
        connection1.setEnd("EndId");
        connection1.setMin("1");
        connection1.setMax("N");

        connection2.setId("IdCon2");
        connection2.setStart("StartId");
        connection2.setEnd("EndId");
        connection2.setMin("1");
        connection2.setMax("N");

        var elements = new ArrayList<ConceptionalModelDto.DrawBoardContent.Element>();
        elements.add(element0);
        elements.add(element1);
        elements.add(element2);

        var connections = new ArrayList<ConceptionalModelDto.DrawBoardContent.Connection>();
        connections.add(connection0);
        connections.add(connection1);
        connections.add(connection2);

        drawBoardContent.setElements(elements);
        drawBoardContent.setConnections(connections);

        conceptionalModelDto.setDrawBoardContent(drawBoardContent);

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




        return conceptionalModelDto;
    }

}

