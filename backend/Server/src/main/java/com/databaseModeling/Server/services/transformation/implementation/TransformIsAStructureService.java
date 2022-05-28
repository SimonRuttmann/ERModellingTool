package com.databaseModeling.Server.services.transformation.implementation;

import com.databaseModeling.Server.model.NodeTableManager;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.conceptionalModel.ErType;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;
import com.databaseModeling.Server.services.transformation.interfaces.ITransformIsAStructureService;

import java.util.stream.Collectors;

import static com.databaseModeling.Server.services.util.ErUtil.*;

public class TransformIsAStructureService implements ITransformIsAStructureService {

    @Override
    public void transformIsAStructures(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        var isaStructures = erGraph.graphNodes.
                stream().
                filter(node -> resolveErType(node) == ErType.IsAStructure).
                collect(Collectors.toList());

        //We execute the algorithm n - 1 times, as the longest possible chain
        //can be n/2 -1 isAs with 1 strong entity
        //E.g. SE -> IsA -> SE -> IsA -> ...
        var maxChainLength = (erGraph.graphNodes.size()/2) - 1;
        for (int i = 0; i < maxChainLength; i++){

            //Increase performance by only iterating through not handled isa structures
            isaStructures = isaStructures.stream().filter(this::isIsANotHandled).collect(Collectors.toList());
            if(isaStructures.isEmpty()) break;

            isaStructures.forEach(this::transformIsAStructure);

        }
    }

    private void transformIsAStructure(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> isAStructure) {

        var parent = ResolveParentOfIsAStructure(isAStructure);

        //Get connected isA`s
        var connectedElements = ResolveElementsConnectionToEntity(parent);
        var connectedIsA = connectedElements.stream().
                           filter(elements -> resolveErType(elements) == ErType.IsAStructure);

        var unhandledIsAs = connectedIsA.filter(this::isIsANotHandled).count();

        //As there can only be one parent to the current isA,
        //all other isAs (on the higher stages) require to be resolved
        if(unhandledIsAs > 1) return;

        //All isAs in the higher stages are resolved, therefore we can resolve this isa
        var inheritors = ResolveInheritorsOfIsAStructure(isAStructure);

        inheritors.forEach(entity ->
                NodeTableManager.AddForeignKeysAsPrimaryKeys(parent, entity));

        isAStructure.getNodeData().getTreeData().setTransformed(true);

    }

    private boolean isIsANotHandled (GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> isA) {
        return !isA.getNodeData().getTreeData().isTransformed();
    }
}
