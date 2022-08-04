package com.databaseModeling.Server.services.transformation.implementation;

import com.databaseModeling.Server.model.conceptionalModel.AssociationType;
import com.databaseModeling.Server.model.conceptionalModel.Cardinality;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;
import com.databaseModeling.Server.services.transformation.interfaces.ICardinalityResolverService;

import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class CardinalityResolverService implements ICardinalityResolverService {

    @Override
    public void ResolveCardinalities(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph){

        for (var edge : erGraph.graphEdges){

            if(edge.getEdgeData().getAssociationType() != AssociationType.Association) continue;

            var cardinality = resolveCardinality(edge.getEdgeData().getMin(), edge.getEdgeData().getMax());

            edge.getEdgeData().setCardinality(cardinality);
        }

    }

    private Cardinality resolveCardinality(String min, String max){

        var cardinalityMin = this.parseAssociationValue(min);
        var cardinalityMax = this.parseAssociationValue(max);

        if(cardinalityMin == 0 && cardinalityMax == 1) return Cardinality.OptionalOne;
        if(cardinalityMin == 0 && cardinalityMax > 1)  return Cardinality.Many;
        if(cardinalityMin == 1 && cardinalityMax == 1) return Cardinality.MandatoryOne;
        if(cardinalityMin == 1 && cardinalityMax > 1)  return Cardinality.Many;
        if(cardinalityMin > 1  && cardinalityMax > 1)  return Cardinality.Many;


        return null;
    }

    private int parseAssociationValue(String value){

        String alphabeticValue = "AlphabeticValue";
        String numericValue = "NumericValue";

        String regex = "^\\s*((?<" + alphabeticValue + ">[A-Za-z]+)|(?<" + numericValue + ">\\d+))\\s*$";

        Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(value);

        int number = 0;

        if(matcher.group(numericValue) != null && !matcher.group(numericValue).isEmpty())
            return getNumberOfValue(matcher.group(numericValue));


        if(matcher.group(alphabeticValue) != null && !matcher.group(alphabeticValue).isEmpty())
            return Integer.MAX_VALUE;

        return number;
    }

    private int getNumberOfValue(String val1){
        int number;
        try{
            //Check for stack overflow
            number = Integer.parseInt(val1);
        }
        catch (NumberFormatException e ) {
            number = Integer.MAX_VALUE;
        }
        return number;
    }


}
