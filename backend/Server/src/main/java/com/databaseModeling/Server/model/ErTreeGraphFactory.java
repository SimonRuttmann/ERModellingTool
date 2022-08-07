package com.databaseModeling.Server.model;

import com.databaseModeling.Server.dto.ConceptionalModelDto;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


/**
 * This class is responsible for the creation of an Er graph
 */
public class ErTreeGraphFactory {

    /**
     * Creates a graph based on the given dto
     *
     * The graph will contain nodes for entities, relations, isAs and weak types
     * Each node is also the root of a tree containing all attributes
     *
     * @param drawBoardContent Based on the information of this object the graph will be created
     * @return A graph representation of the entity relationship diagram
     *
     */
    public static Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> createGraph(
            ConceptionalModelDto.DrawBoardContent drawBoardContent)
    {

        Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph = new Graph<>();

        addNode(erGraph, drawBoardContent);

        addEdges(erGraph, drawBoardContent);

        addTreeElements(erGraph, drawBoardContent);

        return erGraph;
    }

    /**
     * Adds a node to the graph for each non attribute Er element in the draw board content
     */
    private static void addNode(
            Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph,
            ConceptionalModelDto.DrawBoardContent drawBoardContent)
    {

        drawBoardContent.
                getElements().
                stream().
                filter(element -> element.getErType().isNode).
                forEach(node -> erGraph.addNode(
                                    node.getId(),
                                    new TreeNode<>(node.getId(), createNodeData(node))));
    }

    /**
     * Adds an edge to the graph for each connection between non attribute elements in the draw board content
     */
    private static void addEdges(
            Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph,
            ConceptionalModelDto.DrawBoardContent drawBoardContent)
    {
         drawBoardContent.
                getConnections().
                stream().
                filter(connection ->
                        erGraph.graphNodes.stream().anyMatch(graphNode -> graphNode.getId().equals(connection.getStart())) &&
                        erGraph.graphNodes.stream().anyMatch(graphNode -> graphNode.getId().equals(connection.getEnd()))).
                forEach(edge -> erGraph.addEdge(
                                    edge.getId(),
                                    edge.getStart(),
                                    edge.getEnd(),
                                    createEdgeData(edge)));

    }

    /**
     * Adds a tree node to the graph for each attribute Er element in the draw board content
     * Also handles the child - parent referenced between created tree nodes based on the
     * attribute connections in the draw board content
     */
    private static void addTreeElements(
            Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph,
            ConceptionalModelDto.DrawBoardContent drawBoardContent)
    {

        //Create attributes
        var attributes = drawBoardContent.
                getElements().
                stream().
                filter(element -> ! element.getErType().isNode).
                map(attribute ->
                        new TreeNode<>(
                                attribute.getId(),
                                createNodeData(attribute))).

                collect(Collectors.toList());


        //Resolve attribute connectors by checking if the start or end point
        //of the connection is not connected to any graph node
        var attributeConnectors = drawBoardContent.
                getConnections().
                stream().
                filter(connection ->
                        erGraph.graphNodes.stream().noneMatch(graphNode -> graphNode.getId().equals(connection.getStart())) ||
                        erGraph.graphNodes.stream().noneMatch(graphNode -> graphNode.getId().equals(connection.getEnd()))).collect(Collectors.toList());

        //For each node order and add the tree
        for(var root : erGraph.graphNodes) {
            orderTreeRecursive(root.getNodeData(), attributeConnectors, attributes);
        }


    }

    /**
     * Recursive traversal of the tree,
     * starting at the root, identifying the children
     * and starts recursion step with children
     * @param parent The current root element of the tree
     * @param connectors The remaining connections
     * @param treeNodes All tree nodes
     */
    private static void orderTreeRecursive(
            TreeNode<EntityRelationElement> parent,
            List<ConceptionalModelDto.DrawBoardContent.Connection> connectors,
            List<TreeNode<EntityRelationElement>> treeNodes)
    {

        var children = new ArrayList<TreeNode<EntityRelationElement>>();
        var usedConnections = new ArrayList<ConceptionalModelDto.DrawBoardContent.Connection>();

        for (var connector : connectors) {

            //Find connectors which are connected to parent
            TreeNode<EntityRelationElement> child = null;
            //If the connector start is the entity (parent), then the end is the attribute (child)
            if(connector.getStart().equals(parent.getId()) ){
                 child = treeNodes.stream().filter(treeNode -> treeNode.getId().equals(connector.getEnd())).findFirst().orElseThrow();
            }
            if(connector.getEnd().equals(parent.getId())) {
                child = treeNodes.stream().filter(treeNode -> treeNode.getId().equals(connector.getStart())).findFirst().orElseThrow();
            }

            //Resolve child and add connection

            if(child != null) {
                children.add(child);

                parent.addChild(child);
                child.setParent(parent);

                usedConnections.add(connector);
            }

        }

        //Remove used connection to avoid endless parent <-> child circle and increase performance
        connectors.removeAll(usedConnections);

        for (var child : children){
            orderTreeRecursive(child, connectors, treeNodes);
        }

        //End recursion
    }


    private static EntityRelationElement createNodeData(ConceptionalModelDto.DrawBoardContent.Element element){
        var metaInformation = ElementMetaInformationFactory.createElementMetaInformation(element);

        return new EntityRelationElement(
                element.getErType(),
                element.getOwningSide(),
                metaInformation);
    }

    private static EntityRelationAssociation createEdgeData(ConceptionalModelDto.DrawBoardContent.Connection connection){
        return new EntityRelationAssociation(
                connection.getMin(),
                connection.getMax(),
                connection.getConnectionType());
    }


}
