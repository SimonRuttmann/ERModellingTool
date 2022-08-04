package com.databaseModeling.Server.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
