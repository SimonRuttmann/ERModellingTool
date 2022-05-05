package com.databaseModeling.Server.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ElementMetaInformation {

    private String xPos;
    private String yPos;
    private String height;
    private String width;
    private String displayName;
}
