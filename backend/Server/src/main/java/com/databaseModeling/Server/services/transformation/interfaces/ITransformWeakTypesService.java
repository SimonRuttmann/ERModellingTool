package com.databaseModeling.Server.services.transformation.interfaces;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

public interface ITransformWeakTypesService {


    /**
     * Transforms all weak entities into the relational model
     * Each table of a weak entity will have a table with a reference to an identifying table
     *
     * @param erGraph The graph to modify
     *
     * This method only deletes, merges and adds object references between the tables
     * To update the foreign keys of the tables, it is necessary to call the following method
     * @see ITransformWeakTypesService#generateIdentifyingPrimaryKeys(Graph)
     */
    void transformWeakTypes(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph);

    /**
     * Resolves all object references and applies the foreign and primary keys accordingly
     * @param erGraph The graph to modify
     *
     * Requires that the object references are set
     * @see ITransformWeakTypesService#transformWeakTypes(Graph)
     */
    void generateIdentifyingPrimaryKeys(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph);


    //TODO
    // 1:N      trivial
    // N:M      trivial
    // 1:1      frei -- mergebar
    // 01:1     01 seite
    // 01:01    frei
    // Testen!!!!

    ///IDDEEE!!!!

    // Halte eine liste aller tabellen
    // Alle tabellen haben objektverweise
    // so wie .z.b. Tabelle a mit froeign key auf Tabelle b, dann a hat objectverweis auf tabelle b
    // Damit können alle algorithmen (der 1. davon) ausgeführt werden.

    //Bei zuvoriger übersetztung der primary keys
    // Im anschluss daran ist es möglich, beim einem "MERGE" einer 1:1 tabelle alle tabellen ermittelt werden, welche davon betroffen sind
    // diese können sich dann entsprechend updaten

    //Bei späterer übersetzung der primary kesys
    //Es kann bei einem emerge alle betroffenen tabellen ermittelt werden
    //Diese referenzen der Tabellen auf andere können dan geupdated werden

    //Dsa Tranform attribute service ist davon nicht betroffen, wir behandeln hier einfach nur Entity oder Relation tabellen
    //Wird eine Entitätstabelle geändert, so werden alle columns kopiert.

    //Alle tabelle der Attribute werden folgendermaßen geändert.
    // Es werden alle childs einer knoten geommen. wenn sie einen tabelle haben, dann ist die neue referencedTable diese Tabelle (nur suche auf 1. Stufe, nicht kinder der kinder)

    //Bei der alten version reicht es aus, die kinder zum parent zu kopieren, die kinder verweisen dann auf den neuen parent und der parent auf die kinder

    //Algo
    /*
    Wir gehen den ganzen algo n-1 mal durch, woebei n die anzahl der nodes im graphen ist
    1. Suche die Weak enttity, die mit einer weak relation auf ein strong entity zeigt
    2. Füge schlüssel hinzu
    3. Ändere Typ zu Strong
     */
}
