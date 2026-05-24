package kelompok_satu.backend.infrastructure;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/uploads")
public class FileController {
    private static final Logger log = LoggerFactory.getLogger(FileController.class);

    @Value("${app.upload.dir}")
    private String uploadDir;

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            log.info("File request received for: {}", filename);
            // Validate filename to prevent directory traversal
            if (filename.contains("..") || filename.contains("/")) {
                log.warn("Invalid filename (path traversal attempt): {}", filename);
                return ResponseEntity.badRequest().build();
            }

            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            log.info("File path resolved to: {}", filePath.toAbsolutePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                log.warn("File not found at: {}", filePath.toAbsolutePath());
                return ResponseEntity.notFound().build();
            }
            log.info("File found, preparing response");

            // Determine content type
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            log.info("Content type: {}", contentType);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            log.error("MalformedURLException for file: {}", filename, e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Unexpected error serving file: {}", filename, e);
            return ResponseEntity.status(500).build();
        }
    }
}
