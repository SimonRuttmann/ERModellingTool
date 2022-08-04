package com.databaseModeling.Server.model.relationalModel;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Simple register to hold tables
 * required as static variables are kept across multiple http requests
 */
public class TableRegister {

    private final List<Table> register = new ArrayList<>();

    private final AtomicLong tableIdCounter = new AtomicLong();

    public String registerTable(Table table){
        if(register.contains(table)) return null;
        var tableId = generateTableId();
        table.setId(tableId);
        register.add(table);

        return tableId;
    }

    private String generateTableId(){
        return "Table -- " + tableIdCounter.getAndIncrement();
    }

    public void unregisterTable(Table table){
        register.remove(table);
    }

    public List<Table> receiveRegisteredTables(){
        return register;
    }

    public void clearRegister(){
        register.clear();
    }

}
