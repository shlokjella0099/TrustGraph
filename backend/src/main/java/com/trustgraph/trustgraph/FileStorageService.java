package com.trustgraph.trustgraph;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private final Path uploadDir = Paths.get("uploads");

    public String saveFile(MultipartFile file) throws IOException {

        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        Path filePath = uploadDir.resolve(file.getOriginalFilename());

        Files.write(filePath, file.getBytes());

        return filePath.toString();
    }
    public String calculateHash(MultipartFile file) throws IOException, NoSuchAlgorithmException {

    MessageDigest m = MessageDigest.getInstance("SHA-256");
    byte[] b = m.digest(file.getBytes());

    StringBuilder s = new StringBuilder();

    for (byte x : b) {
        s.append(String.format("%02x", x));
    }

    return s.toString();
}
public String calculateStoredFileHash(String filePath) throws IOException, NoSuchAlgorithmException {

    Path path = Paths.get(filePath);

    byte[] data = Files.readAllBytes(path);

    MessageDigest m = MessageDigest.getInstance("SHA-256");
    byte[] b = m.digest(data);

    StringBuilder s = new StringBuilder();

    for (byte x : b) {
        s.append(String.format("%02x", x));
    }

    return s.toString();
}
}