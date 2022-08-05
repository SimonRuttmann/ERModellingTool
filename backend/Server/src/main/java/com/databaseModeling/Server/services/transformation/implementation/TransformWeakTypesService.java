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

    public TransformWeakTypesService (TableManager tablemanager){
        this.tableManager = tablemanager;
    }

    private final TableManager tableManager;


    @Override
    public void transformWeakTypes(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph){

        var weakTypes = resolveWeakEntities(erGraph);

        for (int i = 0; i < weakTypes.size(); i++){

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
            var weakEntityTable = resolveErData(weakEntity).getTable();
            addForeignAsPrimaryKeysRecursive(weakEntityTable);
        }
        
    }

    /**
     * Resolves an identifying type for a weak entity, if it is directly (with a weak relation)
     * connected to an already identified entity
     * If an identifying entity is found, the table of the weak relation will be merged with the weak entity
     * and references as foreign keys to the identifying entity table are created
     * @param weakEntity The weak entity to identify
     */
    private void resolveIdentifyingType(
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> weakEntity){

        //If the weak entity is already resolved, we can skip processing
        if(resolveErData(weakEntity).getTable().isStrongWithReferences()) return;

        //Returns all identifying relations connected to the weak entity
        var identifyingRelations = ResolveIdentifyingRelations(weakEntity);

        //Collect all entities of the other sides of the identifyingRelations
        var identifyingEntitiesRelations = createNodeMap();

        for (var identifyingRelation : identifyingRelations) {
            var connectedOtherEntity = resolveOtherEntitiesConnectedToRelation(weakEntity, identifyingRelation).get(0);
            identifyingEntitiesRelations.put(connectedOtherEntity, identifyingRelation);
        }


        for (var entry : identifyingEntitiesRelations.entrySet()) {

            // weakEntity               Identifying Relation         IdentifyingEntity
            // Weak Entity A    -->     Weak Relation B     -->      Strong Entity C

            var identifyingEntity = entry.getKey();
            var identifyingRelation = entry.getValue();

            var identifyingEntityData = resolveErData(identifyingEntity);
            var weakEntityData = resolveErData(weakEntity);

            //Note, that the defining type does not need to be a strong entity,
            //it can also be a weak entity, which has already resolved its strong type

            var isIdentifying =
                    identifyingEntityData.getErType() == ErType.StrongEntity ||
                            identifyingEntityData.getTable().isStrongWithReferences();

            if(!isIdentifying) continue;

            weakEntityData.getTable().setWeakEntityTable(true);
            weakEntityData.getTable().setReferencedIdentifyingTable(identifyingEntityData.getTable());

            //Merge relation into weak entity
            tableManager.mergeTables(weakEntity, identifyingRelation);

            resolveErData(identifyingRelation).setTransformed(true);
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

        var relations = resolveRelationsOfEntity(weakEntity);

        return  relations.
                stream().
                filter(connectedNode -> resolveErType(connectedNode) == ErType.WeakRelation).
                collect(Collectors.toList());
    }

    /**
     * Adds foreign keys as primary keys recursive to all above tables of the weak entity chain
     * @param table The current table, which needs to add the references as primary keys
     */
    private void addForeignAsPrimaryKeysRecursive(Table table){
        
        if(!table.isWeakEntityTable() || table.isTransformed()) return;

        addForeignAsPrimaryKeysRecursive(table.getReferencedIdentifyingTable());

        var isReferenceStrongEntityTable = !table.getReferencedIdentifyingTable().isWeakEntityTable();
        var isReferenceTransformedWeakEntityTable = table.getReferencedIdentifyingTable().isTransformed();
        
        if(isReferenceStrongEntityTable || isReferenceTransformedWeakEntityTable){
            tableManager.addForeignKeysToTableAsPrimaryKeys(table.getReferencedIdentifyingTable(), table);
            table.setTransformed(true);
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

    private Map< GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>,
                 GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> >
    createNodeMap(){
        return new HashMap<>();
    }

}
