package com.databaseModeling.Server.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class Node {

    private final String id;
    private final ErType erType;
    private final List<Edge> edges = new ArrayList<>();
    private final ElementMetaInformation elementMetaInformation;

    public int getDegree() {
        return edges.size();
    }

    public String getId() { return id; }

    public ErType getErType() { return erType; }

    public ElementMetaInformation getElementMetaInformation() {
        return elementMetaInformation;
    }

    public List<Edge> getEdges() { return edges; }
    public void addEdge(Edge edge){
        edges.add(edge);
    }

    public void removeEdge(Edge edge){
        edges.remove(edge);
    }

    public List<Edge> getSourceEdges(){
        return edges.stream().filter(edge -> edge.getSource().equals(this)).collect(Collectors.toList());
    }

    public List<Edge> getDestinationEdges(){
        return edges.stream().filter(edge -> edge.getDestination().equals(this)).collect(Collectors.toList());
    }


    public Node(String id, ErType erType, ElementMetaInformation elementMetaInformation) {
        this.id = id;
        this.erType = erType;
        this.elementMetaInformation = elementMetaInformation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Node)) return false;
        Node node = (Node) o;
        return Objects.equals(id, node.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}