package com.databaseModeling.Server.model.graph;

//T = DataNode, E = DateEdge
public class GraphEdge<NodeData, EdgeData> {

    private EdgeData data;
    private final String id;

    private GraphNode<NodeData, EdgeData> source;
    private GraphNode<NodeData, EdgeData> destination;

    public GraphEdge(String id, EdgeData data) {
        this.id = id;
        this.data = data;
    }


    public GraphNode<NodeData, EdgeData> getSource() {
        return source;
    }

    public void setSource(GraphNode<NodeData, EdgeData> source) {
        this.source = source;
    }

    public GraphNode<NodeData, EdgeData> getDestination() {
        return destination;
    }

    public void setDestination(GraphNode<NodeData, EdgeData> destination) {
        this.destination = destination;
    }

}
