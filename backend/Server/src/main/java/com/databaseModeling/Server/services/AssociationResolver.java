package com.databaseModeling.Server.services;

import com.databaseModeling.Server.model.EntityRelationAssociation;
import com.databaseModeling.Server.model.EntityRelationElement;
import com.databaseModeling.Server.model.graph.Graph;
import com.databaseModeling.Server.model.tree.TreeNode;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.databaseModeling.Server.services.ErUtil.resolveAssociationQualifiedName;

//Direkt der Association hinzufügen
public class AssociationResolver {

    private final String alphabeticValue = "AlphabeticValue";
    private final String numericValue = "NumericValue";
    private final String regex = MessageFormat.
            format("^\\s*((?<{1}>[A-Za-z]+)|(?<{2}>\\d+))\\s*$", alphabeticValue, numericValue);


    public void ResolveAssociations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph, ValidationResult validationResult){
        for (var edge : erGraph.graphEdges){
            List<String> errors = new ArrayList<>();
            resolveAssociation(edge.getEdgeData().getMin(), edge.getEdgeData().getMax(), errors);
            if(! errors.isEmpty()) {

                validationResult.addErrorsWithPrefix(resolveAssociationQualifiedName(edge), errors);
            }
        }
    }

    private Cardinality resolveAssociation(String min, String max, List<String> errorMessages){

        var cardinalityMin = this.parseAssociationValue(min,errorMessages);
        var cardinalityMax = this.parseAssociationValue(max,errorMessages);

        if(! errorMessages.isEmpty()) return null;

        if(cardinalityMin < 0) errorMessages.add("The min cardinality is negative");
        if(cardinalityMax < 0) errorMessages.add("The max cardinality is negative");
        if(cardinalityMin == 0 && cardinalityMax == 0) errorMessages.add("The min and max cardinality are 0");
        if(cardinalityMin > cardinalityMax) errorMessages.add("The min cardinality is greater than the max cardinality");

        if(cardinalityMin == 0 && cardinalityMax == 1) return Cardinality.OptionalOne;
        if(cardinalityMin == 0 && cardinalityMax > 1) return Cardinality.Many;
        if(cardinalityMin == 1 && cardinalityMax == 1) return Cardinality.MandatoryOne;
        if(cardinalityMin == 1 && cardinalityMax > 1) return Cardinality.Many;
        if(cardinalityMin > 1  && cardinalityMax > 1) return Cardinality.Many;

        errorMessages.add("The cardinality could not be parsed");
        return null;
    }

    private int parseAssociationValue(String value, List<String> errorMessages){

        Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(value);

        if(! matcher.matches()) errorMessages.add("The cardinality " + value + " could not be parsed");

        int number = 0;

        if(! matcher.group(alphabeticValue).isEmpty()) number = Integer.MAX_VALUE;

        else if(! matcher.group(numericValue).isEmpty())
            number = getNumberOfValue(matcher.group(numericValue));

        else errorMessages.add("The cardinality " + value + " could not be parsed");

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
