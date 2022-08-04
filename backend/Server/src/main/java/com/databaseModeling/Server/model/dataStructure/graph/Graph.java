package com.databaseModeling.Server.model.dataStructure.graph;

import java.util.ArrayList;
import java.util.List;

/**
 * Implementation of a generic not directed graph, which can hold data of any kind in its edges and nodes
 * @param <NodeData> The type of data hold in the nodes of the graph
 * @param <EdgeData> The type of data hold in the edges of the graph
 * @see GraphNode
 * @see GraphEdge
 */
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
