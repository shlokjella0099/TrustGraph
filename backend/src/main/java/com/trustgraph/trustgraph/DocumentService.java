package com.trustgraph.trustgraph;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }
    public Document createDocument(Document document) {
    return documentRepository.save(document);
}
public Document getDocument(Long id) {
    return documentRepository.findById(id).orElse(null);
}
}