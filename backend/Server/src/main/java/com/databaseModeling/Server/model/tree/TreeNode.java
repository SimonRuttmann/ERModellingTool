package com.databaseModeling.Server.model.tree;

import java.util.ArrayList;
import java.util.List;

public class TreeNode<T> {

    private final List<TreeNode<T>> children = new ArrayList<>();
    private TreeNode<T> parent;

    private final String id;

    public String getId() { return id; }
    private final T data;

    public TreeNode(String id, T data) {
        this.id = id;
        this.data = data;
    }

    public boolean isLeaf(){
        return children.isEmpty();
    }

    public boolean isParent(){
        return parent == null;
    }

    public void removeParent(){
        this.parent = null;
    }

    public void setParent(TreeNode<T> parent) {
        this.parent = parent;
    }

    public List<TreeNode<T>> getChildren(){
        return children;
    }

    public void removeChild(TreeNode<T> child){
        children.remove(child);
    }

    public void addChild(TreeNode<T> child){
        children.add(child);
    }

    public T getData(){
        return data;
    }
}
