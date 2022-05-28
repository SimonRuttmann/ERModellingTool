package com.databaseModeling.Server.controller;

import com.databaseModeling.Server.model.conceptionalModel.ErType;
import com.databaseModeling.Server.model.conceptionalModel.AssociationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 *
 * First paragraph.
 * <p><ul>
 * <li>the first item
 * <li>the second item
 * <li>the third item
 * </ul><p>
 * Second paragraph.
 *
 * <p>abc</p>This class is representing the object received by the client
 * @see Controller#convertToRelational(ConceptionalModelDto)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConceptionalModelDto {

    private String projectVersion;
    private String projectName;
    private String projectType;
    private DrawBoardContent drawBoardContent;

    @Override
    public String toString() {


        return          "Diagram DTO "                                                          + "\n" +
                        "Project Type       [" + projectType +                              "]" + "\n" +
                        "Connections:       [" + drawBoardContent.getConnections().size() + "]" + "\n" +
                        "Elements           [" + drawBoardContent.getElements().size() +    "]" + "\n";
    }
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DrawBoardContent{

        private List<Element> elements;
        private List<Connection> connections;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class Element{
            private String id;
            private String displayName;
            //private Boolean isHighlighted;
            //private Boolean isSelected;
            private String x;
            private String y;
            private String width;
            private String height;
            private String objectType;  //Enum DrawBoardElement ...
            private String erType;      //Enum IdentifyingAttribute ... //TODO

            //Optional! TODO
            private Boolean isMerging;

            //Optional! TODO
            private String owningSide;
            public ErType getErType(){
                return ErType.valueOf(erType);
            }

            @Override
            public String toString() {
                ErType type = getErType();

                var toString =  "ErType"                                  + "\n" +
                                "Id             [" + id +             "]" + "\n" +
                                "Type           [" + type +           "]" + "\n" +
                                "Name           [" + displayName +    "]" + "\n";

                if(type == ErType.StrongRelation)
                    toString += "Should Merge    [" + isMerging +     "]" + "\n";

                if(type == ErType.StrongRelation && owningSide != null)
                    toString += "Owning Side     [" + owningSide +    "]" + "\n";

                return toString;
            }
        }

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class Connection{

            private String id;
            private String start;
            private String end;
            private String min;
            private String max;
            private String objectType;  //TODO NOT NEEDED

            private Boolean isSelected; //TODO NOT NEEDED
            private Boolean withArrow;  //TODO NOT NEEDED

            private Boolean withLabel;  //TODO NOT NEEDED

            private Boolean isHighlighted; //TODO NOT NEEDED

            private String connectionType;  //ConnectionType = {association: "association", inheritor: "inheritor", parent:"parent"}

            private String associationTypeDetails;  // AssociationTypeDetails = {association: "association", attributeConnector: "attributeConnector"}
            public AssociationType getAssociationType(){

                if(connectionType == null)
                    return AssociationType.Association;

                if(connectionType.equals("association") &&
                   associationTypeDetails.equals("attributeConnector"))
                    return AssociationType.AttributeConnector;

                if(connectionType.equals("association"))
                    return AssociationType.Association;

                if(connectionType.equals("inheritor"))
                    return AssociationType.Inheritor;

                if(connectionType.equals("parent"))
                    return AssociationType.Parent;

                return AssociationType.Association;
            }

            @Override
            public String toString() {
                AssociationType type = getAssociationType();
                var toString =  "Connection"                                + "\n" +
                                "Id             [" + id +    "]"            + "\n" +
                                "Start          [" + start + "]"            + "\n" +
                                "End            [" + end +   "]"            + "\n" +
                                "Type           [" + type +  "]"            + "\n";

                if(type == AssociationType.Association)
                    toString += "Cardinality    (" + min + "," + max + ")"  + "\n";

                return toString;
            }
        }
    }


}

