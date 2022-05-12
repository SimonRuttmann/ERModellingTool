package com.databaseModeling.Server.services;

import com.databaseModeling.Server.model.EntityRelationAssociation;
import com.databaseModeling.Server.model.EntityRelationElement;
import com.databaseModeling.Server.model.ErType;
import com.databaseModeling.Server.model.Table;
import com.databaseModeling.Server.model.graph.Graph;
import com.databaseModeling.Server.model.graph.GraphNode;
import com.databaseModeling.Server.model.tree.TreeNode;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

public class TransformWeakTypesService implements ITransformWeakTypesService{

    @Override
    public void transformWeakTypes(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph){

        //We execute the algorithm n - 1 times, as the longest possible chain
        //can be n-1 weak entities with 1 strong entity
        //E.g. SE -> WE -> WE -> WE -> ...
        for (int i = 0; i < erGraph.graphNodes.size() - 1; i++){

            //Increase performance by only iterating through not handled weak entities
            var typesToIdentify = resolveTypesToIdentify(erGraph);
            if(typesToIdentify.size() == 0) break;

            typesToIdentify.forEach(this::resolveIdentifyingType);

        }

    }

    @Override
    public void generateIdentifyingPrimaryKeys(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph){
        var entities = resolveWeakEntities(erGraph);
        
        for (var weakEntity : entities){
            var weakEntityTable = weakEntity.getNodeData().getTreeData().getTable();
            addForeignAsPrimaryKeysRecursive(weakEntityTable);
        }
        
    }

    /**
     * Adds foreign keys as primary keys recursive to all above tables of the weak entity chain
     * @param table The current table, which needs to add the references as primary keys
     */
    private void addForeignAsPrimaryKeysRecursive(Table table){
        
        if(!table.isWeakEntityTable || table.isTransformed) return;
        
        var isReferenceStrongEntityTable = !table.referencedIdentifyingTable.isWeakEntityTable;
        var isReferenceTransformedWeakEntityTable = table.referencedIdentifyingTable.isTransformed;
        
        if(isReferenceStrongEntityTable || isReferenceTransformedWeakEntityTable){
            TableManager.AddForeignKeysToTableAsPrimaryKeys(table.referencedIdentifyingTable, table);
            table.isTransformed = true;
            return;
        }
        
        addForeignAsPrimaryKeysRecursive(table.referencedIdentifyingTable);
    }

    private List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
            resolveWeakEntities(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph){

        return erGraph.graphNodes.
                stream().
                filter(element ->
                        element.getNodeData().getTreeData().getErType() == ErType.WeakEntity).
                collect(Collectors.toList());

    }

    private List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
            resolveTypesToIdentify(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph){

        return resolveWeakEntities(erGraph).
                stream().
                filter(weakEntity ->
                        !weakEntity.getNodeData().getTreeData().getTable().isStrongWithReferences()).
                collect(Collectors.toList());
    }

    private void resolveIdentifyingType(
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> weakEntity){

        //If the weak entity is already resolved, we can skip processing
        if(weakEntity.getNodeData().getTreeData().getTable().isStrongWithReferences()) return;

        //Returns all identifying relations connected to the weak entity
        var identifyingRelations = ResolveIdentifyingRelations(weakEntity);

        for (var identifyingRelation : identifyingRelations) {

            //Returns all entities of the other side of the identifyingRelation
            var identifyingEntity = ResolveOtherEntityConnectedToRelation(weakEntity, identifyingRelation);

            var identifyingEntityData = identifyingEntity.getNodeData().getTreeData();
            var weakEntityData = weakEntity.getNodeData().getTreeData();

            //Note, that the defining type does not need to be a strong entity,
            //it can also be a weak entity, which has already resolved its strong type

            var isIdentifying =
                    identifyingEntityData.getErType() == ErType.StrongEntity ||
                    identifyingEntityData.getTable().isStrongWithReferences();

            if(!isIdentifying) continue;

            weakEntityData.getTable().isWeakEntityTable = true;
            weakEntityData.getTable().referencedIdentifyingTable = identifyingEntityData.getTable();
            break;
        }
    }


    /**
     * Returns all identifying relations the given entity is connected to
     * @param weakEntity The entity to query for
     * @return A list of graph edges, representing the relations
     * @see TransformWeakTypesService#ResolveRelationsOfEntity(GraphNode)
     */
    private List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
            ResolveIdentifyingRelations(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> weakEntity){

        var relations = ResolveRelationsOfEntity(weakEntity);

        return  relations.
                stream().
                filter(connectedNode -> connectedNode.getNodeData().getTreeData().getErType() == ErType.IdentifyingRelation).
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



    //TODO Move them to util class if needed anywhere else
    //General purpose utils

    /**
     * Returns all relations the given entity is connected to
     * @param entity The entity to query for
     * @return A list of graph edges, representing the relations
     */
    private List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
        ResolveRelationsOfEntity(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> entity){

        return  entity.
                getEdges().
                stream().
                map(edge -> edge.getOtherSide(entity)).
                collect(Collectors.toList());
    }

    /**
     * Returns all entities connected to the relation, without the element specified in the first argument
     * <pre>
     *     Origin Entity <-> Relation <-> Entity1
     *                                <-> Entity2
     *     Return: Entity1, Entity2
     * </pre>
     * @param originEntity The entity, which should be excluded from the result list
     * @param identifyingRelation The relation which will be queried for
     * @return A list of GraphNodes representing the entities
     */
    private List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
            ResolveOtherEntitiesConnectedToRelation(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> originEntity,
                                                    GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> identifyingRelation){

        return  identifyingRelation.
                getEdges().
                stream().                                               //WE = Weak Entity, IR = Identifying Relation, IE = Identifying Entity
                map(edge -> edge.getOtherSide(identifyingRelation)).    //e.g. WE <-> IR <-> IE ---> WR, IE
                filter(node -> !node.equals(originEntity)).               //e.g  WE, IE --> IE
                collect(Collectors.toList());
    }


}