package com.databaseModeling.Server.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data representation of meta information for an Er element
 * This data holds additional information received from the client and required by the client
 * Therefore this data will be added form the Er elements to the table, which will be sent back
 * to the client after the processing of these by the transformation
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ElementMetaInformation {

    private double xPos;
    private double yPos;
    private String displayName;

    public String getDisplayName(){
        if(displayName == null || displayName.isEmpty() || displayName.isBlank()){
            return "No name given";
        }
        return displayName;
    }
}
