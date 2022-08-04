package com.databaseModeling.Server.model.dataStructure.tree;

import com.databaseModeling.Server.model.dataStructure.graph.Graph;

import java.util.ArrayList;
import java.util.List;

/**
 * The representation of a node in a tree, which can hold any kind of data
 * @param <TreeData>> The type of data hold in the nodes of the tree
 * @see Graph
 */
public class TreeNode<TreeData> {

    private final String id;
    public String getId() { return id; }

    private TreeNode<TreeData> parent;
    public void setParent(TreeNode<TreeData> parent) { this.parent = parent; }
    public void removeParent(){ this.parent = null; }

    private final List<TreeNode<TreeData>> children = new ArrayList<>();
    public List<TreeNode<TreeData>> getChildren(){ return children; }
    public void addChild(TreeNode<TreeData> child){ children.add(child); }
    public void removeChild(TreeNode<TreeData> child){ children.remove(child); }

    public boolean isLeaf(){ return children.isEmpty(); }
    public boolean isParent(){ return parent == null; }

    private final TreeData data;
    public TreeData getTreeData(){ return data; }

    public TreeNode(String id, TreeData data) {
        this.id = id;
        this.data = data;
    }
}
