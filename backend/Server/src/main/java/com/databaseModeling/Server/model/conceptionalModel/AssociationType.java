package com.databaseModeling.Server.model.conceptionalModel;

//TODO durch die enum, kann die factory vereinfacht werden
public enum AssociationType {
    Association,
    AttributeConnector,
    Inheritor,
    Parent
}


/*
export const ConnectionType = {association: "association", inheritor: "inheritor", parent:"parent"}
export const AssociationTypeDetails = {association: "association", attributeConnector: "attributeConnector"}
 */