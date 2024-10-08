<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../modules/global.php';
require_once __DIR__ . '/tag.php';

class BlogPost
{
    private $conn;
    private $table_name = 'blog_posts';
    private $tags_table = 'tags';
    private $blog_post_tags_table = 'blog_post_tags';
    private $users_table = 'users';

    public $id;
    public $title;
    public $description;
    public $image;
    public $date_uploaded;
    public $user_id;

    private $tag;

    public function __construct($db)
    {
        $this->conn = $db;
        $this->tag = new Tag($db);
    }

    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . " SET title=:title, description=:description, user_id=:user_id, date_uploaded=NOW()";

        $stmt = $this->conn->prepare($query);

        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));

        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':user_id', $this->user_id);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function read($id)
    {
        $query = "SELECT bp.*, u.username as author, GROUP_CONCAT(t.tag SEPARATOR ', ') as tags
                  FROM " . $this->table_name . " bp
                  LEFT JOIN " . $this->blog_post_tags_table . " bpt ON bp.id = bpt.post_id
                  LEFT JOIN " . $this->tags_table . " t ON bpt.tag_id = t.id
                  LEFT JOIN " . $this->users_table . " u ON bp.user_id = u.id
                  WHERE bp.id = :id
                  GROUP BY bp.id
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT); // Bind the blog post id
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getAllByUserId($user_id)
    {
        $query = "SELECT bp.*, u.username as author, GROUP_CONCAT(t.tag SEPARATOR ', ') as tags
                  FROM " . $this->table_name . " bp
                  LEFT JOIN " . $this->blog_post_tags_table . " bpt ON bp.id = bpt.post_id
                  LEFT JOIN " . $this->tags_table . " t ON bpt.tag_id = t.id
                  LEFT JOIN " . $this->users_table . " u ON bp.user_id = u.id
                  WHERE bp.user_id = :user_id
                  GROUP BY bp.id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    public function getBlogImage($post_id)
    {
        $query = "SELECT image FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $post_id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row && $row['image'] !== null) {
            header('Content-Type: image/png');
            header('Cache-Control: no-cache, no-store, must-revalidate');
            echo $row['image'];
            exit();
        } else {
            echo "Blog image not found or not uploaded.";
            http_response_code(404);
        }
    }

    public function update($tags = [])
    {
        $query = "UPDATE " . $this->table_name . " SET title=:title, description=:description WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':id', $this->id);

        if ($stmt->execute()) {
            if (!empty($tags)) {
                $this->tag->updateTags($this->id, $tags); // Update tags
            }
            return true;
        }
        return false;
    }

    public function delete()
    {
        try {
            // Begin transaction
            $this->conn->beginTransaction();

            // First, delete the comments associated with the blog post
            $commentQuery = "DELETE FROM comments WHERE post_id = :post_id";
            $commentStmt = $this->conn->prepare($commentQuery);
            $this->id = htmlspecialchars(strip_tags($this->id));
            $commentStmt->bindParam(':post_id', $this->id);
            $commentStmt->execute();

            // Then, delete the blog post
            $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $this->id);
            $stmt->execute();

            // Commit the transaction
            $this->conn->commit();

            // Debugging: Log the SQL query and result
            error_log("Blog post delete SQL Query: " . $stmt->queryString);
            error_log("Comments delete SQL Query: " . $commentStmt->queryString);
            error_log("Delete result: Success");

            return true;
        } catch (Exception $e) {
            // Rollback transaction if something failed
            $this->conn->rollBack();
            error_log("Delete result: Failure - " . $e->getMessage());
            return false;
        }
    }

    public function isOwner()
    {
        $query = "SELECT user_id FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row && $row['user_id'] == $this->user_id) {
            return true;
        }
        return false;
    }

    public function getAll()
    {
        $query = "SELECT bp.*, u.username as author, GROUP_CONCAT(t.tag SEPARATOR ', ') as tags
                  FROM " . $this->table_name . " bp
                  LEFT JOIN " . $this->blog_post_tags_table . " bpt ON bp.id = bpt.post_id
                  LEFT JOIN " . $this->tags_table . " t ON bpt.tag_id = t.id
                  LEFT JOIN " . $this->users_table . " u ON bp.user_id = u.id
                  GROUP BY bp.id";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
