package com.databaseModeling.Server.model;

import com.databaseModeling.Server.controller.ConceptionalModelDto;

public class ElementMetaInformationFactory {

    public static ElementMetaInformation createElementMetaInformation(ConceptionalModelDto.DrawBoardContent.Element element){

        var metaInformation = new ElementMetaInformation();

        metaInformation.setXPos(element.getX());
        metaInformation.setYPos(element.getY());
        metaInformation.setDisplayName(element.getDisplayName());

        return metaInformation;
    }

}
