package com.databaseModeling.Server.services.transformation.implementation;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.conceptionalModel.ErType;
import com.databaseModeling.Server.model.relationalModel.Table;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;
import com.databaseModeling.Server.model.relationalModel.TableManager;
import com.databaseModeling.Server.services.transformation.interfaces.ITransformWeakTypesService;

import java.util.*;
import java.util.stream.Collectors;

import static com.databaseModeling.Server.services.util.ErUtil.*;

public class TransformWeakTypesService implements ITransformWeakTypesService {

    @Override
    public void transformWeakTypes(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph){

        //We execute the algorithm n - 1 times, as the longest possible chain
        //can be n-1 weak entities with 1 strong entity
        //E.g. SE -> WE -> WE -> WE -> ...
        for (int i = 0; i < erGraph.graphNodes.size() - 1; i++){

            //Increase performance by only iterating through not handled weak entities
            var typesToIdentify = resolveTypesToIdentify(erGraph);
            if(typesToIdentify.size() == 0) break;

            int round = i;
            typesToIdentify.forEach(type -> resolveIdentifyingType(type, round));

        }

    }

    @Override
    public void generateIdentifyingPrimaryKeys(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph){
        var entities = resolveWeakEntities(erGraph);
        
        for (var weakEntity : entities){
            var weakEntityTable = resolveErData(weakEntity).getTable();
            addForeignAsPrimaryKeysRecursive(weakEntityTable);
        }
        
    }

    /**
     * Adds foreign keys as primary keys recursive to all above tables of the weak entity chain
     * @param table The current table, which needs to add the references as primary keys
     */
    private void addForeignAsPrimaryKeysRecursive(Table table){
        
        if(!table.isWeakEntityTable || table.isTransformed) return;

        addForeignAsPrimaryKeysRecursive(table.referencedIdentifyingTable);

        var isReferenceStrongEntityTable = !table.referencedIdentifyingTable.isWeakEntityTable;
        var isReferenceTransformedWeakEntityTable = table.referencedIdentifyingTable.isTransformed;
        
        if(isReferenceStrongEntityTable || isReferenceTransformedWeakEntityTable){
            TableManager.AddForeignKeysToTableAsPrimaryKeys(table.referencedIdentifyingTable, table);
            table.isTransformed = true;
        }

    }

    private List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
            resolveWeakEntities(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph){

        return erGraph.graphNodes.
                stream().
                filter(element ->
                        resolveErType(element) == ErType.WeakEntity).
                collect(Collectors.toList());

    }

    private List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
            resolveTypesToIdentify(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph){

        return resolveWeakEntities(erGraph).
                stream().
                filter(weakEntity ->
                        !resolveErData(weakEntity).getTable().isStrongWithReferences()).
                collect(Collectors.toList());
    }

    //Round is required for
    // A --> B --> D (strong)
    // C --> B                    To Prevent:  A --> C --> B --> D
    private void resolveIdentifyingType(
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> weakEntity, int round){

        //If the weak entity is already resolved, we can skip processing
        if(resolveErData(weakEntity).getTable().isStrongWithReferences()) return;

        //Returns all identifying relations connected to the weak entity
        var identifyingRelations = ResolveIdentifyingRelations(weakEntity);

        //Collect all entities of the other sides of the identifyingRelations
        Set<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>> identifyingEntities = new HashSet<>();

        for (var identifyingRelation : identifyingRelations) {
            identifyingEntities.addAll(ResolveOtherEntitiesConnectedToRelation(weakEntity, identifyingRelation));
        }


        for (var identifyingEntity : identifyingEntities) {

            var identifyingEntityData = resolveErData(identifyingEntity);
            var weakEntityData = resolveErData(weakEntity);

            //Note, that the defining type does not need to be a strong entity,
            //it can also be a weak entity, which has already resolved its strong type

            var isIdentifying =
                    identifyingEntityData.getErType() == ErType.StrongEntity ||
                    identifyingEntityData.getTable().isStrongWithReferences();

            if(!isIdentifying) continue;

            //Round is required for
            // A --> B --> D (strong)
            // C --> B                    To Prevent:  A --> C --> B --> D

            //Round is required for
            // A(1) --> B(0) --> D(-1) (strong)
            // C(1) --> B(0)                    To Prevent:  A(1) -|FORBIDDEN THROUGH ROUND|-> C(1) --> B(0) --> D(-1)
            if(round == identifyingEntityData.getTable().round) continue;

            weakEntityData.getTable().round = round;
            weakEntityData.getTable().isWeakEntityTable = true;
            weakEntityData.getTable().referencedIdentifyingTable = identifyingEntityData.getTable();
            break;
        }
    }


    /**
     * Returns all identifying relations the given entity is connected to
     * @param weakEntity The entity to query for
     * @return A list of graph edges, representing the relations
     */
    private List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
            ResolveIdentifyingRelations(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> weakEntity){

        var relations = ResolveRelationsOfEntity(weakEntity);

        return  relations.
                stream().
                filter(connectedNode -> resolveErType(connectedNode) == ErType.WeakRelation).
                collect(Collectors.toList());
    }

    //TODO This method can throw an exception, if the weak relation has only 1 connection
    //TODO Such inconsistency needs to be checked via the validation!

    /**
     * Returns the entity connected to the relation, without the element specified in the first argument
     * @param weakEntity The entity, which should be excluded from the result list
     * @param identifyingRelation The relation which will be queried for
     * @return A list of GraphNodes representing the entities
     * @see TransformWeakTypesService#ResolveOtherEntityConnectedToRelation(GraphNode, GraphNode)
     * @throws  java.util.NoSuchElementException
     */
    private GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>
                 ResolveOtherEntityConnectedToRelation( GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> weakEntity,
                                                        GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> identifyingRelation)
                                                        throws NoSuchElementException
    {
        var entities = ResolveOtherEntitiesConnectedToRelation(weakEntity, identifyingRelation);

        return entities.stream().findFirst().orElseThrow();
    }



}
