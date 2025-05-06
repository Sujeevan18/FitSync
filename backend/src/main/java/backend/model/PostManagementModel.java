package backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;

@Document(collection = "posts")
public class PostManagementModel {
    @Id
    private String id;
    private String title;
    private String description;
    private List<String> media;

    public PostManagementModel(String id, String title, String description, List<String> media) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.media = media;
    }

    public PostManagementModel() {

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getMedia() {
        return media;
    }

    public void setMedia(List<String> media) {
        this.media = media;
    }
}
