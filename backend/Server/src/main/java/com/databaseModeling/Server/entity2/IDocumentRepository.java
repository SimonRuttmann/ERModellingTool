package com.databaseModeling.Server.entity2;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface IDocumentRepository extends MongoRepository<DocumentEntity, String> {
    public DocumentEntity findByFirstName(String firstName);
    public List<DocumentEntity> findByLastName(String lastName);
}
