package com.databaseModeling.Server.services;

import java.text.MessageFormat;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

//Direkt der Association hinzufügen
public class AssociationResolver {

    private final String alphabeticValue = "AlphabeticValue";
    private final String numericValue = "NumericValue";
    private final String regex = MessageFormat.
            format("^\\s*((?<{1}>[A-Za-z]+)|(?<{2}>\\d+))\\s*$", alphabeticValue, numericValue);

    public enum Cardinality {
        MandatoryOne,
        OptionalOne,
        Many
    }

    //TODO Check (5,4) !! exception

    // Mandatory One (1,1)
    // Optional one (0,1)
    // Many(0, N) (1,N) (2,N) (3,5)

    public Cardinality resolveAssociation(String min, String max){

        var cardinalityMin = this.parseAssociationValue(min);
        var cardinalityMax = this.parseAssociationValue(max);

        if(cardinalityMin == Cardinality.MandatoryOne && cardinalityMax == Cardinality.MandatoryOne)
            return Cardinality.MandatoryOne;

        if(cardinalityMin == Cardinality.OptionalOne && cardinalityMax != Cardinality.Many)
            return Cardinality.OptionalOne;

        else
            return Cardinality.Many;
    }

    private Cardinality parseAssociationValue(String value){

        Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(value);

        if(! matcher.matches()) throw new IllegalArgumentException();

        Cardinality cardinality;

        if(! matcher.group(alphabeticValue).isEmpty()) return Cardinality.Many;

        else if(! matcher.group(numericValue).isEmpty()) {
            int number = 0;
            try{
                //Check for stack overflow
                number = Integer.parseInt(matcher.group(numericValue));
            }
            catch (NumberFormatException e ) {
                number = Integer.MAX_VALUE;
            }
            finally {
                if      (number > 1)  cardinality = Cardinality.Many;
                else if (number == 1) cardinality = Cardinality.MandatoryOne;
                else                  cardinality = Cardinality.OptionalOne;
            }
        }

        else throw new IllegalArgumentException();

        return cardinality;
    }


}
