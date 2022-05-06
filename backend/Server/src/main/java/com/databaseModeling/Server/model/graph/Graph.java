package com.databaseModeling.Server.model.graph;

import java.util.ArrayList;
import java.util.List;

//Grund für das einsetzen von generics
//1. Wiederverwendbarkeit aufgrund von Flexibilität
//2. Injezieren von weiteren Datenstrukturen (hier tree in node)
public class Graph<N, E> {
    public List<GraphNode<N,E>> graphNodes = new ArrayList<>();

    public void addNode(String id, N nodeData){
        GraphNode<N,E> node = new GraphNode<>(id, nodeData);
        graphNodes.add(node);
    }
    public void addEdge(String id, String sourceId, String destinationId, E edgeData){

        GraphEdge<N,E> edge = new GraphEdge<>(id, edgeData);

        var source = graphNodes.stream().filter(graphNodes -> graphNodes.getId().equals(sourceId)).findFirst().orElseThrow();
        var destination = graphNodes.stream().filter(graphNodes -> graphNodes.getId().equals(destinationId)).findFirst().orElseThrow();

        edge.setSource(source);
        edge.getSource().addEdge(edge);

        edge.setDestination(destination);
        edge.getDestination().addEdge(edge);

    }

}
