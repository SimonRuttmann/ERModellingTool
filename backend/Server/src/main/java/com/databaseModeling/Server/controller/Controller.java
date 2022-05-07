package com.databaseModeling.Server.controller;

import com.databaseModeling.Server.model.ErTreeGraphFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;

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

    @PostMapping("/convert/relational")
    public ConceptionalModelDto convertToRelational(
            @RequestBody ConceptionalModelDto type)
    {
        //Idee für später Node Abstrakte klasse implementiert INode, Edge Abstrakte klasse implementiert IEdge
        //Graph <N,E> mit extends Inode extends IEdge
        //Graph <Element, Association>
        System.out.println(type.getType());
        System.out.println(type.getProjectName());
        System.out.println(type.getProjectVersion());

        ConceptionalModelDto conceptionalModelDto = new ConceptionalModelDto();
        conceptionalModelDto.setProjectName("projectNameValue");
        conceptionalModelDto.setType("typeValue");
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
        element0.setXPos("500");
        element0.setYPos("500");
        element0.setHeight("100");
        element0.setWidth("200");

        element1.setId("Id1");
        element1.setDisplayName("Element1");
        element1.setXPos("500");
        element1.setYPos("500");
        element1.setHeight("100");
        element1.setWidth("200");

        element2.setId("Id2");
        element2.setDisplayName("Element2");
        element2.setXPos("500");
        element2.setYPos("500");
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

        var graph = ErTreeGraphFactory.createGraph(drawBoardContent);
        return conceptionalModelDto;
    }

}

