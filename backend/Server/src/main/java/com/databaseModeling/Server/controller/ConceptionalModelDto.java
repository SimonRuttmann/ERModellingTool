package com.databaseModeling.Server.controller;

import com.databaseModeling.Server.model.ErType;
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
    private String type;
    private DrawBoardContent drawBoardContent;

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

            public ErType getErType(){
                return ErType.valueOf(erType);
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
            private String objectType;
            private Boolean withArrow;

        }
    }


}

