package com.databaseModeling.Server.model;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public final class Table {

    private final String id;

    public String getId() {return id;}

    public Table referencedAttributeTable;
    public Boolean isFixedAttributeTable;

    public Table(String id) {
        this.id = id;
    }

    private final List<Column> columns = new ArrayList<>();

    public void addColumn(Column column){
        columns.add(column);
    }

    public void removeColumn(Column column){
        columns.remove(column);
    }

    public List<Column> getPrimaryKeys(){
        return columns.stream().filter(Column::isPrimaryKey).collect(Collectors.toList());
    }

    public List<Column> getForeignKeys(){
        return columns.stream().filter(Column::isForeignKey).collect(Collectors.toList());
    }

    public List<Column> getColumns(){
        return columns;
    }


}
