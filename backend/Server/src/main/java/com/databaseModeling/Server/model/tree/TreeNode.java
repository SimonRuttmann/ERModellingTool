package com.databaseModeling.Server.model.tree;

import java.util.ArrayList;
import java.util.List;

public class TreeNode<TreeData> {

    private final List<TreeNode<TreeData>> children = new ArrayList<>();
    private TreeNode<TreeData> parent;

    private final String id;

    public String getId() { return id; }
    private final TreeData data;

    public TreeNode(String id, TreeData data) {
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

    public void setParent(TreeNode<TreeData> parent) {
        this.parent = parent;
    }

    public List<TreeNode<TreeData>> getChildren(){
        return children;
    }

    public void removeChild(TreeNode<TreeData> child){
        children.remove(child);
    }

    public void addChild(TreeNode<TreeData> child){
        children.add(child);
    }

    public TreeData getTreeData(){
        return data;
    }
}
