package com.databaseModeling.Server.services;

import com.databaseModeling.Server.model.*;
import com.databaseModeling.Server.model.graph.Graph;
import com.databaseModeling.Server.model.tree.TreeNode;
import static com.databaseModeling.Server.services.ErUtil.*;
public class TransformAttributesService implements ITransformAttributesService{

    @Override
    public void transformAttributes(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph){

        for (var root : erGraph.graphNodes){

            if(resolveErType(root).isNode)
                transformTree(root.getNodeData());

        }

    }

    @Override
    public void generateAttributeTableKeys(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph){
        for (var root : erGraph.graphNodes){

            if(resolveErType(root).isNode)
                updateReferences(root.getNodeData());

        }
    }


    /**
     * Algorithm to transform each element in the tree into tables
     * The algorithm traversals the tree in postorder and merges or enhances tables
     *
     *<pre>
     * 1. Execute postorder traversal
     * 2. If the node is multivalued
     *     2.1  The table needs to be marked to be preserved
     * 3. If the parent is a leaf stop execution
     * 4. Iterate through children
     *      4.1 If the table of the child is marked as fixed
     *           4.1.1 If the table has at least one more children
     *                    Create a reference from the child to the parent
     *           4.1.2 Else
     *                     Merge the child table with the parent table
     *                     and update the sub children reference
     *           4.1.3 Mark the table, to be persisted
     *      4.2. Else
     *          4.2.1 Merge the table of the child with the parent table
     *          4.2.2 Remove the child table
     *</pre>
     *
     * @param parent The parent element of the tree
     */
    private void transformTree(TreeNode<EntityRelationElement> parent){

        //Traversal of tree
        for (var child : parent.getChildren()) {
            transformTree(child);
        }

        if(parent.getTreeData().getErType() == ErType.MultivaluedAttribute){
            parent.getTreeData().getTable().isFixedAttributeTable = true;
        }

        if(parent.isLeaf()) return;


        for (var child : parent.getChildren()) {
            var childTable = child.getTreeData().getTable();
            var parentTable = parent.getTreeData().getTable();


            if(childTable.isFixedAttributeTable){

                //Attribute is used as a "pipe", therefore we can merge the table
                if(parent.getChildren().size() == 1) removePipelineAttribute(parent, child);

                else childTable.referencedAttributeTable = parentTable;

                parentTable.isFixedAttributeTable = true;
            }

            else{
                TableManager.AddColumns(parentTable, childTable.getColumns());
                child.getTreeData().removeTable();
            }

        }

    }

    private void removePipelineAttribute(
            TreeNode<EntityRelationElement> parent,
            TreeNode<EntityRelationElement> child){

        var childTable = child.getTreeData().getTable();
        var parentTable = parent.getTreeData().getTable();

        TableManager.AddColumns(parentTable, childTable.getColumns());

        //Get all references to the child table and update them to the parent table
        for(var subChild : child.getChildren()){

            //Check for reference!
            if(subChild.getTreeData().getTable().referencedAttributeTable == child.getTreeData().getTable()){
                subChild.getTreeData().getTable().referencedAttributeTable = parentTable;
            }

        }

        child.getTreeData().removeTable();
    }

    /**
     * Resolves references between attribute tables and adds foreign keys, referencing the parent table
     *
     *<pre>
     * 1. If it is a leaf, stop execution
     * 2. For each child of the current parent
     *      1. If the child has no table, skip
     *      2. Add foreign keys to the child table to reference the parent table
     * 3. Start preorder traversal
     *</pre>
     *
     * @param parent The parent element of the tree
     */
    private void updateReferences(TreeNode<EntityRelationElement> parent){

        //Added for more readability
        if(parent.isLeaf()) return;

        for(var child : parent.getChildren()){
            var childData = child.getTreeData();

            if(! childData.hasTable() ) continue;

            var childTable = childData.getTable();
            //TODO Version 1, kindtabellen (der 1. stufe) muss das attributeTable aktualisiert werden
            //var parentTable = childData.getTable().referencedAttributeTable;
            //TODO Version 2, die kinder werden bei einem merge ebenfalls gemergt (whr. besser?)
            var parentTable = parent.getTreeData().getTable();

            TableManager.AddForeignKeysToTableAsPrimaryKeys(parentTable, childTable);

            updateReferences(child);
        }

    }

}
