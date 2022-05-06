package com.databaseModeling.Server.model.graph;

//T = DataNode, E = DateEdge
public class GraphEdge<T, D> {

    private D data;
    private final String id;

    private GraphNode<T,D> source;
    private GraphNode<T,D> destination;

    public GraphEdge(String id, D data) {
        this.id = id;
        this.data = data;
    }


    public GraphNode<T,D> getSource() {
        return source;
    }

    public void setSource(GraphNode<T,D> source) {
        this.source = source;
    }

    public GraphNode<T,D> getDestination() {
        return destination;
    }

    public void setDestination(GraphNode<T,D> destination) {
        this.destination = destination;
    }

}
