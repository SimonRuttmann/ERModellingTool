package com.databaseModeling.Server.model;

import com.databaseModeling.Server.dto.ConceptionalModelDto;

/**
 * Factory to create element meta information based on conceptional model elements
 * @see ConceptionalModelDto.DrawBoardContent.Element
 * @see ElementMetaInformation
 */
public class ElementMetaInformationFactory {

    /**
     * Extracts data from an conceptional model element to create an element meta information object
     * @param element The conceptional model element to extract data from
     * @return The created element meta information object
     */
    public static ElementMetaInformation createElementMetaInformation(ConceptionalModelDto.DrawBoardContent.Element element){

        var metaInformation = new ElementMetaInformation();

        metaInformation.setXPos(element.getX());
        metaInformation.setYPos(element.getY());
        metaInformation.setDisplayName(element.getDisplayName());

        return metaInformation;
    }

}
