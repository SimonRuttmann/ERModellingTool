package com.databaseModeling.Server.services.transformation.implementation;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.conceptionalModel.ErType;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;
import com.databaseModeling.Server.model.relationalModel.Table;
import com.databaseModeling.Server.model.relationalModel.TableManager;
import com.databaseModeling.Server.services.transformation.interfaces.ITransformAttributesService;

import static com.databaseModeling.Server.services.util.ErUtil.resolveErType;
public class TransformAttributesService implements ITransformAttributesService {


    public TransformAttributesService (TableManager tablemanager){
        this.tableManager = tablemanager;
    }

    private final TableManager tableManager;

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
                updateReferences(root.getNodeData().getTreeData().getTable());

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
     *           4.1.2 Else (In this case it is a "pipe-attribute" and must be forwarded)
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
            parent.getTreeData().getTable().setFixedAttributeTable(true);
        }

        if(parent.isLeaf()) return;

        var parentTable = parent.getTreeData().getTable();

        // If we reach this point, the element is no leaf
        // therefore it is a composite attribute, so the column needs to be
        // cleared and filled with the child table columns
        parentTable.clearColumns();

        for (var child : parent.getChildren()) {
            var childTable = child.getTreeData().getTable();


            if(childTable.isFixedAttributeTable()){

                //Attribute is used as a "pipe", therefore we can merge the table
                //The node itself can't be a pipeline attribute
                if(parent.getChildren().size() == 1 && !parent.getTreeData().getErType().isNode) {
                    forwardAttributeTable(parent, child);
                    parentTable.setFixedAttributeTable(true);
                }

                else {
                    parentTable.addReferenceToChildAttributeTable(childTable);
                    //childTable.referencedAttributeTable = parentTable;
                }

                //If it is a multivalued attribute it is marked above as isFixedAttributeTable
                //parentTable.isFixedAttributeTable = true;
            }

            else{
                //TableManager.AddColumns(parentTable, childTable.getColumns());
                //child.getTreeData().removeTable();

                //We always forward the attribute table, because the child table
                //Could have references which would get lost by deleting the table
                forwardAttributeTable(parent, child);
            }

        }

    }

    private void forwardAttributeTable(
            TreeNode<EntityRelationElement> parent,
            TreeNode<EntityRelationElement> child){

        var childTable = child.getTreeData().getTable();
        var parentTable = parent.getTreeData().getTable();

        tableManager.addColumns(parentTable, childTable.getColumns());

        //Get all references to the child table and update them to the parent table
        var referencedByChild = childTable.getReferencesToChildAttributeTables();
        parentTable.addAllReferencesToChildAttributeTable(referencedByChild);

        tableManager.removeTable(child.getTreeData());
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
     */
    private void updateReferences(Table parentTable){

        if(parentTable == null) return;

        var referencedTables = parentTable.getReferencesToChildAttributeTables();

        if(referencedTables.size() == 0 ) return;

        for(var childTable : referencedTables){

            tableManager.AddForeignKeysToTableAsPrimaryKeys(parentTable, childTable);

            updateReferences(childTable);
        }

    }

}
