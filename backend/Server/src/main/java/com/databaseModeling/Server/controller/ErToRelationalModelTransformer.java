package com.databaseModeling.Server.controller;

import com.databaseModeling.Server.model.ErTreeGraphFactory;
import com.databaseModeling.Server.model.TableDtoFactory;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;
import com.databaseModeling.Server.model.relationalModel.TableManager;
import com.databaseModeling.Server.services.transformation.implementation.*;
import com.databaseModeling.Server.services.transformation.interfaces.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

public class ErToRelationalModelTransformer {

    private final TableManager tableManager;
    private final ITableCreatorService tableCreatorService;
    private final ICardinalityResolverService cardinalityResolverService;
    private final ITransformAttributesService transformAttributesService;
    private final ITransformIsAStructureService transformIsAStructureService;
    private final ITransformWeakTypesService transformWeakTypesService;
    private final ITransformOneToOneService transformOneToOneService;
    private final ITransformManyToOneService transformManyToOneService;
    private final ITransformManyToManyService transformManyToManyService;

    public ErToRelationalModelTransformer(){
        this.tableManager = new TableManager();
        this.tableCreatorService = new TableCreatorService(tableManager);
        this.cardinalityResolverService = new CardinalityResolverService();
        this.transformAttributesService = new TransformAttributesService(tableManager);
        this.transformIsAStructureService = new TransformIsAStructureService(tableManager);
        this.transformWeakTypesService = new TransformWeakTypesService(tableManager);
        this.transformOneToOneService = new TransformOneToOneService(tableManager);
        this.transformManyToOneService = new TransformManyToOneService(tableManager);
        this.transformManyToManyService = new TransformManyToManyService(tableManager);
    }


    public RelationalModelDto transform(ConceptionalModelDto conceptionalModelDto){

        var graph = buildErGraph(conceptionalModelDto.getDrawBoardContent());

        executeTransformation(graph);

        return buildResult(conceptionalModelDto);
    }


    private Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> buildErGraph(ConceptionalModelDto.DrawBoardContent drawBoardContent){
        var graph = ErTreeGraphFactory.createGraph(drawBoardContent);

        tableCreatorService.createTables(graph);

        cardinalityResolverService.ResolveCardinalities(graph);

        return graph;
    }

    private void executeTransformation(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation>  erGraph){

        //Transform attributes by object references
        transformAttributesService.transformAttributes(erGraph);

        transformIsAStructureService.transformIsAStructures(erGraph);

        //Transform weak entities by object reference
        transformWeakTypesService.transformWeakTypes(erGraph);

        //Create and cascade primary keys of weak entities
        transformWeakTypesService.generateIdentifyingPrimaryKeys(erGraph);

        //Transform one to one
        transformOneToOneService.transformOneToOneRelations(erGraph);

        //Transform many to one
        transformManyToOneService.transformManyToOneRelations(erGraph);

        //Transform many to many
        transformManyToManyService.transformManyToManyRelations(erGraph);

        //Create and cascade primary keys of attributes
        transformAttributesService.generateAttributeTableKeys(erGraph);

    }

    private RelationalModelDto buildResult(ConceptionalModelDto conceptionalModelDto){

        var response = new RelationalModelDto();

        var content = new RelationalModelDto.DrawBoardContent();
        content.setTables(TableDtoFactory.createTableDto(tableManager.getTables()));

        response.setDrawBoardContent(content);
        response.setProjectName(conceptionalModelDto.getProjectName());
        response.setProjectVersion(conceptionalModelDto.getProjectVersion());
        response.setProjectType("relationalDiagram");


        AtomicLong connectionIdCounter = new AtomicLong();
        List<RelationalModelDto.DrawBoardContent.ConnectionDTO> connectionDTOList = new ArrayList<>();

        for (var table : content.getTables()){
            for (var column : table.getColumns()){
                if(column.isForeignKey() && column.getForeignKeyReferencedId() != null){
                    var connection = new RelationalModelDto.DrawBoardContent.ConnectionDTO();
                    var key = column.getId() + " --> " + column.getForeignKeyReferencedId() + connectionIdCounter.getAndIncrement();
                    connection.setId(key);
                    connection.setStart(column.getId());
                    connection.setEnd(column.getForeignKeyReferencedId());
                    connectionDTOList.add(connection);
                }
            }
        }

        content.setConnections(connectionDTOList);

        return response;
    }


}
