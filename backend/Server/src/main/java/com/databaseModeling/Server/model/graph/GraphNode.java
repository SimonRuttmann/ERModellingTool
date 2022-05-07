package com.databaseModeling.Server.model.graph;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

//T = DataNode, E = DateEdge
public class GraphNode<NodeData, EdgeData> {

    private final String id;
    public String getId() { return id; }


    private final NodeData data;
    public NodeData getNodeData(){return data;}


    private final List<GraphEdge<NodeData, EdgeData>> graphEdges = new ArrayList<>();

    public int getDegree() {return graphEdges.size();}
    public List<GraphEdge<NodeData, EdgeData>> getEdges() { return graphEdges; }

    public void addEdge(GraphEdge<NodeData, EdgeData> graphEdge){graphEdges.add(graphEdge);}
    public void removeEdge(GraphEdge<NodeData, EdgeData> graphEdge){graphEdges.remove(graphEdge);}

    public List<GraphEdge<NodeData, EdgeData>> getSourceEdges(){ return graphEdges.stream().filter(graphEdge -> graphEdge.getSource().equals(this)).collect(Collectors.toList());}
    public List<GraphEdge<NodeData, EdgeData>> getDestinationEdges(){ return graphEdges.stream().filter(graphEdge -> graphEdge.getDestination().equals(this)).collect(Collectors.toList());}


    public GraphNode(String id, NodeData data) {
        this.id = id;
        this.data = data;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof GraphNode)) return false;
        GraphNode<?,?> graphNode = (GraphNode<?,?>) o;
        return Objects.equals(id, graphNode.id);
    }


    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}