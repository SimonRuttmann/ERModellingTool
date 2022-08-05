package com.databaseModeling.Server.dto;

import com.databaseModeling.Server.controller.Controller;
import com.databaseModeling.Server.model.conceptionalModel.ErType;
import com.databaseModeling.Server.model.conceptionalModel.AssociationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * This data transfer object represents the conceptional entity relationship model
 * It represents the interface for the controller http endpoints
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
            private double x;
            private double y;
            private ErType erType;
            private String owningSide;  //Optional!
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
            private AssociationType connectionType;
        }
    }
}

