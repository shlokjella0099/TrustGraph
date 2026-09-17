package com.trustgraph.trustgraph;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class DocumentController {

    private final DocumentService documentService;
    private final FileStorageService fileStorageService;

    public DocumentController(DocumentService documentService,
                              FileStorageService fileStorageService) {
        this.documentService = documentService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/api/documents")
    public List<Document> getAllDocuments() {
        return documentService.getAllDocuments();
    }

    @PostMapping("/api/documents")
    public Document createDocument(@RequestBody Document document) {
        return documentService.createDocument(document);
    }

    @PostMapping("/api/documents/upload")
    public Document uploadDocument(@RequestParam("file") MultipartFile file) throws IOException, NoSuchAlgorithmException{ 

        String path = fileStorageService.saveFile(file);
        String hash = fileStorageService.calculateHash(file);

        Document document = new Document();

        document.setFilename(file.getOriginalFilename());
        document.setFileType(file.getContentType());
        document.setFileSize(file.getSize());
        document.setFilePath(path);
        document.setSha256Hash(hash);

        return documentService.createDocument(document);
    }
    @GetMapping("/api/documents/{id}/verify")
public String verifyDocument(@PathVariable Long id) throws IOException, NoSuchAlgorithmException {

    Document document = documentService.getDocument(id);

    if (document == null) {
        return "Document not found";
    }

    String currentHash = fileStorageService.calculateStoredFileHash(document.getFilePath());

   if (currentHash.equals(document.getSha256Hash())) {
    return "Status: VERIFIED\n"
            + "Original Hash: " + document.getSha256Hash() + "\n"
            + "Current Hash: " + currentHash;
}

return "Status: MODIFIED\n"
        + "Original Hash: " + document.getSha256Hash() + "\n"
        + "Current Hash: " + currentHash;
}
}