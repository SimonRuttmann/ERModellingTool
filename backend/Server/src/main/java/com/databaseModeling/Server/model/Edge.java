package com.databaseModeling.Server.model;

public class Edge {

    private String id;

    private String start;
    private String end;

    private String min;
    private String max;


    private Node source;
    private Node destination;


    public Node getSource() {
        return source;
    }

    public void setSource(Node source) {
        this.source = source;
    }

    public Node getDestination() {
        return destination;
    }

    public void setDestination(Node destination) {
        this.destination = destination;
    }
}
