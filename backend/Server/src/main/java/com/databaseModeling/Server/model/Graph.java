package com.databaseModeling.Server.model;

import java.util.ArrayList;
import java.util.List;

public class Graph {

    List<Node> nodes = new ArrayList<>();

    public void addNode(Node node){
        nodes.add(node);
    }

    public void addEdge(Edge edge){
        edge.getSource().addEdge(edge);
        edge.getDestination().addEdge(edge);
    }
}
