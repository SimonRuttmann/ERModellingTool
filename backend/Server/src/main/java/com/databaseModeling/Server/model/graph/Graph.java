package com.databaseModeling.Server.model.graph;

import java.util.ArrayList;
import java.util.List;

//Grund für das einsetzen von generics
//1. Wiederverwendbarkeit aufgrund von Flexibilität
//2. Injezieren von weiteren Datenstrukturen (hier tree in node)
public class Graph<NodeData, EdgeData> {
    public List<GraphNode<NodeData, EdgeData>> graphNodes = new ArrayList<>();
    public List<GraphEdge<NodeData, EdgeData>> graphEdges = new ArrayList<>();
    public void addNode(String id, NodeData nodeData){
        GraphNode<NodeData, EdgeData> node = new GraphNode<>(id, nodeData);
        graphNodes.add(node);
    }
    public void addEdge(String id, String sourceId, String destinationId, EdgeData edgeData){

        GraphEdge<NodeData, EdgeData> edge = new GraphEdge<>(id, edgeData);

        var source = graphNodes.stream().filter(graphNodes -> graphNodes.getId().equals(sourceId)).findFirst().orElseThrow();
        var destination = graphNodes.stream().filter(graphNodes -> graphNodes.getId().equals(destinationId)).findFirst().orElseThrow();

        edge.setSource(source);
        edge.getSource().addEdge(edge);

        edge.setDestination(destination);
        edge.getDestination().addEdge(edge);

        graphEdges.add(edge);

    }

}
