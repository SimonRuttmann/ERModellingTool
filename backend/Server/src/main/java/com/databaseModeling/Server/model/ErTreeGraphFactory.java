package com.databaseModeling.Server.model;

import com.databaseModeling.Server.controller.ConceptionalModelDto;
import com.databaseModeling.Server.model.graph.Graph;
import com.databaseModeling.Server.model.tree.TreeNode;
import com.mongodb.assertions.Assertions;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ErTreeGraphFactory {

    public static Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> createGraph(
            ConceptionalModelDto.DrawBoardContent drawBoardContent)
    {

        Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph = new Graph<>();

        addNode(erGraph, drawBoardContent);

        addEdges(erGraph, drawBoardContent);

        addTreeElements(erGraph, drawBoardContent);

        return erGraph;
    }



    private static void addNode(
            Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph,
            ConceptionalModelDto.DrawBoardContent drawBoardContent)
    {

        drawBoardContent.
                getElements().
                stream().
                filter(element -> element.getErType().isNode).
                forEach(node ->  erGraph.addNode(node.getId(),
                        new TreeNode<>(node.getId(), new EntityRelationElement(node.getErType(), new ElementMetaInformation()))));

    }

    private static void addEdges(
            Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph,
            ConceptionalModelDto.DrawBoardContent drawBoardContent)
    {

         drawBoardContent.
                getConnections().
                stream().
                filter(connection ->
                        drawBoardContent.getElements().stream().anyMatch(graphNode -> graphNode.getId().equals(connection.getStart())) &&
                        drawBoardContent.getElements().stream().anyMatch(graphNode -> graphNode.getId().equals(connection.getEnd()))).
                forEach(edge -> erGraph.addEdge(edge.getId(), edge.getStart(), edge.getEnd(),
                                new EntityRelationAssociation(edge.getMin(), edge.getMax(), new ElementMetaInformation())));

    }

    private static void addTreeElements(
            Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph,
            ConceptionalModelDto.DrawBoardContent drawBoardContent)
    {

        //Create attributes
        var attributes = drawBoardContent.
                getElements().
                stream().
                filter(element -> ! element.getErType().isNode).
                map(attribute -> new TreeNode<>(attribute.getId(), new EntityRelationElement(attribute.getErType(), new ElementMetaInformation()))).
                collect(Collectors.toList());


        //Resolve attribute connectors
        var attributeConnectors = drawBoardContent.
                getConnections().
                stream().
                filter(connection ->
                        drawBoardContent.getElements().stream().noneMatch(graphNode -> graphNode.getId().equals(connection.getStart())) ||
                        drawBoardContent.getElements().stream().noneMatch(graphNode -> graphNode.getId().equals(connection.getEnd()))).collect(Collectors.toList());

        //For each node order and add the tree
        for(var root : erGraph.graphNodes) {
            orderTreeRecursive(root.getData(), attributeConnectors, attributes);
        }

        //TODO remove this
        Assertions.assertTrue(attributeConnectors.isEmpty());

    }

    /**
     * Recursive traversal of the tree,
     * starting at the root, identifying the children
     * and starts recursion step with children
     * @param parent The current root element of the tree
     * @param connectors The remaining connections
     * @param treeNodes All tree nodes TODO optimization possible!
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
            if(connector.getStart().equals(parent.getId()) || connector.getEnd().equals(parent.getId())){

                //Resolve child and add connection

                var child = treeNodes.stream().filter(treeNode -> treeNode.getId().equals(parent.getId())).findFirst().orElseThrow();
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


}
