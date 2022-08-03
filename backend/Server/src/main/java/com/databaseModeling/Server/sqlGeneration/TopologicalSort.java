package com.databaseModeling.Server.sqlGeneration;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

enum Color {white, grey, black}

public class TopologicalSort<M> {
    private final ArrayList<Node<M>> nodes = new ArrayList<>();          // Adjacency List
    private final ArrayList<Node<M>> finishTimeList = new ArrayList<>(); // Sorted list, populated by the algorithm

    private boolean hasCircle = false;
    private int currentTime = 1;

    //returns true if the alg was successful (e.g. has no circle)
    public boolean topologicalSort(){
        for (var node : nodes) {
            if(node.color == Color.white) {
                node.predecessor = null;
                searchSubGraph(node);
            }
        }
        return !hasCircle;
    }

    public List<M> resolveResultSet(){
        return  finishTimeList.stream().
                sorted(Comparator.comparing(node -> node.finishTime)).
                map(node -> node.data).
                collect(Collectors.toList());
    }

    private void searchSubGraph(Node<M> node){
        //Start discovery for the current node
        node.discoveryTime = getCurrentTimeAndIncrement();
        node.color = Color.grey;

        //Discover successor nodes recursively
        for (var successor : node.successors) {

            if(successor.color == Color.grey){
                this.hasCircle = true;
            }

            if(successor.color == Color.white){
                successor.predecessor = node;
                searchSubGraph(successor);
            }
        }

        //Finish discovery
        node.finishTime = getCurrentTimeAndIncrement();
        node.color = Color.black;
        this.finishTimeList.add(node);
    }


    private int getCurrentTimeAndIncrement(){
        this.currentTime++;
        return this.currentTime -1;
    }

    public void addNode(M nodeData){
        Node<M> node = new Node<>(nodeData);
        nodes.add(node);
    }

    public void addEdge(M from, M to){
        var fromNode = getNodeForData(from);
        var toNode = getNodeForData(to);
        fromNode.successors.add(toNode);
    }


    private Node<M> getNodeForData(M data){
        return nodes.stream().filter(node -> node.data == data).findFirst().orElseThrow();
    }

    private static class Node<T> {

        public int discoveryTime;
        public Integer finishTime;

        public Node<T> predecessor;
        public ArrayList<Node<T>> successors = new ArrayList<>();

        public Color color;
        public T data;

        public Node (T data){
            this.data = data;
            color = Color.white;
        }
    }
}
