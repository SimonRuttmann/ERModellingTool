package com.databaseModeling.Server.model.dataStructure.graph;

/**
 * The representation of an edge in a graph, which can hold any kind of data
 * @param <NodeData> The type of data hold in the nodes this edge connects
 * @param <EdgeData> The type of data hold in this edge
 * @see Graph
 */
public class GraphEdge<NodeData, EdgeData> {

    private final String id;
    public String getId() {return id;}

    private GraphNode<NodeData, EdgeData> source;
    public GraphNode<NodeData, EdgeData> getSource() {return source;}
    public void setSource(GraphNode<NodeData, EdgeData> source) {this.source = source;}

    private GraphNode<NodeData, EdgeData> destination;
    public GraphNode<NodeData, EdgeData> getDestination() {return destination;}
    public void setDestination(GraphNode<NodeData, EdgeData> destination) {this.destination = destination;}

    private EdgeData data;
    public EdgeData getEdgeData() {return data;}
    public void setEdgeData(EdgeData data) {this.data = data;}

    public GraphEdge(String id, EdgeData data) {
        this.id = id;
        this.data = data;
    }

    public GraphNode<NodeData, EdgeData> getOtherSide(GraphNode<NodeData, EdgeData> side) {
        if(destination.equals(side)) return source;
        return destination;
    }

}
