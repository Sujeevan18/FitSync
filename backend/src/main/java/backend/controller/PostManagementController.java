package backend.controller;

import backend.exception.PostManagementNotFoundException;
import backend.model.PostManagementModel;
import backend.repository.PostManagementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/posts")
public class PostManagementController {
    @Autowired
    private PostManagementRepository postRepository;

    @Value("${media.upload.dir}")
    private String uploadDir;

    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam List<MultipartFile> mediaFiles) {

        if (mediaFiles.size() < 1 || mediaFiles.size() > 3) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You must upload between 1 and 3 media files.");
        }

        final File uploadDirectory = new File(uploadDir.isBlank() ? uploadDir : System.getProperty("user.dir"), uploadDir);

        if (!uploadDirectory.exists() && !uploadDirectory.mkdirs()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create upload directory.");
        }

        List<String> mediaUrls = mediaFiles.stream()
                .filter(file -> file.getContentType().matches("image/(jpeg|png|jpg)|video/mp4"))
                .map(file -> {
                    try {
                        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
                        String uniqueFileName = System.currentTimeMillis() + "_" + UUID.randomUUID() + "." + extension;

                        Path filePath = uploadDirectory.toPath().resolve(uniqueFileName);
                        file.transferTo(filePath.toFile());
                        return "/media/" + uniqueFileName;
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to store file " + file.getOriginalFilename(), e);
                    }
                })
                .collect(Collectors.toList());

        PostManagementModel post = new PostManagementModel();
        post.setTitle(title);
        post.setDescription(description);
        post.setMedia(mediaUrls);

        PostManagementModel savedPost = postRepository.save(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
    }

    @GetMapping
    public List<PostManagementModel> getAllPosts() {
        return postRepository.findAll();
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable String postId) {
        PostManagementModel post = postRepository.findById(postId)
                .orElseThrow(() -> new PostManagementNotFoundException("Post not found: " + postId));
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable String postId) {
        PostManagementModel post = postRepository.findById(postId)
                .orElseThrow(() -> new PostManagementNotFoundException("Post not found: " + postId));

        for (String mediaUrl : post.getMedia()) {
            try {
                Path filePath = Path.of(uploadDir, mediaUrl.replace("/media/", ""));
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Failed to delete media file: " + mediaUrl);
            }
        }

        postRepository.deleteById(postId);
        return ResponseEntity.ok("Post deleted successfully!");
    }

    @DeleteMapping("/{postId}/media")
    public ResponseEntity<?> deleteMedia(
            @PathVariable String postId,
            @RequestBody Map<String, String> requestBody) {

        String mediaUrl = requestBody.get("mediaUrl");
        if (mediaUrl == null || mediaUrl.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Media URL is required.");
        }

        PostManagementModel post = postRepository.findById(postId)
                .orElseThrow(() -> new PostManagementNotFoundException("Post not found: " + postId));

        if (!post.getMedia().contains(mediaUrl)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Media file not found in the post.");
        }

        try {
            Path filePath = Path.of(uploadDir, mediaUrl.replace("/media/", ""));
            if (!Files.exists(filePath)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Media file does not exist on the server.");
            }
            Files.delete(filePath);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete media file: " + mediaUrl);
        }

        post.getMedia().remove(mediaUrl);
        postRepository.save(post);

        return ResponseEntity.ok("Media file deleted successfully.");
    }

    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(
            @PathVariable String postId,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(required = false) List<MultipartFile> newMediaFiles) {

        PostManagementModel post = postRepository.findById(postId)
                .orElseThrow(() -> new PostManagementNotFoundException("Post not found: " + postId));

        post.setTitle(title);
        post.setDescription(description);

        if (newMediaFiles != null && !newMediaFiles.isEmpty()) {
            final File uploadDirectory = new File(uploadDir.isBlank() ? uploadDir : System.getProperty("user.dir"), uploadDir);
            if (!uploadDirectory.exists() && !uploadDirectory.mkdirs()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create upload directory.");
            }

            List<String> newMediaUrls = newMediaFiles.stream()
                    .map(file -> {
                        try {
                            String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
                            String uniqueFileName = System.currentTimeMillis() + "_" + UUID.randomUUID() + "." + extension;
                            Path filePath = uploadDirectory.toPath().resolve(uniqueFileName);
                            file.transferTo(filePath.toFile());
                            return "/media/" + uniqueFileName;
                        } catch (IOException e) {
                            throw new RuntimeException("Failed to store file " + file.getOriginalFilename(), e);
                        }
                    })
                    .collect(Collectors.toList());
            post.getMedia().addAll(newMediaUrls);
        }

        postRepository.save(post);
        return ResponseEntity.ok("Post updated successfully!");
    }
}
