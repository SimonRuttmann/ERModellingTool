package com.databaseModeling.Server.services;

import com.databaseModeling.Server.model.*;
import com.databaseModeling.Server.model.graph.Graph;
import com.databaseModeling.Server.model.tree.TreeNode;

public class TransformAttributesService {

    /**
     * Transforms all attributes to the relational model
     * Therefore each graph node will have a table containing the attributes
     * In addition, there will be more tables created, if multivalued attributes are involved
     *
     * @param erGraph The graph to modify
     *
     * This method only deletes, merges and adds object references between the tables
     * To update the foreign keys of the tables, each element has to call the following method
     * @see TableManager#AddForeignKeysToTableAsPrimaryKeys(Table, Table)
     */
    public void transformAttributes(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph){

        for (var root : erGraph.graphNodes){

            if(root.getNodeData().getTreeData().getErType().isNode)
                transformTree(root.getNodeData());

        }

    }


    /**
     * Algorithm to transform each element in the tree into tables
     * The algorithm traversals the tree in postorder and merges or enhances tables
     *
     *<pre>
     * 1. Execute postorder traversal
     * 2. If the node is leaf and multivalued
     *     2.1  The table needs to be marked to be preserved
     * 3. If the parent is a leaf stop execution
     * 4. Iterate through children
     *      1. If the table of the child is marked as fixed
     *          1.1 Create a reference from the child to the parent
     *      2. Else
     *          2.1 Merge the table of the child with the parent table
     *          2.2 Remove the child table
     *</pre>
     *
     * @param parent The parent element of the tree
     */
    public void transformTree(TreeNode<EntityRelationElement> parent){


        //Traversal of tree
        for (var child: parent.getChildren()) {
            transformTree(child);
        }

        if(parent.isLeaf() && parent.getTreeData().getErType() == ErType.MultivaluedAttribute){
            parent.getTreeData().getTable().isFixedAttributeTable = true;
        }

        if(parent.isLeaf()) return;

        for (var child : parent.getChildren()) {
            var childTable = child.getTreeData().getTable();
            var parentTable = parent.getTreeData().getTable();

            if(childTable.isFixedAttributeTable){
                childTable.referencedAttributeTable = parentTable;
                parentTable.isFixedAttributeTable = true;
            }
            else{
                TableManager.AddColumns(parentTable, childTable.getColumns());
                child.getTreeData().removeTable();
            }

        }

    }



    /**
     *
     * //TODO BUGGED USE ABOVE METHOD INSTEAD!
     * //TODO Fehler hier sind compound attributes nicht richtig beachtet worden
     * //TODO Compound key "KÖNNEN" eine tabelle bilden, abhängig von seinen kindern
     * //TODO Subtraversals wären zu inperfomant
     *
     * Algorithm to transform each element in the tree into tables
     * The algorithm traversals the tree in preorder and merges or enhances tables
     *
     *<pre>
     * 1. If it is a leaf, stop execution
     * 2. For each child of the current parent
     *      1. Set the new active table to the given active table
     *      2. If it is a multivalued attribute
     *          1. Add references to the attribute table referencing the active table
     *          2. Update the active table with the referenced
     *      3  Else
     *          1. Merge the attribute table with the active table
     *          2. Delete the attribute table
     *      4  Start the recursion step for each child with the (eventually new) active table
     *</pre>
     *
     * @param parent The parent element of the tree
     * @param activeTable The current active table, which will be enhanced by attributes
     */
    public void transformTree(TreeNode<EntityRelationElement> parent, Table activeTable){

        //Added for more readability
        if(parent.isLeaf()) return;

        for(var child : parent.getChildren()){
            var childData = child.getTreeData();

            var activeTableForChildren = activeTable;

            switch (childData.getErType()){
                case MultivaluedAttribute:
                    TableManager.AddForeignKeysToTableAsPrimaryKeys(activeTable, childData.getTable());
                    activeTableForChildren = childData.getTable();
                    break;
                case NormalAttribute:
                case IdentifyingAttribute:
                case WeakIdentifyingAttribute:
                    TableManager.AddColumns(activeTable, childData.getTable().getColumns());
                    childData.removeTable();
            }

            transformTree(child, activeTableForChildren);
        }

    }


}
