package com.databaseModeling.Server.services.transformation.implementation;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.conceptionalModel.ErType;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;
import com.databaseModeling.Server.model.relationalModel.TableManager;
import com.databaseModeling.Server.services.transformation.interfaces.ITransformIsAStructureService;

import java.util.stream.Collectors;

import static com.databaseModeling.Server.services.util.ErUtil.*;

public class TransformIsAStructureService implements ITransformIsAStructureService {

    public TransformIsAStructureService (TableManager tablemanager){
        this.tableManager = tablemanager;
    }

    private final TableManager tableManager;


    @Override
    public void transformIsAStructures(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        var isaStructures = erGraph.graphNodes.
                stream().
                filter(node -> resolveErType(node) == ErType.IsAStructure).
                collect(Collectors.toList());

        for (int i = 0; i < isaStructures.size(); i++){

            //Increase performance by only iterating through not handled isa structures
            var notHandledIsaStructures = isaStructures.stream().filter(this::isIsANotHandled).collect(Collectors.toList());
            if(notHandledIsaStructures.isEmpty()) break;

            notHandledIsaStructures.forEach(this::transformIsAStructure);
        }
    }

    /**
     * Transforms isA Structures by adding a reference from the subtypes to the supertypes of the isA
     * Also cascades the primary keys
     * If the isA can not be handled (yet) due to other isAs affecting the supertype the algorithm will skip the transformation
     * @param isAStructure The isA to transform
     */
    private void transformIsAStructure(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> isAStructure) {

        var parent = resolveParentOfIsAStructure(isAStructure);

        //Get connected isA`s
        var connectedElements = resolveElementsConnectionToEntity(parent);
        var connectedIsA = connectedElements.stream().
                            filter(elements -> resolveErType(elements) == ErType.IsAStructure).
                            filter(isAs -> resolveParentOfIsAStructure(isAs) != parent);

        var unhandledIsAs = connectedIsA.filter(this::isIsANotHandled).count();


        //All other isAs (on the higher stages) require to be resolved
        if(unhandledIsAs > 0) return;

        //All isAs in the higher stages are resolved, therefore we can resolve this isa
        var inheritors = resolveInheritorsOfIsAStructure(isAStructure);

        inheritors.forEach(entity ->
                tableManager.addForeignKeysAsPrimaryKeys(parent, entity));

        isAStructure.getNodeData().getTreeData().setTransformed(true);

    }

    private boolean isIsANotHandled (GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> isA) {
        return !isA.getNodeData().getTreeData().isTransformed();
    }
}
