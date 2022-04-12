package com.databaseModeling.Server.entity2;

import org.springframework.data.annotation.Id;
public class DocumentEntity {

    @Id
    public String id;

    public String firstName;
    public String lastName;

    public DocumentEntity() {}

    public DocumentEntity(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
